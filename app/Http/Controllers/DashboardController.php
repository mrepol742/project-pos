<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * @var int
     */
    protected $items = 25;

    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSummaryEarnings(Request $request)
    {
        try {
            $now = now();

            $endDate = $now->copy()->addMonth()->startOfMonth();
            $startDate = $endDate->copy()->subMonths(7);

            $sales = Sale::selectRaw(
                "
                     TO_CHAR(created_at, 'YYYY-MM') as month,
                     SUM(total) as total
                 ",
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $labels = [];
            $data = [];

            for ($i = 0; $i < 7; $i++) {
                $currentMonth = $startDate->copy()->addMonths($i);

                $label = $currentMonth->format('F');
                if ($currentMonth->year !== $now->year) {
                    $label .= ' ' . $currentMonth->year;
                }

                $labels[] = $label;

                $monthKey = $currentMonth->format('Y-m');
                $monthData = $sales->firstWhere('month', $monthKey);

                $data[] = $monthData ? (float) $monthData->total : 0;
            }

            return response()->json([
                'labels' => $labels,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getOrdersOverTime(Request $request)
    {
        try {
            $now = now();

            $endDate = $now->copy()->addMonth()->startOfMonth();
            $startDate = $endDate->copy()->subMonths(7);

            $sales = Sale::selectRaw(
                "
                     TO_CHAR(created_at, 'YYYY-MM') as month,
                     COUNT(total) as total
                 ",
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $labels = [];
            $data = [];

            for ($i = 0; $i < 7; $i++) {
                $currentMonth = $startDate->copy()->addMonths($i);

                $label = $currentMonth->format('F');
                if ($currentMonth->year !== $now->year) {
                    $label .= ' ' . $currentMonth->year;
                }

                $labels[] = $label;

                $monthKey = $currentMonth->format('Y-m');
                $monthData = $sales->firstWhere('month', $monthKey);

                $data[] = $monthData ? (float) $monthData->total : 0;
            }

            return response()->json([
                'labels' => $labels,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getAverageOrderValue(Request $request)
    {
        try {
            $now = now();

            $endDate = $now->copy()->addMonth()->startOfMonth();
            $startDate = $endDate->copy()->subMonths(7);

            $sales = Sale::selectRaw(
                "
                       TO_CHAR(created_at, 'YYYY-MM') as month,
                        SUM(total) / NULLIF(COUNT(*), 0) as total
                 ",
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $labels = [];
            $data = [];

            for ($i = 0; $i < 7; $i++) {
                $currentMonth = $startDate->copy()->addMonths($i);

                $label = $currentMonth->format('F');
                if ($currentMonth->year !== $now->year) {
                    $label .= ' ' . $currentMonth->year;
                }

                $labels[] = $label;

                $monthKey = $currentMonth->format('Y-m');
                $monthData = $sales->firstWhere('month', $monthKey);

                $data[] = $monthData ? (float) $monthData->total : 0;
            }

            return response()->json([
                'labels' => $labels,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getDailySales(Request $request)
    {
        try {
            $now = now();

            $startDate = $now->copy()->subDays(6)->startOfDay();
            $endDate = $now->copy()->endOfDay();

            $sales = Sale::selectRaw(
                "
                       TO_CHAR(created_at, 'YYYY-MM-DD') as day,
                       SUM(total) as total
                 ",
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('day')
                ->orderBy('day')
                ->get();

            $labels = [];
            $data = [];

            for ($i = 0; $i < 7; $i++) {
                $currentDay = $startDate->copy()->addDays($i);

                $label = $currentDay->format('M d');
                $labels[] = $label;

                $dayKey = $currentDay->format('Y-m-d');
                $dayData = $sales->firstWhere('day', $dayKey);

                $data[] = $dayData ? (float) $dayData->total : 0;
            }

            return response()->json([
                'labels' => $labels,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSummaryTotal(Request $request)
    {
        try {
            $totalEarnings = Cache::remember('dashboard_summary_total', 15, function () {
                return Sale::sum('total');
            });
            $totalSales = Cache::remember('dashboard_summary_sales', 15, function () {
                return Sale::count();
            });
            $totalItems = Cache::remember('dashboard_summary_items', 15, function () {
                return Sale::sum('total_items');
            });

            return response()->json([
                'earnings' => $totalEarnings,
                'sales' => $totalSales,
                'items' => $totalItems,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLatestTransactions(Request $request)
    {
        try {
            $sales = Sale::with(['cashier'])
                ->orderBy('id', 'desc')
                ->take($this->items)
                ->get();

            return response()->json($sales);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}

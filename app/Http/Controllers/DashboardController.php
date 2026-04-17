<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class DashboardController extends ApiController
{
    /**
     * Number of items to show in latest transactions
     *
     * @return JsonResponse
     */
    public function getSummaryEarnings(): JsonResponse
    {
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

        $data = [
            'labels' => $labels,
            'data' => $data,
        ];

        return $this->success($data, 'Summary earnings retrieved successfully');
    }

    /**
     * Number of items to show in latest transactions
     *
     * @return JsonResponse
     */
    public function getOrdersOverTime(): JsonResponse
    {
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

        $data = [
            'labels' => $labels,
            'data' => $data,
        ];

        return $this->success($data, 'Orders over time retrieved successfully');
    }

    /**
     * Number of items to show in latest transactions
     *
     * @return JsonResponse
     */
    public function getAverageOrderValue(): JsonResponse
    {
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

        $data = [
            'labels' => $labels,
            'data' => $data,
        ];

        return $this->success($data, 'Average order value retrieved successfully');
    }

    /**
     * Number of items to show in latest transactions
     *
     * @return JsonResponse
     */
    public function getDailySales(): JsonResponse
    {
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

        $data = [
            'labels' => $labels,
            'data' => $data,
        ];

        return $this->success($data, 'Daily sales retrieved successfully');
    }

    /**
     * Number of items to show in latest transactions
     *
     * @return JsonResponse
     */
    public function getSummaryTotal(): JsonResponse
    {
        $totalEarnings = Cache::remember('dashboard_summary_total', 15, function () {
            return Sale::sum('total');
        });
        $totalSales = Cache::remember('dashboard_summary_sales', 15, function () {
            return Sale::count();
        });
        $totalItems = Cache::remember('dashboard_summary_items', 15, function () {
            return Sale::sum('total_items');
        });

        $data = [
            'earnings' => $totalEarnings,
            'sales' => $totalSales,
            'items' => $totalItems,
        ];

        return $this->success($data, 'Summary total retrieved successfully');
    }

    /**
     * Number of items to show in latest transactions
     *
     * @return JsonResponse
     */
    public function getLatestTransactions(Request $request): JsonResponse
    {
        $sales = Sale::with(['cashier'])
            ->orderBy('id', 'desc')
            ->take(20)
            ->get();

        return $this->success($sales, 'Latest transactions retrieved successfully');
    }
}

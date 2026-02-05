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
            // Get sales from the last 7 days and calculate total
            $recentSales = Sale::where('created_at', '>=', now()->subDays(7))->get();
            $recentTotal = $recentSales->sum('total');

            // Get sales from the previous 7 days (8-14 days ago) and calculate total
            $previousSales = Sale::whereBetween('created_at', [
                now()->subDays(14),
                now()->subDays(7)->subSecond()
                ])->get();
            $previousTotal = $previousSales->sum('total');

            return response()->json([
                'recent' => $recentTotal,
                'previous' => $previousTotal,
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
    public function getSummarySales(Request $request)
    {
        try {
            // Get sales from the last 7 days and calculate total
            $recentSales = Sale::where('created_at', '>=', now()->subDays(7))->get();
            $recentTotal = $recentSales->sum('total');

            // Get sales from the previous 7 days (8-14 days ago) and calculate total
            $previousSales = Sale::whereBetween('created_at', [
                now()->subDays(14),
                now()->subDays(7)->subSecond()
            ])->get();
            $previousTotal = $previousSales->sum('total');

            return response()->json([
                'recent' => $recentTotal,
                'previous' => $previousTotal,
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
    public function getSummaryAverageItems(Request $request)
    {
        try {
            // Get sales from the last 7 days and calculate total
            $recentSales = Sale::where('created_at', '>=', now()->subDays(7))->get();
            $recentTotal = $recentSales->sum('total_items');

            // Get sales from the previous 7 days (8-14 days ago) and calculate total
            $previousSales = Sale::whereBetween('created_at', [
                now()->subDays(14),
                now()->subDays(7)->subSecond()
            ])->get();
            $previousTotal = $previousSales->sum('total_items');

            return response()->json([
                'recent' => $recentTotal,
                'previous' => $previousTotal,
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

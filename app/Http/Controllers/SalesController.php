<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;
use Laravel\Pail\Contracts\Printer;

class SalesController extends ApiController
{
    /**
     * Display a listing of the sales.
     *
     * @return JsonResponse The JSON response containing the list of sales, along with any relevant messages or errors.
     */
    public function getSales(): JsonResponse
    {
        $sales = Sale::with(['cashier'])
            ->latest()
            ->paginate(20);

        return $this->success($sales, 'Sales retrieved successfully');
    }

    /**
     * Display a listing of today's sales.
     *
     * @return JsonResponse The JSON response containing the list of today's sales, along with any relevant messages or errors.
     */
    public function getTodaysSales(Request $request): JsonResponse
    {
        $sales = Sale::where('cashier_id', Auth::user()->id)
            ->whereDate('created_at', now()->format('Y-m-d'))
            ->orderBy('id', 'desc');
        $itemCount = Cache::remember(
            'sale_count',
            60,
            fn() => Sale::whereDate('created_at', now()->format('Y-m-d'))->count(),
        );

        $data = [
            'data' => $sales->paginate(20),
            'itemCount' => $itemCount,
        ];

        return $this->success($data, 'Today\'s sales retrieved successfully');
    }

    /**
     * Handle the checkout process for a sale.
     *
     * @param Request $request The incoming request containing the sale details.
     * @return JsonResponse The JSON response indicating the success or failure of the checkout process, along with any relevant messages or errors.
     */
    public function checkout(Request $request)
    {
        try {
            $data = [
                'products' => $request->input('products'),
                'total' => $request->input('total'),
                'discount' => $request->input('discount'),
                'total_items' => $request->input('total_items'),
                'total_discount' => $request->input('total_discount'),
                'total_taxes' => $request->input('total_taxes'),
                'total_payment' => $request->input('total_payment'),
                'total_change' => $request->input('total_change'),
                'mode_of_payment' => $request->input('mode_of_payment'),
                'reference_number' => time(),
            ];
            $sale = Sale::create(['cashier_id' => Auth::user()->id, ...$data]);
            return response()->json([
                'message' => 'Checkout successful',
                'business' => [
                    'name' => config('business.name'),
                    'address' => config('business.address'),
                    'phone' => config('business.phone'),
                    'email' => config('business.email'),
                    'website' => config('business.website'),
                    'tax_id' => config('business.tax_id'),
                    'vat_id' => config('business.vat_id'),
                ],
                'receipt' => [
                    'id' => str_pad($sale->id, 12, '0', STR_PAD_LEFT),
                    'cashier' => Auth::user(),
                    'date_of_sale' => $sale->created_at->format('Y-m-d H:i:s'),
                    ...$data,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error($e);
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}

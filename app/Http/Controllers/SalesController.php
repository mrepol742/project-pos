<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Pail\Contracts\Printer;

class SalesController extends Controller
{

    public function getSales(Request $request)
    {
        try {
            $currentPage = (int) $request->input('page', 1);
            $query = Sale::with(['cashier'])->orderBy('id', 'desc');
            $sales = $query->paginate(100, ['*'], 'page', $currentPage);
            $total = (int) ceil($sales->total() / 100);
            $itemCount = Sale::count();

            // format the id to be 12 digits with leading zeros
            $data = array_map(function ($sale) {
            $saleArray = $sale->toArray();
            $saleArray['id'] = str_pad($sale->id, 12, '0', STR_PAD_LEFT);
            return $saleArray;
            }, $sales->items());

            return response()->json([
            'data' => $data,
            'totalPages' => $total,
            'currentPage' => $sales->currentPage(),
            'itemCount' => $itemCount,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getTodaysSales(Request $request)
    {
        try {
            $currentPage = (int) $request->input('page', 1);
            $query = Sale::where('cashier_id', Auth::user()->id)
                ->whereDate('created_at', now()->format('Y-m-d'))
                ->orderBy('id', 'desc');
            $sales = $query->paginate(100, ['*'], 'page', $currentPage);
            $total = (int) ceil($sales->total() / 100);
            $itemCount = Sale::whereDate('created_at', now()->format('Y-m-d'))->count();

            // format the id to be 12 digits with leading zeros
            $data = array_map(function ($sale) {
                $saleArray = $sale->toArray();
                $saleArray['id'] = str_pad($sale->id, 12, '0', STR_PAD_LEFT);
                return $saleArray;
            }, $sales->items());

            return response()->json([
                'data' => $data,
                'totalPages' => $total,
                'currentPage' => $sales->currentPage(),
                'itemCount' => $itemCount,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function checkout(Request $request)
    {
        try {
            $data =  [
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
                    ...$data
                ],
            ]);
        } catch (\Exception $e) {
            Log::error($e);
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}

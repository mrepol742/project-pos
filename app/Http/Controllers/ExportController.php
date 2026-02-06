<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Rap2hpoutre\FastExcel\FastExcel;

class ExportController extends Controller
{
    /**
     * Export users to Excel file using FastExcel with cursor for memory efficiency.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportUsers(Request $request)
    {
        try {
            $generator = function () {
                foreach (User::cursor() as $user) {
                    yield $user;
                }
            };

            $filename = 'users_export_' . Carbon::now()->format('Y-m-d') . '.xlsx';
            return (new FastExcel($generator()))->download($filename);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Export products to Excel file using FastExcel with cursor for memory efficiency.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportProducts(Request $request)
    {
        try {
            $generator = function () {
                foreach (Product::cursor() as $product) {
                    yield $product;
                }
            };

            $filename = 'products_export_' . Carbon::now()->format('Y-m-d') . '.xlsx';
            return (new FastExcel($generator()))->download($filename);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}

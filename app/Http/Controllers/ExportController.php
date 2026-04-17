<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Rap2hpoutre\FastExcel\FastExcel;

class ExportController extends ApiController
{
    /**
     * Export users to Excel file using FastExcel with cursor for memory efficiency.
     */
    public function exportUsers()
    {
        $generator = function () {
            foreach (User::cursor() as $user) {
                yield $user;
            }
        };

        $filename = 'users_export_' . Carbon::now()->format('Y-m-d') . '.xlsx';
        return (new FastExcel($generator()))->download($filename);
    }

    /**
     * Export products to Excel file using FastExcel with cursor for memory efficiency.
     */
    public function exportProducts()
    {
        $generator = function () {
            foreach (Product::cursor() as $product) {
                yield $product;
            }
        };

        $filename = 'products_export_' . Carbon::now()->format('Y-m-d') . '.xlsx';
        return (new FastExcel($generator()))->download($filename);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PrinterController extends Controller
{
    /**
     * Set the receipt printing status.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setStatus(Request $request)
    {
        $printerName = $request->input('printer_name');
        $status = $request->input('status');

        return response()->json(['status' => 'Printer status updated']);
    }

    /**
     * Set the default printer.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setPrinter(Request $request)
    {
        $printerName = $request->input('printer_name');
        $status = $request->input('status');

        return response()->json(['status' => 'Printer set']);
    }
}

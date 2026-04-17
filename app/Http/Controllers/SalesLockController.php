<?php

namespace App\Http\Controllers;

use App\Models\SaleLock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreSalesLockRequest;

class SalesLockController extends ApiController
{
    /**
     * Get the current sales lock for the authenticated cashier.
     *
     * @return JsonResponse A JSON response containing the products in the sales lock, or an empty array if no lock exists.
     */
    public function index(): JsonResponse
    {
        $salesLock = SaleLock::where('cashier_id', Auth::user()->id)
            ->orderBy('created_at', 'desc')
            ->firstOrFail();

        return $this->success($salesLock, 'Sales lock retrieved successfully');
    }

    /**
     * Get a specific sales lock for the authenticated cashier.
     *
     * @param int $id The ID of the sales lock to be retrieved.
     * @return JsonResponse A JSON response containing the products in the specified sales lock, or an error message if the lock is not found.
     */
    public function show($id): JsonResponse
    {
        $salesLock = SaleLock::where('cashier_id', Auth::user()->id)
            ->where('id', $id)
            ->firstOrFail();

        return $this->success($salesLock->products, 'Sales lock retrieved successfully');
    }

    /**
     * Create or update a sales lock for the authenticated cashier.
     *
     * @param StoreSalesLockRequest $request The validated request containing the products to be locked.
     * @return JsonResponse A JSON response indicating the success or failure of the sales lock creation
     */
    public function store(StoreSalesLockRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $salesLock = SaleLock::updateOrCreate(
            ['cashier_id' => Auth::user()->id],
            ['products' => $request->input('products')],
        );

        return $this->success($salesLock, 'Sales lock saved successfully');
    }

    /**
     * Delete a specific sales lock for the authenticated cashier.

     * @param int $id The ID of the sales lock to be deleted.
     * @return JsonResponse A JSON response indicating the success or failure of the sales lock deletion process, along with any relevant messages or errors.
     */
    public function destroy($id): JsonResponse
    {
        $salesLock = SaleLock::where('cashier_id', Auth::user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $salesLock->delete();

        return $this->success(null, 'Sales lock deleted successfully');
    }
}

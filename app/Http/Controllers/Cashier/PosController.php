<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\ApiController;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class PosController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse The JSON response containing the paginated list of categories and products.
     */
    public function index(): JsonResponse
    {
        $categories = Category::paginate(20);

        return $this->success($categories, 'Categories retrieved successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param int $id The ID of the category to be retrieved.
     * @return JsonResponse The JSON response containing the details of the specified category, along with any relevant messages or errors.
     */
    public function show($id): JsonResponse
    {
        $product = Product::where('code', $id)->orWhere('barcode', $id)->firstOrFail();

        return $this->success($product, 'Product retrieved successfully.');
    }
}

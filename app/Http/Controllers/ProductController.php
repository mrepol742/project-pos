<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;

class ProductController extends ApiController
{
    /**
     * Display a listing of the products.
     *
     * @return JsonResponse The JSON response containing the list of products, along with any relevant messages or errors.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->has('search')) {
            $input = $request->search;

            $query->where(function ($q) use ($input) {
                $q->where('name', 'LIKE', "%{$input}%")
                    ->orWhere('code', 'LIKE', "%{$input}%")
                    ->orWhere('barcode', 'LIKE', "%{$input}%")
                    ->orWhere('description', 'LIKE', "%{$input}%");
            });
        }

        $products = $query->latest()->paginate(20);

        return $this->success($products, 'Products retrieved successfully');
    }

    /**
     * Store a newly created product in storage.
     *
     * @param StoreProductRequest $request The validated request containing the data for the new product.
     * @return JsonResponse The JSON response indicating the success or failure of the product creation process, along with any relevant messages or errors.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if ($validated['default_quantity']) {
            $validated['quantity'] = 0;
        } else {
            $validated['quantity'] = $validated->input('quantity', 0);
        }

        if (is_null($validated['barcode'])) {
            $lastProduct = Product::orderBy('id', 'desc')->firstOrFail();
            if ($lastProduct && $lastProduct->barcode) {
                $lastBarcode = ltrim($lastProduct->barcode, '0');
                $nextBarcode = str_pad((int) $lastBarcode + 1, 9, '0', STR_PAD_LEFT);
            } else {
                $nextBarcode = '0000000000001';
            }
            $validated['barcode'] = $nextBarcode;
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('product_images', 'public');
            $validated['image'] = $imagePath;
        }

        $product = Product::create($validated);

        return $this->success($product, 'Product created successfully.', 201);
    }

    /**
     * Update the specified product in storage.
     *
     * @param UpdateProductRequest $request The validated request containing the data for updating the product.
     * @param Product $product The product instance to be updated.
     * @return JsonResponse The JSON response indicating the success or failure of the product update process, along with any relevant messages or errors.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('product_images', 'public');
            $validated['image'] = $imagePath;
        }

        $product->update($validated);

        return $this->success($product, 'Product updated successfully.');
    }

    /**
     * Display the specified product by code or barcode.
     *
     * @return JsonResponse The JSON response containing the product details, along with any relevant messages or errors.
     */
    public function show($id): JsonResponse
    {
        $product = Product::where('code', $id)->orWhere('barcode', $id)->firstOrFail();

        return $this->success($product, 'Product retrieved successfully.');
    }

    /**
     * Remove the specified product from storage.
     *
     * @param Product $product The product instance to be deleted.
     * @return JsonResponse The JSON response indicating the success or failure of the product deletion process, along with any relevant messages or errors.
     */
    public function delete(Product $product): JsonResponse
    {
        $product->delete();

        return $this->success($product, 'Product deleted successfully.');
    }
}

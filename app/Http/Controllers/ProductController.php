<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
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
    public function getProducts(Request $request)
    {
        try {
            $currentPage = (int) $request->input('page', 1);
            $query = Product::with(['category:id,name'])->orderBy('id', 'desc');
            $products = $query->paginate($this->items, ['*'], 'page', $currentPage);
            $itemCount = Cache::remember('product_count', 60, fn() => Product::count());
            $total = (int) ceil($itemCount / $this->items);

            return response()->json([
                'data' => $products->items(),
                'totalPages' => $total,
                'currentPage' => $products->currentPage(),
                'itemCount' => $itemCount,
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
    public function createProduct(Request $request)
    {
        try {
            info('Creating product with data: ' . json_encode($request->all()));
            $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:255',
                'barcode' => 'nullable|string|max:255',
                'unit_measurement' => 'required|string|max:255',
                'is_active' => 'sometimes|boolean',
                'default_quantity' => 'required|boolean',
                'category_id' => 'nullable|integer|exists:categories,id',
                'age_restriction' => 'nullable|integer|min:0',
                'description' => 'nullable|string',
                'taxes' => 'nullable|integer|min:0',
                'cost_price' => 'required|integer|min:0',
                'markup' => 'required|integer|min:0',
                'sale_price' => 'required|integer|min:0',
                'color' => 'nullable|string|max:255',
                'image' => 'nullable|image|max:2048', // 2MB Max
            ]);

            if ($request->default_quantity) {
                $request->merge(['quantity' => 0]);
            } else {
                $request->merge(['quantity' => $request->input('quantity', 0)]);
            }

            if (is_null($request->barcode)) {
                $lastProduct = Product::orderBy('id', 'desc')->first();
                if ($lastProduct && $lastProduct->barcode) {
                    $lastBarcode = ltrim($lastProduct->barcode, '0');
                    $nextBarcode = str_pad((int) $lastBarcode + 1, 9, '0', STR_PAD_LEFT);
                } else {
                    $nextBarcode = '0000000000001';
                }
                $request->merge(['barcode' => $nextBarcode]);
            }

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('product_images', 'public');
                $request->merge(['image' => $imagePath]);
            }

            $product = Product::create($request->all());

            return response()->json($product, 201);
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
    public function getProduct(Request $request, $id)
    {
        try {
            $product = Product::where('code', $id)->orWhere('barcode', $id)->first();

            return response()->json($product);
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
    public function search(Request $request)
    {
        try {
            $input = $request->input('query');
            $currentPage = (int) $request->input('page', 1);
            $query = Product::where('name', 'LIKE', "%$input%")
                ->orWhere('code', 'LIKE', "%$input%")
                ->orWhere('barcode', 'LIKE', "%$input%")
                ->orWhere('description', 'LIKE', "%$input%")
                ->orderBy('id', 'desc');
            $searchResults = $query->paginate($this->items, ['*'], 'page', $currentPage);
            $total = (int) ceil($searchResults->total() / $this->items);

            return response()->json([
                'data' => $searchResults->items(),
                'totalPages' => $total,
                'currentPage' => $searchResults->currentPage(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}

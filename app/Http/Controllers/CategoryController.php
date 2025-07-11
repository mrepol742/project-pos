<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/*
 * CategoryController (formerly groups).
 */
class CategoryController extends Controller
{
    /**
     * @var int
     */
    protected $items = 15;
    
    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategories(Request $request)
    {
        try {
            $currentPage = $request->input('page');

            if (is_null($currentPage)) {
                $categories = Category::orderBy('id', 'desc')->get();

                return response()->json(
                    $categories
                );
            }

            $currentPage = (int) $currentPage;
            $query = Category::orderBy('id', 'desc');
            $categories = $query->paginate($this->items, ['*'], 'page', $currentPage);
            $total = (int) ceil($categories->total() / $this->items);

            return response()->json([
                'data' => $categories->items(),
                'totalPages' => $total,
                'currentPage' => $categories->currentPage(),
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
    public function addCategory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:categories,name',
                'description' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails())
                return response()->json($validator->errors(), 422);

            Category::create($request->all());
            return response()->json(['message' => 'Group created successfully'], 201);
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
    public function updateGroup(Request $request, $id)
    {
        try {
            $group = Category::find($id);
            if (!$group)
                return response()->json(['message' => 'Group not found'], 404);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|exists:categories,name',
                'description' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails())
                return response()->json($validator->errors(), 422);

            $group->update($request->all());
            return response()->json(['message' => 'Group updated successfully'], 200);
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
    public function deleteGroup($id)
    {
        try {
            $group = Category::find($id);
            if (!$group)
                return response()->json(['message' => 'Group not found'], 404);

            $group->delete();
            return response()->json(['message' => 'Group deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}

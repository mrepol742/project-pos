<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;

class CategoryController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse The JSON response containing the paginated list of categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::latest()->get();

        return $this->success($categories, 'Categories retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreCategoryRequest $request The validated request containing the data for the new category.
     * @return JsonResponse The JSON response indicating the success or failure of the category creation process.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $category = Category::create($validated);

        return $this->success($category, 'Category created successfully.', 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateCategoryRequest $request The validated request containing the data for updating the category.
     * @param int $id The ID of the category to be updated.
     * @return JsonResponse The JSON response indicating the success or failure of the category update process, along with any relevant messages or errors.
     */
    public function update(UpdateCategoryRequest $request, $id): JsonResponse
    {
        $validated = $request->validated();

        $category = Category::findOrFail($id);

        $category->update($validated);

        return $this->success($category, 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id The ID of the category to be deleted.
     * @return JsonResponse The JSON response indicating the success or failure of the category deletion process, along with any relevant messages or errors.
     */
    public function delete($id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return $this->success($category, 'Category deleted successfully.');
    }
}

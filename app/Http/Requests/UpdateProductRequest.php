<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        $productId = is_object($product) ? $product->getKey() : $product;

        return [
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:255|unique:products,code, ' . $productId,
            'barcode' => 'nullable|string|max:255|unique:products,barcode,' . $productId,
            'unit_measurement' => 'sometimes|required|string|max:255',
            'is_active' => 'sometimes|boolean',
            'default_quantity' => 'sometimes|boolean',
            'category_id' => 'nullable|integer|exists:categories,id',
            'age_restriction' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'taxes' => 'nullable|integer|min:0',
            'cost_price' => 'sometimes|required|integer|min:0',
            'markup' => 'sometimes|required|integer|min:0',
            'sale_price' => 'sometimes|required|integer|min:0',
            'color' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048', // 2MB Max
        ];
    }
}

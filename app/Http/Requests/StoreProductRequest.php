<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
        return [
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
        ];
    }
}

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
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
     //   $productUlid = $this->route('product')?->ulid;

        return [
            'name' => 'sometimes|required|string|max:255',
            // 'code' => [
            //     'nullable',
            //     'string',
            //     'max:255',
            //     'unique:products,code,' . $productUlid . ',ulid,deleted_at,NULL',
            // ],
            // 'barcode' => [
            //     'nullable',
            //     'string',
            //     'max:255',
            //     'unique:products,barcode,' . $productUlid . ',ulid,deleted_at,NULL',
            // ],
            'unit_measurement' => 'sometimes|required|string|max:255',
            'quantity' => 'nullable|integer|min:0',
            // 'category_ulid' => 'required|integer|exists:categories,ulid,deleted_at,NULL',
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

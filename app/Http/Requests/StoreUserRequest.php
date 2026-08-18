<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
        return [
            'first_name' => 'required|string|max:125',
            'middle_name' => 'nullable|string|max:125',
            'last_name' => 'required|string|max:125',
            'prefix' => 'required|string|in:mr,mrs,ms,dr',
            'suffix' => 'nullable|string|max:10',
            'email' => 'email|max:255|unique:users,email',
            'gender' => 'required|string|in:male,female,other',
            'phone_number' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'address' => 'required|string|max:255',
            'role' => 'required|string|in:admin,cashier,production',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
        $user = $this->route('user');
        $userId = is_object($user) ? $user->getKey() : $user;

        return [
            'first_name' => 'sometimes|required|string|max:125',
            'middle_name' => 'nullable|string|max:125',
            'last_name' => 'sometimes|required|string|max:125',
            'prefix' => 'required|string|in:mr,mrs,ms,dr',
            'suffix' => 'required|string|max:10',
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $userId,
            'gender' => 'sometimes|string|in:male,female,other',
            'phone_number' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date|before:today',
            'role' => 'required|string|in:admin,cashier,production',
            'status' => 'required|string|in:active,inactive,suspended',
        ];
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Http\JsonResponse;

class RoleController extends ApiController
{
    /**
     * Display a listing of the roles.
     *
     * @return JsonResponse The JSON response containing the list of roles.
     */
    public function index(): JsonResponse
    {
        $roles = Role::all();

        return $this->success($roles, 'Roles retrieved successfully');
    }
}

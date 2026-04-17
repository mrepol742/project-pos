<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends ApiController
{
    /**
     * Get a paginated list of users.
     *
     * @return JsonResponse The JSON response containing the paginated list of users, along with the total item count and any relevant messages or errors.
     */
    public function index(): JsonResponse
    {
        $users = User::latest('updated_at')->paginate(30);

        return $this->success($users, 'Users retrieved successfully');
    }

    /**
     * Store a newly created user in storage.
     *
     * @param StoreUserRequest $request The validated request containing the data for the new user.
     * @return JsonResponse The JSON response indicating the success or failure of the user creation process, along with any relevant messages or errors.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = User::create($request->all());

        return $this->success($user, 'User created successfully', 201);
    }

    /**
     * Update the specified user in storage.
     *
     * @param UpdateUserRequest $request The validated request containing the data for updating the user.
     * @return JsonResponse The JSON response indicating the success or failure of the user update process, along with any relevant messages or errors.
     */
    public function update(UpdateUserRequest $request, $id): JsonResponse
    {
        $validated = $request->validated();

        $user = User::findOrFail($id);

        $user->update($request->all());

        return $this->success($user, 'User updated successfully');
    }

    /**
     * Remove the specified user from storage.
     *
     * @return JsonResponse The JSON response indicating the success or failure of the user deletion process, along with any relevant messages or errors.
     */
    public function delete($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return $this->success($user, 'User deleted successfully.');
    }
}

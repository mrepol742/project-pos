<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Http\Requests\LoginAuthRequest;

class AuthController extends ApiController
{
    /**
     * Handle login request and return a session token.
     *
     * @param LoginAuthRequest $request The validated login request containing 'login' and 'password'.
     * @return JsonResponse A JSON response containing the session token if login is successful, or an error message if it fails.
     */
    public function login(LoginAuthRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $login = $validated['login'];
        $password = $validated['password'];

        if (Auth::attempt(['email' => $login, 'password' => $password])) {
            $request->session()->regenerate();
            $sessionToken = $request->session()->getId();

            return $this->success($sessionToken, 'Login successful');
        }

        return $this->error('Invalid credentials', 401);
    }

    /**
     * Handle login request and return a session token.
     *
     * @param Request $request The request containing the 'session_id' to verify.
     * @return JsonResponse A JSON response indicating whether the session is active and valid, along with user data if successful, or an error message if it fails.
     */
    public function verifySession(Request $request): JsonResponse
    {
        $sessionId = $request->input('session_id');

        if (Session::getId() === $sessionId && Auth::check() && Auth::user()->status === 'active') {
            $user = Auth::user();

            return $this->success($user, 'Session is active and valid');
        }

        return $this->error('Session is inactive or invalid', 401);
    }

    /**
     * Handle login request and return a session token.
     *
     * @param Request $request The request to log out the user, which will invalidate the current session.
     * @return JsonResponse A JSON response indicating that the logout was successful, or an error message if it fails.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success(null, 'Logout successful');
    }
}

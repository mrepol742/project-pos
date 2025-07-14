<?php

namespace App\Http\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Handle login request and return a session token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
            'error' => $validator->errors()->first()
            ], 200);
        }

        $login = $request->input('login');
        $password = $request->input('password');

        $user = \App\Models\User::where('username', $login)
            ->orWhere('email', $login)
            ->orWhere('phone', $login)
            ->first();

        if ($user && Auth::attempt(['username' => $user->username, 'password' => $password])) {
            $request->session()->regenerate();
            return response()->json([
            'message' => 'Login successful',
            'session_token' => $request->session()->getId(),
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    /**
     * Handle login request and return a session token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifySession(Request $request)
    {
        $sessionId = $request->input('session_id');

        if (Session::getId() === $sessionId && Auth::check() && Auth::user()->status === 'active') {
            return response()->json([
                'message' => 'Session is active',
                'user' => Auth::user()
            ]);
        }

        return response()->json(['message' => 'Session is inactive or invalid'], 401);
    }

    /**
     * Handle login request and return a session token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout successful']);
    }
}

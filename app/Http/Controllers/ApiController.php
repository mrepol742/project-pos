<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class ApiController
{
    /**
     * Return a successful JSON response.
     *
     * @param mixed $data The data to include in the response.
     * @param string $message The success message.
     * @param int $status The HTTP status code.
     * @return JsonResponse The JSON response.
     */
    protected function success($data = null, $message = '', $status = 200): JsonResponse
    {
        return response()->json(
            [
                'data' => $data,
                'success' => true,
                'message' => $message,
            ],
            $status,
        );
    }

    /**
     * Return an error JSON response.
     *
     * @param string $message The error message.
     * @param int $status The HTTP status code.
     * @return JsonResponse The JSON response.
     */
    protected function error($message = '', $status = 400): JsonResponse
    {
        return response()->json(
            [
                'data' => null,
                'success' => false,
                'message' => $message,
            ],
            $status,
        );
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LogController extends ApiController
{
    /**
     * List log files in the storage/logs directory.
     *
     * @return JsonResponse The JSON response containing the list of log files with their names, sizes, and last modified timestamps, along with a success message.
     */
    public function index(): JsonResponse
    {
        $path = storage_path('logs');

        $files = collect(File::files($path))
            ->filter(fn($file) => str_ends_with($file->getFilename(), '.log'))
            ->map(
                fn($file) => [
                    'name' => $file->getFilename(),
                    'size' => $file->getSize(),
                    'modified' => $file->getMTime(),
                ],
            )
            ->sortByDesc('modified')
            ->values();

        return $this->success($files, 'Log files retrieved successfully');
    }

    /**
     * View the contents of a specific log file.
     *
     * @param string $file The name of the log file to be viewed. The file name must match the pattern of a valid log file (e.g., "laravel.log") and must exist in the storage/logs directory.
     * @return JsonResponse The JSON response containing the name of the log file and its content (last 200 lines), along with a success message. If the file name is invalid or the file does not exist, an appropriate error response will be returned.
     */
    public function show($file): JsonResponse
    {
        abort_unless(preg_match('/^[\w\-.]+\.log$/', $file), 403);

        $path = storage_path("logs/{$file}");
        abort_unless(file_exists($path), 404);

        $content = array_slice(file($path), -200);

        return $this->success($content, 'Log file content retrieved successfully');
    }
}

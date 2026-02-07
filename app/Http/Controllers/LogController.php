<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    /**
     * List log files in the storage/logs directory.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listLogs(Request $request)
    {
        try {
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

            return response()->json($files);
        } catch (\Exception $e) {
            Log::error('Error listing log files: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to list log files.'], 500);
        }
    }

    /**
     * View the contents of a specific log file.
     *
     * @param Request $request
     * @param string $file
     * @return \Illuminate\Http\JsonResponse
     */
    public function viewLog(Request $request, $file)
    {
        try {
            abort_unless(preg_match('/^[\w\-.]+\.log$/', $file), 403);

            $path = storage_path("logs/{$file}");
            abort_unless(file_exists($path), 404);

            $lines = array_slice(file($path), -200);

            return response()->json([
                'file' => $file,
                'content' => $lines,
            ]);
        } catch (\Exception $e) {
            Log::error('Error reading log file: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to read log file.'], 500);
        }
    }
}

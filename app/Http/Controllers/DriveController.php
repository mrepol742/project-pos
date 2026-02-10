<?php

namespace App\Http\Controllers;

use App\Models\Drive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DriveController extends Controller
{
    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFiles(Request $request)
    {
        try {
            $drives = Drive::with('user')->paginate(30);
            $totalSize = Drive::sum('file_size');

            return response()->json([
                'data' => $drives->items(),
                'totalPages' => $drives->lastPage(),
                'currentPage' => $drives->currentPage(),
                'itemCount' => $drives->total(),
                'totalSize' => $totalSize,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFile(Request $request, $id)
    {
        try {
            $drive = Drive::findOrFail($id);

            if (!Storage::disk('private')->exists($drive->file_path)) {
                return response()->json(['error' => 'File not found'], 404);
            }

            return Storage::disk('private')->download($drive->file_path, $drive->file_name);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadFile(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file',
            ]);

            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();

            $exists = Drive::where('user_id', $request->user()->id)
                ->where('file_name', $fileName)
                ->exists();

            if ($exists) {
                return response()->json(
                    [
                        'message' => 'File with the same name already exists.',
                    ],
                    409,
                );
            }

            $filePath = $file->store('drive', 'private');
            $fileSize = $file->getSize();
            $fileType = $file->getClientMimeType();

            $drive = Drive::create([
                'user_id' => $request->user()->id,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_size' => $fileSize,
                'file_type' => $fileType,
            ]);

            return response()->json($drive, 201);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function deleteFile(Request $request, $id)
    {
        try {
            $request->validate([
                'id' => 'required|integer|exists:drives,id',
            ]);

            $drive = Drive::findOrFail($id);
            $drive->delete();

            return response()->json(['message' => 'File deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error handling request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}

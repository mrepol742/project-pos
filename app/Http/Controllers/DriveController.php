<?php

namespace App\Http\Controllers;

use App\Models\Drive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
            $drives = Drive::paginate(30);
            return response()->json([
                'data' => $drives->items(),
                'totalPages' => $drives->lastPage(),
                'currentPage' => $drives->currentPage(),
                'itemCount' => $drives->total(),
            ]);
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

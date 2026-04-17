<?php

namespace App\Http\Controllers;

use App\Models\Drive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\StoreDriveRequest;

class DriveController extends ApiController
{
    /**
     * Get a paginated list of files with total size.
     *
     * @return JsonResponse A JSON response containing the list of files and total size.
     */
    public function index(): JsonResponse
    {
        $drives = Drive::with('user')->latest('updated_at')->paginate(30);
        $totalSize = Drive::sum('file_size');

        $data = [
            'files' => $drives,
            'total_size' => $totalSize,
        ];

        return $this->success($data, 'Files retrieved successfully');
    }

    /**
     * Download a file by ID.
     *
     * @param int $id The ID of the file to be downloaded.
     * @return JsonResponse A JSON response containing the file download or an error message if the file is not found.
     */
    public function show($id): JsonResponse
    {
        $drive = Drive::findOrFail($id);

        if (!Storage::disk('private')->exists($drive->file_path)) {
            return $this->error('File not found', 404);
        }

        return Storage::disk('private')->download($drive->file_path, $drive->file_name);
    }

    /**
     * Upload a file and store its metadata in the database.
     *
     * @param StoreDriveRequest $request The validated request containing the file to be uploaded.
     * @return JsonResponse A JSON response indicating the success or failure of the file upload process, along with any relevant messages or errors.
     */
    public function store(StoreDriveRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();

        $exists = Drive::where('user_id', $request->user()->id)
            ->where('file_name', $fileName)
            ->exists();

        if ($exists) {
            return $this->error('File with the same name already exists.', 422);
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

        return $this->success($drive, 'File uploaded successfully', 201);
    }

    /**
     * Delete a file by ID.
     *
     * @param int $id The ID of the file to be deleted.
     * @return JsonResponse A JSON response indicating the success or failure of the file deletion process, along with any relevant messages or errors.
     */
    public function delete($id): JsonResponse
    {
        $drive = Drive::findOrFail($id);
        $drive->delete();

        return $this->success($drive, 'File deleted successfully');
    }
}

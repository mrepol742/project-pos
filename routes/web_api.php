<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DriveController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SalesLockController;
use App\Http\Controllers\Cashier\PosController;
use App\Http\Controllers\UserController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/verify-session', [AuthController::class, 'verifySession']);
});

/*
 * Cashier routes
 */
Route::middleware(['verify.session:cashier'])->group(function () {
    Route::apiResource('/pos', PosController::class);
    Route::apiResource('/sales-lock', SalesLockController::class);

    Route::post('/sales/checkout', [SalesController::class, 'checkout']);
    Route::get('/sales-history', [SalesController::class, 'getTodaysSales']);
});

/*
 * Admin and Super Admin routes
 */
Route::middleware(['verify.session:admin,super_admin'])->group(function () {
    Route::apiResource('/categories', CategoryController::class);
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/roles', RoleController::class);
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/files', DriveController::class);
    Route::apiResource('/logs', LogController::class);

    Route::get('/sales', [SalesController::class, 'getSales']);

    Route::prefix('export')->group(function () {
        Route::get('/users', [ExportController::class, 'exportUsers']);
        Route::get('/products', [ExportController::class, 'exportProducts']);
    });

    Route::prefix('dashboard')->group(function () {
        Route::get('/summary-earnings', [DashboardController::class, 'getSummaryEarnings']);
        Route::get('/orders-over-time', [DashboardController::class, 'getOrdersOverTime']);
        Route::get('/average-order-value', [DashboardController::class, 'getAverageOrderValue']);
        Route::get('/daily-sales', [DashboardController::class, 'getDailySales']);
        Route::get('/latest-transactions', [DashboardController::class, 'getLatestTransactions']);
    });
});

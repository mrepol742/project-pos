<?php

use Illuminate\Support\Facades\Route;
use App\Http\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\SalesLockController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\PrinterController;

Route::group(['prefix' => 'api'], function () {

    // Global
    Route::prefix('categories')->group(function () {

        Route::get('/', [CategoryController::class, 'getCategories']);
        Route::post('/', [CategoryController::class, 'addCategory']);
    });

    Route::prefix('products')->group(function () {

        Route::post('/', [ProductController::class, 'createProduct']);
        Route::post('/search', [ProductController::class, 'search']);
        Route::middleware(['verify.session:admin,super_admin'])->group(function () {
            Route::get('/all', [ProductController::class, 'getProducts']);
        });

        Route::get('/{id?}', [ProductController::class, 'getProduct']);
    });

    Route::post('/sales/checkout', [SalesController::class, 'checkout']);
    Route::get('/sales', [SalesController::class, 'getSales']);

    Route::post('/printer', [PrinterController::class, 'setPrinter']);
    Route::post('/printer/status', [PrinterController::class, 'setStatus']);

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/verify-session', [AuthController::class, 'verifySession']);
    });

    /*
     * Admin and Super Admin routes
     */
    Route::middleware(['verify.session:admin,super_admin'])->group(function () {

        Route::get('/users', [UserController::class, 'getUsers']);
        Route::get('/roles', [UserController::class, 'getRoles']);
        Route::post('/users', [UserController::class, 'createUser']);

        Route::group(['prefix' => 'export'], function () {
            Route::get('/users', [ExportController::class, 'exportUsers']);
            Route::get('/products', [ExportController::class, 'exportProducts']);
        });

        Route::prefix('dashboard')->group(function () {
            Route::get('/summary-earnings', [DashboardController::class, 'getSummaryEarnings']);
            Route::get('/summary-sales', [DashboardController::class, 'getSummarySales']);
            Route::get('/summary-avg-items', [DashboardController::class, 'getSummaryAverageItems']);
            Route::get('/summary-total', [DashboardController::class, 'getSummaryTotal']);
            Route::get('/latest-transactions', [DashboardController::class, 'getLatestTransactions']);
        });
    });


    /*
     * Cashier routes
     */
    Route::middleware(['verify.session:cashier'])->group(function () {
        // Sales lock cashier
        Route::get('/sales-lock', [SalesLockController::class, 'getSalesLock']);
        Route::post('/sales-lock', [SalesLockController::class, 'createSalesLock']);
        Route::get('/sales-history', [SalesController::class, 'getTodaysSales']);
    });
});

Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');

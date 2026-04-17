<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')->prefix('api')->group(base_path('routes/web_api.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: ['/api/*']);
        $middleware->alias([
            'verify.session' => \App\Http\Middleware\VerifySession::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // This simplify laravel exception logging by only logging relevant frames
        $exceptions->report(function (Throwable $e) {
            $trace = collect($e->getTrace())
                ->filter(
                    fn($frame) => isset($frame['file']) &&
                        str_contains($frame['file'], base_path('app')),
                )
                ->take(5)
                ->values()
                ->all();

            logger()->error($e->getMessage(), ['trace' => $trace]);

            return false;
        });
    })
    ->create();

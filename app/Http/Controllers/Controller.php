<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

abstract class Controller
{
    /**
     * Flash a success toast.
     */
    protected function flashSuccess(string $message): void
    {
        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);
    }

    /**
     * Log a failed write, flash an error toast and go back.
     */
    protected function failedWrite(Throwable $exception, string $message): RedirectResponse
    {
        Log::error($message, [
            'exception_message' => $exception->getMessage(),
            'exception_file' => $exception->getFile(),
            'exception_line' => $exception->getLine(),
            'user_id' => Auth::id(),
        ]);

        Inertia::flash('toast', ['type' => 'error', 'message' => $message]);

        return back();
    }
}

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NameEntryController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/names', [NameEntryController::class, 'index']);
Route::post('/api/names', [NameEntryController::class, 'store']);


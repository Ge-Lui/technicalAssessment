<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NameController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/names', [NameController::class, 'index']);
Route::post('/api/names', [NameController::class, 'store']);
Route::put('/api/names/{id}', [NameController::class, 'update']);
Route::delete('/api/names/{id}', [NameController::class, 'destroy']);


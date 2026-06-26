<?php

namespace App\Http\Controllers;

use App\Models\Name;
use Illuminate\Http\Request;

class NameController extends Controller
{
    public function index()
    {
        $entries = Name::orderBy('created_at', 'desc')->get();
        return response()->json($entries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);

        // Check for duplicate entry (case-insensitive)
        $exists = Name::whereRaw('LOWER(first_name) = ?', [strtolower($request->first_name)])
                      ->whereRaw('LOWER(last_name) = ?', [strtolower($request->last_name)])
                      ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This name entry already exists in the records.'
            ], 422);
        }

        $name = Name::create($validated);

        return response()->json($name, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);

        // Check for duplicate entry on other records (case-insensitive)
        $exists = Name::where('id', '!=', $id)
                      ->whereRaw('LOWER(first_name) = ?', [strtolower($request->first_name)])
                      ->whereRaw('LOWER(last_name) = ?', [strtolower($request->last_name)])
                      ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This name entry already exists in the records.'
            ], 422);
        }

        $name = Name::findOrFail($id);
        $name->update($validated);

        return response()->json($name);
    }

    public function destroy($id)
    {
        $name = Name::findOrFail($id);
        $name->delete();

        return response()->json(['success' => true]);
    }
}
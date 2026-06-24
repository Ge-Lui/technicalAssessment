<?php

namespace App\Http\Controllers;

use App\Models\NameEntry;
use Illuminate\Http\Request;

class NameEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $entries = NameEntry::orderBy('created_at', 'desc')->get();
        return response()->json($entries);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);

        $entry = NameEntry::create($validated);

        return response()->json($entry, 211);
    }
}

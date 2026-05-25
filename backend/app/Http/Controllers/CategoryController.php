<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::where('is_active', true)->get();
        return response()->json($categories);
    }

    public function show($slug): JsonResponse
    {
        $category = Category::with(['products' => function($query) {
            $query->where('is_active', true)->with('images');
        }])->where('slug', $slug)->firstOrFail();
        
        return response()->json($category);
    }
}

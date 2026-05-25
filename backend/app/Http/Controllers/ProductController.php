<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->get();
            
        return response()->json($products);
    }

    public function show($slug): JsonResponse
    {
        $product = Product::with(['category', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();
            
        return response()->json($product);
    }

    public function featured(): JsonResponse
    {
        $products = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->get();
            
        return response()->json($products);
    }
}

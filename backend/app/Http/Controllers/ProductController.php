<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'images'])
            ->where('is_active', true);

        // Filter by Category
        if ($request->has('category') && $request->category !== 'all' && !empty($request->category)) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', strtolower($request->category))
                  ->orWhere('name', $request->category);
            });
        }

        // Search by Name
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort By Price or Newest
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                default:
                    $query->orderBy('id', 'asc');
                    break;
            }
        } else {
            $query->orderBy('id', 'asc');
        }

        $products = $query->get();
            
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

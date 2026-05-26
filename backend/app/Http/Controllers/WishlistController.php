<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $wishlist = Wishlist::with(['product.images' => function($query) {
            $query->where('is_primary', true);
        }])
        ->where('user_id', $request->user()->id)
        ->get();

        return response()->json($wishlist);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $userId = $request->user()->id;
        $productId = $request->product_id;

        // Check if already in wishlist
        $wishlistItem = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($wishlistItem) {
            return response()->json([
                'message' => 'Product is already in wishlist',
                'wishlist_item' => $wishlistItem
            ]);
        }

        $wishlistItem = Wishlist::create([
            'user_id' => $userId,
            'product_id' => $productId
        ]);

        return response()->json([
            'message' => 'Added to wishlist',
            'wishlist_item' => $wishlistItem
        ], 201);
    }

    public function destroy(Request $request, $productId): JsonResponse
    {
        $wishlistItem = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->firstOrFail();

        $wishlistItem->delete();

        return response()->json([
            'message' => 'Removed from wishlist'
        ]);
    }
}

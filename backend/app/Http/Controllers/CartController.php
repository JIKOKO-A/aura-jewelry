<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cartItems = CartItem::with(['product.images' => function($query) {
            $query->where('is_primary', true);
        }])
        ->where('user_id', $request->user()->id)
        ->get();

        return response()->json($cartItems);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
            'size' => 'nullable|string',
        ]);

        $userId = $request->user()->id;
        $productId = $request->product_id;
        $size = $request->size;
        $quantity = $request->quantity ?? 1;

        // Check if item already exists in cart
        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('size', $size)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'size' => $size,
            ]);
        }

        return response()->json([
            'message' => 'Product added to bag successfully',
            'cart_item' => $cartItem
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Cart updated successfully',
            'cart_item' => $cartItem
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from bag'
        ]);
    }

    public function sync(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
        ]);

        $userId = $request->user()->id;

        foreach ($request->items as $item) {
            $cartItem = CartItem::where('user_id', $userId)
                ->where('product_id', $item['product_id'])
                ->where('size', $item['size'])
                ->first();

            if ($cartItem) {
                // Keep the larger quantity or replace
                $cartItem->quantity = max($cartItem->quantity, $item['quantity']);
                $cartItem->save();
            } else {
                CartItem::create([
                    'user_id' => $userId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'size' => $item['size']
                ]);
            }
        }

        $cartItems = CartItem::with('product.images')->where('user_id', $userId)->get();

        return response()->json([
            'message' => 'Cart synced successfully',
            'cart' => $cartItems
        ]);
    }
}

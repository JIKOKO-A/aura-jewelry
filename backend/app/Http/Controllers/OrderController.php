<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['items.product.images' => function($query) {
            $query->where('is_primary', true);
        }])
        ->where('user_id', $request->user()->id)
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($orders);
    }

    public function show(Request $request, $orderNumber): JsonResponse
    {
        $order = Order::with(['items.product.images' => function($query) {
            $query->where('is_primary', true);
        }])
        ->where('user_id', $request->user()->id)
        ->where('order_number', $orderNumber)
        ->firstOrFail();

        return response()->json($order);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:255',
            'street_address' => 'required|string|max:255',
            'zip_code' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'payment_method' => 'required|string|in:stripe,cod',
            'payment_status' => 'string',
            'stripe_payment_intent_id' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string'
        ]);

        $user = $request->user();

        // Perform inside a database transaction to ensure data integrity
        $order = DB::transaction(function () use ($request, $user) {
            // Calculate subtotal
            $subtotal = 0;
            $itemsData = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Decrement stock
                if ($product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Product {$product->name} is out of stock.");
                }
                $product->decrement('stock_quantity', $item['quantity']);

                $itemSubtotal = $product->price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'size' => $item['size']
                ];
            }

            // Generate unique order number (e.g. AURA-4921)
            do {
                $orderNumber = 'AURA-' . mt_rand(1000, 9999);
            } while (Order::where('order_number', $orderNumber)->exists());

            $shipping = 0.00; // Complimentary shipping
            $total = $subtotal + $shipping;

            // Set payment status based on method
            $paymentStatus = $request->payment_method === 'stripe' ? 'paid' : 'unpaid';

            // Create Order
            $order = Order::create([
                'user_id' => $user ? $user->id : null,
                'order_number' => $orderNumber,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'street_address' => $request->street_address,
                'zip_code' => $request->zip_code,
                'city' => $request->city,
                'country' => 'Morocco',
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'status' => 'Processing', // Defaults to Processing on placement
                'payment_method' => $request->payment_method,
                'payment_status' => $paymentStatus,
                'stripe_payment_intent_id' => $request->stripe_payment_intent_id
            ]);

            // Save order items
            foreach ($itemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // Update user loyalty points (1 point per 10 MAD spent)
            if ($user) {
                $pointsEarned = floor($total / 10);
                $user->increment('aura_points', $pointsEarned);
                
                // Clear active database cart for this user
                CartItem::where('user_id', $user->id)->delete();
            }

            return $order;
        });

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items.product')
        ], 201);
    }
}

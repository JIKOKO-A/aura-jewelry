<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $totalRevenue = Order::sum('total');
        $activeOrders = Order::whereNotIn('status', ['Delivered', 'Cancelled'])->count();
        $totalCustomers = User::where('is_admin', false)->count();
        
        // Static trend indicators matching the original designs
        $stats = [
            ['label' => 'Total Revenue', 'value' => 'MAD ' . number_format($totalRevenue, 2), 'trend' => '+12.5%'],
            ['label' => 'Active Orders', 'value' => (string)$activeOrders, 'trend' => '+4.2%'],
            ['label' => 'Conversion Rate', 'value' => '3.24%', 'trend' => '-0.8%'],
            ['label' => 'Total Customers', 'value' => number_format($totalCustomers), 'trend' => '+18.1%'],
        ];

        $recentOrders = Order::orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_number,
                    'customer' => $order->first_name . ' ' . $order->last_name,
                    'total' => 'MAD ' . number_format($order->total, 2),
                    'status' => $order->status,
                    'created_at' => $order->created_at->toFormattedDateString()
                ];
            });

        return response()->json([
            'stats' => $stats,
            'recent_orders' => $recentOrders
        ]);
    }

    public function orders(Request $request): JsonResponse
    {
        $orders = Order::with(['items.product.images'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Processing,Shipped,Out for Delivery,Delivered,Cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;

        // If completed Cash on Delivery, update payment status
        if ($request->status === 'Delivered' && $order->payment_method === 'cod') {
            $order->payment_status = 'paid';
        }

        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    public function customers(Request $request): JsonResponse
    {
        // Get all non-admin users with their lifetime orders and spend
        $customers = User::where('is_admin', false)
            ->get()
            ->map(function ($user) {
                $orders = Order::where('user_id', $user->id)->get();
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'order_count' => $orders->count(),
                    'total_spent' => 'MAD ' . number_format($orders->sum('total'), 2),
                    'aura_points' => $user->aura_points,
                    'created_at' => $user->created_at->toFormattedDateString()
                ];
            });

        return response()->json($customers);
    }

    public function products(Request $request): JsonResponse
    {
        $products = Product::with(['category', 'images'])->get();
        return response()->json($products);
    }

    public function storeProduct(Request $request): JsonResponse
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|unique:products,sku',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'image_path' => 'nullable|string'
        ]);

        $slug = Str::slug($request->name);
        
        // Ensure slug uniqueness
        $count = Product::where('slug', 'like', "$slug%")->count();
        if ($count > 0) {
            $slug .= '-' . ($count + 1);
        }

        $product = Product::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'sku' => $request->sku ?? strtoupper(Str::random(8)),
            'is_featured' => $request->is_featured ?? false,
            'is_active' => $request->is_active ?? true
        ]);

        // Add primary image
        $imagePath = $request->image_path ?? '/images/minimalist.png';
        $product->images()->create([
            'image_path' => $imagePath,
            'is_primary' => true
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('category', 'images')
        ], 201);
    }

    public function updateProduct(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'category_id' => 'exists:categories,id',
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'stock_quantity' => 'integer|min:0',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'image_path' => 'nullable|string'
        ]);

        $product->update($request->only([
            'category_id', 'name', 'description', 'price',
            'stock_quantity', 'sku', 'is_featured', 'is_active'
        ]));

        if ($request->name && $product->name !== $request->name) {
            $slug = Str::slug($request->name);
            $count = Product::where('slug', 'like', "$slug%")->where('id', '!=', $product->id)->count();
            if ($count > 0) {
                $slug .= '-' . ($count + 1);
            }
            $product->slug = $slug;
            $product->save();
        }

        if ($request->image_path) {
            // Update primary image path
            $product->images()->where('is_primary', true)->update([
                'image_path' => $request->image_path
            ]);
        }

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load('category', 'images')
        ]);
    }

    public function destroyProduct($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}

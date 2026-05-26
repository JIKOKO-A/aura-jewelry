<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@aura.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
            'aura_points' => 9999
        ]);

        // Categories
        $rings = Category::create(['name' => 'Rings', 'slug' => 'rings', 'description' => 'Luxury rings']);
        $bracelets = Category::create(['name' => 'Bracelets', 'slug' => 'bracelets', 'description' => 'Elegant bracelets']);
        $necklaces = Category::create(['name' => 'Necklaces', 'slug' => 'necklaces', 'description' => 'Stunning necklaces']);
        $earrings = Category::create(['name' => 'Earrings', 'slug' => 'earrings', 'description' => 'Beautiful earrings']);

        // Products
        $products = [
            ['category_id' => $rings->id, 'name' => 'Diamond Halo Ring', 'slug' => 'diamond-halo-ring', 'price' => 2400.00, 'is_featured' => true],
            ['category_id' => $bracelets->id, 'name' => 'Minimalist Gold Cuff', 'slug' => 'minimalist-gold-cuff', 'price' => 850.00, 'is_featured' => true],
            ['category_id' => $necklaces->id, 'name' => 'Emerald Drop Pendant', 'slug' => 'emerald-drop-pendant', 'price' => 3200.00, 'is_featured' => true],
            ['category_id' => $rings->id, 'name' => 'Sapphire Infinity Ring', 'slug' => 'sapphire-infinity-ring', 'price' => 1800.00, 'is_featured' => false],
            ['category_id' => $necklaces->id, 'name' => 'Rose Gold Chain', 'slug' => 'rose-gold-chain', 'price' => 450.00, 'is_featured' => false],
            ['category_id' => $earrings->id, 'name' => 'Pearl Cluster Earrings', 'slug' => 'pearl-cluster-earrings', 'price' => 600.00, 'is_featured' => false],
        ];

        foreach ($products as $product) {
            $p = Product::create($product);
            
            // Add the unique generated image for each product based on slug
            $imagePath = '/images/' . str_replace('-', '_', $p->slug) . '.png';

            $p->images()->create([
                'image_path' => $imagePath,
                'is_primary' => true
            ]);
        }
    }
}

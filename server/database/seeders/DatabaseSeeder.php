<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = [
            'cashier',
            'admin',
            'super_admin',
            'production',
            'material_control',
            'accounting',
            'sales',
            'marketing',
            'customer_service',
        ];
        $categories = [
            'Eletronics',
            'Clothing',
            'Food',
            'Furniture',
            'Toys',
            'Books',
            'Sports',
            'Automotive',
            'Health',
            'Beauty',
            'Jewelry',
            'Gardening',
            'Pet Supplies',
        ];

        // User seeder
        for ($i = 0; $i < 30; $i++) {
            \App\Models\User::factory()->create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'username' => fake()->userName(),
                'role' => $roles[array_rand($roles)],
                'status' => fake()->randomElement(['active', 'inactive']),
                'password' => bcrypt('password'),
            ]);
        }

        // Role seeder
        foreach ($roles as $role) {
            \App\Models\Role::factory()->create([
                'name' => $role,
            ]);
        }

        // Category seeder
        foreach ($categories as $category) {
            \App\Models\Category::factory()->create([
                'name' => $category,
                'description' => fake()->text(50),
            ]);
        }

        $batchSize = 1000;
        $total = 10000;
        $products = [];

        for ($i = 0; $i < $total; $i++) {
            $products[] = [
                'category_id' => rand(1, count($categories)),
                'barcode' => fake()->ean13(),
                'unit_measurement' => fake()->word(),
                'name' => fake()->word(),
                'description' => fake()->text(50),
                'cost_price' => rand(1, 100),
                'markup' => rand(1, 100),
                'sale_price' => rand(1, 100),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($products) === $batchSize) {
                \App\Models\Product::insert($products);
                $products = [];
            }
        }

        // Insert any remaining products
        if (!empty($products)) {
            \App\Models\Product::insert($products);
        }
    }
}

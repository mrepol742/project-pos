<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $batchSize = 1000;
        $total = 10000;
        $products = [];

        for ($i = 0; $i < $total; $i++) {
            $products[] = [
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
                Product::insert($products);
                $products = [];
            }
        }

        // Insert any remaining products
        if (!empty($products)) {
            Product::insert($products);
        }
    }
}

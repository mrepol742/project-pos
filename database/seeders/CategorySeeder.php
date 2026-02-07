<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        foreach ($categories as $category) {
            Category::factory()->create([
                'name' => $category,
                'description' => fake()->text(50),
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
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

        foreach ($roles as $role) {
            Role::factory()->create([
                'name' => $role,
                'description' => fake()->text(50),
            ]);
        }
    }
}

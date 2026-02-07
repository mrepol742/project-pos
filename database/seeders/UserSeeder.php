<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'email' => 'cashier@example.com',
                'role' => 'cashier',
            ],
            [
                'email' => 'admin@example.com',
                'role' => 'admin',
            ],
            [
                'email' => 'super_admin@example.com',
                'role' => 'super_admin',
            ],
        ];

        foreach ($users as $user) {
            User::factory()->create([
                'name' => fake()->name(),
                'email' => $user['email'],
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'username' => $user['role'],
                'role' => $user['role'],
                'password' => bcrypt($user['role']),
            ]);
        }
    }
}

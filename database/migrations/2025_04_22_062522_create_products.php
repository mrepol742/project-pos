<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique()->nullable();
            $table->string('barcode')->unique();
            $table->string('unit_measurement');
            $table->boolean('is_active')->default(true);
            $table->integer('quantity')->default(0);
            $table->integer('category_id')->nullable();
            $table->integer('age_restriction')->nullable();
            $table->text('description')->nullable();
            $table->double('taxes')->default(0);
            $table->double('cost_price')->default(0);
            $table->double('markup')->default(0);
            $table->double('sale_price')->default(0);
            $table->string('color')->nullable();
            $table->text('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
        Schema::dropIfExists('products');
    }
};

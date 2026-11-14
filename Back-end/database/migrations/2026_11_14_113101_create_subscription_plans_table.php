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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('price'); // e.g. "Rp 79.000 / bulan"
            $table->unsignedInteger('numeric_price')->default(0);
            $table->string('period')->default('bulan');
            $table->string('icon')->nullable(); // e.g. "📦", "👑", "💎"
            $table->json('features')->nullable(); // [{ "text": "...", "available": true }]
            $table->string('button_text')->default('Mulai Sekarang');
            $table->string('button_style')->nullable();
            $table->string('card_style')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mentor_learning_activity', function (Blueprint $table) {
            $table->id();

            $table->foreignId('mentor_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('learning_activity_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'mentor_id',
                'learning_activity_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mentor_learning_activity');
    }
};
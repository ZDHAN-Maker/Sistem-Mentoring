<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_progress', function (Blueprint $table) {
            $table->id();

            $table->foreignId('material_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('mentee_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->integer('watch_duration')->default(0);

            $table->decimal('progress_percentage', 5, 2)
                ->default(0);

            $table->boolean('is_completed')
                ->default(false);

            $table->timestamp('completed_at')
                ->nullable();

            $table->timestamps();

            $table->unique([
                'material_id',
                'mentee_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_progress');
    }
};
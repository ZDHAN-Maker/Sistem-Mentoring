<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_path_mentees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('path_id')
                ->constrained('learning_paths')
                ->onDelete('cascade');
            $table->foreignId('mentee_id')
                ->constrained('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_path_mentees');
    }
};

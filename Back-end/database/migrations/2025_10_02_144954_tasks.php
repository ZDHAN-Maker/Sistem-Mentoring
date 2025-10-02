<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pairing_id')->constrained('pairings')->onDelete('cascade');
            $table->foreignId('mentee_id')->constrained('users')->onDelete('cascade');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->enum('type', ['file', 'video', 'link'])->default('file');
            $table->string('file_path')->nullable();
            $table->enum('status', ['done', 'reviewed', 'submitted'])->default('submitted');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('tasks');
    }
};

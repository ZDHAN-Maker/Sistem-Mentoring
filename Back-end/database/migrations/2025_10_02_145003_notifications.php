<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // User yang menerima notifikasi
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Tipe notifikasi: task, feedback, schedule, dll.
            $table->string('type', 50);

            // Pesan singkat
            $table->string('title');

            // Pesan panjang / detail
            $table->text('message');

            // Data berikut opsional (mendukung polymorphic relations)
            $table->nullableMorphs('notifiable');

            // Status
            $table->enum('status', ['unread', 'read'])->default('unread');

            // timestamps lengkap
            $table->timestamps();

            // index untuk optimasi
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};

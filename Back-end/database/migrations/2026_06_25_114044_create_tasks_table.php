<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('mentor_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('pairing_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');

            $table->text('description')
                ->nullable();

            $table->enum('type', [
                'file',
                'link',
                'video',
                'text'
            ])->default('file');

            $table->dateTime('due_date')
                ->nullable();

            $table->enum('status', [
                'draft',
                'published',
                'closed'
            ])->default('draft');

            $table->timestamps();

            $table->index('mentor_id');
            $table->index('pairing_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

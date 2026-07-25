<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();

            $table->foreignId('mentor_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('pairing_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');

            $table->text('description')->nullable();

            $table->enum('type', [
                'video',
                'pdf',
                'link'
            ]);

            $table->string('file_path', 500)->nullable();

            $table->string('external_url', 500)->nullable();

            $table->integer('duration')->nullable();

            $table->enum('status', [
                'draft',
                'published',
                'archived'
            ])->default('draft');

            $table->timestamps();

            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
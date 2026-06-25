<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('task_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('mentee_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('file_path', 500)
                ->nullable();

            $table->longText('answer')
                ->nullable();

            $table->enum('status', [
                'submitted',
                'reviewed',
                'graded',
                'revision'
            ])->default('submitted');

            $table->decimal('grade', 5, 2)
                ->nullable();

            $table->text('feedback')
                ->nullable();

            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('reviewed_at')
                ->nullable();

            $table->timestamps();

            $table->index('task_id');
            $table->index('mentee_id');
            $table->index('status');
            $table->index('reviewed_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};

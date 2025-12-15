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
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade');
            $table->foreignId('mentee_id')->constrained('users')->onDelete('cascade'); // hanya role mentee
            $table->string('file_path')->nullable(); // untuk file upload
            $table->text('answer')->nullable();      // kalau berupa teks
            $table->enum('status', ['submitted', 'reviewed', 'graded'])->default('submitted');
            $table->integer('grade')->nullable();    // nilai dari mentor
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};

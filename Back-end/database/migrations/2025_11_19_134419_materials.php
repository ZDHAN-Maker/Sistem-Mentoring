<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_url')->nullable();
            $table->string('module_url')->nullable();
            // video
            $table->string('video_path')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->integer('duration')->nullable();

            // ordering & status
            $table->integer('order')->default(0);
            $table->enum('status', ['draft', 'published'])->default('draft');

            // FK yang benar
            $table->foreignId('mentor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('schedule_id')->nullable()->constrained('schedules')->onDelete('cascade');

            // metadata
            $table->string('video_size')->nullable();
            $table->string('video_format')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('materials');
    }
};

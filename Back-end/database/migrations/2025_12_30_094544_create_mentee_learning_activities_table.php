<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('mentee_learning_activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mentee_id');
            $table->unsignedBigInteger('material_id');
            $table->string('action')->default('viewed'); // viewed, completed, etc
            $table->timestamps();

            $table->foreign('mentee_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentee_learning_activities');
    }
};

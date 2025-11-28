<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLearningActivitiesTable extends Migration
{
    public function up()
    {
        Schema::create('learning_activities', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Nama aktivitas, misalnya "Web Development"
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('learning_activities');
    }
};

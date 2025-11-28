<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMentorLearningActivityTable extends Migration
{
    public function up()
    {
        Schema::create('mentor_learning_activity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Mentor (User)
            $table->foreignId('learning_activity_id')->constrained()->onDelete('cascade'); // Learning Activity
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('mentor_learning_activity');
    }
}

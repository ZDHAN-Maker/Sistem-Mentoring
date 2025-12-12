<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            if (!Schema::hasColumn('schedules', 'title')) {
                $table->string('title');
            }
            if (!Schema::hasColumn('schedules', 'description')) {
                $table->text('description')->nullable();
            }
            if (!Schema::hasColumn('schedules', 'location')) {
                $table->string('location')->nullable();
            }
            if (!Schema::hasColumn('schedules', 'status')) {
                $table->enum('status', ['planned','ongoing','done'])->default('planned');
            }
        });
    }

    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn(['title','description','location','status']);
        });
    }
};

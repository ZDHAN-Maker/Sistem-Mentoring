<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progress_reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pairing_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('mentor_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->date('report_date');

            $table->text('note')
                ->nullable();

            $table->timestamps();

            $table->index('pairing_id');
            $table->index('mentor_id');
            $table->index('report_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progress_reports');
    }
};

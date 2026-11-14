<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pairings', function (Blueprint $table) {
            $table->string('completion_status')->nullable()->after('status');
            $table->text('completion_notes')->nullable()->after('completion_status');
            $table->boolean('certificate_eligible')->default(false)->after('completion_notes');
            $table->timestamp('extended_at')->nullable()->after('ended_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pairings', function (Blueprint $table) {
            $table->dropColumn([
                'completion_status',
                'completion_notes',
                'certificate_eligible',
                'extended_at',
            ]);
        });
    }
};

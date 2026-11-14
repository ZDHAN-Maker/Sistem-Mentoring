<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pairings', function (Blueprint $table) {
            $table->foreignId('subscription_plan_id')->nullable()->constrained('subscription_plans')->nullOnDelete()->after('mentee_id');
            $table->string('subscription_name')->nullable()->after('subscription_plan_id');
            $table->integer('duration_months')->default(1)->after('subscription_name');
        });
    }

    public function down(): void
    {
        Schema::table('pairings', function (Blueprint $table) {
            $table->dropForeign(['subscription_plan_id']);
            $table->dropColumn(['subscription_plan_id', 'subscription_name', 'duration_months']);
        });
    }
};

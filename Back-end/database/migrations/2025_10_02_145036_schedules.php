<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('google_oauth_tokens', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->text('access_token');
            $t->text('refresh_token')->nullable();
            $t->timestamp('expires_at')->nullable();
            $t->string('scope')->nullable();
            $t->timestamps();
        });

        Schema::table('schedules', function (Blueprint $t) {
            $t->string('google_event_id')->nullable()->index();
            $t->string('google_calendar_id')->nullable()->default('primary');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('google_oauth_tokens');
        Schema::table('schedules', function (Blueprint $t) {
            $t->dropColumn(['google_event_id', 'google_calendar_id']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_code')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mentor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('title');
            $table->string('program_track');
            $table->string('skkni_reference')->default('SKKNI No. 282 Tahun 2016');
            $table->string('grade')->default('Sangat Baik (A)');
            $table->json('competencies')->nullable();
            $table->date('issue_date');
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['active', 'revoked'])->default('active');
            $table->string('credential_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};

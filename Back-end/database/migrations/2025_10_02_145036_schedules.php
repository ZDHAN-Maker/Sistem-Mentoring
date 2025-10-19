<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            // ====== kolom jadwal modern ======
            if (!Schema::hasColumn('schedules', 'title')) {
                $table->string('title')->after('pairing_id');
            }
            if (!Schema::hasColumn('schedules', 'description')) {
                $table->text('description')->nullable()->after('title');
            }
            if (!Schema::hasColumn('schedules', 'location')) {
                $table->string('location')->nullable()->after('description');
            }
            if (!Schema::hasColumn('schedules', 'status')) {
                $table->enum('status', ['planned', 'ongoing', 'done'])->default('planned')->after('location');
            }

            // ====== waktu mulai/akhir ======
            if (!Schema::hasColumn('schedules', 'start_at')) {
                $table->dateTime('start_at')->nullable()->after('status');
            }
            if (!Schema::hasColumn('schedules', 'end_at')) {
                $table->dateTime('end_at')->nullable()->after('start_at');
            }

            // ====== tipe & kepemilikan ======
            if (!Schema::hasColumn('schedules', 'type')) {
                $table->enum('type', ['meeting', 'event'])->default('meeting')->after('end_at');
            }
            if (!Schema::hasColumn('schedules', 'creator_id')) {
                $table->foreignId('creator_id')->nullable()->constrained('users')->cascadeOnDelete()->after('type');
            }
            if (!Schema::hasColumn('schedules', 'mentee_id')) {
                $table->foreignId('mentee_id')->nullable()->constrained('users')->cascadeOnDelete()->after('creator_id');
            }
        });

        // Backfill start_at dari 'tanggal' kalau ada
        if (Schema::hasColumn('schedules', 'tanggal') && Schema::hasColumn('schedules', 'start_at')) {
            // set start_at = tanggal 00:00:00 untuk baris yang masih null
            DB::table('schedules')
                ->whereNull('start_at')
                ->update([
                    'start_at' => DB::raw("TIMESTAMP(tanggal, '00:00:00')")
                ]);
        }

        // (Opsional) hapus kolom lama 'tanggal' & 'keterangan' jika sudah tidak dipakai
        Schema::table('schedules', function (Blueprint $table) {
            if (Schema::hasColumn('schedules', 'tanggal')) {
                $table->dropColumn('tanggal');
            }
            if (Schema::hasColumn('schedules', 'keterangan')) {
                $table->dropColumn('keterangan');
            }
        });
    }

    public function down(): void
    {
        // rollback aman ke versi lama (buat kolom tanggal & keterangan lagi)
        Schema::table('schedules', function (Blueprint $table) {
            if (!Schema::hasColumn('schedules', 'tanggal')) {
                $table->date('tanggal')->nullable();
            }
            if (!Schema::hasColumn('schedules', 'keterangan')) {
                $table->text('keterangan')->nullable();
            }

            // hapus kolom baru jika ada
            foreach (['title', 'description', 'location', 'status', 'start_at', 'end_at', 'type', 'creator_id', 'mentee_id'] as $col) {
                if (Schema::hasColumn('schedules', $col)) {
                    if (in_array($col, ['creator_id', 'mentee_id'])) {
                        // drop foreign key jika perlu
                        $fk = "schedules_{$col}_foreign";
                        try {
                            DB::statement("ALTER TABLE `schedules` DROP FOREIGN KEY `$fk`");
                        } catch (\Throwable $e) {
                        }
                    }
                    $table->dropColumn($col);
                }
            }
        });
    }
};

<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $tipe
 * @property string $pesan
 * @property string $status
 * @property string $created_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification wherePesan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereTipe($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereUserId($value)
 */
	class Notification extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $mentor_id
 * @property int $mentee_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $mentee
 * @property-read \App\Models\User $mentor
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProgressReport> $progressReports
 * @property-read int|null $progress_reports_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Schedule> $schedules
 * @property-read int|null $schedules_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing whereMenteeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing whereMentorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pairing whereUpdatedAt($value)
 */
	class Pairing extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $pairing_id
 * @property string|null $catatan
 * @property string|null $tanggal
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $mentee
 * @property-read \App\Models\Pairing $pairing
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport whereCatatan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport wherePairingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProgressReport whereUpdatedAt($value)
 */
	class ProgressReport extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $pairing_id
 * @property string $title
 * @property string|null $description
 * @property string|null $location
 * @property string $status
 * @property string|null $start_at
 * @property string|null $end_at
 * @property string $type
 * @property string|null $start_time
 * @property string|null $end_time
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $creator_id
 * @property int|null $mentee_id
 * @property-read \App\Models\Pairing $pairing
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereEndAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereMenteeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule wherePairingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereStartAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Schedule whereUpdatedAt($value)
 */
	class Schedule extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $task_id
 * @property int $mentee_id
 * @property string|null $file_path
 * @property string|null $answer
 * @property string $status
 * @property int|null $grade
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $mentee
 * @property-read \App\Models\Task $task
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereMenteeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereTaskId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereUpdatedAt($value)
 */
	class Submission extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $pairing_id
 * @property int $mentee_id
 * @property string $judul
 * @property string|null $deskripsi
 * @property string|null $file_path
 * @property string $type
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $mentee
 * @property-read \App\Models\Pairing $pairing
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Submission> $submissions
 * @property-read int|null $submissions_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDeskripsi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereJudul($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereMenteeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task wherePairingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUpdatedAt($value)
 */
	class Task extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Pairing> $menteePairings
 * @property-read int|null $mentee_pairings_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Pairing> $mentorPairings
 * @property-read int|null $mentor_pairings_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Notification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProgressReport> $progressReports
 * @property-read int|null $progress_reports_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Schedule> $schedules
 * @property-read int|null $schedules_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Submission> $submissions
 * @property-read int|null $submissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}


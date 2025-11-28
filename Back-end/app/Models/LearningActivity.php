<?

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
    ];

    // Relasi ke Materi
    public function materials()
    {
        return $this->hasMany(Material::class, 'learning_activity_id');
    }

    // Relasi ke Mentors (melalui pivot table)
    public function mentors()
    {
        return $this->belongsToMany(User::class, 'mentor_learning_activity', 'learning_activity_id', 'user_id');
    }
}

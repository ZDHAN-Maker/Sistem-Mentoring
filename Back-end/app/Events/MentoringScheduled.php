<?

namespace App\Events;


use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class MentoringScheduled
{
    use Dispatchable;

    public $mentor;
    public $mentee;
    public $date;

    public function __construct(User $mentor, User $mentee, $date)
    {
        $this->mentor = $mentor;
        $this->mentee = $mentee;
        $this->date = $date;
    }
}

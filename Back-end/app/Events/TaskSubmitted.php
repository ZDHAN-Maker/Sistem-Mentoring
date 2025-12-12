<?

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class TaskSubmitted
{
    use Dispatchable;
    public $mentee;
    public $mentor;

    public function __construct(User $mentee, User $mentor)
    {
        $this->mentee = $mentee;
        $this->mentor = $mentor;
    }
}

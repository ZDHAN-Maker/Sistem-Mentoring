<?

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class FeedbackGiven
{
    use Dispatchable;
    public $mentor;
    public $mentee;

    public function __construct(User $mentor, User $mentee)
    {
        $this->mentor = $mentor;
        $this->mentee = $mentee;
    }
}

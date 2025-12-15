<?php

namespace App\Events;

use App\Models\Pairing;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PairingCreated
{
    use Dispatchable, SerializesModels;

    public $pairing;
    public $mentor;
    public $mentee;

    public function __construct(Pairing $pairing)
    {
        $this->pairing = $pairing;
        $this->mentor  = $pairing->mentor;
        $this->mentee  = $pairing->mentee;
    }
}

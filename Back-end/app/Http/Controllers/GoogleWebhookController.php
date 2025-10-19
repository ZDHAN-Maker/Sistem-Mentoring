<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Services\GoogleService;
use App\Models\GoogleWatchChannel; // buat model/migrasinya jika kamu pakai fitur watch


class GoogleWebhookController extends Controller
{
public function receive(Request $request)
{
// Header: X-Goog-Channel-ID, X-Goog-Resource-ID, X-Goog-Resource-State
// Strategi: jalankan job untuk sync delta based on user/channel
return response()->noContent();
}


public function watch(Request $request, GoogleService $google)
{
$userId = $request->user()->id;
$calendar = $google->clientForUser($userId);


$channel = new \Google\Service\Calendar\Channel([
'id' => (string) Str::uuid(),
'type' => 'web_hook',
'address' => config('app.url').'/api/google/webhook',
]);


$resp = $calendar->events->watch('primary', $channel);
// Simpan $resp->id, $resp->resourceId, $resp->expiration di tabel GoogleWatchChannel (opsional)
return response()->json(['channel_id' => $resp->id]);
}
}
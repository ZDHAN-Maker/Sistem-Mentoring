<?php

namespace App\Services;

use Google\Client as GoogleClient;
use Google\Service\Calendar as GoogleCalendar;
use App\Models\GoogleOauthToken;
use Carbon\Carbon;
use Illuminate\Support\Arr;

class GoogleService
{
    public function clientForUser(int $userId): GoogleCalendar
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->setAccessType('offline');
        $client->setPrompt('consent');
        $client->setScopes(explode(' ', config('services.google.scopes', 'https://www.googleapis.com/auth/calendar')));

        $token = GoogleOauthToken::where('user_id', $userId)->firstOrFail();

        $client->setAccessToken($token->access_token);

        if ($client->isAccessTokenExpired()) {
            if ($token->refresh_token) {
                $client->fetchAccessTokenWithRefreshToken($token->refresh_token);
                $new = $client->getAccessToken();
                $token->access_token = json_encode($new);
                $token->expires_at = Carbon::now()->addSeconds($new['expires_in'] ?? 3600);
                $token->save();
            } else {
                abort(401, 'Google token expired. Please reconnect.');
            }
        }

        return new GoogleCalendar($client);
    }

    public function getAuthUrl(): string
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->setAccessType('offline');
        $client->setPrompt('consent');
        $client->setScopes(explode(' ', config('services.google.scopes')));
        return $client->createAuthUrl();
    }

    public function exchangeCodeForToken(int $userId, string $code): void
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->setAccessType('offline');
        $client->setPrompt('consent');
        $client->setScopes(explode(' ', config('services.google.scopes')));

        $tokenArr = $client->fetchAccessTokenWithAuthCode($code);
        if (isset($tokenArr['error'])) abort(401, 'Google OAuth failed');

        GoogleOauthToken::updateOrCreate(
            ['user_id' => $userId],
            [
                'access_token'  => json_encode($tokenArr),
                'refresh_token' => $tokenArr['refresh_token'] ?? null,
                'expires_at'    => now()->addSeconds($tokenArr['expires_in'] ?? 3600),
                'scope'         => config('services.google.scopes'),
            ]
        );
    }
}

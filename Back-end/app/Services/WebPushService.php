<?php

namespace App\Services;

use App\Models\PushSubscription;
use App\Models\User;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Illuminate\Support\Facades\Log;

class WebPushService
{
    protected string $publicKey;
    protected string $privateKey;
    protected string $subject;

    public function __construct()
    {
        $this->publicKey  = env('VAPID_PUBLIC_KEY', 'BHI97IWk7yTD_HGtv7m3EOONn-iI0YgRz1UT_q36MqAdKPgU2ijB_deF2wuWu2RDFOcjxzDjBQryqzt77FGCuwU');
        $this->privateKey = env('VAPID_PRIVATE_KEY', 'F4QnTpW-jNoSL_6Q-lTIPUWpQdVrmRdvcwAB0EDv6j8');
        $this->subject    = env('VAPID_SUBJECT', 'mailto:support@aeterna.id');
    }

    public function getPublicKey(): string
    {
        return $this->publicKey;
    }

    /**
     * Mengirimkan notifikasi push VAPID langsung ke browser perangkat user
     */
    public function sendToUser(User $user, string $title, string $message, array $options = []): int
    {
        $subscriptions = PushSubscription::where('user_id', $user->id)->get();

        if ($subscriptions->isEmpty()) {
            return 0;
        }

        $auth = [
            'VAPID' => [
                'subject'    => $this->subject,
                'publicKey'  => $this->publicKey,
                'privateKey' => $this->privateKey,
            ],
        ];

        try {
            $webPush = new WebPush($auth);
            $webPush->setDefaultOptions([
                'TTL' => 86400, // 24 jam
                'urgency' => 'high',
            ]);

            $payload = json_encode([
                'title' => $title,
                'body'  => $message,
                'icon'  => '/assets/Logo Sistem Mentoring.png',
                'badge' => '/assets/Logo Sistem Mentoring.png',
                'data'  => [
                    'url'  => $options['url'] ?? '/dashboard',
                    'type' => $options['type'] ?? 'system',
                    'time' => now()->toIso8601String(),
                ],
            ]);

            foreach ($subscriptions as $sub) {
                if (empty($sub->endpoint)) continue;

                $webPushSub = Subscription::create([
                    'endpoint'        => $sub->endpoint,
                    'publicKey'       => $sub->public_key,
                    'authToken'       => $sub->auth_token,
                    'contentEncoding' => $sub->content_encoding ?? 'aesgcm',
                ]);

                $webPush->queueNotification($webPushSub, $payload);
            }

            $successCount = 0;
            foreach ($webPush->flush() as $report) {
                $endpoint = $report->getRequest()->getUri()->__toString();

                if ($report->isSuccess()) {
                    $successCount++;
                } else {
                    Log::warning("Gagal mengirim Push Notifikasi ke: {$endpoint}. Alasan: {$report->getReason()}");

                    // Jika langganan kedaluwarsa atau tidak valid (410 Gone / 404), hapus dari database
                    if ($report->isSubscriptionExpired()) {
                        PushSubscription::where('endpoint', $endpoint)->delete();
                    }
                }
            }

            return $successCount;
        } catch (\Exception $e) {
            Log::error("WebPush Exception: " . $e->getMessage());
            return 0;
        }
    }
}

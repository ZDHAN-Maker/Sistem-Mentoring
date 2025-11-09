<?php

namespace Laravel\Sanctum\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Laravel\Sanctum\Sanctum;
use Symfony\Component\HttpFoundation\Response;

class EnsureFrontendRequestsAreStateful
{
    /**
     * Determine if the given request is from a frontend SPA that should receive
     * stateful API authentication cookies.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    public static function fromFrontend($request)
    {
        $stateful = Sanctum::$statefulDomains ?? [];

        return $request->isFromTrustedProxy() ||
            in_array($request->getHost(), $stateful);
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {
        if (static::fromFrontend($request)) {
            return $this->addStatefulMiddleware($request, $next);
        }

        return $next($request);
    }

    /**
     * Apply the Sanctum middleware stack for stateful requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function addStatefulMiddleware($request, \Closure $next)
    {
        $middleware = [
            EncryptCookies::class,
            AddQueuedCookiesToResponse::class,
            StartSession::class,
            ShareErrorsFromSession::class,
        ];

        $pipeline = app('Illuminate\Pipeline\Pipeline')->send($request);

        foreach ($middleware as $m) {
            $pipeline->through($m);
        }

        return $pipeline->then(fn($request) => $next($request));
    }
}

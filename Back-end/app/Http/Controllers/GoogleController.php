<?php

namespace App\Http\Controllers;

use App\Services\GoogleService;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    public function __construct(private GoogleService $google) {}

    public function redirect(Request $request)
    {
        return response()->json(['url' => $this->google->getAuthUrl()]);
    }

    public function callback(Request $request)
    {
        $userId = auth('sanctum')->id(); // jika user sedang login di browser yang sama
        // Jika tidak, sediakan mekanisme state/PKCE atau temp session untuk map user.
        if (!$userId) abort(401, 'Please login first then retry the Google connect.');

        $code = $request->query('code');
        $this->google->exchangeCodeForToken($userId, $code);

        return response()->json(['message' => 'Google connected']);
    }
}

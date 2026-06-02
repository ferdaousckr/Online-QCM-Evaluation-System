<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifie si l'utilisateur est connecté et si son rôle est autorisé
    if (!$request->user() || !in_array($request->user()->role, $roles)) {
        return response()->json([
            'message' => 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'
        ], 403); // 403 Forbidden
    }

    return $next($request);
    }
}

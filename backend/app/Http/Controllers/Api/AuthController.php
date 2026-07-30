<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $identifier = $request->validated('identifier');
        $password = $request->validated('password');

        $user = \App\Models\User::where('email', $identifier)
            ->orWhere('nip', $identifier)
            ->orWhere('nisn', $identifier)
            ->first();

        if (! $user || ! \Illuminate\Support\Facades\Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['Email / NIP / NISN atau password salah.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ],
        ]);
    }

    public function register(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ],
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()),
        ]);
    }
}

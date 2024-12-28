<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Beekeeper;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        if (!Auth::attempt($data)) {
            return response([
                "message" => "Wrong parametrs"
            ], 400);
        }
        $user = Auth::user();
        $token = $user->createToken("main")->plainTextToken;

        return response()->json([
            "user" => $user,
            "token" => $token
        ]);
    }
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            "name" => $data['name'],
            "email" => $data['email'],
            "password" => bcrypt($data["password"])
        ]);
        $user->assignRole("user");
        $token = $user->createToken("main")->plainTextToken;
        return response()->json([

            "user" => $user,
            "token" => $token
        ]);
    }
    public function register_beekeeper(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'number_of_hives' => 'required|integer',
            'years_of_experience' => 'required|integer',
            'location' => 'required|string',
            'city' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $user->assignRole('beekeeper');

        Beekeeper::create([
            'user_id' => $user->id,
            'number_of_hives' => $validated['number_of_hives'],
            'years_of_experience' => $validated['years_of_experience'],
            'location' => $validated['location'],
            'city' => $validated['city'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ]);
        $token = $user->createToken("main")->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 200);
    }
    public function logout(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();
        return response("", 204);
    }
}

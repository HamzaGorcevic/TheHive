<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Beekeeper;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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


    public function delete_user(Request $request, $id = null)
    {
        if ($id) {
            // Check if user is admin
            if (!$request->user()->hasRole('admin')) {
                return response()->json([
                    'message' => 'Unauthorized to delete other users'
                ], 403);
            }

            $user = User::findOrFail($id);
        } else {
            $user = $request->user();
        }

        // Delete associated beekeeper data if exists
        if ($user->beekeeper) {
            $user->beekeeper->delete();
        }

        // Delete user
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    public function update_profile(Request $request)
    {
        $user = $request->user();

        $rules = [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'sometimes|string|min:8',
            // Beekeeper fields
            'beekeeper_data' => 'sometimes|array',
            'beekeeper_data.number_of_hives' => 'required_with:beekeeper_data|integer',
            'beekeeper_data.years_of_experience' => 'required_with:beekeeper_data|integer',
            'beekeeper_data.location' => 'required_with:beekeeper_data|string',
            'beekeeper_data.city' => 'required_with:beekeeper_data|string',
            'beekeeper_data.latitude' => 'required_with:beekeeper_data|numeric',
            'beekeeper_data.longitude' => 'required_with:beekeeper_data|numeric',
        ];

        $validatedData = $request->validate($rules);

        // Update user data
        if (isset($validatedData['name'])) {
            $user->name = $validatedData['name'];
        }
        if (isset($validatedData['email'])) {
            $user->email = $validatedData['email'];
        }
        if (isset($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }

        $user->save();

        // Handle beekeeper data
        if (isset($validatedData['beekeeper_data'])) {
            if ($user->beekeeper) {
                // Update existing beekeeper data
                $user->beekeeper->update($validatedData['beekeeper_data']);
            } else {
                // Create new beekeeper data and assign role
                $user->beekeeper()->create($validatedData['beekeeper_data']);
                $user->assignRole('beekeeper');
            }
        }
        $token = $user->createToken("main")->plainTextToken;

        // Refresh user data with relationships
        $user->load(['beekeeper', 'roles']);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function get_profile(Request $request)
    {
        $user = $request->user();
        $user->load(['beekeeper', 'roles']);

        return response()->json([
            'user' => $user
        ]);
    }
    public function get_profile_to_view(Request $request)
    {
        $user = User::with(['beekeeper', 'roles'])->find($request->user_id);

        if ($user) {
            return response()->json(["user" => $user]);
        }
        return response()->json(["message" => "User not found"]);
    }
    public function get_users(Request $request)
    {
        $users = User::with(['beekeeper' => function ($query) {
            $query->select('user_id', 'city');
        }])
            ->select('id', 'name', 'points')
            ->get();

        $formattedUsers = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'points' => $user->points,
                'city' => $user->beekeeper ? $user->beekeeper->city : null,
            ];
        });

        return response()->json([
            'users' => $formattedUsers,
        ]);
    }
}

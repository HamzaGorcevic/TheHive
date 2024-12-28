<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route; // Correct import for Route

Route::post("login", [AuthController::class, "login"]);
Route::post("register", [AuthController::class, "register"]);
Route::post("logout", [AuthController::class, "logout"]);
Route::post("register_beekeeper", [AuthController::class, "register_beekeeper"]);

Route::middleware('auth:sanctum')->group(function () {
    // Get all rooms
    Route::get('rooms', [RoomController::class, 'all_rooms']);

    // Get rooms for the authenticated user
    Route::get('user/rooms', [RoomController::class, 'user_rooms']);

    // Create a new room
    Route::post('rooms', [RoomController::class, 'create_room']);

    Route::get('rooms/{room_id}', [RoomController::class, 'get_room']);
});

// Message Routes
Route::middleware('auth:sanctum')->group(function () {
    // Get all messages in a specific room
    Route::get('rooms/{room_id}/messages', [MessageController::class, 'room_messages']);

    // Add a new message to a room
    Route::post('rooms/{room_id}/messages', [MessageController::class, 'add_message']);
    Route::post('messages/{message_id}/reply', [MessageController::class, 'reply_message']);

    // Remove a specific message
    Route::delete('messages/{message_id}', [MessageController::class, 'remove_message']);

    // Reply to a message

    //Vote
    Route::post('messages/{message_id}/vote', [MessageController::class, 'vote_message']);
    Route::get('messages/{message_id}/vote', [MessageController::class, 'get_message_votes']);
    Route::post('messages/solved', [MessageController::class, 'mark_as_solved']);
});

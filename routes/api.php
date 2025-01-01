<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BeekeeperServiceController;
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
    Route::delete('rooms/{room_id}', [RoomController::class, 'delete_room']);
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
    Route::get('/messages/{messageId}/replies', [MessageController::class, 'get_replies']);

    //Vote
    Route::get('votes', [MessageController::class, 'get_user_points']);
    Route::post('messages/{message_id}/vote', [MessageController::class, 'vote_message']);
    Route::get('messages/{message_id}/vote', [MessageController::class, 'get_message_votes']);
    Route::post('messages/solved', [MessageController::class, 'mark_as_solved']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/services', [BeekeeperServiceController::class, 'get_availble_services']);
    Route::get('/categories', [BeekeeperServiceController::class, 'get_categories']);
    Route::get("/services/user", [BeekeeperServiceController::class, 'get_user_services']);
    Route::post('/categories', [BeekeeperServiceController::class, 'create_category']);
    Route::post('/services', [BeekeeperServiceController::class, 'beekeeper_make_availble']);
    Route::get('/services/category', [BeekeeperServiceController::class, 'category_services']);
    Route::delete("/services/{service_id}", [BeekeeperServiceController::class, 'delete_service']);
    Route::delete("/categories/{category_id}", [BeekeeperServiceController::class, 'delete_category']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::delete('/user/{id?}', [AuthController::class, 'delete_user']);
    Route::put('/user/profile', [AuthController::class, 'update_profile']);
    Route::get('/user/profile', [AuthController::class, 'get_profile']);
    Route::get('/user/view/{user_id}/profile', [AuthController::class, 'get_profile_to_view']);
    Route::get('/users', [AuthController::class, 'get_users']);
});

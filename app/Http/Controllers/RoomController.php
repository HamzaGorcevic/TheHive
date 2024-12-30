<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    //
    public function all_rooms(Request $request)
    {
        $rooms = Room::with('creator')->latest()->get();

        return response()->json([
            'rooms' => $rooms
        ]);
    }
    public function user_rooms(Request $request)
    {

        $user = $request->user();

        $rooms = $user->rooms()->latest()->get();

        return response()->json([
            'rooms' => $rooms
        ]);
    }

    public function create_room(RoomRequest $request)
    {
        $validated = $request->validated();

        $user = $request->user();

        $room = Room::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'user_id' => $user->id,  // Store the authenticated user's ID
        ]);

        return response()->json([
            'room' => $room,
            'message' => 'Room created successfully!'
        ], 201);
    }
    public function get_room(Request $request)
    {
        $room = Room::with('creator')->find($request->room_id);

        return response()->json([
            'room' => $room
        ]);
    }
    public function delete_room(Request $request)
    {
        $room = Room::find($request->room_id);
        if ($room) {
            $room->delete();
            return response()->json([
                'message' => 'Room deleted successfully'
            ]);
        }
        return response()->json([
            "message" => "Room not found"
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\MessageRequest;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    //
    public function room_messages(Request $request)
    {
        $roomMessages = Message::where('room_id', $request->room_id)
            ->with(['user', 'replies.user', 'replies.replies.user']) // Load nested replies
            ->latest()
            ->where('parent_message_id', null) // Only get top-level messages
            ->get();

        return response()->json([
            'messages' => $roomMessages
        ]);
    }

    public function add_message(MessageRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();

        $message = Message::create([
            'user_id' => $user->id,
            'room_id' => $data['room_id'],
            'content' => $data['content'],
            'parent_message_id' => $data['parent_message_id'] ?? null,
        ]);

        // Load the relationships for the response
        $message->load(['user', 'replies.user']);

        return response()->json([
            'message' => $message,
            'status' => 'Message posted successfully'
        ], 201);
    }

    public function remove_message(Request $request)
    {
        $message = Message::find($request->message_id);
        if ($message) {
            if ($message->user_id !== $request->user()->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Delete all nested replies first
            $this->deleteNestedReplies($message);
            $message->delete();

            return response()->json([
                'message' => 'Message deleted successfully'
            ]);
        }
        return response()->json(['error' => 'Message not found'], 404);
    }

    public function reply_message(Request $request)
    {
        $parentMessage = Message::with('allReplies')->find($request->message_id);

        if (!$parentMessage) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        // Validate the room context
        if ($parentMessage->room_id != $request->room_id) {
            return response()->json(['error' => 'Invalid room context'], 400);
        }

        $data = $request->validate([
            'content' => 'required|string|max:1000',
            'room_id' => 'required|exists:rooms,id'
        ]);

        $reply = Message::create([
            'user_id' => $request->user()->id,
            'room_id' => $parentMessage->room_id,
            'content' => $data['content'],
            'parent_message_id' => $request->message_id,
        ]);

        // Load all necessary relationships
        $reply->load(['user', 'allReplies.user']);

        return response()->json([
            'reply' => $reply,
            'message' => 'Reply posted successfully'
        ], 201);
    }

    private function deleteNestedReplies($message)
    {
        // Recursively delete all nested replies
        foreach ($message->replies as $reply) {
            $this->deleteNestedReplies($reply);
            $reply->delete();
        }
    }
}

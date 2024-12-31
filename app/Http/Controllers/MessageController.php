<?php

namespace App\Http\Controllers;

use App\Http\Requests\MessageRequest;
use App\Models\Message;
use App\Models\Room;
use App\Models\Vote;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{

    public function room_messages(Request $request)
    {
        $roomMessages = Message::where('room_id', $request->room_id)
            ->where('parent_message_id', null)
            ->with(['user:id,name'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'messages' => $roomMessages
        ]);
    }

    public function get_replies(Request $request, $messageId)
    {
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);

        $replies = Message::where('parent_message_id', $messageId)
            ->with(['user:id,name'])
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'replies' => $replies
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

        $reply->load(['user', 'allReplies.user']);

        return response()->json([
            'reply' => $reply,
            'message' => 'Reply posted successfully'
        ], 201);
    }
    public function vote_message(Request $request)
    {
        $request->validate([
            'voted_user_id' => 'required|exists:users,id',
            'message_id' => 'required|exists:messages,id',
            'vote_type' => 'required|in:1,0,-1'
        ]);

        $user = $request->user();
        $message = Message::findOrFail($request->message_id);

        // Prevent voting on own messages
        if ($message->user_id === $user->id) {
            return response()->json(['error' => 'Cannot vote on your own message'], 403);
        }
        if ($message->parent_message_id !== null) {
            return response()->json(['error' => 'Can only vote on parent messages'], 403);
        }

        try {
            DB::beginTransaction();

            $currentVote = Vote::where('user_id', $user->id)
                ->where('message_id', $message->id)
                ->first();

            $previousVoteType = $currentVote ? $currentVote->vote_type : 0;

            if ($request->vote_type === 0) {
                if ($currentVote) {
                    $currentVote->delete();
                }
            } else {
                Vote::updateOrCreate(
                    ['user_id' => $user->id, 'message_id' => $message->id, 'voted_user_id' => $request->voted_user_id],
                    ['vote_type' => $request->vote_type]
                );
            }

            $totalPoints = $message->votes()->sum('vote_type');
            $message->update(['points' => $totalPoints]);

            $pointDiff = $request->vote_type - $previousVoteType;
            if ($pointDiff !== 0) {
                $messageAuthor = $message->user;
                $messageAuthor->increment('points', $pointDiff);
            }

            DB::commit();

            return response()->json([
                'message' => 'Vote recorded successfully',
                'new_score' => $totalPoints
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function get_user_points(Request $request)
    {
        $votes = Vote::where('voted_user_id', $request->user()->id)->count();
        return response()->json(["votes" => $votes], 200);
    }


    public function mark_as_solved(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'message_id' => 'required|exists:messages,id',
        ]);

        $room = Room::findOrFail($request->room_id);
        $user = $request->user();
        if ($user->id !== $room->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message = Message::where('id', $request->message_id)
            ->where('room_id', $room->id)
            ->first();

        if (!$message) {
            return response()->json(['error' => 'Message does not belong to this room'], 400);
        }

        $room->solved_message_id = $message->id;
        $room->save();

        return response()->json([
            'message' => 'Room marked as solved',
            'solved_message_id' => $room->solved_message_id,
        ]);
    }

    public function get_message_votes(Request $request)
    {
        $voteCount = Vote::where('message_id', $request->message_id)->count();
        return response()->json(['count' => $voteCount]);
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

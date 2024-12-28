<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'room_id', 'content', 'parent_message_id'];

    // A message belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A message belongs to a room
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    public function allReplies()
    {
        return $this->hasMany(Message::class, 'parent_message_id')->with(['user', 'allReplies']);
    }

    // A message can have many replies (self-referential relationship)
    public function replies()
    {
        return $this->hasMany(Message::class, 'parent_message_id');
    }

    // A message can have one parent (if it's a reply)
    public function parent()
    {
        return $this->belongsTo(Message::class, 'parent_message_id');
    }
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}

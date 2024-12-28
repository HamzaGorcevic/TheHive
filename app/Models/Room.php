<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'user_id'];

    /**
     * Get the user who created the room.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function solvedMessage()
    {
        return $this->belongsTo(Message::class, 'solved_message_id');
    }

    /**
     * Get the messages associated with the room.
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}

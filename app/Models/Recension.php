<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recension extends Model
{

    protected $fillable = ['message', 'stars', 'service_id', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function beekeeper_service()
    {
        return $this->belongsTo(BeekeeperService::class);
    }
}

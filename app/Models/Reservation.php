<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'beekeeper_service_id',
        'reservation_date',
        'status',
    ];

    // Relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship to BeekeeperService
    public function beekeeperService()
    {
        return $this->belongsTo(BeekeeperService::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beekeeper extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'number_of_hives',
        'years_of_experience',
        'location',
        'city',
        'latitude',
        'longitude',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

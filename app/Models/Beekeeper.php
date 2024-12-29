<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    protected $casts = [
        'number_of_hives' => 'integer',
        'years_of_experience' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    protected $hidden = [];
    public function services()
    {
        return $this->hasMany(BeekeeperService::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

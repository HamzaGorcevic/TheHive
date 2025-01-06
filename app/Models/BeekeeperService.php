<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeekeeperService extends Model
{
    protected $fillable = ['user_id', 'categoryservice_id', 'details', 'price', 'image_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categoryservice()
    {
        return $this->belongsTo(CategoryService::class);
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
    public function recensions()
    {
        return $this->hasMany(Recension::class, 'service_id');
    }
}

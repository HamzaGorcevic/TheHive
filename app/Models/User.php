<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'points',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Add eager loading for roles and beekeeper
    // protected $with = ['roles', 'beekeeper'];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    // Add the beekeeper relationship
    public function beekeeper()
    {
        return $this->hasOne(Beekeeper::class);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'points' => 'integer'
        ];
    }
    public function services()
    {
        return $this->hasMany(BeekeeperService::class);
    }
    public function getRoleAttribute()
    {
        return $this->roles->first()->name ?? null;
    }

    public function getBeekeeperDataAttribute()
    {
        if (!$this->relationLoaded('beekeeper')) {
            $this->load('beekeeper');
        }
        if ($this->hasRole('beekeeper')) {
            return $this->beekeeper;
        }
        return null;
    }


    protected $appends = ['role', 'beekeeper_data'];
}

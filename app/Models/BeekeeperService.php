<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeekeeperService extends Model
{
    protected $fillable = ['user_id', 'categoryservice_id', 'details', "price"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function categoryservice()
    {
        return $this->belongsTo(CategoryService::class);
    }
    //
}

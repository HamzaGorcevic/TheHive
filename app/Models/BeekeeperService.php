<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeekeeperService extends Model
{
    protected $fillable = ['beekeeper_id', 'categoryservice_id', 'details', "price"];

    public function beekeeper()
    {
        return $this->belongsTo(Beekeeper::class);
    }

    public function categoryservice()
    {
        return $this->belongsTo(CategoryService::class);
    }
    //
}

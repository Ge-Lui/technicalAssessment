<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NameEntry extends Model
{
    protected $table = 'name_entries';

    protected $fillable = [
        'first_name',
        'last_name',
    ];
}

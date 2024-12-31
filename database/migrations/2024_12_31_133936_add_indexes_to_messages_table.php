<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->index(['room_id', 'parent_message_id']);
            $table->index('created_at');
        });

        Schema::table('votes', function (Blueprint $table) {
            $table->index(['message_id', 'user_id']);
            $table->index('voted_user_id');
        });
    }

    public function down()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['room_id', 'parent_message_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('votes', function (Blueprint $table) {
            $table->dropIndex(['message_id', 'user_id']);
            $table->dropIndex(['voted_user_id']);
        });
    }
};

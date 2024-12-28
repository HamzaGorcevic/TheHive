<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->unsignedBigInteger('solved_message_id')->nullable()->after('user_id');
            $table->foreign('solved_message_id')->references('id')->on('messages')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropForeign(['solved_message_id']);
            $table->dropColumn('solved_message_id');
        });
    }
};

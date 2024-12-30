<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('message_id')->constrained()->onDelete('cascade');
            $table->foreignId('voted_user_id')->constrained('users')->onDelete('cascade');
            $table->integer('vote_type');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};

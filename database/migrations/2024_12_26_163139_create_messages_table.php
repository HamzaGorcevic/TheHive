<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->text('content'); // Message content
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key for the user
            $table->foreignId('room_id')->constrained()->onDelete('cascade'); // Foreign key for the room
            $table->foreignId('parent_message_id')->nullable()->constrained('messages')->onDelete('cascade'); // For replies (nullable)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};

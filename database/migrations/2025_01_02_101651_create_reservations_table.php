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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User who made the reservation
            $table->foreignId('beekeeper_service_id')->constrained()->onDelete('cascade'); // Service being reserved
            $table->dateTime('reservation_date'); // Date and time of the reservation
            $table->string('status')->default('pending'); // Reservation status (e.g., pending, confirmed, canceled)
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};

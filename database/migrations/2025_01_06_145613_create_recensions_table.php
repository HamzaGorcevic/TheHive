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
        Schema::create('recensions', function (Blueprint $table) {
            $table->id();
            $table->text('message'); // The review message
            $table->unsignedTinyInteger('stars'); // The star rating (1-5)
            $table->foreignId('service_id')->constrained('beekeeper_services')->onDelete('cascade'); // Foreign key to beekeeper_services table
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key to users table
            $table->timestamps(); // created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recensions');
    }
};
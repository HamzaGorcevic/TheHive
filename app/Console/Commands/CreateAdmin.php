<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class CreateAdmin extends Command
{
    protected $signature = 'make:admin {email}';
    protected $description = 'Make a user admin by email';

    public function handle()
    {
        // First make sure the admin role exists
        if (!Role::where('name', 'admin')->exists()) {
            Role::create(['name' => 'admin']);
        }

        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found!");
            return;
        }

        $user->syncRoles(['admin']);
        $this->info("User {$user->name} is now an admin!");
    }
}

<?php

namespace Modules\Announcements\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Announcements\Models\Announcement;
use Spatie\Permission\Models\Role;

class DemoAnnouncementsDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // A staff account that sees only this module's admin area.
        Role::findOrCreate('announcements admin')->syncPermissions(['access admin panel', 'manage announcements']);
        $staff = User::firstOrCreate(
            ['email' => 'announcements@saucebase.dev'],
            ['name' => 'Announcements Admin', 'password' => bcrypt(config('saucebase.demo_password'))],
        );
        $staff->syncRoles('announcements admin');

        if (Announcement::exists()) {
            return;
        }

        Announcement::create([
            'text' => '⭐ <strong>Enjoying Saucebase?</strong> A star on GitHub helps other developers find it. <a href="https://github.com/saucebase-dev/saucebase">Star us on GitHub →</a>',
            'is_active' => true,
            'is_dismissable' => true,
            'show_on_frontend' => true,
            'show_on_dashboard' => true,
        ]);
    }
}

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
            ['name' => 'Announcements Admin', 'password' => bcrypt('secretsauce')],
        );
        $staff->syncRoles('announcements admin');

        if (Announcement::exists()) {
            return;
        }

        Announcement::create([
            'text' => '🎉 <strong>Saucebase 3.0 is here!</strong> Much faster, better DX, and now ships with Vue 3 and React 19. <a href="/blog/vue-or-react-what-about-both">Learn more →</a>',
            'is_active' => true,
            'is_dismissable' => true,
            'show_on_frontend' => true,
            'show_on_dashboard' => true,
        ]);
    }
}

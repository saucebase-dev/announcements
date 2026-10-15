<?php

namespace Modules\Announcements\Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Modules\Announcements\Database\Seeders\DatabaseSeeder;
use Modules\Announcements\Database\Seeders\DemoAnnouncementsDatabaseSeeder;
use Tests\TestCase;

/**
 * The demo ships a staff account for this module's admin area, so visitors can try a
 * role that sees only part of the panel.
 */
class DemoStaffTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_demo_adds_a_staff_account_for_this_module_only(): void
    {
        $this->seed([DatabaseSeeder::class, DemoAnnouncementsDatabaseSeeder::class]);

        $staff = User::where('email', 'announcements@saucebase.dev')->firstOrFail();

        $this->assertSame(['announcements admin'], $staff->getRoleNames()->all());
        $this->assertEqualsCanonicalizing(['access admin panel', 'manage announcements'], $staff->getAllPermissions()->pluck('name')->all());
    }

    public function test_demo_accounts_use_the_configured_demo_password(): void
    {
        config(['saucebase.demo_password' => 'not-the-old-default']);

        $this->seed([DatabaseSeeder::class, DemoAnnouncementsDatabaseSeeder::class]);

        $this->assertTrue(Hash::check('not-the-old-default', User::where('email', 'announcements@saucebase.dev')->value('password')));
    }
}

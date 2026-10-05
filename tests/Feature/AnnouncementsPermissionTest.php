<?php

namespace Modules\Announcements\Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Announcements\Database\Seeders\DatabaseSeeder;
use Modules\Announcements\Filament\Resources\Announcements\AnnouncementResource;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

/**
 * The announcements admin area is its own permission, so a role can be given it and nothing else in the
 * panel. `access admin panel` alone only opens the door.
 */
class AnnouncementsPermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_the_seeder_creates_the_permission(): void
    {
        $this->assertTrue(Permission::where('name', 'manage announcements')->exists());
    }

    public function test_a_user_with_the_permission_can_open_it(): void
    {
        $this->actingAs($this->staff('access admin panel', 'manage announcements'))
            ->get(AnnouncementResource::getUrl('index'))
            ->assertOk();
    }

    public function test_panel_access_alone_does_not_open_it(): void
    {
        $this->actingAs($this->staff('access admin panel'))
            ->get(AnnouncementResource::getUrl('index'))
            ->assertForbidden();
    }

    private function staff(string ...$permissions): User
    {
        Permission::findOrCreate('access admin panel');

        return User::factory()->create(['email_verified_at' => now()])->givePermissionTo($permissions);
    }
}

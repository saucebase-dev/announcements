<?php

namespace Modules\Announcements\Tests\Feature;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Livewire\Livewire;
use Modules\Announcements\Filament\Resources\Announcements\Pages\CreateAnnouncement;
use Modules\Announcements\Filament\Resources\Announcements\Pages\EditAnnouncement;
use Modules\Announcements\Filament\Resources\Announcements\Pages\ListAnnouncements;
use Modules\Announcements\Models\Announcement;
use Tests\TestCase;

class AnnouncementResourceTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['email_verified_at' => now()]);
        $this->admin->assignRole(Role::ADMIN);
    }

    public function test_can_list_announcements_in_filament(): void
    {
        $announcement = Announcement::factory()->active()->create();

        $this->actingAs($this->admin);

        Livewire::test(ListAnnouncements::class)
            ->assertCanSeeTableRecords([$announcement]);
    }

    public function test_can_create_announcement_and_auto_sets_created_by(): void
    {
        $this->actingAs($this->admin);

        Livewire::test(CreateAnnouncement::class)
            ->fillForm([
                'text' => 'Test announcement',
                'is_active' => true,
                'is_dismissable' => false,
                'show_on_frontend' => true,
                'show_on_dashboard' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        // The wrapping markup is the rich editor's business and has changed between
        // Filament releases. What this module promises is that the text survives and
        // that the author is recorded without being asked for.
        $this->assertDatabaseHas('announcements', [
            'is_active' => true,
            'created_by' => $this->admin->id,
        ]);

        $this->assertStringContainsString('Test announcement', Announcement::sole()->text);
    }

    public function test_can_edit_an_announcement(): void
    {
        $announcement = Announcement::factory()->create();

        $this->actingAs($this->admin);

        Livewire::test(EditAnnouncement::class, ['record' => $announcement->id])
            ->fillForm(['text' => 'Updated text'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertStringContainsString('Updated text', $announcement->refresh()->text);
    }

    public function test_can_delete_an_announcement(): void
    {
        $announcement = Announcement::factory()->create();

        $this->actingAs($this->admin);

        Livewire::test(EditAnnouncement::class, ['record' => $announcement->id])
            ->callAction('delete')
            ->assertNotified();

        $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
    }

    /**
     * A route this test owns, to assert a prop this module shares.
     *
     * The prop is shared onto every Inertia response, so the subject is "any Inertia
     * response" and nothing more specific. Borrowing another module's page instead — the
     * dashboard, say — ties these assertions to that page's middleware and redirects,
     * and they then fail for reasons that have nothing to do with announcements.
     */
    private function inertiaRoute(): string
    {
        Route::middleware('web')->get('/announcements-prop-probe', fn () => Inertia::render('Index'));

        return '/announcements-prop-probe';
    }

    public function test_active_announcement_is_shared_as_inertia_prop(): void
    {
        $announcement = Announcement::factory()->active()->create();

        $response = $this->get($this->inertiaRoute());

        $response->assertInertia(function ($page) use ($announcement) {
            $page->has('announcement')
                ->where('announcement.id', $announcement->id);
        });
    }

    public function test_inactive_announcement_is_not_shared(): void
    {
        Announcement::factory()->create(['is_active' => false]);

        $response = $this->get($this->inertiaRoute());

        $response->assertInertia(function ($page) {
            $page->where('announcement', null);
        });
    }

    public function test_dismissed_cookie_prevents_prop_from_being_shared(): void
    {
        $announcement = Announcement::factory()->active()->create();
        $cookieName = config('announcements.cookie_name');

        $response = $this->withCookie($cookieName, (string) $announcement->id)
            ->get($this->inertiaRoute());

        $response->assertInertia(function ($page) {
            $page->where('announcement', null);
        });
    }

    public function test_dismiss_route_sets_announcement_dismissed_cookie(): void
    {
        $announcement = Announcement::factory()->active()->create();
        $cookieName = config('announcements.cookie_name');

        $response = $this->post(route('announcements.dismiss', $announcement));

        $response->assertCookie($cookieName, (string) $announcement->id);
    }
}

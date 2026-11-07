<?php

namespace Modules\Announcements\Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Modules\Announcements\Models\Announcement;
use Tests\TestCase;

class AnnouncementTest extends TestCase
{
    use RefreshDatabase;

    /** The banner renders the text as HTML on every page, so markup that runs is stripped. */
    public function test_text_is_sanitised_for_rendering(): void
    {
        $announcement = Announcement::factory()->create([
            'text' => '<p><strong>Sale</strong><img src=x onerror="alert(1)"><script>alert(2)</script></p>',
        ]);

        $text = $announcement->fresh()->text;

        $this->assertStringContainsString('<strong>Sale</strong>', $text);
        $this->assertStringNotContainsString('onerror', $text);
        $this->assertStringNotContainsString('<script', $text);
    }

    public function test_returns_null_when_no_announcements_exist(): void
    {
        $result = Announcement::active()->first();

        $this->assertNull($result);
    }

    public function test_returns_null_when_announcement_is_inactive(): void
    {
        Announcement::factory()->create(['is_active' => false]);

        $result = Announcement::active()->first();

        $this->assertNull($result);
    }

    public function test_returns_announcement_when_active_and_no_schedule_set(): void
    {
        $announcement = Announcement::factory()->active()->create();

        $result = Announcement::active()->first();

        $this->assertNotNull($result);
        $this->assertEquals($announcement->id, $result->id);
    }

    public function test_returns_null_when_starts_at_is_in_the_future(): void
    {
        Announcement::factory()->active()->create([
            'starts_at' => now()->addHour(),
        ]);

        $result = Announcement::active()->first();

        $this->assertNull($result);
    }

    public function test_returns_null_when_ends_at_is_in_the_past(): void
    {
        Announcement::factory()->active()->create([
            'ends_at' => now()->subHour(),
        ]);

        $result = Announcement::active()->first();

        $this->assertNull($result);
    }

    public function test_returns_announcement_when_within_schedule_window(): void
    {
        $announcement = Announcement::factory()->active()->create([
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHour(),
        ]);

        $result = Announcement::active()->first();

        $this->assertNotNull($result);
        $this->assertEquals($announcement->id, $result->id);
    }

    public function test_returns_latest_when_multiple_active_announcements_exist(): void
    {
        Announcement::factory()->active()->create([
            'created_at' => now()->subDay(),
        ]);
        $latest = Announcement::factory()->active()->create([
            'created_at' => now(),
        ]);

        $result = Announcement::active()->first();

        $this->assertNotNull($result);
        $this->assertEquals($latest->id, $result->id);
    }

    /** Cast, so a database 0/1 never reaches callers as an integer. */
    public function test_flags_are_booleans(): void
    {
        $announcement = Announcement::factory()->create(['is_active' => 1])->fresh();

        $this->assertTrue($announcement->is_active);
    }
}

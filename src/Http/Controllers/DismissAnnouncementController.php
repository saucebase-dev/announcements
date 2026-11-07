<?php

namespace Modules\Announcements\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Modules\Announcements\Models\Announcement;

class DismissAnnouncementController
{
    public function __invoke(Announcement $announcement): RedirectResponse
    {
        // 404, as for a missing one: the banner offers no button for these.
        abort_unless($announcement->is_dismissable, 404);

        return back()->withCookie(
            cookie(
                config('announcements.cookie_name'),
                (string) $announcement->id,
                60 * 24 * 365, // 1 year
            )
        );
    }
}

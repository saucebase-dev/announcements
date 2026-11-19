<?php

namespace Modules\Announcements\Providers;

use Inertia\Inertia;
use Modules\Announcements\Models\Announcement;
use Saucebase\Core\Providers\ModuleServiceProvider;

class AnnouncementsServiceProvider extends ModuleServiceProvider
{
    protected function shareInertiaData(): void
    {
        Inertia::share('announcement', function () {
            $cookieName = config('announcements.cookie_name');
            $dismissedId = request()->cookie($cookieName);
            // The newest for this visitor's audience, as the banner reads it (signed in: dashboard),
            // so a newer one for the other audience never hides it.
            $audience = auth()->check() ? 'show_on_dashboard' : 'show_on_frontend';
            $announcement = Announcement::active()->where($audience, true)->first();

            if (! $announcement) {
                return null;
            }

            if ($dismissedId && (int) $dismissedId === $announcement->id) {
                return null;
            }

            return $announcement->only([
                'id',
                'text',
                'is_dismissable',
                'show_on_frontend',
                'show_on_dashboard',
            ]);
        });
    }
}

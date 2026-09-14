import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import IconXMark from '~icons/heroicons/x-mark';
import type { Announcement } from '../../types';

export default function AnnouncementBanner() {
    const page = usePage();
    const announcement = (page.props?.announcement as Announcement) ?? null;
    const isAuthenticated = !!page.props?.auth?.user;
    const [isDismissed, setIsDismissed] = useState(false);

    if (isDismissed || !announcement) {
        return null;
    }

    const audienceAllowed = isAuthenticated
        ? announcement.show_on_dashboard
        : announcement.show_on_frontend;

    if (!audienceAllowed) {
        return null;
    }

    function dismiss() {
        setIsDismissed(true);

        router.post(
            route('announcements.dismiss', { announcement: announcement.id }),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <div
            data-announcement-banner
            className="sticky inset-x-0 top-0 z-50 flex min-h-16 items-center bg-indigo-600 dark:bg-indigo-700"
        >
            <div className="mx-auto max-w-7xl px-6">
                <p
                    className={`announcement-text line-clamp-2 text-center text-sm/6 text-white [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold ${announcement.is_dismissable ? 'pr-8' : ''}`}
                    dangerouslySetInnerHTML={{ __html: announcement.text }}
                />
            </div>

            {announcement.is_dismissable && (
                <button
                    type="button"
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-1.5 text-white opacity-80 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    data-testid="announcement-dismiss"
                    aria-label="Dismiss announcement"
                    onClick={dismiss}
                >
                    <IconXMark className="size-5" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

import { router, usePage } from '@inertiajs/react';
import type { Announcement } from '../../types';
import { AnnouncementBanner } from './AnnouncementBanner';

/**
 * The banner on every page: the server shares the active announcement as the
 * `announcement` page prop. Covered by the module's E2E tests, not by stories.
 */
export function AnnouncementBannerSlot() {
    const page = usePage();
    const announcement = (page.props.announcement as Announcement | null) ?? null;
    const audience = page.props.auth?.user
        ? announcement?.show_on_dashboard
        : announcement?.show_on_frontend;

    if (!announcement || !audience) {
        return null;
    }

    /**
     * The banner goes when the server says so, not on the click: hiding it first raced
     * the request that stores the cookie, and a reload straight after brought it back.
     */
    function dismiss({ id }: Announcement) {
        router.post(
            route('announcements.dismiss', { announcement: id }),
            {},
            { preserveScroll: true },
        );
    }

    return <AnnouncementBanner announcement={announcement} onDismiss={dismiss} />;
}

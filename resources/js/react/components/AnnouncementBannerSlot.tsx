import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { Announcement } from '../../types';
import { AnnouncementBanner } from './AnnouncementBanner';

/**
 * The banner on every page: the server shares the active announcement as the
 * `announcement` page prop. Covered by the module's E2E tests, not by stories.
 */
export function AnnouncementBannerSlot() {
    const page = usePage();
    const shared = (page.props.announcement as Announcement | null) ?? null;
    const audience = page.props.auth?.user
        ? shared?.show_on_dashboard
        : shared?.show_on_frontend;
    const announcement = audience ? shared : null;

    // The last one shown, so the banner keeps its text while it slides away.
    const [shown, setShown] = useState(announcement);
    if (announcement && announcement !== shown) {
        setShown(announcement);
    }

    if (!shown) {
        return null;
    }
    const { id } = shown;

    /**
     * The banner goes when the server says so, not on the click: hiding it first raced
     * the request that stores the cookie, and a reload straight after brought it back.
     */
    function dismiss() {
        router.post(
            route('announcements.dismiss', { announcement: id }),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <AnnouncementBanner
            text={shown.text}
            dismissable={shown.is_dismissable}
            open={announcement !== null}
            onDismiss={dismiss}
        />
    );
}

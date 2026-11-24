import { user } from '@/.storybook/page';
import preview from '@/.storybook/preview';
import { expect, waitFor } from 'storybook/test';
import type { Announcement } from '../../types';
import AnnouncementBanner from './AnnouncementBanner.vue';

const announcement: Announcement = {
    id: 1,
    text: 'Scheduled maintenance on <strong>Sunday, 02:00 UTC</strong>. <a href="/status">Status page</a>',
    is_dismissable: true,
    show_on_frontend: true,
    show_on_dashboard: true,
};

/**
 * The site-wide announcement, across the top of the page. The server shares the active
 * one as the `announcement` page prop; each one chooses whether visitors, signed-in
 * users, or both see it, and whether it can be dismissed.
 *
 * The text is HTML from the admin panel: bold and links render.
 */
const meta = preview.meta({
    title: 'Announcements/AnnouncementBanner',
    component: AnnouncementBanner,
    parameters: {
        // Its stories differ only in page props, which one docs page shares.
        docs: { story: { inline: false, iframeHeight: '120px' } },
        layout: 'fullscreen',
        inertia: { announcement },
    },
});
export default meta;

/** A visitor on the public site. Bold text and links come from the admin's editor. */
export const Visitor = meta.story({
    play: async ({ canvas }) => {
        await expect(
            canvas.getByRole('link', { name: 'Status page' }),
        ).toBeVisible();
    },
});

/** Dismissing hides it at once and tells the server, which stops sharing it. */
export const Dismissing = meta.story({
    play: async ({ canvas, canvasElement, userEvent }) => {
        await userEvent.click(canvas.getByTestId('announcement-dismiss'));

        await waitFor(() =>
            expect(
                canvasElement.querySelector('[data-announcement-banner]'),
            ).toBeNull(),
        );
    },
});

/** A signed-in user, on the dashboard. */
export const SignedIn = meta.story({
    parameters: { inertia: { auth: { user } } },
});

/** One that can't be dismissed: no close button. */
export const NotDismissable = meta.story({
    parameters: {
        inertia: { announcement: { ...announcement, is_dismissable: false } },
    },
    play: async ({ canvas }) => {
        await expect(canvas.queryByTestId('announcement-dismiss')).toBeNull();
    },
});

/** Dashboard-only, seen by a visitor: nothing renders. */
export const HiddenFromVisitors = meta.story({
    parameters: {
        inertia: { announcement: { ...announcement, show_on_frontend: false } },
    },
    play: async ({ canvasElement }) => {
        await expect(
            canvasElement.querySelector('[data-announcement-banner]'),
        ).toBeNull();
    },
});

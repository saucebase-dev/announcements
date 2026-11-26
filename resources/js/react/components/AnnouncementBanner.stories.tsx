import preview from '@/.storybook/preview';
import { expect, fn } from 'storybook/test';
import type { Announcement } from '../../types';
import { AnnouncementBanner } from './AnnouncementBanner';

const announcement: Announcement = {
    id: 1,
    text: 'Scheduled maintenance on <strong>Sunday, 02:00 UTC</strong>. <a href="/status">Status page</a>',
    is_dismissable: true,
    show_on_frontend: true,
    show_on_dashboard: true,
};

/**
 * The site-wide announcement, across the top of the page. The text is HTML from the
 * admin panel: bold and links render.
 *
 * `AnnouncementBannerSlot` puts it on every page: it picks the active announcement for
 * the visitor's audience and tells the server when one is dismissed.
 */
const meta = preview.meta({
    title: 'Announcements/AnnouncementBanner',
    component: AnnouncementBanner,
    args: { announcement, onDismiss: fn() },
    parameters: { layout: 'fullscreen' },
});
export default meta;

/** Bold text and a link, from the admin's editor. */
export const Default = meta.story({
    play: async ({ canvas }) => {
        await expect(
            canvas.getByRole('link', { name: 'Status page' }),
        ).toBeVisible();
    },
});

/** The close button asks for the announcement to go; the banner doesn't hide itself. */
export const Dismissing = meta.story({
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(
            canvas.getByRole('button', { name: 'Dismiss announcement' }),
        );

        await expect(args.onDismiss).toHaveBeenCalledWith(announcement);
    },
});

/** One that can't be dismissed: no close button. */
export const NotDismissable = meta.story({
    args: { announcement: { ...announcement, is_dismissable: false } },
    play: async ({ canvas }) => {
        await expect(canvas.queryByRole('button')).toBeNull();
    },
});

/** A long text stops at two lines. */
export const LongText = meta.story({
    args: {
        announcement: {
            ...announcement,
            text: 'We are moving to a new data centre this weekend. '.repeat(8),
        },
    },
});

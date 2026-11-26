import preview from '@/.storybook/preview';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, waitFor } from 'storybook/test';
import AnnouncementBanner from './AnnouncementBanner.vue';

/**
 * The site-wide announcement, stuck to the top of the page. The text is HTML from the
 * admin panel: bold and links render.
 *
 * `AnnouncementBannerSlot` puts it on every page: it picks the active announcement for
 * the visitor's audience, tells the server when one is dismissed, and closes the banner
 * when the next page comes back without it. Here, dismissing closes it at once; turn
 * `open` back on in Controls to bring it back.
 */
const meta = preview.meta({
    title: 'Announcements/AnnouncementBanner',
    component: AnnouncementBanner,
    args: {
        text: 'Scheduled maintenance on <strong>Sunday, 02:00 UTC</strong>. <a href="/status">Status page</a>',
        dismissable: true,
        open: true,
        onDismiss: fn(),
    },
    parameters: {
        layout: 'fullscreen',
        docs: {
            // Each story scrolls its own page.
            story: { inline: false, iframeHeight: '320px' },
        },
    },
    decorators: [
        // Stands in for the slot: dismissing closes it, as the next page would.
        (story, { parameters }) => {
            const [, updateArgs] = useArgs();
            if (parameters.closeOnDismiss === false) {
                return story();
            }

            return {
                setup: () => ({
                    close(event: MouseEvent) {
                        const target = event.target as HTMLElement;
                        if (
                            target.closest(
                                '[data-testid="announcement-dismiss"]',
                            )
                        ) {
                            updateArgs({ open: false });
                        }
                    },
                }),
                // `contents`: no box of its own, so the banner still sticks to the page.
                template:
                    '<div class="contents" @click="close"><story /></div>',
            };
        },
        // A page under it, tall enough to scroll, so its place at the top can be seen.
        () => ({
            template: `
                <story />
                <main class="mx-auto min-h-[250vh] max-w-7xl space-y-6 px-6 py-12">
                    <div class="bg-muted h-48 rounded-xl" />
                    <div class="grid gap-6 sm:grid-cols-3">
                        <div v-for="n in 3" :key="n" class="bg-muted h-40 rounded-xl" />
                    </div>
                    <div class="bg-muted h-96 rounded-xl" />
                </main>`,
        }),
    ],
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

/** It stays at the top of the window while the page scrolls under it. */
export const Scrolling = meta.story({
    play: async ({ canvasElement }) => {
        window.scrollTo({ top: 600, behavior: 'instant' });

        const banner = canvasElement.querySelector(
            '[data-announcement-banner]',
        );
        await waitFor(() =>
            expect(banner?.getBoundingClientRect().top).toBe(0),
        );
    },
});

/**
 * The close button asks for it to go. This story keeps it open: closing re-renders the
 * story, which would reset the spy the test reads. The other stories close it.
 */
export const Dismissing = meta.story({
    parameters: { closeOnDismiss: false },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(
            canvas.getByRole('button', { name: 'Dismiss announcement' }),
        );

        await expect(args.onDismiss).toHaveBeenCalled();
    },
});

/** Closed: nothing shows. Turning `open` on slides it in. */
export const Closed = meta.story({
    args: { open: false },
    play: async ({ canvasElement }) => {
        await expect(
            canvasElement.querySelector('[data-announcement-banner]'),
        ).toBeNull();
    },
});

/** One the admin made permanent: no close button. */
export const NotDismissable = meta.story({
    args: { dismissable: false },
    play: async ({ canvas }) => {
        await expect(canvas.queryByRole('button')).toBeNull();
    },
});

/** A long text stops at two lines. */
export const LongText = meta.story({
    args: {
        text: 'We are moving to a new data centre this weekend. '.repeat(8),
    },
});

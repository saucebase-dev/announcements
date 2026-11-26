import preview from '@/.storybook/preview';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';
import { expect, waitFor } from 'storybook/test';
import AnnouncementBanner from './AnnouncementBanner.vue';

/**
 * The site-wide announcement, stuck to the top of the page. The text is HTML from the
 * admin panel: bold and links render.
 *
 * `AnnouncementBannerSlot` puts it on every page: it picks the active announcement for
 * the visitor's audience, tells the server when one is dismissed, and closes the banner
 * when the next page comes back without it. Here, dismissing closes it at once and logs
 * `dismiss` in Actions; turn `open` back on in Controls to bring it back.
 */
const meta = preview.meta({
    title: 'Announcements/AnnouncementBanner',
    component: AnnouncementBanner,
    args: {
        text: 'Scheduled maintenance on <strong>Sunday, 02:00 UTC</strong>. <a href="#">Status page</a>',
        dismissable: true,
        open: true,
    },
    parameters: { layout: 'fullscreen' },
    decorators: [
        // Stands in for the slot: dismissing closes it, as the next page would. The
        // handler is the decorator's, not an arg, so the docs can print the snippet.
        (story, { args }) => {
            const [, updateArgs] = useArgs();

            return story({
                args: {
                    onDismiss: () => {
                        action('dismiss')();
                        args.open = false;
                        updateArgs({ open: false });
                    },
                },
            });
        },
        // A page under it, in a box of its own that scrolls, so its place at the top can
        // be seen inline on the docs page too.
        () => ({
            template: `
                <div data-page class="h-80 overflow-y-auto">
                    <story />
                    <main class="mx-auto max-w-7xl space-y-6 px-6 py-12">
                        <div class="bg-muted h-48 rounded-xl" />
                        <div class="grid gap-6 sm:grid-cols-3">
                            <div v-for="n in 3" :key="n" class="bg-muted h-40 rounded-xl" />
                        </div>
                        <div class="bg-muted h-96 rounded-xl" />
                    </main>
                </div>`,
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

/** It stays at the top while the page scrolls under it. */
export const Scrolling = meta.story({
    play: async ({ canvasElement }) => {
        const page = canvasElement.querySelector('[data-page]')!;
        page.scrollTo({ top: 600, behavior: 'instant' });

        const banner = canvasElement.querySelector(
            '[data-announcement-banner]',
        );
        await waitFor(() =>
            expect(banner?.getBoundingClientRect().top).toBe(
                page.getBoundingClientRect().top,
            ),
        );
    },
});

/** The close button: the banner slides away. Turn `open` back on to bring it back. */
export const Dismissing = meta.story({
    play: async ({ canvas, canvasElement, userEvent }) => {
        await userEvent.click(
            canvas.getByRole('button', { name: 'Dismiss announcement' }),
        );

        await waitFor(() =>
            expect(
                canvasElement.querySelector('[data-announcement-banner]'),
            ).toBeNull(),
        );
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

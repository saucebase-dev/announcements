import preview from '@/.storybook/preview';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, waitFor } from 'storybook/test';
import { ref, watch } from 'vue';
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
        // Each story scrolls its own page.
        docs: { story: { inline: false, iframeHeight: '320px' } },
    },
    // Stands in for the slot: dismissing closes it, as the next page would.
    render: (args) => {
        const [, updateArgs] = useArgs();

        return {
            components: { AnnouncementBanner },
            setup() {
                // Its own state, so the banner animates away before Controls re-render it.
                const open = ref(args.open);
                watch(
                    () => args.open,
                    (value) => (open.value = value),
                );
                const close = () => {
                    open.value = false;
                    updateArgs({ open: false });
                };

                return { args, open, close };
            },
            template:
                '<AnnouncementBanner v-bind="args" :open="open" @dismiss="close" />',
        };
    },
    // A page under it, tall enough to scroll, so its place at the top can be seen.
    decorators: [
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
 * The close button asks for it to go, and it slides away. The story closes it only from
 * the `dismiss` event (logged in Actions), so the banner leaving shows the event fired.
 */
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

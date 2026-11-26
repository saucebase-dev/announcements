import preview from '@/.storybook/preview';
import type { Decorator } from '@storybook/react-vite';
import { useState, type ComponentProps, type ComponentType } from 'react';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';
import { expect, waitFor } from 'storybook/test';
import { AnnouncementBanner } from './AnnouncementBanner';

type Args = ComponentProps<typeof AnnouncementBanner>;

/** Holds `open`, so a dismiss closes the banner even where Controls can't re-render. */
function Closing({
    Story,
    args,
    onClose,
}: {
    Story: ComponentType<{ args: Args }>;
    args: Args;
    onClose: () => void;
}) {
    const [open, setOpen] = useState(args.open);
    const [control, setControl] = useState(args.open);
    if (args.open !== control) {
        setControl(args.open);
        setOpen(args.open);
    }

    return (
        <Story
            args={{
                ...args,
                open,
                onDismiss: () => {
                    action('dismiss')();
                    setOpen(false);
                    onClose();
                },
            }}
        />
    );
}

// Stands in for the slot: dismissing closes it, as the next page would. The handler is
// the decorator's, not an arg, so the docs can print the snippet.
const closeOnDismiss: Decorator<Args> = (Story, { args }) => {
    const [, updateArgs] = useArgs();

    return (
        <Closing
            Story={Story as ComponentType<{ args: Args }>}
            args={args}
            onClose={() => updateArgs({ open: false })}
        />
    );
};

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
        closeOnDismiss,
        // A page under it, in a box of its own that scrolls, so its place at the top can
        // be seen inline on the docs page too.
        (Story) => (
            <div data-page className="h-80 overflow-y-auto">
                <Story />
                <main className="mx-auto max-w-7xl space-y-6 px-6 py-12">
                    <div className="bg-muted h-48 rounded-xl" />
                    <div className="grid gap-6 sm:grid-cols-3">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-muted h-40 rounded-xl" />
                        ))}
                    </div>
                    <div className="bg-muted h-96 rounded-xl" />
                </main>
            </div>
        ),
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

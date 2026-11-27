import { cn } from '@/lib/utils';
import { useT } from '@saucebase/react/i18n';
import { useEffect, useRef, useState } from 'react';
import IconXMark from '~icons/heroicons/x-mark';

type Props = {
    /** HTML from the admin's editor, sanitised by the server: bold and links render. */
    text: string;
    /** Shows the close button. */
    dismissable?: boolean;
    /** Slides in when it turns on, and away when it turns off. */
    open?: boolean;
    /** The close button. Whoever shows the banner decides when it goes, through `open`. */
    onDismiss?: () => void;
};

/** The site-wide announcement, stuck to the top of the page. */
export function AnnouncementBanner({
    text,
    dismissable = false,
    open = true,
    onDismiss,
}: Props) {
    const t = useT();
    // Still on the page while it slides away.
    const [present, setPresent] = useState(open);
    // Slides in when reopened; the first render shows it at once, as Vue's does.
    const [reopened, setReopened] = useState(false);

    const banner = useRef<HTMLDivElement>(null);

    if (open && !present) {
        setPresent(true);
        setReopened(true);
    }

    // Gone once the slide finishes: at once when there's no transition (reduced motion,
    // story tests), and not at all if it reopens first.
    useEffect(() => {
        const element = banner.current;
        if (open || !element) {
            return;
        }
        let reopenedFirst = false;
        // Settled, not fulfilled: a slide cut short rejects, and the banner still goes.
        Promise.allSettled(element.getAnimations().map((a) => a.finished)).then(
            () => !reopenedFirst && setPresent(false),
        );

        return () => {
            reopenedFirst = true;
        };
    }, [open]);

    if (!present) {
        return null;
    }

    return (
        <div
            data-announcement-banner
            className={cn(
                'sticky inset-x-0 top-0 z-50 flex min-h-16 items-center bg-indigo-600 transition-all duration-300 dark:bg-indigo-700',
                reopened && 'starting:-translate-y-full starting:opacity-0',
                open ? 'ease-out' : '-translate-y-full opacity-0 ease-in',
            )}
            ref={banner}
        >
            <div className="mx-auto max-w-7xl px-6">
                <p
                    className={cn(
                        'announcement-text line-clamp-2 text-center text-sm/6 text-white [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold',
                        dismissable && 'pr-8',
                    )}
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            </div>

            {dismissable && (
                <button
                    type="button"
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-1.5 text-white opacity-80 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    data-testid="announcement-dismiss"
                    aria-label={t('Dismiss announcement')}
                    onClick={onDismiss}
                >
                    <IconXMark className="size-5" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

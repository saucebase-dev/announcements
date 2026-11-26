import { useT } from '@saucebase/react/i18n';
import IconXMark from '~icons/heroicons/x-mark';
import type { Announcement } from '../../types';

type Props = {
    /** The text is HTML from the admin's editor, sanitised by the server. */
    announcement: Announcement;
    /** The close button: whoever shows the banner decides when it goes. */
    onDismiss?: (announcement: Announcement) => void;
};

/** The site-wide announcement, across the top of the page. */
export function AnnouncementBanner({ announcement, onDismiss }: Props) {
    const t = useT();

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
                    aria-label={t('Dismiss announcement')}
                    onClick={() => onDismiss?.(announcement)}
                >
                    <IconXMark className="size-5" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

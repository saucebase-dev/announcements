import { expect, test } from '@e2e/fixtures';
import { isModuleInstalled } from '@e2e/helpers/modules';

/** A date `days` away from now, as the `Y-m-d H:i:s` the factory expects. */
function isoOffsetFromNow(days: number): string {
    const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    return date.toISOString().slice(0, 19).replace('T', ' ');
}

test.describe('Announcement Banner', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ laravel }) => {
        await laravel.callFunction(
            'Modules\\Announcements\\Tests\\Support\\AnnouncementTestHelper::clean',
        );
    });

    test('banner is visible on public page when active and show_on_frontend is true', async ({
        page,
        laravel,
    }) => {
        await laravel.factory('Modules\\Announcements\\Models\\Announcement', {
            text: 'Hello from announcement!',
            is_active: true,
            show_on_frontend: true,
        });

        await page.goto('/');

        await expect(page.getByText('Hello from announcement!')).toBeVisible();
    });

    test('banner is not visible when show_on_frontend is false on public page', async ({
        page,
        laravel,
    }) => {
        await laravel.factory('Modules\\Announcements\\Models\\Announcement', {
            text: 'Hidden on frontend',
            is_active: true,
            show_on_frontend: false,
        });

        await page.goto('/');

        await expect(page.getByText('Hidden on frontend')).not.toBeVisible();
    });

    test('banner is visible on dashboard when active and show_on_dashboard is true', async ({
        page,
        laravel,
        credentials,
        loginAs,
    }) => {
        // Core has no authenticated page besides `/dashboard` (routes/web.php),
        // and tenancy funnels authenticated visitors away from it when
        // installed — skip rather than assert on a page this module doesn't
        // control in that combination.
        test.skip(
            await isModuleInstalled(laravel, 'tenancy'),
            'no tenancy-safe authenticated page to check the dashboard banner on',
        );

        await laravel.factory('Modules\\Announcements\\Models\\Announcement', {
            text: 'Dashboard announcement',
            is_active: true,
            show_on_dashboard: true,
        });

        await loginAs(credentials.user);
        await page.goto('/dashboard');

        await expect(page.getByText('Dashboard announcement')).toBeVisible();
    });

    test('banner is not visible on dashboard when show_on_dashboard is false', async ({
        page,
        laravel,
        credentials,
        loginAs,
    }) => {
        test.skip(
            await isModuleInstalled(laravel, 'tenancy'),
            'no tenancy-safe authenticated page to check the dashboard banner on',
        );

        await laravel.factory('Modules\\Announcements\\Models\\Announcement', {
            text: 'Hidden on dashboard',
            is_active: true,
            show_on_dashboard: false,
        });

        await loginAs(credentials.user);
        await page.goto('/dashboard');

        await expect(page.getByText('Hidden on dashboard')).not.toBeVisible();
    });

    test('dismiss button hides the banner and banner does not reappear on reload', async ({
        page,
        laravel,
    }) => {
        await laravel.factory('Modules\\Announcements\\Models\\Announcement', {
            text: 'Dismissable banner',
            is_active: true,
            is_dismissable: true,
        });

        await page.goto('/');
        await expect(page.getByText('Dismissable banner')).toBeVisible();

        await page.getByTestId('announcement-dismiss').click();
        await expect(page.getByText('Dismissable banner')).not.toBeVisible();

        await page.reload();
        await expect(page.getByText('Dismissable banner')).not.toBeVisible();
    });

    test('no dismiss button when is_dismissable is false', async ({
        page,
        laravel,
    }) => {
        await laravel.factory('Modules\\Announcements\\Models\\Announcement', {
            text: 'Non-dismissable banner',
            is_active: true,
            is_dismissable: false,
        });

        await page.goto('/');
        await expect(page.getByText('Non-dismissable banner')).toBeVisible();
        await expect(
            page.getByTestId('announcement-dismiss'),
        ).not.toBeVisible();
    });

    /**
     * The window is written around the real clock rather than travelled to.
     *
     * `laravel.travel()` moves the server's clock for every worker, and a login
     * happening in another project at that moment gets a session stamped in the
     * travelled past, which the next real-time request treats as expired.
     */
    test('banner is visible when current time is within the schedule window', async ({
        page,
        laravel,
    }) => {
        await laravel.factory('Modules\\Announcements\\Models\\Announcement', {
            text: 'Scheduled announcement',
            is_active: true,
            show_on_frontend: true,
            starts_at: isoOffsetFromNow(-1),
            ends_at: isoOffsetFromNow(1),
        });

        await page.goto('/');

        await expect(page.getByText('Scheduled announcement')).toBeVisible();
    });

    test('banner is not visible when current time is outside the schedule window', async ({
        page,
        laravel,
    }) => {
        await laravel.factory('Modules\\Announcements\\Models\\Announcement', {
            text: 'Scheduled announcement',
            is_active: true,
            show_on_frontend: true,
            starts_at: isoOffsetFromNow(1),
            ends_at: isoOffsetFromNow(2),
        });

        await page.goto('/');

        await expect(
            page.getByText('Scheduled announcement'),
        ).not.toBeVisible();
    });
});

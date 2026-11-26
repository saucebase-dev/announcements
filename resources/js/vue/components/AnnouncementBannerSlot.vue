<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import type { Announcement } from '../../types';
import AnnouncementBanner from './AnnouncementBanner.vue';

/**
 * The banner on every page: the server shares the active announcement as the
 * `announcement` page prop. Covered by the module's E2E tests, not by stories.
 */
const page = usePage();

const announcement = computed(() => {
    const shared = (page.props.announcement as Announcement | null) ?? null;
    const audience = page.props.auth?.user
        ? shared?.show_on_dashboard
        : shared?.show_on_frontend;

    return audience ? shared : null;
});

/**
 * The banner goes when the server says so, not on the click: hiding it first raced
 * the request that stores the cookie, and a reload straight after brought it back.
 */
function dismiss(announcement: Announcement) {
    router.post(
        route('announcements.dismiss', { announcement: announcement.id }),
        {},
        { preserveScroll: true },
    );
}
</script>

<template>
    <Transition
        leave-active-class="transition-all duration-300 ease-in"
        leave-to-class="opacity-0 -translate-y-full"
    >
        <AnnouncementBanner
            v-if="announcement"
            :announcement="announcement"
            @dismiss="dismiss"
        />
    </Transition>
</template>

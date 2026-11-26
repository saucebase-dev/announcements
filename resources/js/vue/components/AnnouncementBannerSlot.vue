<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, ref, watchEffect } from 'vue';
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

// The last one shown, so the banner keeps its text while it slides away.
const shown = ref<Announcement | null>(null);
watchEffect(() => {
    if (announcement.value) {
        shown.value = announcement.value;
    }
});

/**
 * The banner goes when the server says so, not on the click: hiding it first raced
 * the request that stores the cookie, and a reload straight after brought it back.
 */
function dismiss() {
    if (!shown.value) {
        return;
    }

    router.post(
        route('announcements.dismiss', { announcement: shown.value.id }),
        {},
        { preserveScroll: true },
    );
}
</script>

<template>
    <AnnouncementBanner
        v-if="shown"
        :text="shown.text"
        :dismissable="shown.is_dismissable"
        :open="announcement !== null"
        @dismiss="dismiss"
    />
</template>

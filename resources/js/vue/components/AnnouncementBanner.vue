<script setup lang="ts">
import IconXMark from '~icons/heroicons/x-mark';
import type { Announcement } from '../../types';

defineProps<{
    /** The text is HTML from the admin's editor, sanitised by the server. */
    announcement: Announcement;
}>();

defineEmits<{
    /** The close button: whoever shows the banner decides when it goes. */
    dismiss: [announcement: Announcement];
}>();
</script>

<template>
    <div
        data-announcement-banner
        class="sticky inset-x-0 top-0 z-50 flex min-h-16 items-center bg-indigo-600 dark:bg-indigo-700"
    >
        <div class="mx-auto max-w-7xl px-6">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p
                class="announcement-text line-clamp-2 text-center text-sm/6 text-white [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold"
                :class="announcement.is_dismissable ? 'pr-8' : ''"
                v-html="announcement.text"
            />
        </div>

        <button
            v-if="announcement.is_dismissable"
            type="button"
            class="absolute top-1/2 right-4 -translate-y-1/2 p-1.5 text-white opacity-80 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            data-testid="announcement-dismiss"
            :aria-label="$t('Dismiss announcement')"
            @click="$emit('dismiss', announcement)"
        >
            <IconXMark class="size-5" aria-hidden="true" />
        </button>
    </div>
</template>

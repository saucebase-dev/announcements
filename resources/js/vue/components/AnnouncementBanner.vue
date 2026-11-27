<script setup lang="ts">
import IconXMark from '~icons/heroicons/x-mark';

withDefaults(
    defineProps<{
        /** HTML from the admin's editor, sanitised by the server: bold and links render. */
        text: string;
        /** Shows the close button. */
        dismissable?: boolean;
        /** Slides in when it turns on, and away when it turns off. */
        open?: boolean;
    }>(),
    { dismissable: false, open: true },
);

defineEmits<{
    /** The close button. Whoever shows the banner decides when it goes, through `open`. */
    dismiss: [];
}>();
</script>

<template>
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-full"
        leave-active-class="transition-all duration-300 ease-in"
        leave-to-class="opacity-0 -translate-y-full"
    >
        <div
            v-if="open"
            data-announcement-banner
            class="sticky inset-x-0 top-0 z-50 flex min-h-16 items-center bg-indigo-600 dark:bg-indigo-700"
        >
            <div class="mx-auto max-w-7xl px-6">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p
                    class="announcement-text line-clamp-2 text-center text-sm/6 text-white [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold"
                    :class="dismissable ? 'pr-8' : ''"
                    v-html="text"
                />
            </div>

            <button
                v-if="dismissable"
                type="button"
                class="absolute top-1/2 right-4 -translate-y-1/2 p-1.5 text-white opacity-80 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                data-testid="announcement-dismiss"
                :aria-label="$t('Dismiss announcement')"
                @click="$emit('dismiss')"
            >
                <IconXMark class="size-5" aria-hidden="true" />
            </button>
        </div>
    </Transition>
</template>

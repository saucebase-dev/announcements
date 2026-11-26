import '@modules/announcements/resources/css/style.css';
import { registerGlobalComponent } from '@saucebase/vue/lib/globalComponents';
import AnnouncementBannerSlot from './components/AnnouncementBannerSlot.vue';

/**
 * Announcements module setup
 * Called during app initialization before mounting
 */
export function setup() {
    registerGlobalComponent('app::page.before', AnnouncementBannerSlot);
}

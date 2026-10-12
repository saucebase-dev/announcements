import '@modules/announcements/resources/css/style.css';
import { registerGlobalComponent } from '@saucebase/vue/lib/globalComponents';
import AnnouncementBanner from './components/AnnouncementBanner.vue';

/**
 * Announcements module setup
 * Called during app initialization before mounting
 */
export function setup() {
    registerGlobalComponent('top', AnnouncementBanner);
}

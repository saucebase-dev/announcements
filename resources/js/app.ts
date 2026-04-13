import { registerGlobalComponent } from '@/lib/globalComponents';
import AnnouncementBanner from './components/AnnouncementBanner.vue';
import '../css/style.css';

/**
 * Announcements module setup
 * Called during app initialization before mounting
 */
export function setup() {
    registerGlobalComponent('top', AnnouncementBanner);
}

/**
 * Announcements module after mount logic
 * Called after the app has been mounted
 */
export function afterMount() {}

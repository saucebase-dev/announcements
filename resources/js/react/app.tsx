import '@modules/announcements/resources/css/style.css';
import { registerGlobalComponent } from '@saucebase/react/lib/globalComponents';
import { AnnouncementBannerSlot } from './components/AnnouncementBannerSlot';

export function setup() {
    registerGlobalComponent('app::page.before', AnnouncementBannerSlot);
}

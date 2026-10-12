import '@modules/announcements/resources/css/style.css';
import { registerGlobalComponent } from '@saucebase/react/lib/globalComponents';
import AnnouncementBanner from './components/AnnouncementBanner';

export function setup() {
    registerGlobalComponent('top', AnnouncementBanner);
}

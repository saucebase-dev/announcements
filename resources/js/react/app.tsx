import { registerGlobalComponent } from '@/lib/globalComponents';
import '@modules/announcements/resources/css/style.css';
import AnnouncementBanner from './components/AnnouncementBanner';

export function setup() {
    registerGlobalComponent('top', AnnouncementBanner);
}

export function afterMount() {}

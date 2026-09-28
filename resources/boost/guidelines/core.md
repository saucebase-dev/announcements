## Announcements module

`modules/announcements` (namespace `Modules\Announcements`) shows site-wide announcement banners with
scheduling, audience targeting, and cookie-based dismissal. It is admin-only: no pages, the banner mounts in
the `top` global component slot.

- The server removes a dismissed banner, not the click; never hide it client-side first.
- `show_on_frontend` and `show_on_dashboard` are independent audiences.

Activate the `saucebase-announcements-development` skill before changing this module.

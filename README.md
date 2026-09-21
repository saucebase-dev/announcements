# Announcements Module

<div align="center">

[![Tests](https://github.com/saucebase-dev/announcements/actions/workflows/test.yml/badge.svg)](https://github.com/saucebase-dev/announcements/actions/workflows/test.yml)
[![Release](https://img.shields.io/github/v/release/saucebase-dev/announcements)](https://github.com/saucebase-dev/announcements/releases)
[![Saucebase](https://img.shields.io/badge/Saucebase-1.1+-FF6B35)](https://github.com/saucebase-dev/saucebase)
[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4?logo=php&logoColor=white)](https://php.net)

Works with:<br/>
[![Vue 3.5](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org) [![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)

</div>

Site-wide announcement banners for [Saucebase](https://github.com/saucebase-dev/saucebase), a Laravel SaaS starter kit.

Write a banner in the admin, choose who sees it and when, and it appears at the top of every page. Visitors can dismiss it and it stays gone.

**[Full documentation →](https://saucebase-dev.github.io/docs/modules/announcements)**

## Features

- **Banner on every page** — sticky at the top, no layout changes needed
- **Scheduling** — set a start and end date, or leave them open and switch it off by hand
- **Choose your audience** — show it to visitors, to signed-in users, or both
- **Dismissable** — visitors can close it, and it stays closed for a year
- **Rich text** — links and bold text inside the message
- **Admin panel** — write and manage announcements at `/admin`
- **Vue and React** — works on both

## Requirements

| | |
| --- | --- |
| Saucebase core | `^1.1` |
| Modules | [Auth](https://github.com/saucebase-dev/auth) |

## Installation

```bash
composer require saucebase/announcements
php artisan migrate
npm run build
```

That is it. There is nothing to configure — go to `/admin` → Announcements and write your first one.

### Sample data (optional)

```bash
php artisan modules:seed --module=announcements --demo
```

## Writing an announcement

In `/admin` → Announcements, each one has:

- **Text** — your message, with links and formatting
- **Active** — the on/off switch
- **Starts at / Ends at** — optional. Leave both empty and it shows until you turn it off
- **Dismissable** — lets visitors close it
- **Show on frontend / Show on dashboard** — who sees it. Turn on either, or both

Only one announcement shows at a time — the most recent active one.

## Extending

**Change the look.** The banner is a normal component in `resources/js/vue/components/` and `resources/js/react/components/`. Edit it like any other.

**Change the cookie.** Dismissals are stored in a cookie named `saucebase_announcement_dismissed`. Rename it in `config/announcements.php` if it clashes with something.

Note that dismissals are tied to the announcement's ID. If you want to reach people who dismissed the last one, publish a new announcement rather than editing the old one.

## Configuration

Nothing is required. The only setting is the cookie name above.

See the [documentation](https://saucebase-dev.github.io/docs/modules/announcements) for the rest.

## License

Proprietary. Part of [Saucebase](https://github.com/saucebase-dev/saucebase).

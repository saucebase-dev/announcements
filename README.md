# Saucebase Announcements

<div align="center">

[![Tests](https://github.com/saucebase-dev/announcements/actions/workflows/test.yml/badge.svg)](https://github.com/saucebase-dev/announcements/actions/workflows/test.yml)
[![Release](https://img.shields.io/github/v/release/saucebase-dev/announcements)](https://github.com/saucebase-dev/announcements/releases)
[![Saucebase Core](https://img.shields.io/packagist/dependency-v/saucebase/announcements/saucebase%2Fcore?label=Saucebase%20Core&color=FF6B35)](https://github.com/saucebase-dev/core)
[![License](https://img.shields.io/github/license/saucebase-dev/announcements)](LICENSE)

</div>

Site-wide announcement banners for Saucebase, scheduled and targeted.

A module for [Saucebase](https://github.com/saucebase-dev/saucebase), the AI-ready Laravel SaaS kit. Modules are Composer packages you add to a Saucebase app; once installed, the code is yours to change.

## Features

- **A banner on every page**, sticky at the top, with no layout changes
- **Scheduling**: a start and end date, or open-ended
- **Audience**: visitors, signed-in users, or both
- **Dismissable**: closed banners stay closed for a year
- **Rich text**: links and bold text in the message
- **Admin panel** to write and manage announcements
- **Vue and React**

## Install

**New to Saucebase?** Start a new app and pick **announcements** when it asks for modules:

```bash
curl -fsSL https://install.saucebase.dev | bash
```

It installs PHP and Composer if they're missing. With the CLI already installed, run `saucebase new my-app` instead.

**Already have a Saucebase app?** Add it with:

```bash
composer require saucebase/announcements
php artisan migrate
php artisan modules:seed --module=announcements
npm run build
```

## Configuration

Nothing to set up. Write announcements in the admin panel, under **Announcements**.

## Demo data

```bash
php artisan modules:seed --module=announcements --demo
```

Adds a sample banner and a staff account (`announcements@saucebase.dev`) that only sees announcements in the admin. It uses the `DEMO_PASSWORD` from `.env`.

## License

MIT. See [LICENSE](LICENSE).

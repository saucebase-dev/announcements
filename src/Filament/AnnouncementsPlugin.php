<?php

namespace Modules\Announcements\Filament;

use Filament\Contracts\Plugin;
use Filament\Panel;
use Saucebase\Core\Filament\ModulePlugin;

class AnnouncementsPlugin implements Plugin
{
    use ModulePlugin;

    public function getModuleName(): string
    {
        return 'Announcements';
    }

    public function getId(): string
    {
        return 'announcements';
    }

    public function boot(Panel $panel): void {}
}

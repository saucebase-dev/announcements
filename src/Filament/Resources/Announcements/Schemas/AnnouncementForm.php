<?php

namespace Modules\Announcements\Filament\Resources\Announcements\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AnnouncementForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Group::make([
                    Section::make(__('Message'))
                        ->description(__('Shown in the banner at the top of the page.'))
                        ->schema([
                            RichEditor::make('text')
                                ->hiddenLabel()
                                ->required()
                                ->toolbarButtons([
                                    ['bold', 'italic', 'underline', 'strike'],
                                    ['link'],
                                    ['bulletList', 'orderedList'],
                                ]),
                        ]),
                ])->columnSpan(['lg' => 2]),

                Group::make([
                    Section::make(__('Publish'))
                        ->schema([
                            Toggle::make('is_active')
                                ->label(__('Active'))
                                ->default(false),

                            Toggle::make('is_dismissable')
                                ->label(__('Visitors can dismiss it'))
                                ->default(false),
                        ]),

                    Section::make(__('Schedule'))
                        ->description(__('Leave empty to show it while active.'))
                        ->schema([
                            DateTimePicker::make('starts_at')
                                ->label(__('Starts'))
                                ->nullable(),

                            DateTimePicker::make('ends_at')
                                ->label(__('Ends'))
                                ->nullable()
                                ->rules(['nullable', 'after_or_equal:starts_at']),
                        ]),

                    Section::make(__('Audience'))
                        ->schema([
                            Toggle::make('show_on_frontend')
                                ->label(__('announcements::filament.show_on_frontend'))
                                ->default(true),

                            Toggle::make('show_on_dashboard')
                                ->label(__('announcements::filament.show_on_dashboard'))
                                ->default(true),
                        ]),
                ])->columnSpan(['lg' => 1]),
            ]);
    }
}

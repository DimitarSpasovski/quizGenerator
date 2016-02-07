<?php

namespace App\Providers;

use App\QuizService;
use Illuminate\Support\ServiceProvider;

class QuizServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(QuizService::class, function() {
            return new QuizService;
        });
    }
}

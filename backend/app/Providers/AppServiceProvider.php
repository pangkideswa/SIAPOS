<?php

namespace App\Providers;

use App\Repositories\Eloquent\JurusanRepository;
use App\Repositories\Eloquent\StudentRepository;
use App\Repositories\Eloquent\TeacherRepository;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\JurusanRepositoryInterface;
use App\Repositories\StudentRepositoryInterface;
use App\Repositories\TeacherRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class
        );

        $this->app->bind(
            JurusanRepositoryInterface::class,
            JurusanRepository::class
        );

        $this->app->bind(
            TeacherRepositoryInterface::class,
            TeacherRepository::class
        );

        $this->app->bind(
            StudentRepositoryInterface::class,
            StudentRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}

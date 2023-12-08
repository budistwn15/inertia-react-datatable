<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = (
            UserResource::collection(User::paginate(request()->load))
        )->additional([
                'attributes' => [
                      'total' => User::count(),
                      'per_page' => 10
                ],
                'filtered' => [
                    'load' => request()->load ?? 10,
                ]
            ]);

        return inertia('Users/Index', [
            'users' => $users,
        ]);
    }
}

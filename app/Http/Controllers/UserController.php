<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $query = User::query();

        if(request()->q) {
            $query->where('name', 'LIKE', '%'.request()->q.'%')
                ->orWhere('email', 'LIKE', '%'.request()->q.'%')
                ->orWhere('username', 'LIKE', '%'.request()->q.'%');
        }

        if(request()->has(['field','direction'])){
            $query->orderBy(request()->field, request()->direction);
        }

        $users = (
            UserResource::collection($query->paginate(request()->load))
        )->additional([
                'attributes' => [
                      'total' => User::count(),
                      'per_page' => 10
                ],
                'filtered' => [
                    'load' => request()->load ?? 10,
                    'q' => request()->q ?? '',
                    'page' => request()->page ?? 1,
                    'field' => request()->field ?? '',
                    'direction' => request()->direction ?? '',
                ],
            ]);

        return inertia('Users/Index', [
            'users' => $users,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {

        request()->validate([
           'direction' => ['in:asc,desc'],
            'field' => ['in:name,email,username'],
        ]);

        $query = User::query();

        if(request()->q) {
            $query->where('name', 'LIKE', '%'.request()->q.'%')
                ->orWhere('email', 'LIKE', '%'.request()->q.'%')
                ->orWhere('username', 'LIKE', '%'.request()->q.'%');
        }

        if(request()->has(['field','direction'])){
            $query->orderBy(request()->field, request()->direction);
        }

        $users = new UserCollection($query->paginate(request()->load));

        return inertia('Users/Index', [
            'users' => $users,
        ]);
    }
}

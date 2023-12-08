import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from '@inertiajs/react';
import {useCallback, useEffect, useState} from "react";
import {debounce, pickBy} from "lodash";

export default function Users({ auth }) {
    const {data: users, meta, filtered, attributes} = usePage().props.users;
    const [params, setParams] = useState(filtered);
    const [pageNumber, setPageNumber] = useState([]);

    const reload = useCallback(
        debounce((query) => {
            router.get(
                route('users.index'),
                {
                    ...pickBy(query),
                    page: query.q ? 1 : query.page,
                },
                {
                    preserveState: true,
                }
            )
        }, 150)
        ,
        []
    );

    useEffect(() => reload(params), [params]);

    useEffect(() => {
        let numbers = [];
        for(let i = attributes.per_page; i <= attributes.total / attributes.per_page; i = i+attributes.per_page) {
            numbers.push(i);
        }
        setPageNumber(numbers);
    }, [attributes.per_page, meta.total])

    const onChange = (event) => setParams({...params, [event.target.name]: event.target.value})

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-end">
                        <div className="w-1/2">
                            <div className="flex items-center gap-x-2">
                                <select
                                    name='load'
                                    id='load'
                                    onChange={onChange}
                                    value={params.load}
                                    className="rounded-lg border-gray-300 focus:ring-blue-200 focus:ring transition duration-150 ease-in form-select"
                                >
                                    {pageNumber.map((page, index) => <option key={index} value={page}>{page}</option>)}
                                </select>
                                <input
                                    type="text"
                                    name="q"
                                    id="q"
                                    onChange={onChange}
                                    className="rounded-lg border-gray-300 focus:ring-blue-200 focus:ring transition duration-150 ease-in form-text w-full"
                                    value={params.q}
                                    placeholder="Cari apapun itu..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-x-auto mt-10">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead
                                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Joined
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {meta.from + index}
                                    </th>
                                    <th scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.username}
                                    </th>
                                    <td className="px-6 py-4">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.joined}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <ul className="flex items-center gap-x-1 mt-10">
                        {meta.links.map((item, index) => (
                            <button
                                disabled={item.url == null ? true : false}
                                className={`${item.url == null ? 'text-gray-500 cursor-not-allowed' : 'text-gray-800'} w-16 h-9 rounded-lg flex items-center justify-center border bg-white`}
                                onClick={() => setParams({...params, page: new URL(item.url).searchParams.get('page')})}
                            >
                                {item.label}
                            </button>
                        ))}
                    </ul>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

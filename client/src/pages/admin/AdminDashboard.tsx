import { FC, useState, useEffect } from 'react'
import { IformTypes } from '../../types/formTypes'
import axios from 'axios'
import UserNotFound from './UserNotFound'
const AdminDashboard: FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [totalUser, setTotalUser] = useState<number>(0)
    const [userDetails, setUserDetails] = useState<IformTypes[]>([{
        username: "",
        email: "",
        _id: ""
    }])
    const filterUsers = (searchTerm: string) => {
        return userDetails.filter((user) =>
            Object.values(user).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const filteredUsers = filterUsers(searchTerm);
    const fetchAllUser = async () => {
        const { data } = await axios.get("http://localhost:3001/api/admin/fetchAllUsers")
        setUserDetails(data)
    }
    useEffect(() => {
        setTotalUser(filteredUsers.length)
        fetchAllUser()
    }, [filteredUsers.length])


    const handleDelete = async (userId: string) => {
        const { data } = await axios.delete(`http://localhost:3001/api/admin/delete-user/${userId}`)
        if (data) {
            fetchAllUser()
        }
    }
    // const filteredUsers = userDetails.filter((user) =>
    //     user.username.toLowerCase().includes(searchTerm.toLowerCase())
    // );


    return (
        <div className="flex text-white flex-col px-28">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <button className='bg-blue-700 px-4 py-2 rounded-md font-semibold ms-2 hover:bg-opacity-90'>Add User</button>
                    <input
                        className='block w-2/6 ms-auto rounded-md outline-none ps-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        type="text"
                        placeholder="Search Users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="overflow-hidden">
                        {filteredUsers.length > 0 ?
                            <table className="min-w-full text-left text-sm font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Username</th>
                                        <th scope="col" className="px-6 py-4">Email</th>
                                        <th scope="col" className="px-6 py-4">Created</th>
                                        <th scope="col" className="px-6 py-4">Updated</th>
                                        <th scope="col" className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, idx) => (
                                        <tr key={idx} className="border-b dark:border-neutral-500">
                                            <td className="whitespace-nowrap px-6 py-4 font-medium">{user.username}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{user.createdAt}</td>
                                            <td className="whitespace-nowrap px-6 py-4">{user.updatedAt}</td>
                                            <td className="whitespace-nowrap px-6 py-4"><button onClick={() => handleDelete(String(user._id))} className='bg-red-700 px-2 py-2 rounded-md font-semibold hover:bg-opacity-90'>Delete</button><button className='bg-blue-700 px-4 py-2 rounded-md font-semibold ms-2 hover:bg-opacity-90'>Edit</button></td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                            : <UserNotFound />}
                    </div>
                </div>
            </div>
            <div>
                <span className='text-cyan-400 font-bold'>No of Documents found:<span className='text-white ps-2'>{totalUser}</span></span>
            </div>
        </div>
    )
}

export default AdminDashboard
import { FC, useState, useEffect, FormEvent, ChangeEvent, MouseEvent } from 'react'
import { IformTypes } from '../../types/formTypes'
import axios from 'axios'
import UserNotFound from './UserNotFound'
import Modal from '../../components/Modal'
import { ToastContainer, toast } from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from '../../redux/store'
import { useNavigate } from 'react-router-dom'
import { adminLogout } from '../../redux/actions/admin/adminAction'
const AdminDashboard: FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { admin } = useSelector((state: RootState) => state.admin)
    const [error, setError] = useState<string>("")
    const [error2, setError2] = useState<string>("")
    const [formData, setFormData] = useState<IformTypes>({
        username: "",
        password: "",
        email: ""
    })

    const [editUser, setEditUser] = useState<IformTypes>({
        username: "",
        email: ""
    })
    const [deleteId, setDeleteId] = useState<string>("")
    const [editId, setEditId] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showModalDelete, ShowModalDelete] = useState<boolean>(false)
    const [showModalEdit, ShowModalEdit] = useState<boolean>(false)
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

    const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        dispatch(adminLogout())
            navigate('/admin')
        
    }
    const handleDelete = async () => {
        const { data } = await axios.delete(`http://localhost:3001/api/admin/delete-user/${deleteId}`)
        if (data) {
            fetchAllUser()
            ShowModalDelete(false)
            setDeleteId("")
            toast.success("User deleted successfully")
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response: any = await axios.post('http://localhost:3001/api/admin/create-user', formData)
            console.log(response, "response data")
            if (response.data.errorMessage) {
                setError(response.data.errorMessage)
            }
            else {
                toast.success("User created successfully")
                setFormData({ username: "", email: "", password: "" })
                setError("")
                setShowModal(false)
                fetchAllUser()
            }
        } catch (error: any) {
            console.log(error, "error in catch")
            setError(error.response.data.errorMessage)
        }
    }
    const handleSubmit2 = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response: any = await axios.post(`http://localhost:3001/api/admin/edit-user/${editId}`, editUserformData)
            console.log(response, "response data")
            if (response.data.errorMessage) {
                setError(response.data.errorMessage)
            }
            else {
                toast.success("User Edited successfully")
                setFormData({ username: "", email: "", password: "" })
                setError2("")
                ShowModalEdit(false)
                fetchAllUser()
            }
        } catch (error: any) {
            console.log(error, "error in catch")
            setError2(error.response.data.errorMessage)
        }
    }

    const handleEdit = async (id: string) => {
        setEditId(id)
        const { data }: { data: IformTypes } = await axios.get(`http://localhost:3001/api/admin/get-user-details/${id}`)
        if (data) {
            console.log(data, "edited user details")
            setEditUser(data)
            ShowModalEdit(true)
        }
    }
    useEffect(() => {
        if (editUser) {
            setEditUserhandleChange({
                username: editUser.username,
                email: editUser.email
            })
        }
    }, [editUser])
    // const filteredUsers = userDetails.filter((user) =>
    //     user.username.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    const [editUserformData, setEditUserhandleChange] = useState<IformTypes>({
        username: editUser.username || "das",
        email: editUser.email || "dsad"
    })
    const EditUserhandleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        setEditUserhandleChange({ ...editUserformData, [name]: value })
    }

    return (
        <div className="flex text-white flex-col px-28">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <button onClick={() => setShowModal(true)} className='bg-blue-700 px-4 py-2 rounded-md font-semibold ms-2 hover:bg-opacity-90'>Add User</button>
                    {admin && <button onClick={handleLogout} className='bg-red-700 px-2 py-2 rounded-md ms-3'>logout</button>}
                    <input
                        className='block w-2/6 ms-auto rounded-md outline-none ps-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        type="text"
                        placeholder="Search Users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="overflow-auto h-[526px] scrollBar">
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
                                            <td className="whitespace-nowrap px-6 py-4"><button onClick={() => {
                                                ShowModalDelete(true)
                                                setDeleteId(String(user._id))
                                            }}
                                                className='bg-red-700 px-2 py-2 rounded-md font-semibold hover:bg-opacity-90'>Delete</button><button onClick={() => handleEdit(String(user._id))} className='bg-blue-700 px-4 py-2 rounded-md font-semibold ms-2 hover:bg-opacity-90'>Edit</button></td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                            : <UserNotFound />}
                    </div>
                </div>
            </div>
            <ToastContainer />
            <div>
                <span className='text-cyan-400 font-bold'>No of Documents found:<span className='text-white ps-2'>{totalUser}</span></span>
            </div>
            <div>
                <Modal isVisible={showModal} onCLose={() => setShowModal(false)}>
                    <div className='text-black'>
                        <h2 className='font-bold text-md text-center'>Create User</h2>
                        {error && <p className='text-red-700 text-center'>{error}</p>}
                        <form action="" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-black">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="block w-full rounded-md outline-none ps-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">
                                        Username
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 ps-2 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 ps-2 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <button type='submit' className='bg-green-700 px-2 py-2 mt-2 flex mx-auto rounded-md text-white'>Submit</button>
                        </form>
                    </div>

                </Modal>
                <Modal isVisible={showModalDelete} onCLose={() => ShowModalDelete(false)}>
                    <h1 className='text-xl font-bold mb-4'>Delete User</h1>
                    <p className='mb-4'>Are you sure you want to delete this user?</p>
                    <div className='flex justify-end'>
                        <button onClick={() => ShowModalDelete(false)} className='mr-2 px-4 py-2 text-gray-500 hover:text-gray-700'>
                            Cancel
                        </button>
                        <button onClick={handleDelete} className='px-4 rounded-md py-2 bg-red-700 text-white hover:bg-red-600'>
                            Delete
                        </button>
                    </div>
                </Modal>
                <Modal isVisible={showModalEdit} onCLose={() => ShowModalEdit(false)}>
                    <div className='text-black'>
                        <h2 className='font-bold text-md text-center'>Edit User</h2>
                        {error && <p className='text-red-700 text-center'>{error2}</p>}
                        <form action="" onSubmit={handleSubmit2}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-black">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={editUserformData.email}
                                        onChange={EditUserhandleChange}
                                        required
                                        className="block w-full rounded-md outline-none ps-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">
                                        Username
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={editUserformData.username}
                                        onChange={EditUserhandleChange}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 ps-2 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <button type='submit' className='bg-green-700 px-2 py-2 mt-2 flex mx-auto rounded-md text-white'>Submit</button>
                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default AdminDashboard
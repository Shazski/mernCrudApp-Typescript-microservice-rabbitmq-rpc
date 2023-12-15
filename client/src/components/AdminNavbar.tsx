import { NavLink, useNavigate } from 'react-router-dom';
import { MouseEvent, FC } from "react"
import { AppDispatch, RootState } from '../redux/store';
import { userLogout } from '../redux/actions/user/userActions';
import { useDispatch, useSelector } from "react-redux"
const AdminNavbar: FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading } = useSelector((state: RootState) => state.user)
    const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        dispatch(userLogout())
        navigate('/login')
    }

    return (
        <div>
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

                            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>

                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>

                                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex  flex-1 items-center justify-center sm:justify-between">
                            <div className="hidden sm:ml-6 sm:block ">
                                <div className="flex justify-between space-x-4 me-10">


                                    {user && (
                                        <NavLink
                                            to="/"
                                            className={({ isActive }) => {
                                                return 'px-3 py-2 rounded-md  text-sm font-medium' +
                                                    (!isActive ? ' hover:bg-gray-700 text-white' : ' bg-gray-900 text-white hover:text-white')
                                            }}
                                        >
                                            Home
                                        </NavLink>
                                    )}
                                    {!user && (
                                        <NavLink
                                            to="/login"
                                            className={({ isActive }) => {
                                                return 'px-3 py-2 rounded-md  text-sm font-medium' +
                                                    (!isActive ? ' hover:bg-gray-700 text-white' : ' bg-gray-900 text-white hover:text-white')
                                            }}
                                        >
                                            Login
                                        </NavLink>
                                    )}
                                    {
                                        user && (
                                            <div className='flex '>
                                                <img src={user?.profilePic} className='rounded-full w-9 h-10' alt="profilepic" />
                                                <div className='text-white pt-2.5 ps-2'>{user?.username}</div>
                                                {user && <button onClick={handleLogout} className='bg-red-600 text-white rounded-md ms-3 w-20 h-10'>{loading ? "waiting..." : "Logout"}</button>}
                                            </div>)
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {user && (
                            <NavLink
                                to="/"
                                className={({ isActive }) => {
                                    return 'px-3 py-2 rounded-md  text-sm font-medium' +
                                        (!isActive ? ' hover:bg-gray-700 text-white' : ' bg-gray-900 text-white hover:text-white')
                                }}
                            >
                                Home
                            </NavLink>
                        )}
                        {!user && (
                            <NavLink
                                to="/login"
                                className={({ isActive }) => {
                                    return 'px-3 py-2 rounded-md  text-sm font-medium' +
                                        (!isActive ? ' hover:bg-gray-700 text-white' : ' bg-gray-900 text-white hover:text-white')
                                }}
                            >
                                Login
                            </NavLink>
                        )}
                        {user && (
                            <NavLink
                                to="/chat"
                                className={({ isActive }) => {
                                    return 'px-3 py-2 rounded-md  text-sm font-medium' +
                                        (!isActive ? ' hover:bg-gray-700 text-white' : ' bg-gray-900 text-white hover:text-white')
                                }}
                            >
                                Chat
                            </NavLink>
                        )}
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default AdminNavbar
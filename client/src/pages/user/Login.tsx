import { Link } from 'react-router-dom';
import signImage from "../../assets/41-413269_jpg-freeuse-library-friendship-child-art-style-children.png"
import { useState, ChangeEvent, FormEvent } from 'react';
import { userLogin } from '../../redux/actions/user/userActions';
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from '../../redux/store';
function Login() {
    const { error, loading } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
    const [formData, setFormData] = useState<{ email: string, password: string }>({
        email: "",
        password: ""
    })
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData({
            email: "",
            password: ""
        })
        dispatch(userLogin(formData))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        setFormData({
            ...formData,
            [name]: value
        })
    }
    return (
        <div className="flex h-screen flex-1  justify-center px-6 py-12 lg:px-8 bg-gray-900 min-w-full">
            <div className='w-3/4 hidden bg-cover  md:flex justify-center'>
                <img src={signImage} alt="" />
            </div>
            <div className='w-full'>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm w-full">
                    <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Crud App
                    </h2>
                    <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Login to your account
                        {error && <p className='text-red-600 '>{error}</p>}
                    </h2>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit} method="">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
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
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
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

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loading ? "loading..." : "Sign In"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
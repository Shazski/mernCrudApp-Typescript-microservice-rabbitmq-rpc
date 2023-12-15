import { useNavigate } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef, useState, ChangeEvent, FormEvent, FC, useEffect } from 'react';
import { IformTypes } from "../../types/formTypes";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../redux/actions/user/userActions";
import { AppDispatch } from '../../redux/store';
const EditUser: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { user, loading, error } = useSelector((state: any) => state.user)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const profileRef = useRef<HTMLInputElement>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formData, setFormData] = useState<IformTypes>({
        username: "",
        email: "",
        profilePic: ""
    })
    useEffect(() => {
        if (!user && !loading && !window.location.pathname.startsWith('/edit-user')) {
           return navigate("/login")
        }
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
            });
        }
    }, [user, loading, navigate])
    const handleFileUpload: () => void = () => {
        profileRef.current?.click()
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget
        const file: any = event.target.files
        if (name === 'profilePic' && file) {
            setImagePreview(URL.createObjectURL(file[0]))
            setFormData({
                ...formData,
                [name]: file[0],
            })
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    }

    const imageUpload = async (image: any) => {
        setIsLoading(true)
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'drtyu0yv');
        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dvjggxcc1/image/upload', {
                method: 'post',
                body: formData,
            })
            const urlData = await res.json()
            return urlData.url
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (profileRef.current?.value) {
            const profilePic = await imageUpload(formData.profilePic)
            formData.profilePic = profilePic
        }
        await dispatch(editUser(formData))
        setImagePreview(null)
    }
    return (
        <div >
            <div className="flex min-h-full flex-1 items-center  px-6 py-12 lg:px-8 bg-gray-900">
                <div className='w-full'>
                    <ToastContainer />
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-3 text-center text-xl font-semibold leading-9 tracking-tight text-white">
                            EDIT USER
                        </h2>

                    </div>
                    <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
                        {error && <p className='text-red-600 text-center'>{error}</p>}
                        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                            <div className='flex justify-center relative hover:cursor-pointer' onClick={handleFileUpload}>
                                <input className='hidden' type="file" ref={profileRef} name="profilePic" id="profilePic" accept='image/png, image/jpeg' onChange={handleChange} />
                                <img src={imagePreview || user?.profilePic} alt="" className='rounded-full w-20 h-20 text-center relative' />
                                <IoIosAdd size={20} style={{ color: 'white', position: "absolute", top: 60, left: 205 }} className="rounded-full bg-green-700 hover:cursor-pointer" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                    User Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="block w-full rounded-md ps-2 outline-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                        value={formData?.username}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData?.email}
                                        required
                                        className="block w-full rounded-md outline-none border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {isLoading || loading ? "loading..." : "Edit"}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default EditUser
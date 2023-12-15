import { FC } from 'react'
import { useSelector } from "react-redux"
import { RootState } from '../../redux/store'
import { Link } from 'react-router-dom'
const Home: FC = () => {
    const { user } = useSelector((state: RootState) => state.user)
    return (
        <div className=''>
            <div className="container my-24 mx-auto md:px-6">
                <section className="mb-32 text-center">
                    <h2 className="mb-12 text-3xl font-bold font-mono text-white">
                        Welcome <span className="text-primary dark:text-primary-400">{user?.username}</span>
                    </h2>
                    <div className="flex justify-center lg:gap-x-12 w-1/4 mx-auto">
                        <div className="mb-6 lg:mb-0">
                            <div
                                className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                                <div className="relative overflow-hidden bg-cover bg-no-repeat">
                                    <img src={user?.profilePic} className="w-[240px] h-[262px] rounded-t-lg" />
                                    <svg className="absolute text-white dark:text-neutral-700 left-0 bottom-0" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 1440 320">
                                        <path fill="currentColor"
                                            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                                        </path>
                                    </svg>
                                </div>
                                <div className="p-6">
                                    <h5 className="mb-4 text-lg font-bold text-white">{user?.username}</h5>
                                    <p className="mb-4 text-neutral-500 dark:text-neutral-300">Fullstack developer</p>
                                    <Link to={`/edit-user`} className='text-md font-bold text-white font-serif bg-red-800 px-3 rounded-md py-2'>EDIT</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Home

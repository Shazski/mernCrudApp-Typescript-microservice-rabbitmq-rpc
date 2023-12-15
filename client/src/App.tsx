import { FC, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import SignUp from './pages/user/SignUp'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { getLoggedInUserDetails } from './redux/actions/user/userActions'
import Login from './pages/user/Login'
import { AppDispatch, RootState } from './redux/store'
import Home from './pages/user/Home'
import Navigation from './components/Navbar'
import EditUser from './pages/user/EditUser'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { getLoggedInAdmin } from './redux/actions/admin/adminAction'
const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)
  const { admin } = useSelector((state: RootState) => state.admin)
  useEffect(() => {
    if (!user) {
      dispatch(getLoggedInUserDetails())
    }
    if(!admin) {
      dispatch(getLoggedInAdmin())
    }
  }, [user, dispatch, admin])
  return (
    <div className='bg-gray-900 h-screen' >
      <Router>
        <Navigation />
        <Routes>
          <Route element={!user ? <SignUp /> : <Navigate to="/" />} path='/signup' />
          <Route element={!user ? <Login /> : <Navigate to="/" />} path='/login' />
          <Route element={user ? <Home /> : <Navigate to="/login" />} path='/' />
          <Route element={<EditUser />} path='/edit-user' />
          <Route element={<AdminLogin />} path='/admin' />
          <Route element={admin ? <AdminDashboard /> : <Navigate to="/admin"/>} path='/admin/dashboard' />
        </Routes>
      </Router>

    </div>
  )
}

export default App

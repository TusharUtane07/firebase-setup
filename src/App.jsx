import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from './firebase/firebase'

const App = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    onAuthStateChanged(auth, (currentUser) => {
      if(currentUser){
        console.log("User is logged in")
      }else{
        navigate('/login')
      }
    })
  }, [])

  return (
    <div className='font-bold text-center text-xl mt-2 flex items-center justify-center h-screen'>
      <NavLink to={"/details"} className='border-2 border-black px-4 py-1 rounded-md'>Start Measuring</NavLink>
    </div>
  )
}

export default App
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Auth from './auth'
import Board from './board'
import {  refreshAuthToken } from '../api'


const MainPage = () => {
  const [signin, setSignin] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log("USER")
    console.log(user)

    if (token && user) {
      refreshAuthToken(user)
      .then((res) => {
        console.log(res)
        setSignin(true)
      })
      .catch((error)=>{
        console.log(error)
        localStorage.clear()
      })
    }
  },[])
  return (
    <div>
        {signin ? 
        <Board setSignin={setSignin} /> :
        <Auth setSignin={setSignin} />
        }
    </div>
  )
}

export default MainPage
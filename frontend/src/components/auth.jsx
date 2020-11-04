import React, { useState } from 'react'
import styled from 'styled-components'
import {login,register} from '../api'
const Container = styled.div`
  display:flex;
`
const List = styled.div`
  display: flex;
  flex-direction: column
`
const HList = styled.div`
  display: flex;
  flex-direction: row
`

const Auth = (props) => {
    const [username, setName] = useState("")
    const [password, setPassword] = useState("")

    const [signupUsername, setSignupName] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("")

    const onChangeName = (event) => {
        setName(event.target.value)
    }

    const onChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const onChangeSignupName = (event) => {
        setSignupName(event.target.value)
    }

    const onChangeSignupPassword = (event) => {
        setSignupPassword(event.target.value)
    }

    const onChangeSignupConfirmPassword = (event) => {
        setSignupConfirmPassword(event.target.value)
    }

    const signin = () => {
        login(username,password)
        .then((res) => {
            props.setSignin(true)
        })
        .catch((error) =>{
            alert("sign in failed")
        })
        
    }

    const signup = () => {
        if (signupPassword===signupConfirmPassword&&signupUsername!=""&&signupUsername!=null){
            register(signupUsername,signupPassword)
            .then((res) => {
                login(signupUsername,signupPassword)
                .then((res) => {
                    props.setSignin(true)
                })
                .catch((error) =>{
                    alert("sign in failed")
                })
            })
            .catch((error)=>{
                alert("sign up failed")
            })
        }
        
    }


  return (
    <div>
      <Container>
          <HList>
            <List>
                <div>
                email: 
                <input value={username} onChange={onChangeName}></input>
                </div>
                <div>
                password:
                <input value={password} onChange={onChangePassword}></input>
                </div> 
                <button onClick={signin}>sign in</button>
            </List>
            <List>
                <div>
                email: 
                <input value={signupUsername} onChange={onChangeSignupName}></input>
                </div>
                <div>
                password:
                <input value={signupPassword} onChange={onChangeSignupPassword}></input>
                </div> 
                <div>
                confirm password:
                <input value={signupConfirmPassword} onChange={onChangeSignupConfirmPassword}></input>
                </div> 
                <button onClick={signup}>sign up</button>
            </List>
          </HList>
      </Container>
    </div>
  )
}

export default Auth
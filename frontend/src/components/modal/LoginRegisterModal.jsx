import React, { useEffect, useState } from "react";
import {Button, Form, Grid, Header, Menu, Message, Segment} from 'semantic-ui-react'
import {useDispatch, useSelector} from 'react-redux'
import {login, register} from '../../store/actions/userActions'
import "./modal.css";

function LoginRegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [registerPage, setRegisterPage] = useState(false)
  const [email, setEmail] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, userInfo, success, error } = userLogin

  const userRegister = useSelector((state) => state.userRegister)

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false)
    setRegisterPage(false)
    setEmail('')
    setRegisterEmail('') 
    setRegisterPassword('')
    setConfirmPassword('')
    setName('')
    setPassword('')
  }

  const loginHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  const registerHandler = (e) => {
    e.preventDefault()
    dispatch(register(name, registerEmail, registerPassword, confirmPassword))
}

  useEffect(() => {
    if (success){
      closeModal()
    }
  }, [success])

  useEffect(() => {
    if (userRegister?.userInfo?.registered){
      setRegisterPage(false)
    }
  }, [userRegister])

  return (
    <>
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header className="modal__header" style={{backgroundColor: 'teal', color: 'white', textAlign: 'center'}}>
              <h2>
              </h2>
              <button onClick={closeModal} className="close-button">&times;</button>
            </header>
            <main className="modal__main">
            {!registerPage && <Grid textAlign='center' verticalAlign='middle'>
              <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                {error && error.message ? error.message : 'Log-in to your account'}
                </Header>
                <Form size='large'>
                  <Segment stacked>
                    <Form.Input 
                    fluid 
                    icon='user' 
                    iconPosition='left' 
                    placeholder='E-mail address' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Input
                      fluid
                      icon='lock'
                      iconPosition='left'
                      placeholder='Password'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={loginHandler} color='teal' fluid size='large' loading={loading}>
                      Login
                    </Button>
                  </Segment>
                </Form>
                <Message>
                  Don't have an account?
                  <Button onClick={() => setRegisterPage(true)}>
                  Register
                  </Button>
                </Message>
              </Grid.Column>
            </Grid>}
            {registerPage &&  <Grid textAlign='center' verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
          {userRegister.userInfo && userRegister.userInfo.message ? userRegister.userInfo.message : 'Register'}
          </Header>
          <Form size='large'>
            <Segment stacked>
            <Form.Input 
                fluid 
                icon='user' 
                iconPosition='left' 
                placeholder='Username'
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
              <Form.Input 
                fluid 
                icon='user' 
                iconPosition='left' 
                placeholder='E-mail address' 
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
               <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Confirm Password'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
             <Button onClick={registerHandler} color='teal' fluid size='large' loading={loading}>
                Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Already Have An Account? 
              <Button onClick={() => setRegisterPage(false)}>
              Sign in
              </Button>
            </Message>
          </Grid.Column>
        </Grid>}
            </main>
          </div>
        </>
      )}
      <Menu.Item onClick={openModal}>Login</Menu.Item>
    </>
  );
}

export default LoginRegisterModal
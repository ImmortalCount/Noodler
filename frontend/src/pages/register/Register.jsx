import React, {useState, useEffect} from 'react'
import { register } from '../../store/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

export default function Register({history, location}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userRegister = useSelector((state) => state.userRegister)
    const {loading, error, userInfo } = userRegister

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword){
            setMessage('Passwords do not match')
        } else {
            setMessage('Success!')
            dispatch(register(name, email, password))
        }
    }

    // useEffect(() => {
    //   if (userInfo) {
    //     history.push(redirect)
    //   }
    // }, [history, userInfo, redirect])

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
           {message && <h3>{message}</h3>} 
          <Header as='h2' color='teal' textAlign='center'>
            Register
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
               <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Confirm Password'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={submitHandler} color='teal' fluid size='large'>
                Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Already Have An Account? 
            <Link to= {'/login'}>
              Sign in
            </Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
}

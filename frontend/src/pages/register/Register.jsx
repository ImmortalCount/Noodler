import React, {useState, useEffect} from 'react'
import { register } from '../../store/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'
import {Link, useNavigate} from 'react-router-dom'

export default function Register({history, location}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const userRegister = useSelector((state) => state.userRegister)
    const {loading, userInfo } = userRegister

    const registerHandler = (e) => {
        e.preventDefault()
        dispatch(register(name, email, password, confirmPassword))
    }

    useEffect(() => {
      if (userInfo && userInfo.registered){
        setTimeout(() => navigate('/login'), 1000);
      }
    }, [navigate, userInfo])

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
          {userInfo && userInfo.message ? userInfo.message : 'Register'}
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
             <Button onClick={registerHandler} color='teal' fluid size='large' loading={loading}>
                Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Already Have An Account? 
            <Link to= '/login'>
              Sign in
            </Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
}

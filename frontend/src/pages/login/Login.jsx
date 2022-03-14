import React, {useState, useEffect} from 'react'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'
import {Link, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {login} from '../../store/actions/userActions'

export default function Login({location, history}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, error, userInfo } = userLogin

    const loginHandler = (e) => {
      e.preventDefault()
      dispatch(login(email, password))
    }

    useEffect(() => {
      if (userInfo){
        navigate('/')
      }
    }, [navigate, userInfo])

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='teal' textAlign='center'>
        Log-in to your account
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

          {!userInfo && <Button onClick={loginHandler} color='teal' fluid size='large' loading={loading}>
            Login
          </Button>}
          {userInfo && <Button as={Link} to='/' color='teal' fluid size='large' loading={loading}>
            Start Noodling {userInfo.name}
          </Button>}
        </Segment>
      </Form>
      <Message>
        Don't have an account?
         <Link to={'/register'}>
         Register
         </Link>
      </Message>
    </Grid.Column>
  </Grid>
    )
}

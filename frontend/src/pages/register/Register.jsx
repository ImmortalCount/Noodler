import React, {useState, useEffect} from 'react'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword){
            setMessage('Passwords do not match')
        } else {
            setMessage('Success!')
        }
    }
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
            Already Have An Account? <a href='#'>Sign In</a>
          </Message>
        </Grid.Column>
      </Grid>
    )
}

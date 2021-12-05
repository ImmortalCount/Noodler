import React, {useState} from 'react'
import { Menu, Select } from 'semantic-ui-react'

export default function Navbar() {
    var activeItem;
    var OnClickHandler;
    var [logedInUserName, setLoggedInUserName] = useState(null)

    var accountOptions = [
        { key: 'name', text: 'Name', value: 'name' },
        { key: 'login', text: 'Login', value: 'login' },
        { key: 'logout', text: 'Logout', value: 'logout' },
    ]

    const loginHandler = () => {
        setLoggedInUserName('User1')
    }

    const logoutHandler = () => {
        setLoggedInUserName(null)
    }

    return (
        <Menu>
             <Menu.Item
            name='options'
            active={activeItem === 'options'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name='explorer'
            active={activeItem === 'explorer'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name='social'
            active={activeItem === 'social'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name='lab'
            active={activeItem === 'lab'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name='player'
            active={activeItem === 'player'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name={logedInUserName}
            active={activeItem === 'player'}
            onClick={OnClickHandler}
            />
            <Menu.Menu position='right'>
            {!(logedInUserName === null) &&
                <Menu.Item
                name='account'
                active={activeItem === 'account'}
                onClick={OnClickHandler}
                />
            }
            {(logedInUserName === null) && 
            <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={loginHandler}
            />
            }
            {!(logedInUserName === null) &&
            <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={logoutHandler}
            />
            }
            

            {/* <Select compact options={accountOptions} defaultValue='login'/> */}
            </Menu.Menu>

        </Menu>
    )
}

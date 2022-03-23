import React from 'react'
import { Dropdown, Menu} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {logout} from '../../store/actions/userActions.js'

export default function Navbar() {
    var activeItem;
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const dispatch = useDispatch()

    // var accountOptions = [
    //     { key: 'name', text: 'Name', value: 'name' },
    //     { key: 'login', text: 'Login', value: 'login' },
    //     { key: 'logout', text: 'Logout', value: 'logout' },
    // ]

    const logoutHandler = () => {
        dispatch(logout());
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    }



    return (
        <>  
        <Menu>
             <Menu.Item
            header
            name='NOODLER'
            />
             {/* <Menu.Item
            name='options'
            active={activeItem === 'options'}
            onClick={OnClickHandler}
            /> */}
            
            {/* <Menu.Item
            name='collections'
            active={activeItem === 'collections'}
            onClick={OnClickHandler}
            /> */}
            {/* <Menu.Item
            name='pools'
            active={activeItem === 'pools'}
            onClick={OnClickHandler}
            /> */}
            {/* <Menu.Item
            name='lab'
            active={activeItem === 'lab'}
            onClick={OnClickHandler}
            /> */}
            {/* <Menu.Item
            name='player'
            active={activeItem === 'player'}
            onClick={OnClickHandler}
            /> */}
            {/* <Menu.Item
            name='test'
            onClick={() => console.log(userInfo)}
            /> */}
            <Menu.Menu position='right'>
            {(user) && 
                <Dropdown item text={user.name}>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={logoutHandler}> Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }
            {!(user) && 
            <>
            <Menu.Item as={Link}
            to='/login'
            name='login'
            active={activeItem === 'login'}
            />
            <Menu.Item as={Link}
            to='/register'
            name='register'
            active={activeItem === 'register'}
            />
            </>
            
            }
            {/* <Select compact options={accountOptions} defaultValue='login'/> */}
            </Menu.Menu>
            </Menu>
        </>
    )
}

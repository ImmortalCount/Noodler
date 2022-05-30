import {React, useEffect, useState} from 'react'
import { Dropdown, Menu, Button} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {logout} from '../../store/actions/userActions.js'
import LoginRegisterModal from '../modal/LoginRegisterModal.jsx';

export default function Navbar() {
    const [opened, setOpened] = useState(false)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')))
    var activeItem;
    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout());
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    }

    const userLogin = useSelector((state) => state.userLogin)
    const { success } = userLogin

    useEffect(() => {
        if (success){
            setUser(JSON.parse(localStorage.getItem('userInfo')))
        }
    }, [success])
    return (
        <>  
        <div>
        <Menu>
             <Menu.Item
            header
            name='NOODLER'
            />
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
            <LoginRegisterModal
            registerDisplay={'login'}
            />
            </>
            }
            </Menu.Menu>
        </Menu>
        </div>
        </>
    )
}

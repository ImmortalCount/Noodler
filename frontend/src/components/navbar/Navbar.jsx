import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

export default function Navbar() {
    var activeItem;
    var OnClickHandler;
    return (
        <Menu>
            <Menu.Item
            name='player'
            active={activeItem === 'player'}
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
            name='options'
            active={activeItem === 'options'}
            onClick={OnClickHandler}
            />
            <Menu.Menu position='right'>
            <Menu.Item
            name='account'
            active={activeItem === 'account'}
            onClick={OnClickHandler}
            />
            </Menu.Menu>

        </Menu>
    )
}

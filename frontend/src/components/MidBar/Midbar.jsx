import React from 'react'
import { Menu, Icon} from 'semantic-ui-react'

export default function Midbar() {
    var activeItem;
    var OnClickHandler;
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
            name='palette'
            active={activeItem === 'palette'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name='mixer'
            active={activeItem === 'mixer'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name='player'
            active={activeItem === 'player'}
            onClick={OnClickHandler}
            />
            <Menu.Menu position='right'>
            <Menu.Item
            name='guitar 1'
            active={activeItem === 'guitar 1'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name='guitar 2'
            active={activeItem === 'guitar 2'}
            onClick={OnClickHandler}
            />
            <Menu.Item
            name='add'
            active={activeItem === 'guitar 2'}
            onClick={OnClickHandler}
            >
            <Icon name='add'/>
            </Menu.Item>
            <Icon name='' />
            </Menu.Menu>

        </Menu>
    )
}
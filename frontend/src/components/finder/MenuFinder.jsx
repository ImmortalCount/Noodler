import React from 'react'
import { Input, Menu, List} from 'semantic-ui-react'

export default function MenuFinder() {
    return (
            <Menu vertical>
           <Menu.Item>
               <Input icon='search' placeholder='Search...'/>
           </Menu.Item>
           <Menu.Item
           name='global' />
           <Menu.Item
           name='local' />
           <Menu.Item
           name='components' />
           <Menu.Item
           name='collections' />
           <Menu.Item
           name='songs' />
           <Menu.Item
           name='modules' />
           <Menu.Item
           name='chords' />
           <Menu.Item
           name='scales' />
           <Menu.Item
           name='rhythms' />
           <Menu.Item
           name='patterns' />
           <Menu.Item
           name='rhy pat' />
       </Menu>
    )
}

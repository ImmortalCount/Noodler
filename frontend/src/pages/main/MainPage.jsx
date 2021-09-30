import React,{useState} from 'react'
import DragAndFillProper from '../../components/DragAndDrop/DragAndFillProper'
import MenuFinder from '../../components/finder/MenuFinder'
import Results from '../../components/finder/Results'
import Guitar from '../../components/guitar/Guitar'
import Lab from '../../components/lab/Lab'
import Navbar from '../../components/navbar/Navbar'
import Palette from '../../components/palette/Palette'
import {Menu, Icon} from 'semantic-ui-react';
import Finder from '../../components/finder/Finder'

export default function MainPage() {
    const [activeTabs, setActiveTabs] = useState(['guitar 1'])

    const onClickHandler = (e, titleProps) => {
        var temp = [...activeTabs]
       if (activeTabs.includes(titleProps.name) === false){
           temp.push(titleProps.name)
       } else {
           temp = temp.filter(x => x !== titleProps.name);
       }
       setActiveTabs(temp)
    }

    const guitarAddHandler = (e, titleProps) => {
        console.log('guitar added!')
    }
    
function Midbar() {
        return (
            <Menu>
                <Menu.Item
                name='options'
                active={activeTabs.includes('options')}
                onClick={onClickHandler}
                />
                <Menu.Item
                name='explorer'
                active={activeTabs.includes('explorer')}
                onClick={onClickHandler}
                />
                <Menu.Item
                name='social'
                active={activeTabs.includes('social')}
                onClick={onClickHandler}
                />
                <Menu.Item
                name='lab'
                active={activeTabs.includes('lab')}
                onClick={onClickHandler}
                />
                <Menu.Item
                name='palette'
                active={activeTabs.includes('palette')}
                onClick={onClickHandler}
                />
                <Menu.Item
                name='player'
                active={activeTabs.includes('player')}
                onClick={onClickHandler}
                />
                <Menu.Menu position='right'>
                <Menu.Item
                name='guitar 1'
                active={activeTabs.includes('guitar 1')}
                onClick={onClickHandler}
                />
                <Menu.Item
                name='add'
                onClick={guitarAddHandler}
                >
                <Icon name='add'/>
                </Menu.Item>
                <Icon name='' />
                </Menu.Menu>
    
            </Menu>
        )
    }
    return (
        <>
        <div>
            <Navbar/>
            <div className="tophalf"> <Guitar/></div>
            <Midbar/>
        </div>
        <div className="bottomhalf" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'white'}}>
            <div className="bottomleft" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'white'}}> 
            {activeTabs.includes('explorer') && <MenuFinder/>}
            {activeTabs.includes('explorer') && <Results/>}
            {activeTabs.includes('lab') && <Lab/>}
            {activeTabs.includes('palette') && <Palette/>}
            </div>
            <div className="bottomright"> 
            {activeTabs.includes('player') && <DragAndFillProper/>}
            </div>
        </div>
        </>
    )
}

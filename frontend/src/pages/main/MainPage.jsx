import React,{useState} from 'react'
import Player from '../../components/DragAndDrop/Player'
import MenuFinder from '../../components/finder/MenuFinder'
import Results from '../../components/finder/Results'
import Lab from '../../components/lab/Lab'
import Navbar from '../../components/navbar/Navbar'
import Palette from '../../components/palette/Palette'
import {Menu, Icon} from 'semantic-ui-react';
import GuitarSVG from '../../components/guitar/GuitarSVG'
import Explorer from '../../components/finder/Explorer'

export default function MainPage() {
    const [activeTabs, setActiveTabs] = useState(['player', 'explorer' ])
    const [masterInstrumentArray, setMasterInstrumentArray] = useState(['instr 1'])
    const [activelyDisplayedInstruments, setActivelyDisplayedInstruments] = useState([0, 1])

    const onClickHandler = (e, titleProps) => {
        var temp = [...activeTabs]
       if (activeTabs.includes(titleProps.name) === false){
           temp.push(titleProps.name)
       } else {
           temp = temp.filter(x => x !== titleProps.name);
       }
       setActiveTabs(temp)
    }

    function guitarAddHandler(){
        var clone = [...masterInstrumentArray]
        clone.push('instr ' + (clone.length + 1))
        setMasterInstrumentArray(clone)
    }

    function guitarSubtractHandler(){
        if (masterInstrumentArray.length === 1){
            return
        } else {
            var clone = [...masterInstrumentArray]
            clone.pop()
            setMasterInstrumentArray(clone)
        }
        
    }
    function mapMenuItems(){
            return (
                masterInstrumentArray.map((instrument, idx) => 
                <Menu.Item
                name={instrument}
                active={activeTabs.includes(instrument)}
                onClick={onClickHandler}
                key={'mappedInstr' + idx}
                />
                )
            )
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
                name='test'
                active
                onClick={() => console.log(activeTabs)}
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
                name='mixer'
                active={activeTabs.includes('mixer')}
                onClick={onClickHandler}
                />
                <Menu.Item
                name='player'
                active={activeTabs.includes('player')}
                onClick={onClickHandler}
                />
                <Menu.Menu position='right'>
                {mapMenuItems()}
                <Menu.Item
                name='add'
                onClick={() => guitarAddHandler()}
                >
                <Icon name='add'/>
                </Menu.Item>
                <Menu.Item
                name='subtract'
                onClick={() => guitarSubtractHandler()}
                >
                <Icon name='minus'/>
                </Menu.Item>
                </Menu.Menu>
    
            </Menu>
        )
    }
    return (
        <>
        <div>
            <Navbar/>
            <div className="tophalf"> 
            <GuitarSVG 
            masterInstrumentArray = {masterInstrumentArray}
            activelyDisplayedInstruments = {activelyDisplayedInstruments}
            />
            </div>
            <Midbar/>
        </div>
        <div className="bottomhalf" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'white'}}>
            <div className="bottomleft" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'white'}}> 
            {/* {activeTabs.includes('explorer') && <MenuFinder/>}
            {activeTabs.includes('explorer') && <Results/>} */}
            {activeTabs.includes('explorer') && <Explorer/>}
            {activeTabs.includes('lab') && <Lab/>}
            {activeTabs.includes('palette') && <Palette/>}
            </div>
            <div className="bottomright"> 
            {activeTabs.includes('player') && 
            <Player
            masterInstrumentArray = {masterInstrumentArray}
            />}
            </div>
        </div>
        </>
    )
}

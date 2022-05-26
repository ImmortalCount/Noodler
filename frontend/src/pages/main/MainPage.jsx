import React,{useState, useEffect} from 'react'
import Player from '../../components/DragAndDrop/Player'
import Lab from '../../components/lab/Lab'
import Navbar from '../../components/navbar/Navbar'
import Palette from '../../components/palette/Palette'
import {Menu, Icon, Button} from 'semantic-ui-react';
import Guitar from '../../components/guitar/Guitar'
import Explorer from '../../components/finder/Explorer'
import { useSelector } from 'react-redux'
import Mixer from '../../pages/mixer/Mixer'
import ScaleLab from '../../components/lab/ScaleLab'
import ChordLab from '../../components/lab/ChordLab'
import PatternLab from '../../components/lab/PatternLab'
import RhythmLab from '../../components/lab/RhythmLab'
import ModuleLab from '../../components/lab/ModuleLab'
import './mainpage.css'

export default function MainPage() {
    const [activeTabs, setActiveTabs] = useState(['explorer', 'player' ])
    const [masterInstrumentArray, setMasterInstrumentArray] = useState(['Instr 1'])
    const [activelyDisplayedInstruments, setActivelyDisplayedInstruments] = useState([2])
    const [update, setUpdate] = useState(false)
    const [groupDisplay, setGroupDisplay] = useState(false)
    const [labSplit, setLabSplit] = useState(false)
    const songImportData = useSelector(state => state.songImport)
    const {songImport} = songImportData
    const instrumentNames = useSelector(state => state.instrumentNames)
 
    //For song import
    useEffect(() => {
        if (songImport){
            var newArr = []
            const num = songImport['instruments'].length
            for (var i = 0; i < num; i++){
                newArr.push('instr ' + (i + 1))
            }
            setMasterInstrumentArray(newArr)
        } else {
            return
        }
    }, [songImport])

    useEffect(() => {
       
            setMasterInstrumentArray(instrumentNames['nameInfo'])
        
    }, [instrumentNames['nameInfo']])

    const onClickHandler = (e, titleProps) => {
        var temp = [...activeTabs]
       if (activeTabs.includes(titleProps.name) === false){
           temp.push(titleProps.name)
       } else {
           temp = temp.filter(x => x !== titleProps.name);
       }
       setActiveTabs(temp)
    }

    function handleLabSplit(){
        setUpdate(true)
        setLabSplit(!labSplit)
    }

    function guitarAddHandler(){
        var clone = [...masterInstrumentArray]
        var clone2 = [...activelyDisplayedInstruments]
        clone.push('Instr ' + (clone.length + 1))
        clone2.push(clone.length -1)
        setMasterInstrumentArray(clone) 
    }

    function guitarSubtractHandler(){
        if (masterInstrumentArray.length === 1){
            return
        } else {
            var clone = [...masterInstrumentArray]
            var clone2 = [...activelyDisplayedInstruments]
            clone.pop()
            clone2.pop()
            setMasterInstrumentArray(clone)
            setActivelyDisplayedInstruments(clone2)
        }
        
    }
    function childChangeInstr(instrumentNumber){
        let temp = [...activelyDisplayedInstruments]
        temp = [instrumentNumber]
        setActivelyDisplayedInstruments(temp)
    }

    const onClickHandlerInstr = (e, titleProps) => {
        const instrumentNumber = Number(titleProps['id'].split('_')[1])
        var temp = [...activelyDisplayedInstruments]
        if (groupDisplay){
            if (activelyDisplayedInstruments.includes(instrumentNumber) === false){
                temp.push(instrumentNumber)
            } else {
                temp = temp.filter(x => x !== instrumentNumber);
            }
        } else {
            temp = [instrumentNumber]
        }
       
       setActivelyDisplayedInstruments(temp)
    }

    
    function mapMenuItems(){
            return (
                masterInstrumentArray.map((instrument, idx) => 
                <Button
                basic
                name={instrument}
                active={activelyDisplayedInstruments.includes(idx)}
                onClick={onClickHandlerInstr}
                key={'mappedInstr_' + idx}
                id={'mappedInstr_' + idx}
                >
                {instrument}
                </Button>
                )
            )
    }

function Midbar() {
        return (
            <Menu>
                <Button.Group>
               {!labSplit && <Button
                basic
                name='labSplit'
                onClick={() => handleLabSplit()}
                >
                Lab Split
                </Button>}
                {labSplit && <Button
                basic
                name='labSplit'
                onClick={() => handleLabSplit()}
                >
                Lab Join
                </Button> }  
                <Button
                basic
                name='explorer'
                active={activeTabs.includes('explorer')}
                onClick={onClickHandler}
                >
                Explorer
                </Button>
               {!labSplit && <Button
                basic
                name='lab'
                active={activeTabs.includes('lab')}
                onClick={onClickHandler}
                >
                Lab
                </Button>}
               {labSplit && <> 
                <Button
                basic
                name='scaleLab'
                active={activeTabs.includes('scaleLab')}
                onClick={onClickHandler}
                >
                Scale Lab
                </Button>
                <Button
                basic
                name='chordLab'
                active={activeTabs.includes('chordLab')}
                onClick={onClickHandler}
                >
                Chord Lab
                </Button>
                <Button
                basic
                name='patternLab'
                active={activeTabs.includes('patternLab')}
                onClick={onClickHandler}
                >
                Pattern Lab
                </Button>
                <Button
                basic
                name='rhythmLab'
                active={activeTabs.includes('rhythmLab')}
                onClick={onClickHandler}
                >
                Rhythm Lab
                </Button>
                <Button
                basic
                name='moduleLab'
                active={activeTabs.includes('moduleLab')}
                onClick={onClickHandler}
                >
                Module Lab
                </Button>
                </>}
                <Button
                basic
                name='palette'
                active={activeTabs.includes('palette')}
                onClick={onClickHandler}
                >
                Palette
                </Button>
                <Button
                basic
                name='mixer'
                active={activeTabs.includes('mixer')}
                onClick={onClickHandler}
                >
                Mixer
                </Button>
                <Button
                basic
                name='player'
                active={activeTabs.includes('player')}
                onClick={onClickHandler}
                >
                Player
                </Button>
                </Button.Group>
                <Menu.Menu position='right'>
                <Button.Group>
                {mapMenuItems()}
                <Button
                basic
                onClick={() => guitarAddHandler()}
                >
                <Icon name='add'/>
                </Button>
                <Button
                basic
                onClick={() => guitarSubtractHandler()}
                >
                <Icon name='minus'/>
                </Button>
                </Button.Group>
                <Button
                basic
                onClick={() => setGroupDisplay(!groupDisplay)}
                >
                    {groupDisplay ? 'Toggle' : 'Group'}
                </Button>
                </Menu.Menu>
    
            </Menu>
        )
    }
    return (
        <>
        <div>
            <Navbar/>
            <div className="tophalf"> 
            <Guitar 
            masterInstrumentArray = {masterInstrumentArray}
            activelyDisplayedInstruments = {activelyDisplayedInstruments}
            />
            </div>
            <Midbar/>
        </div>
        <div className="bottomhalf" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'white'}}>
            <div className="bottomleft" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'white'}}> 
            <Explorer
            display = {activeTabs.includes('explorer')}
            />
            <Lab
            masterInstrumentArray = {masterInstrumentArray}
            display = {activeTabs.includes('lab')  && (!labSplit)}
            update={update}
            setUpdate={setUpdate}
            labSplit={labSplit}
            />
            <ScaleLab
            masterInstrumentArray = {masterInstrumentArray}
            display = {activeTabs.includes('scaleLab')  && (labSplit)}
            update = {update}
            setUpdate = {setUpdate}
            free = {true}
            labSplit={labSplit}
            />
            <ChordLab
            masterInstrumentArray = {masterInstrumentArray}
            display = {activeTabs.includes('chordLab') && (labSplit) }
            update = {update}
            setUpdate = {setUpdate}
            free = {true}
            labSplit={labSplit}
            />
            <PatternLab
            masterInstrumentArray = {masterInstrumentArray}
            display = {activeTabs.includes('patternLab') && (labSplit) }
            update = {update}
            setUpdate = {setUpdate}
            free = {true}
            labSplit={labSplit}
            />
            <RhythmLab
            masterInstrumentArray = {masterInstrumentArray}
            display = {activeTabs.includes('rhythmLab') && (labSplit)}
            update = {update}
            setUpdate = {setUpdate}
            free = {true}
            labSplit={labSplit}
            />
            <ModuleLab
            masterInstrumentArray = {masterInstrumentArray}
            display = {activeTabs.includes('moduleLab') && (labSplit)}
            update = {update}
            setUpdate = {setUpdate}
            free = {true}
            labSplit={labSplit}
            />
            
            <Mixer
            masterInstrumentArray = {masterInstrumentArray}
            display = {activeTabs.includes('mixer')}
            />
            <Palette display= {activeTabs.includes('palette')} />
            </div>
            <div className="bottomright"> 
            <Player
            masterInstrumentArray = {masterInstrumentArray}
            display = {activeTabs.includes('player')}
            childChangeInstr = {childChangeInstr}
            />
            </div>
        </div>
        </>
    )
}

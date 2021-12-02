import React, {useState} from 'react'
import { Tab, List, Button, Segment, Icon } from 'semantic-ui-react' 
import './palette.css'

export default function Palette() {
    const activeTabStates = [
        "Components",
        "Collections",
        "Songs",
    ]

    const activeSubTabStates = [
        "Modules",
        "Scales",
        "Chords",
        "Patterns",
        "Rhythms",
    ]




    var [storage, setStorage] = useState(
        {
            "Components": {
                "Modules": ['A Module', 'B Module'],
                "Scales": [{
                    scaleName: 'C harmonic major',
                    scale: ['C', 'D', 'E', 'F', 'G', 'G#', 'B'],
                }],
                "Chords": [{
                    chordName: 'CM',
                    chord: ['C3', 'E3', 'G3'],
                    position: [],
                }],
                "Patterns": [{
                    patternName: 'Boogie 1',
                    type: 'normal',
                    pattern: [0, 6, 3, 8, -7, 0, 12],
                    position: [],
                }],
                "Rhythms": [{
                    rhythmName: '4ths',
                    rhythm: [["O"], ["O"], ["O"], ["O"]],
                    length: 4,
                }],
            },
            "Collections": {
                "Modules": ['A Module Collection', 'B Module Collection'],
                "Chords": ['Chord Collections'],
                "Patterns": ['Pattern Collections'],
                "Rhythms": ['Rhythm Collections'],
            },
            "Songs": ['In A Gadda Da Vida']
        }
    )

    const [activeTab, setActiveTab] = useState(0)
    const [activeSubTab, setActiveSubTab] = useState(1)

    function mapRegularComponents(arr, type){
        var groupTag;
        var name;
        var dataClass;
        if (type === 'Scales'){
            groupTag = 'scales'
            name = 'scaleName'
            dataClass = 'scaleData'
        } else if (type === 'Chords'){
            groupTag = 'chords'
            name = 'chordName'
            dataClass = 'chordData'
        } else if (type === 'Patterns'){
            groupTag = 'patterns'
            name = 'patternName'
            dataClass = 'patternData'
        } else if (type === 'Rhythms'){
            groupTag = 'rhythms'
            name = 'rhythmName'
            dataClass = 'rhythmData'

        } else {
            return
        }

        return (
            arr.map((arr, idx) => 
            <div id={'palette_' + groupTag + '_' + idx} key={'palette_' + groupTag + '_' + idx} draggable onDragStart = {dragStartHandler} onDrag = {dragHandler} onDragOver = {dragOverHandler} onDragLeave={dragLeaveHandler} onDrop = {dropHandler}  className={dataClass} style={{marginTop: '10px', marginBottom: '10px', height: '25px', width: '175px',backgroundColor: 'wheat'}}>{arr[name]}</div>
            )
        )
            
    }

    function mapModuleComponent(){

    }

    function mapCollectionComponent(){
        return (
            <>
            <Icon name='folder'/>
            <Icon name='folder open'/>
            </>
        )
    }

    function mapSong(){

    }


    function onClickHandler(direction, type){
        if (direction === 'right'){
            if (type === 'tab'){
                if (activeTab !== activeTabStates.length - 1){
                    setActiveTab(activeTab + 1)
                } else {
                    setActiveTab(0)
                }
            }
            if (type === 'subTab'){
                if (activeSubTab !== activeSubTabStates.length - 1){
                    setActiveSubTab(activeSubTab + 1)
                } else {
                    setActiveSubTab(0)
                }
            }
        }
        if (direction === 'left'){
            if (type === 'tab'){
                if (activeTab !== 0){
                    setActiveTab(activeTab - 1)
                } else {
                    setActiveTab(activeTabStates.length -1)
                }
            }
            if (type === 'subTab'){
                if (activeSubTab !== 0){
                    setActiveSubTab(activeSubTab - 1)
                } else {
                    setActiveSubTab(activeSubTabStates.length - 1)
                }
            }
        }
        

    }

    const dragStartHandler = e => {
        var ex = e.target.id.split('_');
        var pos = Number(ex[2])
        var obj = {id: 'special', className: e.target.className, message: 
        storage[activeTabStates[activeTab]][activeSubTabStates[activeSubTab]][pos],
         type: 'foreign'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log(obj)
    };

    const dragHandler = e => {
    };

    const dragOverHandler = e => {
        e.preventDefault();
    }

    const dragLeaveHandler = e => {
        e.preventDefault();
    }
   
    const dropHandler = e => {
        var cloneStorage = JSON.parse(JSON.stringify(storage))
        var data = JSON.parse(e.dataTransfer.getData("text"));
        if (data['id'] === 'special'){
            console.log(data['className'])
           if (data['className'] === 'chordData'){
            cloneStorage['Components']['Chords'].push(data['message'])
            setActiveTab(0)
            setActiveSubTab(2)
           } else if (data['className'] === 'rhythmData'){
            cloneStorage['Components']['Rhythms'].push(data['message'])
            setActiveTab(0)
            setActiveSubTab(4)
           } else if (data['className'] === 'patternData'){
            cloneStorage['Components']['Patterns'].push(data['message'])
            setActiveTab(0)
            setActiveSubTab(3)
           } else if (data['className'] === 'scaleData'){
            cloneStorage['Components']['Scales'].push(data['message'])
            setActiveTab(0)
            setActiveSubTab(1)
           } else {
               return
           }
        } else {
            return
        }
        console.log(data)
        setStorage(cloneStorage)
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
        e.dataTransfer.clearData();
        
        
    }
    console.log(storage[activeTabStates[activeTab]][activeSubTabStates[activeSubTab]][0], 'TEST!')
    function InnerPalette(){
        return (
            <div style={({height: '500px', width: '100px', background: 'wheat'})}></div>
        )
    }
    const Panes = [
        {menuItem: 'Rhythms', render: () => <Tab.Pane style={{innerHeight: '500px'}}> <InnerPalette/> </Tab.Pane> },
        {menuItem: 'Scales', render: () => <Tab.Pane> <InnerPalette/> </Tab.Pane> },
        {menuItem: 'Patterns', render: () => <Tab.Pane> <InnerPalette/> </Tab.Pane> },
        {menuItem: 'Rhythmic Patterns', render: () => <Tab.Pane> <InnerPalette/> </Tab.Pane> },
        {menuItem: 'Chords', render: () => <Tab.Pane> <InnerPalette/> </Tab.Pane> },
        {menuItem: 'Modules', render: () => <Tab.Pane> <InnerPalette/> </Tab.Pane> },
    ]
    const Tabs = () => <Tab menu ={{color: 'teal', inverted: 'true'}} panes ={Panes}/>

    return (
        <>
        <div onDrop={dropHandler} onDragOver={dragOverHandler}>
         <List relaxed divided size='large' className='fixed-width' onDrop={() => console.log('DROPPED!?!?!?!? LIST')} >
         <Button.Group className='no-padding'>
            <Button compact basic onClick={() => onClickHandler('left', 'tab')}> <Icon name ='left arrow'/></Button>
            <Segment>
            {activeTabStates[activeTab]}
            </Segment>
            <Button compact basic onClick={() => onClickHandler('right', 'tab')}> <Icon name ='right arrow'/></Button>
        </Button.Group>
        {activeTab !== 2 && 
        <Button.Group className='no-padding'>
            <Button compact basic onClick={() => onClickHandler('left', 'subTab')}> <Icon name ='left arrow'/></Button>
            <Segment>
            &nbsp;&nbsp;&nbsp;&nbsp;{activeSubTabStates[activeSubTab]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Segment>
            <Button compact basic onClick={() => onClickHandler('right', 'subTab')}> <Icon name ='right arrow'/></Button>
        </Button.Group>}
        <List.Item className='Item'>
            {/* <List.Icon name='clock' size='large' verticalAlign='middle' /> */}
            <List.Content>
                <List.Header> {activeTab !== 2 ? activeSubTabStates[activeSubTab] : 'Songs'}</List.Header>
                <List.Description>
                    {activeTab !== 2 &&
                    <div >
                    {mapRegularComponents(storage[activeTabStates[activeTab]][activeSubTabStates[activeSubTab]], activeSubTabStates[activeSubTab])}
                    </div>}
                    {activeTab === 2 &&
                    <div>
                        {storage['Songs']}
                    </div>}
                   
                </List.Description>
            </List.Content>
        </List.Item>
        </List>
        </div>
        </>
    )
}

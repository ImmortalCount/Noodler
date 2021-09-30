import React, {useState} from 'react'
import { Tab, List, Header, Button, Segment, Icon } from 'semantic-ui-react' 
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
        "Rhy-Pat"
    ]

    var storage = {
        "Components": {
            "Modules": ['A Module', 'B Module'],
            "Scales": ['Scale Comp, Scale Comp'],
            "Chords": ['Chord Comp'],
            "Patterns": ['Arp Up', 'Arp Down'],
            "Rhythms": ['Boogie', 'Tango'],
            "Rhy-Pat": ['Bossa Riff', 'Smooby Riff'],
        },
        "Collections": {
            "Modules": ['A Module Collection', 'B Module Collection'],
            "Scales": ['Scale Collections'],
            "Chords": ['Chord Collections'],
            "Patterns": ['Pattern Collections'],
            "Rhythms": ['Rhythm Collections'],
            "Rhy-Pat": ['Rhy-Pat Collections'],
        },
        "Songs": ['In A Gadda Da Vida']
    }


    const [activeTab, setActiveTab] = useState(0)
    const [activeSubTab, setActiveSubTab] = useState(0)

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
        <div style={{backgroundColor:'teal'}}>
         <List relaxed divided size='large' className='fixed-width'>
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
        <List.Item className='Item' draggable='true'>
            <List.Icon name='clock' size='large' verticalAlign='middle' />
            <List.Content>
                <List.Header> {activeTab !== 2 ? activeSubTabStates[activeSubTab] : 'Songs'}</List.Header>
                <List.Description>
                    {activeTab !== 2 &&
                    <div>
                    {storage[activeTabStates[activeTab]][activeSubTabStates[activeSubTab]]}
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

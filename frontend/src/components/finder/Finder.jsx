import React from 'react'
import {Tab, Icon} from 'semantic-ui-react'
import { localChords } from '../../data/dummyData'

export default function Finder() {
    const Panes = [
        {menuItem: 'Global', render: () => <Tab.Pane> <Tab panes={subPanes}  menu ={{color: 'teal', inverted: 'true'}}/> </Tab.Pane> },
        {menuItem: 'Local', render: () => <Tab.Pane> <Tab panes={subPanes}  menu ={{color: 'teal', inverted: 'true'}} />  </Tab.Pane> }
    ]

    const subPanes = [
        {menuItem: 'Components', render: () => <Tab.Pane> <Tab panes={subSubPanes1} menu ={{color: 'teal', inverted: 'true'}} /> </Tab.Pane> },
        {menuItem: 'Collections', render: () => <Tab.Pane> <Tab panes={subSubPanes2} menu ={{color: 'teal', inverted: 'true'}} /> </Tab.Pane> },
        {menuItem: 'Songs/Exercises', render: () => <Tab.Pane> <Tab panes={subSubPanes3} menu ={{color: 'teal', inverted: 'true'}} /></Tab.Pane> },
    ]

    const subSubPanes1 = [
        {menuItem: 'Rhythms', render: () => <Tab.Pane> Rhythm 1 </Tab.Pane> },
        {menuItem: 'Scales', render: () => <Tab.Pane> Tab 2 Content </Tab.Pane> },
        {menuItem: 'Patterns', render: () => <Tab.Pane> Tab 3 Content </Tab.Pane> },
        {menuItem: 'Rhythmic Patterns', render: () => <Tab.Pane> Tab 3 Content </Tab.Pane> },
        {menuItem: 'Chords', render: () => <Tab.Pane> {localChordData} </Tab.Pane> },
        {menuItem: 'Modules', render: () => <Tab.Pane> Tab 3 Content </Tab.Pane> },
    ]

    const subSubPanes2 = [
        {menuItem: 'Rhythms Collection', render: () => <Tab.Pane> Rhythm 1 </Tab.Pane> },
        {menuItem: 'Scales Collection', render: () => <Tab.Pane> Tab 2 Content </Tab.Pane> },
        {menuItem: 'Patterns Collection', render: () => <Tab.Pane> Tab 3 Content </Tab.Pane> },
        {menuItem: 'Rhythmic Pattern Collection', render: () => <Tab.Pane> Tab 3 Content </Tab.Pane> },
        {menuItem: 'Chord Collection', render: () => <Tab.Pane> Tab 3 Content </Tab.Pane> },    
        {menuItem: 'Module Collection', render: () => <Tab.Pane> Tab 3 Content </Tab.Pane> },    
    ]

    const subSubPanes3 = [
        {menuItem: 'Songs', render: () => <Tab.Pane> Rhythm 1 </Tab.Pane> },
        {menuItem: 'Exercises', render: () => <Tab.Pane> Tab 2 Content </Tab.Pane> },
    ]

    function mapDataCards(data){
        return (
            localChords.map((data, idx) => 
            <div key={idx} draggable='true'>
                <div>
                {data.name}
                </div>
                <div>
                {data.data}
                </div>
            </div>
            )
        )
    }
    const localChordData = mapDataCards(localChords)

    const Tabs = () => <Tab menu ={{color: 'teal', inverted: 'true'}} panes ={Panes}/>
    return (
        <>
        <Tabs />
        </>
    )
}

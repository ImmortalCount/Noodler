import React from 'react'
import { Tab } from 'semantic-ui-react' 

export default function Palette() {

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
        <div>
            This is the pallette 
        </div>
        {/* <Tabs/> */}
        </>
    )
}

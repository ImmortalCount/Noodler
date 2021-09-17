import React, {useState, useEffect} from 'react'
import {Tab, Icon} from 'semantic-ui-react'
import ModuleDataService from '../../services/modules.js'

export default function Finder() {
    const [modules, setModules] = useState([])

    useEffect(() => {
        retrieveModules();
    }, [])

    const Panes = [
        {menuItem: 'Global', render: () => <Tab.Pane attached='top' > <Tab panes={subPanes}  menu ={{color: 'teal', inverted: 'true', attached: 'top'}}/> </Tab.Pane> },
        {menuItem: 'Local', render: () => <Tab.Pane attached='top'> <Tab panes={subPanes}  menu ={{color: 'teal', inverted: 'true', attached: 'top'}} />  </Tab.Pane> }
    ]

    const subPanes = [
        {menuItem: 'Components', render: () => <Tab.Pane attached='top' > <Tab panes={subSubPanes1} menu ={{color: 'teal', inverted: 'true', attached: 'top'}} /> </Tab.Pane> },
        {menuItem: 'Collections', render: () => <Tab.Pane attached='top' > <Tab panes={subSubPanes2} menu ={{color: 'teal', inverted: 'true', attached: 'top'}} /> </Tab.Pane> },
        {menuItem: 'Songs/Exercises', render: () => <Tab.Pane attached='top'> <Tab panes={subSubPanes3} menu ={{color: 'teal', inverted: 'true', attached: 'top'}} /></Tab.Pane> },
    ]

    const subSubPanes1 = [
        {menuItem: 'Modules', render: () => <Tab.Pane attached='top' > {localModuleData} </Tab.Pane> },
        {menuItem: 'Rhythms', render: () => <Tab.Pane attached='top'> Rhythm 1 </Tab.Pane> },
        {menuItem: 'Scales', render: () => <Tab.Pane attached='top'> Tab 2 Content </Tab.Pane> },
        {menuItem: 'Patterns', render: () => <Tab.Pane attached='top'> Tab 3 Content </Tab.Pane> },
        {menuItem: 'Rhy-Pat', render: () => <Tab.Pane attached='top'> Tab 3 Content </Tab.Pane> },
        {menuItem: 'Chords', render: () => <Tab.Pane attached='top'> {database} </Tab.Pane> },
        
    ]

    const subSubPanes2 = [
        {menuItem: 'Rhythms Collection', render: () => <Tab.Pane attached='top'> Rhythm 1 </Tab.Pane> },
        {menuItem: 'Scales Collection', render: () => <Tab.Pane attached='top'> Tab 2 Content </Tab.Pane> },
        {menuItem: 'Patterns Collection', render: () => <Tab.Pane attached='top'> Tab 3 Content </Tab.Pane> },
        {menuItem: 'Rhythmic Pattern Collection', render: () => <Tab.Pane attached='top'> Tab 3 Content </Tab.Pane> },
        {menuItem: 'Chord Collection', render: () => <Tab.Pane attached='top'> Tab 3 Content </Tab.Pane> },    
        {menuItem: 'Module Collection', render: () => <Tab.Pane attached='top'> Tab 3 Content </Tab.Pane> },    
    ]

    const subSubPanes3 = [
        {menuItem: 'Songs', render: () => <Tab.Pane> Rhythm 1 </Tab.Pane> },
        {menuItem: 'Exercises', render: () => <Tab.Pane> Tab 2 Content </Tab.Pane> },
    ]

    
    var database = ['dummy']

    const retrieveModules = () => {
        ModuleDataService.getAll()
        .then(response => {
            console.log(response.data);
            setModules(response.data.modules)
        })
        .catch(e => {
            console.log(e)
        })
    }

//--


    function mapDataCards(data){
        return (
            data.map((data, idx) => 
            <div key={idx} draggable='true'>
                <div>
                {data.author}
                </div>
                <div>
                {data.name}
                </div>
            </div>
            )
        )
    }
    const localModuleData = mapDataCards(modules)

    const Tabs = () => <Tab menu ={{color: 'blue', inverted: 'true'}} panes ={Panes}/>
    return (
        <>
        <Tabs />
        </>
    )
}

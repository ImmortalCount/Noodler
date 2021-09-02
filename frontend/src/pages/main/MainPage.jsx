import React from 'react'
import DragAndFillProper from '../../components/DragAndDrop/DragAndFillProper'
import Finder from '../../components/finder/Finder'
import Guitar from '../../components/guitar/Guitar'
import Lab from '../../components/lab/Lab'
import Palette from '../../components/palette/Palette'

export default function MainPage() {
    return (
        <>
        <div>
            <div className="tophalf"> <Guitar/></div>
        </div>
        <div className="bottomhalf" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'gainsboro'}}>
            <div className="bottomleft" style={{flexGrow: 1, backgroundColor: 'grey'}}> 
            <Lab/>
            <Palette/>
            <Finder/>
            </div>
            <div className="bottomright" style={{flexGrow: 5, backgroundColor: 'green'}}> <DragAndFillProper/></div>
        </div>
        </>
    )
}

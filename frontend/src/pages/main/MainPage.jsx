import React from 'react'
import DragAndFillCard2 from '../../components/DragAndDrop/DragAndFillCard2'
import DragAndFillProper from '../../components/DragAndDrop/DragAndFillProper'
import ButtonFinder from '../../components/finder/ButtonFinder'
import Finder from '../../components/finder/Finder'
import MenuFinder from '../../components/finder/MenuFinder'
import Results from '../../components/finder/Results'
import Guitar from '../../components/guitar/Guitar'
import Lab from '../../components/lab/Lab'
import Navbar from '../../components/navbar/Navbar'
import Palette from '../../components/palette/Palette'

export default function MainPage() {
    return (
        <>
        <div>
            <Navbar/>
            <div className="tophalf"> <Guitar/></div>
        </div>
        <div className="bottomhalf" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'white'}}>
            <div className="bottomleft" style={{display: 'flex', flexDirection: 'row', backgroundColor: 'white'}}> 
            {/* <Finder/> */}
            {/* <ButtonFinder/> */}
            <MenuFinder/>
            <Results/>
            {/* <Lab/> */}
            {/* <Palette/> */}
            </div>
            <div className="bottomright"> <DragAndFillProper/></div>
        </div>
        </>
    )
}

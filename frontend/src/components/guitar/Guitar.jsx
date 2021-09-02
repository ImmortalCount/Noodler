import React from 'react'
import GuitarSVG from './GuitarSVG.jsx'



//use filter effects on SVG for advanced looking graphics
//possible pallette #e96d5e #ff9760 #ffe69d #6a7e6a #393f5f
//maybe use anime js
//Said Too Much tuning C#0 in Fourths
export default function Guitar() {
    return (
        <>
        <div>
            <div id="svg"></div>
            <p>Guitar Component</p>
            <GuitarSVG/>
        </div>
        
        </>
    )
}

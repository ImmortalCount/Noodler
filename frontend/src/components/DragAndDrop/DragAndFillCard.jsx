import React, { useState } from 'react'
import {Icon} from 'semantic-ui-react'

export default function DragAndFillCard({onDrag, onDragStart, dragOverHandler, dropHandler, chordName, rhythmName, patternName, scaleName, hasId, addBox, id}) {
    const [isShown, setIsShown] = useState(false)

    return (
        <>
        <div id= {id} className="box" onDrag={onDrag} onDragStart ={onDragStart} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' onClick={hasId} style={{borderStyle: 'solid', borderWidth: '3px', borderColor: 'black'}}>
                <div className="romanNumeralData" style={{textAlign: 'center'}} > I </div>
                <div className="chordData" draggable="true" style={{background: "lightsalmon"}}>{chordName}</div>
                <div className="rhythmData" draggable="true" style={{background: "lightseagreen"}}>{rhythmName}</div>
                <div className="patternData" draggable="true" style={{background: "lightblue"}}>{patternName}</div>
                <div className="scaleData" draggable="true" style={{background: "lightcoral"}}>{scaleName}</div>
                <div className="countData" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
        <div>
        <div id={id + '_divider'} className='verticalDivider' onClick={addBox} onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
            {isShown &&
            <div>
            <Icon id="plusIcon" fitted name='plus circle' />
            </div>
            }
        </div>
        </div>
        </>
    )
}

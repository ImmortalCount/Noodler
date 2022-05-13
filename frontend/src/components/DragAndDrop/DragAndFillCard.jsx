import { Icon } from "semantic-ui-react";

export default function DragAndFillCard({onDrag, onDragStart, dragOverHandler, dropHandler, chordName, rhythmName, patternName, scaleName, id, romanNumeralName, countName, keyName, moduleName, currentlyPlaying, onClick, patternType, positionType, chordPositionType}) {
    const lengthAllowed = 20;
    function stringOverflowHandler(str){
        if (typeof str === 'string'){
            if (str.length > lengthAllowed){
                return str.substring(0, lengthAllowed) + '...'
            } else {
                return str.substring(0, lengthAllowed)
            }
        } else {
            return str;
        } 
    }
    function patternTypeHandler(){
        if (patternType === 'fluid'){
            return ''
        }
        if (patternType === 'fixed'){
            return 'anchor'
        }
        if (patternType === 'floating'){
            return 'fly'
        }
    }

    function positionTypeHandler(){
        if (positionType === 'unlocked'){
            return ''
        }
        if (positionType === 'locked'){
            return 'lock'
        }
    }

    function chordPositionTypeHandler(){
        if (chordPositionType === 'unlocked'){
            return ''
        }
        if (chordPositionType === 'locked'){
            return 'lock'
        }
    }
    return (
        <>
        <div>{stringOverflowHandler(moduleName)}
            <div id= {id} className="moduleData" onClick={onClick} onDrag={onDrag} onDragStart ={onDragStart} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' style={{borderStyle: 'solid', borderWidth: currentlyPlaying ? '8px' : '2px', borderColor:  currentlyPlaying ? 'orange' : 'black', width: '175px' }}>
                <div className="romanNumeralData" style={{textAlign: 'center'}} > {stringOverflowHandler(romanNumeralName)}</div>
                <div className="chordData" draggable="true" style={{background: "lightsalmon"}}>{stringOverflowHandler(chordName)}<Icon name={chordPositionTypeHandler()}/></div>
                <div className="scaleData" draggable="true" style={{background: "lightcoral"}}>{stringOverflowHandler(scaleName)}</div>
                <div className="patternData" draggable="true" style={{background: "lightblue"}}>{stringOverflowHandler(patternName)}<Icon name={patternTypeHandler()}/><Icon name={positionTypeHandler()}/></div>
                <div className="rhythmData" draggable="true" style={{background: "lightseagreen"}}>{stringOverflowHandler(rhythmName)}</div>
                <div className="keyData" draggable="true" style={{background: "teal"}}>{stringOverflowHandler(keyName)}</div>
                <div className="countData" draggable="true" style={{textAlign: 'center', background: 'lightgreen'}}> {stringOverflowHandler(countName)} </div>
            </div>
       </div>
        </>
    )
}

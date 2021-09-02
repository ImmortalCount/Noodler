import React, { useState } from 'react'
import DragAndFillCard from './DragAndFillCard'
import {Icon} from 'semantic-ui-react';

export default function DragAndFillProper() { 
    var initialData = [
        {
            chordData: {
                chordName: 'Cmaj',
                chord: ['C4', 'E4', 'G4'],
            },
            rhythmData: {
                rhythmName: 'Default: Str Q',
                rhythm: ['W', 'H', 'H', 'Q'],
            },
            patternData: {
                patternName: 'Default: 1235',
                pattern: [1,1,2],
            },
            scaleData: {
                scaleName: 'C Ionian',
                scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            },
            output: [],
            position: []
        },
        {
            chordData: {
                chordName: 'Dmin',
                chord: ['D4', 'F4', 'A4'],
            },
            rhythmData: {
                rhythmName: 'Zipp H*DD',
                rhythm: ['Q', 'W', 'H', 'Q'],
            },
            patternData: {
                patternName: 'DownArp: 322',
                pattern: [-3,-2,-2],
            },
            scaleData: {
                scaleName: 'D Dorian',
                scale: ['D', 'E', 'F', 'G', 'A', 'B', 'C']
            },
            output: [],
            position: []
        },
        {
            chordData: {
                chordName: 'Emin',
                chord: ['E4', 'G4', 'B4'],
            },
            rhythmData: {
                rhythmName: 'Glorp H*DD',
                rhythm: ['H', 'Q', 'W', 'Q'],
            },
            patternData: {
                patternName: 'SideArp: 111',
                pattern: [1,1,1],
            },
            scaleData: {
                scaleName: 'E Phrygian',
                scale: ['E', 'F', 'G', 'A', 'B', 'C', 'D']
            },
            output: [],
            position: []
        },
    ];
var [controls, setControls] = useState('replace');
var [cardData] = useState(initialData);

    var cardDataPrototype = {
        chordData: {
            chordName: 'None',
            chord: []
        },
        rhythmData: {
            rhythmName: 'None',
            rhythm: []
        },
        patternData: {
            patternName: 'None',
            pattern: []
        },
        scaleData: {
            scaleName: 'None',
            scale: [],
        },
        output: [],
        position: []
    }

    

    //handling dragging
    //----------------------------------
    const dragStartHandler = e => {
        var obj = {id: e.currentTarget.id, className: e.target.className}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log('dragstart')
    };

    const dragHandler = e => {
    };

    const dragOverHandler = e => {
        e.preventDefault();
    };

    //replace
    const dropHandler = e => {
        e.preventDefault();
        var data = JSON.parse(e.dataTransfer.getData("text"));
        var startIndex = Number(data['id'])
        var endIndex = Number(e.currentTarget.id)
        var className = data['className']
        if (controls === 'replace'){
        cardData[endIndex][className] = cardData[startIndex][className]
        console.log('replaced!');
        console.log(controls);
        setMappedCards((mapCards(cardData)))
        e.dataTransfer.clearData();
        }
        if (controls === 'swap'){
        console.log('swapped!');
        console.log(controls);
        var placeholder;
        placeholder = cardData[endIndex][className]
        console.log(placeholder)
        cardData[endIndex][className] = cardData[startIndex][className];
        cardData[startIndex][className]= placeholder;
        setMappedCards((mapCards(cardData)))
        e.dataTransfer.clearData();
        }
        if (controls === 'fill'){
            for (var i = endIndex; i < cardData.length;i++){
                cardData[i][className] = cardData[startIndex][className]
            }
        setMappedCards((mapCards(cardData)))
        e.dataTransfer.clearData();
        }
        if (controls === 'reverseFill'){
            for (var j = endIndex; j > -1; j--){
                cardData[j][className] = cardData[startIndex][className]
            }
        setMappedCards((mapCards(cardData)))
        e.dataTransfer.clearData();
        }
    }

    //-----------------------------------
    

    //currentTarget returns parent div
    //Target just returns currently clicked div
    const hasId = e => {
        console.log(e.target.parentNode.id)
        console.log(e.target.className)
    }

    const addBox = e => {
        var clone = {...cardDataPrototype}
        var spliceIndex = Number((e.currentTarget.id).split('_')[0]);
        cardData.splice(spliceIndex + 1, 0, clone);
        setMappedCards((mapCards(cardData)));
    }

    const removeBox =() =>{
        cardData.pop();
        setMappedCards((mapCards(cardData)));
    }

    function mapCards(cardData){
        return (
            cardData.map((cardData, idx) => 
            <DragAndFillCard
            onDragStart = {dragStartHandler}
            onDrag = {dragHandler}
            dragOverHandler = {dragOverHandler}
            dropHandler = {dropHandler}
            id={idx}
            key={idx}
            chordName={cardData.chordData.chordName}
            rhythmName={cardData.rhythmData.rhythmName}
            patternName={cardData.patternData.patternName}
            scaleName={cardData.scaleData.scaleName}
            hasId={hasId}
            addBox={addBox}
            />
            )
        )
    }

    var [mappedCards, setMappedCards] = useState(mapCards(cardData))
        

    return (
        <>
        <div>
            <h1>Global Key: C major</h1>
        </div>
        <div style={{textAlign: 'center'}}>
            <h3>Verse 1</h3>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mappedCards}
            {/* <button onClick = {() => console.log(cardData)}>print cardData</button> */}
            <div className='box' style={{textAlign: 'center', paddingTop:'35px'}}> X2 </div>
        </div>
        <div style={{textAlign: 'center'}} className='ui divider'>
            <Icon name='plus circle'></Icon>
        </div>
        <div style={{textAlign: 'center'}}>
            <h3>Chorus</h3>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mappedCards}
        </div>
        <div className='ui divider'/>
        <div className='controls'>  Controls   </div>
        <div>
            <button onClick ={() => setControls('replace')}> Replace </button>
            <button onClick ={() => setControls('swap')}> Swap </button>
            <button onClick ={() => setControls('fill')}> Fill </button>
            <button onClick ={() => setControls('reverseFill')}> Reverse Fill </button>
        </div>
        <div>
            <button>Focus</button>
            <button>Edit On Click</button>
            <button>Advance Edit</button>
            <button>Play on Click</button>
            <button>Mute </button>
            <button>Loop options = x0 - x99, xInfinity, skip</button>
            <button>Show Loop Options</button>
        </div>
        <div>
            <button onClick={addBox}>Add Box</button>
            <button onClick={removeBox}>Remove Box</button>
        </div>
        </>
    )
}

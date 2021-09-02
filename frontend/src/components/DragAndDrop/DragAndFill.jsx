import React from 'react'

export default function DragAndFill() {
    
    const dragHandler = e => {
        
    };

    const dragStartHandler = e => {
        e.dataTransfer.setData('text', e.target.id);
    };


    const dropHandler = e => {
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        var previousColor = document.getElementById(data).style.background;

        if (document.getElementById(data).className !== 'pattern'){
            document.getElementById(data).style.background = e.target.style.background;
        }
        
        e.target.style.background = previousColor;
    }

    //Works in Swap Style
    // const dropHandler3 = e => {
    //     e.preventDefault();
    //     var data = e.dataTransfer.getData("text");
    //     var previousColor = document.getElementById(data).style.background;

    //     if (document.getElementById(data).className !== 'pattern'){
    //         document.getElementById(data).style.background = e.target.style.background;
    //     }
        
    //     e.target.style.background = previousColor;
    // }

    // //Make this work for replace style
    // const dropHandler4 = e => {
    //     e.preventDefault();
    //     var data = e.dataTransfer.getData("text");
    //     var previousColor = document.getElementById(data).style.background;

    //     if (document.getElementById(data).className !== 'pattern'){
    //         document.getElementById(data).style.background = e.target.style.background;
    //     }
        
    //     e.target.style.background = previousColor;
    // }

    

    const dragOverHandler = e => {
        e.preventDefault();
    };


    const hasAttribute = e => {
        console.log(e.target.hasAttribute('classname'))
    }


    


    return (
        <>
        <div className='main'>
        
        <div className="left">
        <div className="column">
                <h2>Chords</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord1' style={{background: 'lightsalmon'}}>CMaj</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord2' style={{background: 'lightsalmon'}}>DMaj</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord3' style={{background: 'lightsalmon'}}>EMaj</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord4' style={{background: 'lightsalmon'}}>FMaj</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord5' style={{background: 'lightsalmon'}}>GMin</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord6' style={{background: 'lightsalmon'}}>Amin</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord7' style={{background: 'lightsalmon'}}>Bminb5</div>
            </div>
            <div className="column">
                <h2>Rhythms</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm1' style={{background: 'lightseagreen'}}> H* DD</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm2' style={{background: 'lightseagreen'}}>H*DD</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm3' style={{background: 'lightseagreen'}}>WH</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm4' style={{background: 'lightseagreen'}}>HHHH</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm5' style={{background: 'lightseagreen'}}>WHHH</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm6' style={{background: 'lightseagreen'}}>WHHHH</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm7' style={{background: 'lightseagreen'}}>WHHHH</div>
            </div>
            <div className="column">
                <h2>Patterns</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern1' style={{background: 'lightblue'}}> 1,2,2</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern2' style={{background: 'lightblue'}}> 1,3,1</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern3' style={{background: 'lightblue'}}>2,2,2</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern4' style={{background: 'lightblue'}}>4,4,5</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern5' style={{background: 'lightblue'}}>1,2,2,-2</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern6' style={{background: 'lightblue'}}>1,4,2,1</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern7' style={{background: 'lightblue'}}>1,2,2,4</div>
            </div>
            <div className="column">
                <h2>Rhy/Pat</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern1' style={{background: 'lightgreen'}}> 1W,H*2,H2</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern2' style={{background: 'lightgreen'}}> 1W,H3,H1</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern3' style={{background: 'lightgreen'}}>2W,2H,2W</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern4' style={{background: 'lightgreen'}}>4H,4E,5W</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern5' style={{background: 'lightgreen'}}>1H,2H,2W,-2W</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern6' style={{background: 'lightgreen'}}>1H,4R,2R,1H</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern7' style={{background: 'lightgreen'}}>1H,2R,2R,4H</div>
            </div>
            <div className="column">
                <h2>Scales</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='scales1' style={{background: 'lightcoral'}}> Major</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='scales2' style={{background: 'lightcoral'}}> Harmonic Minor</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='scales3' style={{background: 'lightcoral'}}> Melodic Minor</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='scales4' style={{background: 'lightcoral'}}> Double Harmonic Minor</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='scales5' style={{background: 'lightcoral'}}> Harmonic Major</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='scales6' style={{background: 'lightcoral'}}> Blues</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='scales7' style={{background: 'lightcoral'}}> Whole Tone</div>
            </div>
            {/* <div className="column">
                <h2>Chord Packs</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord1' style={{background: 'lightsalmon'}}>CMaj</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord2' style={{background: 'lightsalmon'}}>DMaj</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord3' style={{background: 'lightsalmon'}}>EMaj</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord4' style={{background: 'lightsalmon'}}>FMaj</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord5' style={{background: 'lightsalmon'}}>GMin</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord6' style={{background: 'lightsalmon'}}>Amin</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='chord7' style={{background: 'lightsalmon'}}>Bminb5</div>
            </div>
            <div className="column">
                <h2>Rhythm Packs</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm1' style={{background: 'lightseagreen'}}> H* DD</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm2' style={{background: 'lightseagreen'}}>H*DD</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm3' style={{background: 'lightseagreen'}}>WH</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm4' style={{background: 'lightseagreen'}}>HHHH</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm5' style={{background: 'lightseagreen'}}>WHHH</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm6' style={{background: 'lightseagreen'}}>WHHHH</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythm7' style={{background: 'lightseagreen'}}>WHHHH</div>
            </div>
            <div className="column">
                <h2>Pattern Packs</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern1' style={{background: 'lightblue'}}> 1,2,2</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern2' style={{background: 'lightblue'}}> 1,3,1</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern3' style={{background: 'lightblue'}}>2,2,2</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern4' style={{background: 'lightblue'}}>4,4,5</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern5' style={{background: 'lightblue'}}>1,2,2,-2</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern6' style={{background: 'lightblue'}}>1,4,2,1</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='pattern7' style={{background: 'lightblue'}}>1,2,2,4</div>
            </div>
            <div className="column">
                <h2>Rhy/Pat Packs</h2>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern1' style={{background: 'lightblue'}}> 1W,H*2,H2</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern2' style={{background: 'lightblue'}}> 1W,H3,H1</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern3' style={{background: 'lightblue'}}>2W,2H,2W</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern4' style={{background: 'lightblue'}}>4H,4E,5W</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern5' style={{background: 'lightblue'}}>1H,2H,2W,-2W</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern6' style={{background: 'lightblue'}}>1H,4R,2R,1H</div>
                <div className="pattern" onDrag={dragHandler} onDragStart ={dragStartHandler} draggable='true' id='rhythmic_pattern7' style={{background: 'lightblue'}}>1H,2R,2R,4H</div>
            </div> */}
            
        
        </div>
        <div className="right">
        <div className="controls">
            <button>Fill</button>
            <button>Swap</button>
            <button>Replace</button>
            <button>Add Box</button>
            <button>Add Color</button>
            <button>Key: C</button>
            <button>Count: Rhythm OverRide</button>
            <button>Count: Regular</button>
        </div>
            <div className="row-1" id='row-1'>
            <div className="box" id="box-1" onClick={hasAttribute} onDrag={dragHandler} onDragStart ={dragStartHandler} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' data-chord='Cmaj' data-rhythm='H*DD' data-pattern="122" data-scale="Major">
                <div className="roman-numeral-data" style={{textAlign: 'center'}}> I </div>
                <div className="chord-data" draggable="true" style={{background: "lightsalmon"}}>Chord: C Maj</div>
                <div className="rhythm-data" draggable="true" style={{background: "lightseagreen"}}>Boom: H*DD</div>
                <div className="pattern-data" draggable="true" style={{background: "lightblue"}}>UpArp: 122</div>
                <div className="scale-data" draggable="true" style={{background: "lightcoral"}}>Default: C Ionian</div>
                <div className="count-data" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
            <div className="box" id="box-2" onDrag={dragHandler} onDragStart ={dragStartHandler} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' data-chord='Cmaj' data-rhythm='H*DD' data-pattern="122" data-scale="Major">
                <div className="roman-numeral-data" style={{textAlign: 'center'}}> V </div>
                <div className="chord-data" draggable="true" style={{background: "lightsalmon"}}>Chord: G Maj</div>
                <div className="rhythm-data" draggable="true" style={{background: "lightseagreen"}}>Zeep: H*DD</div>
                <div className="pattern-data" draggable="true" style={{background: "lightblue"}}>UpArp: 022</div>
                <div className="scale-data" draggable="true" style={{background: "lightcoral"}}>Default: G Mixolydian</div>
                <div className="count-data" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
            <div className="box" id="box-3" onDrag={dragHandler} onDragStart ={dragStartHandler} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' data-chord='Cmaj' data-rhythm='H*DD' data-pattern="122" data-scale="Major">
                <div className="roman-numeral-data" style={{textAlign: 'center'}}> vi </div>
                <div className="chord-data" draggable="true" style={{background: "lightsalmon"}}>Chord: A Min</div>
                <div className="rhythm-data" draggable="true" style={{background: "lightseagreen"}}>Boom: DDD</div>
                <div className="pattern-data" draggable="true" style={{background: "lightblue"}}>UpArp: 232</div>
                <div className="scale-data" draggable="true" style={{background: "lightcoral"}}>Default: A Aoelian</div>
                <div className="count-data" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
            <div className="box" id="box-4" onDrag={dragHandler} onDragStart ={dragStartHandler} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' data-chord='Cmaj' data-rhythm='H*DD' data-pattern="122" data-scale="Major">
                <div className="roman-numeral-data" style={{textAlign: 'center'}}> iii </div>
                <div className="chord-data" draggable="true" style={{background: "lightsalmon"}}>Chord: E min</div>
                <div className="rhythm-data" draggable="true" style={{background: "lightseagreen"}}>Boom: H*HD</div>
                <div className="pattern-data" draggable="true" style={{background: "lightblue"}}>UpArp: 422</div>
                <div className="scale-data" draggable="true" style={{background: "lightcoral"}}>Default: E Phrygian</div>
                <div className="count-data" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
        </div>
            <div className="row-2" id='row-2'>
            <div className="box" id="box-5" onDrag={dragHandler} onDragStart ={dragStartHandler} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' data-chord='Cmaj' data-rhythm='H*DD' data-pattern="122" data-scale="Major">
                <div className="roman-numeral-data" style={{textAlign: 'center'}}> IV </div>
                <div className="chord-data" draggable="true" style={{background: "lightsalmon"}}>Chord: F Maj</div>
                <div className="rhythm-data" draggable="true" style={{background: "lightseagreen"}}>Boom: H*DD</div>
                <div className="pattern-data" draggable="true" style={{background: "lightblue"}}>UpArp: 242</div>
                <div className="scale-data" draggable="true" style={{background: "lightcoral"}}>Default: F Lydian</div>
                <div className="count-data" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
            <div className="box" id="box-6" onDrag={dragHandler} onDragStart ={dragStartHandler} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' data-chord='Cmaj' data-rhythm='H*DD' data-pattern="122" data-scale="Major">
                <div className="roman-numeral-data" style={{textAlign: 'center'}}> I </div>
                <div className="chord-data" draggable="true" style={{background: "lightsalmon"}}>Chord: C Maj</div>
                <div className="rhythm-data" draggable="true" style={{background: "lightseagreen"}}>Boom: H*DD</div>
                <div className="pattern-data" draggable="true" style={{background: "lightblue"}}>UpArp: 242</div>
                <div className="scale-data" draggable="true" style={{background: "lightcoral"}}>Default: C Ionian</div>
                <div className="count-data" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
            <div className="box" id="box-7" onDrag={dragHandler} onDragStart ={dragStartHandler} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' data-chord='Cmaj' data-rhythm='H*DD' data-pattern="122" data-scale="Major">
                <div className="roman-numeral-data" style={{textAlign: 'center'}}> IV </div>
                <div className="chord-data" draggable="true" style={{background: "lightsalmon"}}>Chord: F Maj</div>
                <div className="rhythm-data" draggable="true" style={{background: "lightseagreen"}}>Boom: H*DD</div>
                <div className="pattern-data" draggable="true" style={{background: "lightblue"}}>UpArp: 322</div>
                <div className="scale-data" draggable="true" style={{background: "lightcoral"}}>Default: F Lydian</div>
                <div className="count-data" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
            <div className="box" id="box-8" onDrag={dragHandler} onDragStart ={dragStartHandler} onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' data-chord='Cmaj' data-rhythm='H*DD' data-pattern="122" data-scale="Major">
                <div className="roman-numeral-data" style={{textAlign: 'center'}}> V </div>
                <div className="chord-data" draggable="true" style={{background: "lightsalmon"}}>Chord: G Maj</div>
                <div className="rhythm-data" draggable="true" style={{background: "lightseagreen"}}>Boom: H*DD</div>
                <div className="pattern-data" draggable="true" style={{background: "lightblue"}}>UpArp: 242</div>
                <div className="scale-data" draggable="true" style={{background: "lightcoral"}}>Default: G Mixolydian</div>
                <div className="count-data" style={{textAlign: 'center'}}> Count: 4 </div>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}

import React from 'react'
import './rhythmlab.css'

export default function RecursionLab() {
    var noteTest = [[['A', 'B', ['XXX'],'X', 'Y'], 'C' ], ['B', 'C'], ['D', 'E', ['F', 'G', ['H', 'I', ['J', 'K', ['L', 'M']]]]], ['A']]

    function randomRhythmGenerator(depth){
        if (depth === undefined){
            depth = 0;
        }
    }



    function mapNotes(notes){
        var returnArr = [];
        var divIDNames = {};

        function divIDHandler(level){
            if (divIDNames[level] === undefined){
                divIDNames[level] = 0;
            } else {
                divIDNames[level] += 1;
            }
            return level + '_' + divIDNames[level];
        }
        var counter = 0;

        function innerMapNotes(notes){
            for (var i = 0; i < notes.length; i++){
                var level0Return = [];
                for (var j = 0; j < notes[i].length; j++){
                    if (Array.isArray(notes[i][j]) === false){
                        level0Return.push(<div id={counter} key={counter} className='inactive'style={{height: '50px', width: '50px', margin: '1px' }}>{notes[i][j]}</div>)
                        counter++;
                    }
                    else {
                        var level1Return = [];
                        for (var k = 0; k < notes[i][j].length; k++){
                            if (Array.isArray(notes[i][j][k]) === false){
                                level1Return.push(<div id={counter} key={counter} className='inactive'style={{height: '50px', width: '40px', margin: '1px' }}>{notes[i][j][k]}</div>)
                                counter++;
                            } else {
                                var level2Return = [];
                                for (var l = 0; l < notes[i][j][k].length; l++){
                                    if (Array.isArray(notes[i][j][k][l]) === false){
                                        level2Return.push(<div id={counter} key={counter} className='inactive' style={{height: '50px', width: '30px', margin: '1px' }}>{notes[i][j][k][l]}</div>)
                                        counter++;
                                    } else {
                                        var level3Return = [];
                                        for (var m = 0; m < notes[i][j][k][l].length; m++){
                                            if (Array.isArray(notes[i][j][k][l][m]) === false){
                                                level3Return.push(<div id={counter} key={counter} className='inactive' style={{height: '50px', width: '20px', margin: '1px' }}>{notes[i][j][k][l][m]}</div>)
                                                counter++;
                                            } else {
                                            var level4Return = [];
                                            for (var n = 0; n < notes[i][j][k][l][m].length; n++){
                                                if (Array.isArray(notes[i][j][k][l][m][n]) === false){
                                                    level3Return.push(<div id={counter} key={counter} className='inactive' style={{height: '50px', width: '15px', margin: '1px' }}>{notes[i][j][k][l][m][n]}</div>)
                                                    counter++;
                                                } else {
                                                    counter++;
                                                    continue;
                                                }
                                            }
                                            level3Return.push(
                                                <div id={divIDHandler('level_4')} key={divIDHandler('level_4')} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', backgroundColor:'purple', alignItems: 'center'}}>{level4Return}</div>
                                            )
                                            }
                                        }
                                        level2Return.push(
                                            <div id={divIDHandler('level_3')} key={divIDHandler('level_3')} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', backgroundColor:'grey', alignItems: 'center'}}>{level3Return}</div>
                                        )
                                    }
                                    
                                }
                                level1Return.push(
                                    <div id={divIDHandler('level_2')} key={divIDHandler('level_2')} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', backgroundColor:'black', alignItems: 'center'}}>{level2Return}</div>
                                )
                            } 
                        }
                        level0Return.push(
                            <div id={divIDHandler('level_1')} key={divIDHandler('level_1')} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', backgroundColor:'violet', alignItems: 'center'}}>{level1Return}</div>
                            )
                    }
                }
                returnArr.push(
                    <div id={divIDHandler('level_0')} key={divIDHandler('level_0')} className='inactive'style={{margin: '5px', display: 'flex', flexDirection: 'row', backgroundColor:'thistle', alignItems: 'center'}}>{level0Return}</div>
                    )
            }
            return returnArr    
        }
        return innerMapNotes(notes);
    }

    return (
        <>
        <div>
            This better fucking work!
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {mapNotes(noteTest)}
        </div>
        </>
    )
}

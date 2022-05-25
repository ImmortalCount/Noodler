import { createSVGElement, setAttributes } from '../svg/svgUtils';
import { shadeHexColor} from './guitarDisplayFunctions';
import { bassInstruments } from './instruments';
import {noteValues, romanNumerals} from './guitarSVGConstants';
import { Note } from '@tonaljs/tonal';

function findIndex(name){
    for (var z = 0; z < noteValues.length; z++){
        if (noteValues[z]['name'] === name){
            return z
        }
    }
}

//NUM needs to be known so it doesn't have the same ID numbers as other Guitar SVGS
export function createGuitarSVG(NUM, instruments){
    let stringWidth = 0.5;
    let y = 10;
    //length of imaginary guitar if shown in full
    const scaleLength = 2400;
    const fretNumber = instruments[NUM]['fretNumber'];
    const tuning = instruments[NUM]['tuning']
    const instrumentScale =  instruments[NUM]['scale']
    const instrumentType = instruments[NUM]['instrument']
    const noteColor = instruments[NUM]['noteColors'];
    const leftHanded = false;
    const fretPositions = []
    const boardLength = 42 + (scaleLength - (scaleLength/(Math.pow(2, fretNumber/12)))) 
    if (leftHanded === true){
        for (var k = 1; k < fretNumber + 1; k++){
            var result = (boardLength - 40) - (scaleLength - (scaleLength/(Math.pow(2, k/12))))
            fretPositions.push(result)
        } 
    } else {
        for (let k = 1; k < fretNumber + 1; k++){
            let result = 40 + (scaleLength - (scaleLength/(Math.pow(2, k/12))))
            fretPositions.push(result)
        } 
    }
    const boardHeight = 20 + ((instruments[NUM]['tuning'].length - 1) * 50);
    const topBuffer = 15;

    //MAIN SVG
    const svg = createSVGElement('svg')
    const svgAttrs = {"height": boardHeight + 45 + topBuffer, "width": boardLength, "id": "svg" + NUM, "class": "GuitarSVG"}
    setAttributes(svg, svgAttrs)
    
    //NECK
    const rect = createSVGElement('rect')
    const rectAttrs = {"y": topBuffer, "width": boardLength, "height": boardHeight, "fill": "#BA8C63"}
    setAttributes(rect, rectAttrs)
    svg.appendChild(rect)

    //NUT
    var nutPosition;
    if (leftHanded === true){
        nutPosition = (boardLength - 40)
    } else {
        nutPosition = 40
    }
    const nut = createSVGElement('line')
    const nutAttrs = {"x1": nutPosition, "x2": nutPosition, "y1": topBuffer, "y2": boardHeight + topBuffer, "stroke-width": "5", 'stroke': 'black'}
    setAttributes(nut, nutAttrs)
    svg.appendChild(nut);

    //FRETS
    for (let j = 0; j < fretNumber + 1; j++){
    const fret = createSVGElement('line')
    const fretAttrs = {'x1': fretPositions[j], 'x2': fretPositions[j], "y1": topBuffer, "y2": boardHeight + topBuffer, "stroke-width": "4", 'stroke': "#C0C0C0"}
    setAttributes(fret, fretAttrs)
    svg.appendChild(fret);
    }
    
    //SINGLE FRET MARKERS
    let fretMarkerPositions = [3, 5, 7, 9, 15, 17, 19, 21, 27, 29, 31, 33]
    let filteredFretMarkerPositions = [];
    for (let i = 0; i < fretMarkerPositions.length; i++){
        if (fretMarkerPositions[i] <= fretNumber){
            filteredFretMarkerPositions.push(fretMarkerPositions[i])
        }
    }
    fretMarkerPositions = filteredFretMarkerPositions;
    for (let i = 0; i < fretMarkerPositions.length; i++){
    const fretMarker = createSVGElement('circle')
    const fretMarkerAttrs = {'cx': ((fretPositions[fretMarkerPositions[i] - 2] + fretPositions[fretMarkerPositions[i] -1])/2), 'cy': boardHeight/2 + topBuffer, 'r': 10, 'fill': 'black', 'class': 'fretmarker', }
    setAttributes(fretMarker, fretMarkerAttrs)
    svg.appendChild(fretMarker);
    }
    //DOUBLE FRET MARKERS
    if (fretNumber >= 12){
        const markerPos = [12, 24, 36]
        let renderNum = 1;
        if (fretNumber >= 24){
            renderNum = 2
        }
        if (fretNumber >= 36){
            renderNum = 3
        }
        for (let i = 0; i < renderNum; i++){
            const fretMarker1 = createSVGElement('circle')
            const fretMarker1Attrs = {'cx': ((fretPositions[markerPos[i] - 2] + fretPositions[markerPos[i] - 1])/2),'cy': ((boardHeight - 10) * 1/3) + topBuffer, 'r': 10, 'fill': 'black' , 'class': 'fretmarker', 'id': 'fretmarker1' + i + NUM }
            setAttributes(fretMarker1, fretMarker1Attrs)
            svg.appendChild(fretMarker1);

            const fretMarker2 = createSVGElement('circle');
            const fretMarker2Attrs ={'cx':  ((fretPositions[markerPos[i] - 2] + fretPositions[markerPos[i] - 1])/2), 'cy': ((boardHeight + 10) * 2/3) + topBuffer, 'r': 10, 'fill': 'black', 'class': 'fretmarker', 'id': 'fretmarker2' + i + NUM}
            setAttributes(fretMarker2, fretMarker2Attrs)
            svg.appendChild(fretMarker2);
        }
    }

    //STRINGS
    if (bassInstruments.includes(instrumentType)){
        stringWidth += 2;
    }
    for (let i = 0; i < tuning.length; i++) {
        const string = createSVGElement('line')
        const stringAttrs = {"x1": 0, "x2": boardLength, "y1": y + topBuffer, "y2": y + topBuffer, "stroke-width": stringWidth, "stroke": "#71797E"}
        setAttributes(string, stringAttrs)
        svg.appendChild(string);
        y += 50;
        stringWidth += 0.5;
     };
    
    //NOTES
    var noteY = 10;
    for (let k = 0; k < tuning.length; k++){
        var index = findIndex(tuning[k]);
        for (var l = 0; l < fretNumber + 1; l++){
            const note = createSVGElement('circle')
            const noteAttrs = {'cy': noteY + topBuffer,'r': 15, 'stroke': "azure", 'stroke-width': "2", 'class': noteValues[index]["name"] + '_' + NUM + ' note_' + NUM + ' note note_pitchClass_' + Note.pitchClass(noteValues[index]["name"]) + '_' + NUM, 'id': (k + 1) + "_" + l + "_" + NUM}
            if (!leftHanded){
                if (l === 0){
                    noteAttrs['cx'] = 20
                } else if (l === 1){
                    noteAttrs['cx'] = (40 + fretPositions[0])/2
                } else {
                    noteAttrs['cx'] = (fretPositions[l -2] + fretPositions[l -1])/2
                }
            }
            if (leftHanded){
                if (l === 0){
                    noteAttrs['cx'] = boardLength - 20
                } else if (l === 1){
                    noteAttrs['cx'] = (boardLength - 40 + fretPositions[0])/2
                } else {
                    noteAttrs['cx'] = (fretPositions[l -2] + fretPositions[l -1])/2
                }
            } 
            if (noteColor === 'black'){
                noteAttrs['fill'] = 'black'
            } else {
                noteAttrs['fill'] = shadeHexColor(noteValues[index]["color"], (noteValues[index]["octave"] * 0.06))
            }
            setAttributes(note, noteAttrs)

            //SPECIAL NOTES
            var thisX;
            var thisY= noteY + topBuffer - 21
            if (leftHanded === true){
                if (l === 0){
                    thisX = boardLength - 20
                } else if (l === 1){
                    thisX = (boardLength - 40 + fretPositions[0])/2
                } else {
                    thisX = (fretPositions[l -2] + fretPositions[l -1])/2
                }
            } else {
                if (l === 0){
                    thisX = 20
                } else if (l === 1){
                    thisX = (40 + fretPositions[0])/2
                } else {
                    thisX = (fretPositions[l -2] + fretPositions[l -1])/2
                }
            } 
            const noteDiamond = createSVGElement('rect')
            const noteDiamondAttrs = {'x': thisX, 'y': thisY, 'height': 30, 'width': 30, 'stroke': 'azure', 'stroke-width': "2", 'class': noteValues[index]["name"] + '_' + NUM + '_special notespecial_' + NUM + ' notespecial notespecial_pitchClass_' + Note.pitchClass(noteValues[index]["name"]) + '_' + NUM, 'id': (k + 1) + "_" + l + "_" + NUM + 'special', 'transform': `translate(${thisX}, ${thisY}) rotate(45) translate(-${thisX}, -${thisY})`, 'visibility': 'hidden' }
            if (noteColor === 'black'){
                noteDiamondAttrs['fill'] = 'black'
                } else {
                noteDiamondAttrs['fill'] = shadeHexColor(noteValues[index]["color"], (noteValues[index]["octave"] * 0.06))
                }
            setAttributes(noteDiamond, noteDiamondAttrs)
                
            //NOTENAME
            const noteName = createSVGElement('text')
            const noteNameAttrs = {'dominant-baseline': 'middle', 'font-size': '15px', 'class': noteValues[index]["name"] + '_' + NUM + '_name notename_' + NUM + ' notename notename_pitchClass_' + Note.pitchClass(noteValues[index]["name"]) + '_' + NUM, 'id': (k + 1) + "_" + l + "_" + NUM + "_name", 'y': noteY + topBuffer, 'text-anchor': 'middle'}
            noteName.textContent = noteValues[index]["name"];
            if (!leftHanded){
                if (l === 0){
                    noteNameAttrs['x'] = 20
                } else if (l === 1){
                    noteNameAttrs['x'] = (40 + fretPositions[0])/2
                } else {
                    noteNameAttrs['x'] = (fretPositions[l -2] + fretPositions[l -1])/2
                }
            }
            if (leftHanded){
                if (l === 0){
                    noteNameAttrs['x'] = boardLength - 20
                } else if (l === 1){
                    noteNameAttrs['x'] = (boardLength - 40 + fretPositions[0])/2
                } else {
                    noteNameAttrs['x'] = (fretPositions[l -2] + fretPositions[l -1])/2
                }
            } 
            if (noteColor === 'black'){
                noteNameAttrs['fill'] = 'white'
            } else {
                noteNameAttrs['fill'] = 'black'
            }
            
            setAttributes(noteName, noteNameAttrs)

            if (instrumentScale.indexOf(noteValues[index]["note"]) === -1){
                note.setAttribute('visibility', 'hidden');
                noteName.setAttribute('visibility', 'hidden');
            }
            svg.appendChild(note);
            svg.appendChild(noteDiamond);
            svg.appendChild(noteName);

            index += 1;
        }
        noteY += 50;
    }
    
    //ROMAN NUMERAL FRET INDICATORS
    for (let l = 1; l < fretNumber + 1; l++){
        const fretIndicator = createSVGElement('text')
        const fretIndicatorAttrs = {'font-size': '15px', 'text-anchor': 'middle', 'y': boardHeight + 30 + topBuffer}
        if (!leftHanded){
            if (l === 1){
                fretIndicatorAttrs['x'] = (40 + fretPositions[0])/2
            } else {
                fretIndicatorAttrs['x'] = (fretPositions[l -2] + fretPositions[l -1])/2
            }
        }
        if (leftHanded){
            if (l === 1){
                fretIndicatorAttrs['x'] = (boardLength - 40 + fretPositions[0])/2
            } else {
                fretIndicatorAttrs['x'] = fretPositions[l -2] + fretPositions[l -1]/2
            }
        } 
        setAttributes(fretIndicator, fretIndicatorAttrs)
        fretIndicator.textContent = romanNumerals[l];
        svg.appendChild(fretIndicator);
    }
    return svg
}
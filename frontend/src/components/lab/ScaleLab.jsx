import {React, useState, useEffect} from 'react'
import { Form, Checkbox , Icon, Dropdown, Menu, Button} from 'semantic-ui-react'
import {Scale, ScaleType, Note} from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useDispatch } from 'react-redux';
import { actionCreators } from '../../store';
import { bindActionCreators } from 'redux';

import '../../../public/Do_Mayor_armadura.svg'

export default function ScaleLab() {
    var [scaleDataBinary, setScaleDataBinary] = useState([1,0,1,0,1,1,0,1,0,1,0,1])
    var [scaleName, setScaleName] = useState('major');
    var [notes, setNotes] = useState(["C", "D", "E", "F", "G", "A", "B"]);
    var [scaleNumber, setScaleNumber] = useState(2773);
    var [display, setDisplay] = useState('off')
    var [options, setOptions] = useState('sharps')
    const [rootNote, setRootNote] = useState('C')

    const dispatch = useDispatch();

    const {sendScaleData, receiveScaleData} = bindActionCreators(actionCreators, dispatch);


function createScaleSVG(){
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute("height", 300);
    svg.setAttribute("width", 300);
    // svg.setAttribute("fill-opacity", 0.5);
    
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "white");
    svg.appendChild(rect)
    
    //for circular representation:
    var angle = 30;
    var amountCircles = 12;
    var xCenter = 150;
    var yCenter = 150;
    var radius = 100;
    var angleIncrement = 2 * Math.PI / (amountCircles) 
    //main circle
    var mainCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        mainCircle.setAttribute('cx', xCenter );
        mainCircle.setAttribute('cy', yCenter);
        mainCircle.setAttribute('r', radius);
        mainCircle.setAttribute("fill", 'transparent');
        mainCircle.setAttribute("stroke", 'black');
        mainCircle.setAttribute("stroke-width", '2');
        svg.appendChild(mainCircle)
    //inner Circles
    var noteCount = 0;
    for (var i = 0; i < amountCircles; i++){
        var fill;
        if (scaleDataBinary[i] === 1){ 
            fill = 'black'
        } else {
            fill = 'white';
        }
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circle.setAttribute('cx', xCenter + (radius * Math.cos(angle)));
        circle.setAttribute('cy', yCenter + (radius * Math.sin(angle)));
        circle.setAttribute('r', 23);
        circle.setAttribute("fill", fill);
        circle.setAttribute("stroke", 'black');
        circle.setAttribute("stroke-width", '2');
        var noteName = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        noteName.setAttribute('x', xCenter + (radius * Math.cos(angle)));
        noteName.setAttribute('y', yCenter + (radius * Math.sin(angle)));
        noteName.setAttribute('text-anchor', 'middle');
        noteName.setAttribute('fill', 'white');
        noteName.setAttribute('dominant-baseline', 'middle');
        noteName.setAttribute('font-size', '15px');
        if (fill === 'black'){
          noteName.textContent = notes[noteCount];
          noteCount++
        }
        svg.appendChild(circle);
        svg.appendChild(noteName);
        angle += angleIncrement

    }
    //check if its there
    const scaleDiv = document.getElementById('divScaleInteractive');
    if (scaleDiv.firstChild){
        while (scaleDiv.firstChild){
            scaleDiv.removeChild(scaleDiv.firstChild)
        }
    }
    //Add to div
    scaleDiv.appendChild(svg);
  }

    useEffect (()=>{
      createScaleSVG()
      // sendScaleData(notes)
  }, [notes]);

    function generateRandomScale(noteNumber){
        var returnArr = [1,0,0,0,0,0,0,0,0,0,0,0];
        var returnScale = [];
        var rootChromaticScale = Scale.get(rootNote + ' chromatic').notes
        
        var i = 1;
        while (i < noteNumber){
            var randomIndex = (Math.floor(Math.random() * 11) + 1);
            if (returnArr[randomIndex] !== 1){
                returnArr[randomIndex] = 1;
                i += 1;
            }
        }
        for (var j = 0; j < returnArr.length; j++){
            if (returnArr[j] === 1){
                returnScale.push(rootChromaticScale[j]);
            }
        }
        var digit = parseInt(returnArr.join(""), 2)
        if (Scale.get(returnArr.join("")).name === ''){
          setScaleName(digit);
          } else {
          setScaleName(Scale.get(returnArr.join("")).name);
          }
        setScaleNumber(digit)
        setScaleDataBinary(returnArr);
        setNotes(scaleHandler(returnScale, options));
        
    }

    function generateRandomNamedScale(){
        var allNamed = ScaleType.all();
        var randIndex = Math.floor(Math.random() * (ScaleType.all().length))
        var rootChromaticScale = Scale.get(rootNote + ' chromatic').notes

        var chromaReturn = allNamed[randIndex]['chroma'].split("")

        for (var k = 0; k < chromaReturn.length; k++){
            chromaReturn[k] = Number(chromaReturn[k])
        }

        var returnScale = [];

        for (var j = 0; j < chromaReturn.length; j++){
            if (chromaReturn[j] === 1){
                returnScale.push(rootChromaticScale[j]);
            }
        }
        setScaleName(allNamed[randIndex]['name']);
        setScaleNumber(allNamed[randIndex]['setNum'])
        setScaleDataBinary(chromaReturn);
        setNotes(scaleHandler(returnScale, options));
    }

    function changeBinary(index, status){
        var returnScale = [];
        var rootChromaticScale = Scale.get(rootNote + ' chromatic').notes
        var clone = [...scaleDataBinary]

        if (status === 'on'){
            clone[index] = 1;
        }
        if (status === 'off'){
            clone[index] = 0;
        }
        for (var j = 0; j < clone.length; j++){
            if (clone[j] === 1){
                returnScale.push(rootChromaticScale[j]);
            }
        }

        var digit = parseInt(clone.join(""), 2)
        if (Scale.get(clone.join("")).name === ''){
          setScaleName(digit);
          } else {
          setScaleName(Scale.get(clone.join("")).name);
          }
        setScaleNumber(digit)
        setScaleDataBinary(clone);
        setNotes(scaleHandler(returnScale, options));
    }

    function generateAllModes(binaryNoteArr){
        var modes = [];
        var cloneScale = [...binaryNoteArr];
        
            for (var i = 0; i < 12; i++){
                    var current = [...cloneScale]
                    if (current[0] === 1){
                        modes.push(current);
                    }
                    
                    cloneScale.push(cloneScale.shift());
                }
            return modes;
        }

    function toggleModes(direction, notes){
    var newRoot;
    var allModes = generateAllModes(scaleDataBinary);
    var rootChromaticScale = Scale.get(rootNote + ' chromatic').notes
    

    if (allModes.length === 0 || allModes.length === undefined){
        return;
    }
    var newBinary = [];
    var returnScale = [];
    var currentNotes = notes;

  //   for (var i = 0; i < allModes[0].length; i++){
  //     if (allModes[0][i] === 1){
  //         currentNotes.push(rootChromaticScale[i]);
  //     }
  // }

    if (direction === 'next'){
        newBinary = allModes[1]
        var newRoot = currentNotes[1]
    }

    if (direction === 'previous'){
        newBinary = allModes[allModes.length - 1];
        var newRoot = currentNotes[currentNotes.length - 1];
    }

    var newRootChromaticScale = Scale.get(newRoot + ' chromatic').notes

    for (var j = 0; j < newBinary.length; j++){
        if (newBinary[j] === 1){
            returnScale.push(newRootChromaticScale[j]);
        }
    }


    var digit = parseInt(newBinary.join(""), 2)
        if (Scale.get(newBinary.join("")).name === ''){
          setScaleName(digit)
          } else {
          setScaleName(Scale.get(newBinary.join("")).name);
          }
        setScaleNumber(digit)
        setScaleDataBinary(newBinary);
        setRootNote(newRoot);
        setNotes(scaleHandler(returnScale, options));
    }

    //---Play notes:
    function playNoteSequence(){
    Tone.Transport.start();
    var synth = new Tone.Synth().toDestination()
    var position = 0;
//---Synthpart function 
        const synthPart = new Tone.Sequence(
          function(time, note) {
            synth.triggerAttackRelease(note + 3, "10hz", time)
            Tone.Draw.schedule(() => {
                //notes

            }, time)
            //position
            if (position < notes.length -1){
                position += 1;
            } else {
                position = 0;
            }
            //memory

          },
         notes,
          "8n"
        );
        synthPart.start();
        synthPart.loop = 1;
    }
      const dropdownOptions = [
        { key: 1, text: 'C', value: 'C'},
        { key: 2, text: 'C#', value: 'C#'},
        { key: 3, text: 'D', value: 'D'},
        { key: 4, text: 'D#', value: 'D#'},
        { key: 5, text: 'E', value: 'E'},
        { key: 6, text: 'F', value: 'F'},
        { key: 7, text: 'F#', value: 'F#'},
        { key: 8, text: 'G', value: 'G'},
        { key: 9, text: 'G#', value: 'G#'},
        { key: 10, text: 'A', value: 'A'},
        { key: 11, text: 'A#', value: 'A#'},
        { key: 12, text: 'B', value: 'B'}
      ]

      const playDropdownOptions = [
        { key: 'forward', text: 'forward', value: 'forward'},
        { key: 'reverse', text: 'reverse', value: 'reverse'},
        { key: 'random', text: 'random', value: 'random'},
      ]

      const dragStartHandler = e => {
        var obj = {id: 1, className: 'test', message: 'scaleLab side', type: 'foreign'}
        e.dataTransfer.setData('text', JSON.stringify(obj));
        console.log('draggin on scale lab')
    };

      
      const onChangeDropdown = (e, {value}) => {
        var newRootChromaticScale = Scale.get(value + ' chromatic').notes
        var returnScale = [];
        for (var j = 0; j < scaleDataBinary.length; j++){
          if (scaleDataBinary[j] === 1){
              returnScale.push(newRootChromaticScale[j]);
          }
      }
        setNotes(scaleHandler(returnScale, options))
        setRootNote(value);
      }

      function noteMapper(notes){
        var returnArr = []
        for (var i = 0; i < notes.length; i++){
          returnArr.push(notes[i] + " ")
        }
        return returnArr.join('')
      }

      function scaleHandler(scale, options){
        //options = sharps, flats, situational, classical
        var returnArr = []
          if (options === 'classical'){
            return scale
          }
          for (var i = 0; i < scale.length; i++){
            returnArr.push(Note.simplify(scale[i]))
          }
          if (options === undefined || options === 'situational'){
            return returnArr
          }
          if (options ==='flats'){
            for (var j = 0; j < returnArr.length; j++){
              if (returnArr[j].includes('#')){
                returnArr[j] = Note.enharmonic(returnArr[j])
              }
            }
            return returnArr;
          }
          if (options ==='sharps'){
            for (var k = 0; k < returnArr.length; k++){
              if (returnArr[k].includes('b')){
                returnArr[k] = Note.enharmonic(returnArr[k])
              }
            }
            return returnArr;
          }
      }

    return (
        <>
        <Menu>
        <Dropdown onChange={onChangeDropdown} options={dropdownOptions} text = {`Root: ${rootNote}`} simple item/>
        <Button.Group>
        <Button basic onClick={()=> playNoteSequence()}><Icon name='play'/></Button>
        <Dropdown
          simple
          item
          className='button icon'
          options={playDropdownOptions}
          trigger={<></>}
        />
      </Button.Group>
      <Button.Group>
        <Button basic onClick={() => generateRandomScale(7)}>Random</Button>
        <Dropdown
          simple
          item
          className='button icon'
          options={playDropdownOptions}
          trigger={<></>}
        />
      </Button.Group>
      <Button.Group>
      <Button basic onClick={() => toggleModes('previous', notes)}><Icon name='caret left'/></Button>
      <Button basic > Mode </Button>
      <Button basic onClick={() => toggleModes('next', notes)}><Icon name='caret right'/></Button>
      </Button.Group>
      <Menu.Item>Options: Display 'Sharps'</Menu.Item>
      <Menu.Item>Display: {display}</Menu.Item>
      <Menu.Item onClick={() => console.log(notes, 'notes')}>Export</Menu.Item>
      </Menu>
        <div>
        <div draggable='true' onDragStart={dragStartHandler} style={{height: '25px', width: '200px', backgroundColor:'wheat'}}>{rootNote} {scaleName}</div>
        <p># {scaleNumber} </p>
        <p>{noteMapper(notes)}</p>
        </div>
        <div id="divScaleInteractive"></div>
        {/* <img src="Do_Mayor_armadura.svg" alt="" /> */}
        {/* <button onClick={() => generateRandomScale(7)} >Generate Random Scale: 7 Notes</button>
        <button onClick={() => generateRandomNamedScale()}>Generate Named Scale</button>
        <button onClick={() => toggleModes('previous')}> <Icon name='arrow left'></Icon>Mode</button>
        <button onClick={() => toggleModes('next')}> Mode <Icon name='arrow right'></Icon></button>
        <button onClick={() => console.log(Scale.get('Db chromatic').notes)}>Generate Modes</button>
        <button onClick={()=> Tone.start()}>Initialize</button>
        <button>Root lock</button>
        <button>Play on Change</button>
        <button onClick={()=> Tone.Transport.start()}> Play</button>
        <button onClick={()=> Tone.Transport.stop()}> Stop</button> */}
        
        <div className='binaryRadioSelector' style={{display: 'flex', flexDirection: 'row'}}>
        <Form>
        <Form.Field>
         R
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[0] === 1 ? 'true' : ''}
            name='binaryRadioSelector0'
            value='0'
            onClick={() => changeBinary(0, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[0] === 0 ? 'true' : ''}
            name='binaryRadioSelector0'
            value='1'
            onClick={() => changeBinary(0, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        m2
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[1] === 1 ? 'true' : ''}
            name='binaryRadioSelector1'
            value='0'
            onClick={() => changeBinary(1, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[1] === 0 ? 'true' : ''}
            name='binaryRadioSelector1'
            value='1'
            onClick={() => changeBinary(1, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        M2
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[2] === 1 ? 'true' : ''}
            name='binaryRadioSelector2'
            value='0'
            onClick={() => changeBinary(2, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[2] === 0 ? 'true' : ''}
            name='binaryRadioSelector2'
            value='1'
            onClick={() => changeBinary(2, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        m3
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[3] === 1 ? 'true' : ''}
            name='binaryRadioSelector3'
            value='0'
            onClick={() => changeBinary(3, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[3] === 0 ? 'true' : ''}
            name='binaryRadioSelector3'
            value='1'
            onClick={() => changeBinary(3, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        M3
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[4] === 1 ? 'true' : ''}
            name='binaryRadioSelector4'
            value='0'
            onClick={() => changeBinary(4, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[4] === 0 ? 'true' : ''}
            name='binaryRadioSelector4'
            value='1'
            onClick={() => changeBinary(4, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        P4
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[5] === 1 ? 'true' : ''}
            name='binaryRadioSelector5'
            value='0'
            onClick={() => changeBinary(5, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[5] === 0 ? 'true' : ''}
            name='binaryRadioSelector5'
            value='1'
            onClick={() => changeBinary(5, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        TT
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[6] === 1 ? 'true' : ''}
            name='binaryRadioSelector6'
            value='0'
            onClick={() => changeBinary(6, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[6] === 0 ? 'true' : ''}
            name='binaryRadioSelector6'
            value='1'
            onClick={() => changeBinary(6, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        P5
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[7] === 1 ? 'true' : ''}
            name='binaryRadioSelector7'
            value='0'
            onClick={() => changeBinary(7, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[7] === 0 ? 'true' : ''}
            name='binaryRadioSelector7'
            value='1'
            onClick={() => changeBinary(7, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        m6
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[8] === 1 ? 'true' : ''}
            name='binaryRadioSelector8'
            value='0'
            onClick={() => changeBinary(8, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[8] === 0 ? 'true' : ''}
            name='binaryRadioSelector8'
            value='1'
            onClick={() => changeBinary(8, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        M6
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[9] === 1 ? 'true' : ''}
            name='binaryRadioSelector9'
            value='0'
            onClick={() => changeBinary(9, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[9] === 0 ? 'true' : ''}
            name='binaryRadioSelector9'
            value='1'
            onClick={() => changeBinary(9, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        m7
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[10] === 1 ? 'true' : ''}
            name='binaryRadioSelector10'
            value='0'
            onClick={() => changeBinary(10, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[10] === 0 ? 'true' : ''}
            name='binaryRadioSelector10'
            value='1'
            onClick={() => changeBinary(10, 'off')}
          />
        </Form.Field>
      </Form>
      <Form>
        <Form.Field>
        M7
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[11] === 1 ? 'true' : ''}
            name='binaryRadioSelector11'
            value='0'
            onClick={() => changeBinary(11, 'on')}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label=''
            checked={scaleDataBinary[11] === 0 ? 'true' : ''}
            name='binaryRadioSelector11'
            value='1'
            onClick={() => changeBinary(11, 'off')}
          />
        </Form.Field>
      </Form>
        </div>
        </>
    )
}

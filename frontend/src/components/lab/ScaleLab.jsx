import {React, useState, useEffect} from 'react'
import { Form, Checkbox , Icon} from 'semantic-ui-react'
import {Scale, ScaleType} from '@tonaljs/tonal';
import * as Tone from 'tone';
import '../../../public/Do_Mayor_armadura.svg'

export default function ScaleLab() {
    var [scaleDataBinary, setscaleDataBinary] = useState([0,0,0,0,0,0,0,0,0,0,0,0])
    var [scaleName, setScaleName] = useState('');
    var [notes, setNotes] = useState([]);
    const chromaticScale = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B'
    ]
    
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute("height", 450);
    svg.setAttribute("width", 450);
    
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
        svg.appendChild(circle);
        angle += angleIncrement
    }

    useEffect (()=>{
      document.getElementById("divScale").appendChild(svg);
  }, []);

    function generateRandomScale(noteNumber){
        var returnArr = [1,0,0,0,0,0,0,0,0,0,0,0];
        var returnScale = [];
        
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
                returnScale.push(chromaticScale[j] + 3);
            }
        }
        synthPart.dispose()
        var digit = parseInt(returnArr.join(""), 2)
        document.body.removeChild(svg);
        setScaleName(Scale.get(returnArr.join("")).name + " : " + digit);
        setscaleDataBinary(returnArr);
        setNotes(returnScale);
        
    }

    function generateRandomNamedScale(){
        var allNamed = ScaleType.all();
        var randIndex = Math.floor(Math.random() * (ScaleType.all().length))
        const chromaticScale = [
            'C',
            'C#',
            'D',
            'D#',
            'E',
            'F',
            'F#',
            'G',
            'G#',
            'A',
            'A#',
            'B'
        ]

        var chromaReturn = allNamed[randIndex]['chroma'].split("")

        for (var k = 0; k < chromaReturn.length; k++){
            chromaReturn[k] = Number(chromaReturn[k])
        }

        var returnScale = [];

        for (var j = 0; j < chromaReturn.length; j++){
            if (chromaReturn[j] === 1){
                returnScale.push(chromaticScale[j] + 3);
            }
        }
        synthPart.dispose()
        document.body.removeChild(svg);
        setScaleName(allNamed[randIndex]['name'] + " : " + allNamed[randIndex]['setNum']);
        setscaleDataBinary(chromaReturn);
        setNotes(returnScale);
    }

    function changeBinary(index, status){
        var returnScale = [];
        var clone = [...scaleDataBinary]
        if (status === 'on'){
            clone[index] = 1;
        }
        if (status === 'off'){
            clone[index] = 0;
        }
        for (var j = 0; j < clone.length; j++){
            if (clone[j] === 1){
                returnScale.push(chromaticScale[j] + 3);
            }
        }


        synthPart.dispose()
        var digit = parseInt(clone.join(""), 2)
        document.body.removeChild(svg);
        setScaleName(Scale.get(clone.join("")).name + " : " + digit);
        setscaleDataBinary(clone);
        setNotes(returnScale);
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

    function toggleModes(direction){
    var allModes = generateAllModes(scaleDataBinary);

    if (allModes.length === 0 || allModes.length === undefined){
        return;
    }
    var newBinary = [];
    var returnScale = [];

    if (direction === 'next'){
        newBinary = allModes[1]
    }

    if (direction === 'previous'){
        newBinary = allModes[allModes.length - 1];
    }

    for (var j = 0; j < newBinary.length; j++){
        if (newBinary[j] === 1){
            returnScale.push(chromaticScale[j] + 3);
        }
    }

    synthPart.dispose()
    var digit = parseInt(newBinary.join(""), 2)
        document.body.removeChild(svg);
        setScaleName(Scale.get(newBinary.join("")).name + " : " + digit);
        setscaleDataBinary(newBinary);
        setNotes(returnScale);
    }

    //---Play notes:
    var synth = new Tone.Synth().toDestination()
    var position = 0;
//---Synthpart function 
        const synthPart = new Tone.Sequence(
          function(time, note) {
            synth.triggerAttackRelease(note, "10hz", time)

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
          "4n"
        );
        synthPart.start();


    return (
        <>
        <div>
            <h1>Scale Lab</h1>
        </div>
        <div id="divScale"></div>
        <div>
        <div>Slideer for Amount of notes</div>
        <h3>What Scale Be this?: {scaleName}</h3>
        <h3>What Notes: {notes}</h3>
        </div>
        {/* <img src="Do_Mayor_armadura.svg" alt="" /> */}
        <button onClick={() => generateRandomScale(7)} >Generate Random Scale: 7 Notes</button>
        <button onClick={() => generateRandomNamedScale()}>Generate Named Scale</button>
        <button onClick={() => toggleModes('previous')}> <Icon name='arrow left'></Icon>Mode</button>
        <button onClick={() => toggleModes('next')}> Mode <Icon name='arrow right'></Icon></button>
        <button onClick={() =>generateAllModes(scaleDataBinary)}>Generate Modes</button>
        <button>Root: C3</button>
        <button onClick={()=> Tone.start()}>Initialize</button>
        <button onClick={()=> Tone.Transport.start()}> Play</button>
        <button onClick={()=> Tone.Transport.stop()}> Stop</button>
        <div>Select Notes for Scale</div>
        
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

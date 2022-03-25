import React, {useState, useRef, useEffect} from 'react'
import { Scale, Note, Chord } from '@tonaljs/tonal';
import DragAndFillCard from '../DragAndDrop/DragAndFillCard'
import { Menu , Input, Dropdown, Button, Form, TextArea, Icon} from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { insertData } from '../../store/actions/dataPoolActions';
import { scaleHandler } from './utils';
import * as Tone from 'tone';
import { keySynth, polySynth } from './synths';
import ExportModal from '../modal/ExportModal'

export default function ModuleLab({importedModuleData}) {
    const [name, setName] = useState('Module 1')
    const [keyName, setKeyName] = useState('Key: C')
    const [key, setKey] = useState('C')
    const [options, setOptions] = useState('sharps')
    const [exportPool, setExportPool] = useState('global')
    const [inputFocus, setInputFocus] = useState(false)
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)
    const user = JSON.parse(localStorage.getItem('userInfo'))
    var sequence = useRef('')

    const dispatch = useDispatch()

    const initState = {
        lab: {activeLabIndices: [0]},
        scaleLab: { 
            name: 'C major',
            scaleName: 'C major',
            scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            binary: [1,0,1,0,1,1,0,1,0,1,0,1],
            number: 2773,
            dataType: 'scale',
            pool: '',
    },
        chordLab: {
            name: 'CM',
            chordName: 'CM',
            desc: '',
            chord: ['C3', 'E3', 'G3'],
            position: [],
            author: '',
            authorId: '',
            dataType: 'chord',
            pool: ''
        },
        patternLab: {
            name: 'Pattern 1',
            patternName: 'Pattern 1',
            desc: '',
            type: 'pattern',
            length: 0,
            pattern: [7, 8, 9, 18, 14, 13, 11, 12],
            position: [],
            author: '',
            authorId: '',
            dataType: 'pattern',
            pool: ''
        },
        rhythmLab: {
            name: 'Rhythm 1',
            rhythmName: 'Rhythm 1',
            desc: '',
            rhythm: [['O'], ['O'], ['O'], ['O']],
            length: 4,
            noteSlots: 0,
            speed: 1,
            author: '',
            authorId: '',
            dataType: 'rhythm',
            pool: ''
        },
        moduleLab: {
            name: '',
            desc: '',
            author: '',
            pool: '',
        }
    }

    const labData = useSelector(state => state.labData)
    const {labInfo} = labData

    const dropdownOptionsKeySharp = 
    [
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

    const dropdownOptionsKeyFlat = [
        { key: 1, text: 'C', value: 'C'},
        { key: 2, text: 'Db', value: 'Db'},
        { key: 3, text: 'D', value: 'D'},
        { key: 4, text: 'Eb', value: 'Eb'},
        { key: 5, text: 'E', value: 'E'},
        { key: 6, text: 'F', value: 'F'},
        { key: 7, text: 'Gb', value: 'Gb'},
        { key: 8, text: 'G', value: 'G'},
        { key: 9, text: 'Ab', value: 'Ab'},
        { key: 10, text: 'A', value: 'A'},
        { key: 11, text: 'Bb', value: 'Bb'},
        { key: 12, text: 'B', value: 'B'}
    ]

    useEffect(() => {
        if (importedModuleData['name'] !== undefined){
            setName(importedModuleData['name'])
            setDescription(importedModuleData['desc'])
        }
    
    }, [importedModuleData])
    //========functions for player

    function noteStringHandler(notes){
        var returnArr = []
        if (notes.indexOf(' ') === -1){
            returnArr.push(notes)
        } else {
            returnArr = notes.split(' ')
        }
        return returnArr
    }
    var allScaleNotes = [];
    var scaleNotes = labInfo && labInfo['scaleLab'] && labInfo['scaleLab']['scale'] ? scaleHandler(labInfo['scaleLab']['scale'], options) : Scale.get('c major').notes;
    var allChromaticNotes = [];
    var chromaticNotes = scaleHandler(Scale.get('c chromatic').notes, options);
    var pattern = labInfo && labInfo['patternLab'] && labInfo['patternLab']['pattern'] ? labInfo['patternLab']['pattern'] : initState['patternLab']['pattern']
    var rhythm = labInfo && labInfo['rhythmLab'] && labInfo['rhythmLab']['rhythm'] ? labInfo['rhythmLab']['rhythm'] : initState['rhythmLab']['rhythm']
    var playConstant = labInfo && labInfo['rhythmLab'] && labInfo['rhythmLab']['speed'] ? labInfo['rhythmLab']['speed'] : initState['rhythmLab']['speed']
    var chord = labInfo && labInfo['chordLab'] && labInfo['chordLab']['chord'] ? labInfo['chordLab']['chord'] : initState['chordLab']['chord']

for (var o = 0; o < 10; o++){
    for (var p = 0; p < chromaticNotes.length; p++){
        allChromaticNotes.push(chromaticNotes[p] + o)
    }
}

//generate all scale specific notes
    for (var n = 0; n < allChromaticNotes.length; n++){
        if (scaleNotes.includes(Note.pitchClass(allChromaticNotes[n]))){
            allScaleNotes.push(allChromaticNotes[n])
        }
    }
    function patternAndScaleToNotes(patternX){
        var clonePattern = patternX
        var notesExport = [];
        var root = scaleNotes[0] + 3
        const allNotes = Note.sortedNames(allScaleNotes);
        //------------
        var startingIndex;
        if (allNotes.indexOf(root) === -1){
            startingIndex = allNotes.indexOf(Note.enharmonic(root))
        } else {
            startingIndex = allNotes.indexOf(root)
        }
        var startingChromaticIndex;
        if (allChromaticNotes.indexOf(root) === -1){
            startingChromaticIndex = allChromaticNotes.indexOf(Note.enharmonic(root))
        } else {
            startingChromaticIndex = allChromaticNotes.indexOf(root);
        }
        for (var k = 0; k < clonePattern.length; k++){
            //check if flag is added to clonePattern
            if (typeof clonePattern[k] === 'string'){
                notesExport.push(allChromaticNotes[startingChromaticIndex + Number(clonePattern[k].split("").slice(1).join(""))])
            } else {
                notesExport.push(allNotes[startingIndex + clonePattern[k]])
            }
        }
        return notesExport
    }

    function mapNotesToRhythm(notes, rhythm){
        var cloneRhythm = JSON.parse(JSON.stringify(rhythm))
        var cloneNotes = notes.slice();
        var count = 0;
        function recursiveNoteToRhythmMapper(cloneRhythm){
                for (var i = 0; i < cloneRhythm.length; i++){
                    if (Array.isArray(cloneRhythm[i]) === false){
                        if (cloneRhythm[i] === 'O'){
                            if (cloneNotes[count] === undefined){
                                cloneRhythm[i] = 'X'
                            } else {
                                cloneRhythm[i] = cloneNotes[count]
                                count++;
                            }
                            
                        }
                    } else {
                        recursiveNoteToRhythmMapper(cloneRhythm[i]);
                    }
                }
        }
        recursiveNoteToRhythmMapper(cloneRhythm);
        return cloneRhythm;
    }

    function playModule(){
        Tone.start()
        Tone.Transport.cancel();
        Tone.Transport.stop();
        Tone.Transport.start();
        var notesToMap = patternAndScaleToNotes(pattern)
        var sequence = mapNotesToRhythm(notesToMap, rhythm)

            var synthPart = new Tone.Sequence(
              function(time, note) {
                if (note !== 'X'){
                    polySynth.triggerAttackRelease(note, 0.2, time);
                }
               
              },
             sequence,
              (playConstant * Tone.TransportTime('4n').toSeconds())
            );
            
              synthPart.start();
              synthPart.loop = 1;
    }



    
    //====draganddrop functionality
    const dragStartHandler = e => {
        let obj;
        if (e.target.className === 'moduleData'){
            obj = {id: e.currentTarget.id, className: e.target.className, message:
                {
                    name: name,
                    moduleName: name,
                    desc: description,
                    author: '',
                    authorId: '',
                    dataType: 'module',
                    pool: '',
                    data: {
                    chordData: labInfo && labInfo['chordLab'] ? labInfo['chordLab'] : initState['chordLab'],
                    rhythmData: labInfo && labInfo['rhythmLab'] ? labInfo['rhythmLab'] : initState['rhythmLab'],
                    patternData: labInfo && labInfo['patternLab'] ? labInfo['patternLab'] : initState['patternLab'],
                    scaleData: labInfo && labInfo['scaleLab'] ? labInfo['scaleLab'] : initState['scaleLab'],
                    keyData: {
                        keyName: keyName,
                        root: key,
                    },
                    countData: {
                        countName: '4',
                        count: 4
                    }
                  }
                  }, 
            type: 'moduleLab'}
        } else if (e.target.className === 'chordData') {
            obj = {id: e.currentTarget.id, className: e.target.className,
                message: labInfo && labInfo['chordLab'] ? labInfo['chordLab'] : initState['chordLab'],
                 type: 'chordLabExport'}
        } else if (e.target.className === 'scaleData') {
            obj = {id: e.currentTarget.id, className: e.target.className,
                message: labInfo && labInfo['scaleLab'] ? labInfo['scaleLab'] : initState['scaleLab'],
                 type: 'scaleLabExport'}
        } else if (e.target.className === 'patternData') {
            obj = {id: e.currentTarget.id, className: e.target.className,
                message: labInfo && labInfo['patternLab'] ? labInfo['patternLab'] : initState['patternLab'],
                 type: 'patternLabExport'}
        } else if (e.target.className === 'rhythmData') {
            obj = {id: e.currentTarget.id, className: e.target.className,
                message: labInfo && labInfo['rhythmLab'] ? labInfo['rhythmLab'] : initState['rhythmLab'],
                 type: 'rhythmLabExport'}
        } else if (e.target.className === 'keyData') {
            obj = {id: e.currentTarget.id, className: e.target.className,
                message: {
                    keyName: keyName,
                    root: key,
                },
                 type: 'KeyLabExport'}
        } 
        
        e.dataTransfer.setData('text', JSON.stringify(obj));
    };

    const dragHandler = e => {
        };

    const onChangeDropdown = (e, {value}) => {
        setKey(value)
        setKeyName('Key: ' + value)
      }



    function qualityOfChordNameParser(chordName){
        if (chordName === undefined || chordName === null || chordName.length === 0){
            return
        }
        var chordNameArr = chordName.split("");
        var returnArr = [];
       for (var i = 1; i < chordNameArr.length;i++){
           if (chordNameArr[i] !== 'b' && chordNameArr[i] !== '#'){
                returnArr.push(chordNameArr[i])
           }
       }
       return returnArr.join("");
    }

    function setRomanNumeralsByKey(chord, root){
        var valuesToKey;
            valuesToKey = {
                0: 'I',
                1: 'bII',
                2: 'II',
                3: 'bIII',
                4: 'III',
                5: 'IV',
                6: '#IV',
                7: 'V',
                8: 'bVI',
                9: 'VI',
                10: 'bVII',
                11: 'VII'
            }   
        var rootChromatic = Scale.get(root + ' chromatic').notes
        var chordRoot = Note.pitchClass(chord[0])
        var simpleChromatic = [];
        for (var i = 0; i < rootChromatic.length; i++){
            simpleChromatic.push(Note.simplify(rootChromatic[i]))
        }
        var index = simpleChromatic.indexOf(chordRoot)
        if (index === -1){
            index = simpleChromatic.indexOf(Note.enharmonic(chordRoot))
        }
        var returnChord = qualityOfChordNameParser(Chord.detect(chord)[0])
        if (returnChord === undefined){
            returnChord = ''
        }
        var returnValue = valuesToKey[index];
    
        return returnValue + returnChord;
    }

        //---Export the module

    const exportObj = {
        name: name,
        moduleName: name,
        desc: '',
        author: user?.['name'],
        authorId: user?.['_id'],
        dataType: 'module',
        pool: exportPool,
        data: {
        chordData: labInfo && labInfo['chordLab'] ? labInfo['chordLab'] : initState['chordLab'],
        rhythmData: labInfo && labInfo['rhythmLab'] ? labInfo['rhythmLab'] : initState['rhythmLab'],
        patternData: labInfo && labInfo['patternLab'] ? labInfo['patternLab'] : initState['patternLab'],
        scaleData: labInfo && labInfo['scaleLab'] ? labInfo['scaleLab'] : initState['scaleLab'],
        keyData: {
            keyName: keyName,
            root: key,
        },
      }
    }


    const exportDropdownOptions = [
        { key: 'global', text: 'global', value: 'global'},
        { key: 'local', text: 'local', value: 'local'},
    ]
    
    const handleExportDropdown = (e, {value}) => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        if (value === 'local'){
            const user = JSON.parse(localStorage.getItem('userInfo'))
            setExportPool(user['_id'])
        } else {
            setExportPool(value)
        }
      }
    
    const handleDescriptionChange = e => {
        setDescription(e.target.value)
      }

    return (
        <>
        <Menu>
         <Menu.Item onClick={() => playModule()} ><Icon name='play' /></Menu.Item>  
         <Dropdown onChange={onChangeDropdown} options={options === 'sharps' ? dropdownOptionsKeySharp : dropdownOptionsKeyFlat} text = {`Key: ${key}`} simple item/>
         <Menu.Item onClick={() => setShowDescription(!showDescription)}> Desc </Menu.Item>
         <Button.Group>
        <ExportModal
        dataType={'Module'}
        exportObj={exportObj}/>
        </Button.Group>
        </Menu>
        <div>
        <div onClick={() => setInputFocus(!inputFocus)} style={{display: !inputFocus ? '': 'none' }}>
            {name}
        </div>
            <Input type='text'
            value={name}
            id={'input_moduleLab'}
            ref={input => input && input.focus()}
            onInput={e => setName(e.target.value)}
            onBlur={() => setInputFocus(false)}
            style={{display: inputFocus ? '': 'none' }}
            />
        </div>
        <DragAndFillCard
            onDragStart = {dragStartHandler}
            onDrag = {dragHandler}
            id={'moduleCard'}
            romanNumeralName={setRomanNumeralsByKey(chord, key)}
            chordName={labInfo && labInfo['chordLab'] && labInfo['chordLab']['name'] ? labInfo['chordLab']['name']: initState['chordLab']['name']}
            rhythmName={labInfo && labInfo['rhythmLab'] && labInfo['rhythmLab']['name'] ? labInfo['rhythmLab']['name']: initState['rhythmLab']['name']}
            patternName={labInfo && labInfo['patternLab'] && labInfo['patternLab']['name'] ? labInfo['patternLab']['name']: initState['patternLab']['name']}
            scaleName={labInfo && labInfo['scaleLab'] && labInfo['scaleLab']['scaleName'] ? labInfo['scaleLab']['name']: initState['scaleLab']['name']}
            countName={labInfo && labInfo['rhythmLab'] && labInfo['rhythmLab']['length'] ? labInfo['rhythmLab']['length'] : initState['rhythmLab']['length']}
            keyName={`Key: ${key}`}
            />
        {showDescription && <Form>
        <TextArea onInput={handleDescriptionChange} id={'desc_chordLab'} ref={input => input && input.focus()} placeholder='Description...' value={description} />
        </Form>}
        </>
    )
    
}

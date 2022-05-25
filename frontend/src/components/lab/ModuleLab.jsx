import React, {useState, useRef, useEffect} from 'react'
import { Scale, Note, Chord } from '@tonaljs/tonal';
import DragAndFillCard from '../DragAndDrop/DragAndFillCard'
import { Menu , Input, Dropdown, Button, Form, TextArea, Icon} from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { scaleHandler } from './utils';
import * as Tone from 'tone';
import { polySynth } from './synths';
import { setNoteDisplay } from '../../store/actions/noteDisplayActions';
import { setPlayImport } from '../../store/actions/playImportActions';
import ExportModal from '../modal/ExportModal'
import { setDisplayFocus } from '../../store/actions/displayFocusActions';
import { setLabData } from '../../store/actions/labDataActions';

export default function ModuleLab({importedModuleData, masterInstrumentArray, free, display}) {
    const [name, setName] = useState('Module 1')
    const [keyName, setKeyName] = useState('Key: C')
    const [key, setKey] = useState('C')
    const [options, setOptions] = useState('sharps')
    const [exportPool, setExportPool] = useState('global')
    const [inputFocus, setInputFocus] = useState(false)
    const [description, setDescription] = useState('')
    const [showDescription, setShowDescription] = useState(false)
    const [instrumentDisplay, setInstrumentDisplay] = useState(-1)
    const [displayAll, setDisplayAll] = useState(true)
    const [playType, setPlayType] = useState('Melody')
    const [playing, setPlaying] = useState(false)
    const [opened, setOpened] = useState(false)
    const user = JSON.parse(localStorage.getItem('userInfo'))

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setNoteDisplay(convertModuleForDispatch()))
    }, [instrumentDisplay, displayAll])

    useEffect(() => {
        dispatch(setDisplayFocus('lab'))
      }, [playModule, instrumentDisplay ])


    function convertModuleForDispatch(){
        let notes = patternAndScaleToNotes(pattern, patternType, scaleNotes)
        let displayStyle;
        let pos;
        if (displayAll){
            displayStyle = 'special'
        } else {
            displayStyle = false;
        }
        if (positionType === 'locked'){
            pos = position
        } else {
            pos = []
        }

        
        var arrOfObj = [];
        var blankObj = {data: [{speed: 1, notes: [['']], position: []}], displayOnly: displayStyle, highlight: [], specialHighlight: [0]}
        var loadedObj = {data: [{speed: 1, notes: [notes], position: pos}], displayOnly: displayStyle, highlight: [], specialHighlight: [0]}

        for (let h = 0; h < masterInstrumentArray.length; h++){
            arrOfObj.push(JSON.parse(JSON.stringify(blankObj)))
        }

        if (instrumentDisplay === -2){
            return arrOfObj
        } else if (instrumentDisplay === -1){
            for (let i = 0; i < arrOfObj.length; i++){
                arrOfObj[i] = JSON.parse(JSON.stringify(loadedObj))
            }
        } else {
            arrOfObj[instrumentDisplay - 1] = JSON.parse(JSON.stringify(loadedObj))
        }
        return arrOfObj
    }

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
            type: 'fluid',
            length: 0,
            pattern: [0,1,2,3,4,5,6,7],
            positionType: 'unlocked',
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
            notes: 0,
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
        if (importedModuleData?.['name']){
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
    var patternType = labInfo && labInfo['patternLab'] && labInfo['patternLab']['type'] ? labInfo['patternLab']['type'] : initState['patternLab']['type']
    var position = labInfo && labInfo['patternLab'] && labInfo['patternLab']['position'] ? labInfo['patternLab']['position'] : initState['patternLab']['position']
    var positionType = labInfo && labInfo['patternLab'] && labInfo['patternLab']['positionType'] ? labInfo['patternLab']['positionType'] : initState['patternLab']['positionType']
    var rhythm = labInfo && labInfo['rhythmLab'] && labInfo['rhythmLab']['rhythm'] ? labInfo['rhythmLab']['rhythm'] : initState['rhythmLab']['rhythm']
    var notesFromRhythm = labInfo && labInfo['rhythmLab'] && labInfo['rhythmLab']['notes'] ? labInfo['rhythmLab']['notes'] : initState['rhythmLab']['notes']
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
    function patternAndScaleToNotes(pattern, patternType, scale, root){
        var allNotes = [];
        var allChromaticNotes = [];
        var chromaticScale = Scale.get('c chromatic').notes
        var notesExport = [];
        if (root === undefined){
            root = scale[0] + 3;
        }
        if (patternType === 'fixed'){
            return pattern
        }
        var simplifiedScale = [];
        for (var h = 0; h < scale.length; h++){
            simplifiedScale.push(Note.simplify(scale[h]))
        }
        for (var i = 0; i < 10; i++){
            for (var j = 0; j < simplifiedScale.length; j++){
                allNotes.push(simplifiedScale[j] + i)
            }
        }
        allNotes = Note.sortedNames(allNotes);
        for (var m = 0; m < 10; m++){
            for (var n = 0; n < chromaticScale.length; n++){
                allChromaticNotes.push(chromaticScale[n] + m)
            }
        }
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
        for (var k = 0; k < pattern.length; k++){
                if (Array.isArray(pattern[k]) === true){
                    var localReturn = [];
                    for (var l = 0; l < pattern[k].length; l++){
                        if (typeof pattern[k][l] === 'string'){
                            localReturn.push(allChromaticNotes[startingChromaticIndex + Number(pattern[k][l].split("").slice(1).join(""))])
                        } else {
                            localReturn.push(allNotes[startingIndex + pattern[k][l]])
                        }
                    }
                    notesExport.push(localReturn.join(' '))
                } else {
                    if (typeof pattern[k] === 'string'){
                        notesExport.push(allChromaticNotes[startingChromaticIndex + Number(pattern[k].split("").slice(1).join(""))])
                    } else {
                        notesExport.push(allNotes[startingIndex + pattern[k]])
                    }
                }
        }
        return notesExport;
    }
    function chordIntoNotes(chord, notesFromRhythm){
        if (notesFromRhythm === 0 || notesFromRhythm === undefined){
            notesFromRhythm = 1;
        } 

        console.log(notesFromRhythm, 'notesFromRhythm')
        console.log(chord, 'chord')
        let returnStr = ''
        for (let i = 0; i < chord.length; i++){
            if (i === chord.length - 1){
                returnStr += chord[i]
            } else {
                returnStr += chord[i] + ' '
            }
        }
        
        let returnArr = [];
        //create the pattern to be as  long as the rhythmNotes
        for (let j = 0; j < notesFromRhythm; j++){
            returnArr.push(returnStr)
        }
        return returnArr;
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

    var intervals = useRef([])

    function playModule(){
        Tone.start()
        Tone.Transport.cancel();
        Tone.Transport.stop();
        Tone.Transport.start();
        let sequence;
        if (playType === 'Melody'){
            let notesToMap = patternAndScaleToNotes(pattern, patternType, scaleNotes)
            sequence = mapNotesToRhythm(notesToMap, rhythm)
            console.log(notesToMap, 'notesToMap')
        } else if (playType === 'Chord'){
            let notesToMap = chordIntoNotes(chord, notesFromRhythm)
            sequence = mapNotesToRhythm(notesToMap, rhythm)
            console.log(notesToMap, 'notesToMap')
        }
        
        let previousInstrumentDisplay = instrumentDisplay
        let gap = Tone.Time('4n').toMilliseconds()
        let totalTime = gap * sequence.length * playConstant

        if (playing){
            intervals.current.forEach(clearInterval)
            Tone.Transport.cancel()
            Tone.Transport.stop()
            setInstrumentDisplay(-2)
            setTimeout(() => setPlaying(false), 0)
            setTimeout(() => setInstrumentDisplay(previousInstrumentDisplay), 50)
        } else if (instrumentDisplay === -2){
            var synthPart = new Tone.Sequence(
                function(time, note) {
                  if (note !== 'X'){
                      polySynth.triggerAttackRelease(noteStringHandler(note), 0.2, time);
                  }
                },
               sequence,
                (playConstant * Tone.TransportTime('4n').toSeconds())
              );
              
                synthPart.start();
                synthPart.loop = 1;
                intervals.current.push(setTimeout(() => Tone.Transport.stop(), totalTime));
                intervals.current.push(setTimeout(() => setPlaying(false), totalTime));
        } else {
            let pos;
            if (positionType === 'locked'){
                pos = position
            } else {
                pos = [];
            }
            let returnObj = {
                displayOnly: false,
                highlight: 1,
                data: [{speed: 1, notes: sequence, position: pos}]
            }
            Tone.start()
            Tone.Transport.cancel()
            dispatch(setPlayImport([returnObj]))
            Tone.Transport.start()

            intervals.current.push(setTimeout(() => setInstrumentDisplay(-2), totalTime - 100))
            intervals.current.push(setTimeout(() => setInstrumentDisplay(previousInstrumentDisplay), totalTime))
            intervals.current.push(setTimeout(() => Tone.Transport.stop(), totalTime));
            intervals.current.push(setTimeout(() => setPlaying(false), totalTime));
        }
            
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
        desc: description,
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

    const handleDescriptionChange = e => {
        setDescription(e.target.value)
      }
    
    function handleChangeModuleName(name){
          setName(name)
      }

    function mapMenuItems(){
        return (
            masterInstrumentArray.map((instrument, idx) => 
            <Dropdown.Item
            text={instrument}
            key={'mappedInstr' + idx}
            selected={instrumentDisplay === idx + 1}
            onClick={() => setInstrumentDisplay(idx + 1)}
            />
            )
        )
} 
    function setDisplay(){
        dispatch(setDisplayFocus('lab'))
        dispatch(setNoteDisplay(convertModuleForDispatch()))
    }

    const dropHandlerSpecial =  e => {
        if (!free){
            return
        }
        
        const data = JSON.parse(e.dataTransfer.getData("text"));
        if (data['className'] !== 'moduleData'){
            return
          }
        const importedModuleData =  data['message']
        setName(importedModuleData['name'])
        setDescription(importedModuleData['desc'])

        // console.log(data, 'import data')
        // console.log(labData, 'lab data')
        let exportData = {};
        exportData['chordLab'] = importedModuleData['data']['chordData']
        exportData['patternLab'] = importedModuleData['data']['patternData']
        exportData['rhythmLab'] = importedModuleData['data']['rhythmData']
        exportData['scaleLab'] = importedModuleData['data']['scaleData']
        dispatch(setLabData(exportData))
    }
    const dragOverHandlerSpecial =  e => {
        e.preventDefault();
    }

    return (
        <div onDragOver={dragOverHandlerSpecial} onDrop={dropHandlerSpecial} style={ free ? {'height': '200px', display: display ? '' : 'none'} : {}}>
        <Menu>
         <Menu.Item onClick={() => {playModule(); setPlaying(true)}} ><Icon name={playing ? 'stop': 'play'}/></Menu.Item>  
         <Dropdown onChange={onChangeDropdown} options={options === 'sharps' ? dropdownOptionsKeySharp : dropdownOptionsKeyFlat} text = {`Key: ${key}`} simple item/>
         <Menu.Item onClick={() => setShowDescription(!showDescription)}> Desc </Menu.Item>
         <Menu.Item onClick={() => console.log(labInfo)}> Desc </Menu.Item>
         <Dropdown
            simple 
            item
            text = 'Playback'
       >
          <Dropdown.Menu>
                <Dropdown.Item selected={playType === 'Melody'} onClick={() => setPlayType('Melody')}> Melody </Dropdown.Item>
                <Dropdown.Item selected={playType === 'Chord'} onClick={() => setPlayType('Chord')}> Chord </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button.Group>
        <Button basic compact onClick={() => setDisplay()}>Display</Button>
         <Dropdown
            simple 
            item
            className='button icon' 
       >
          <Dropdown.Menu>
          <Dropdown.Header>Display Options</Dropdown.Header>
              <Dropdown.Divider/>
                <Dropdown.Item selected={!displayAll} onClick={() => setDisplayAll(false)}> Single Notes </Dropdown.Item>
                <Dropdown.Item selected={displayAll} onClick={() => setDisplayAll(true)}> Full Pattern </Dropdown.Item>
              <Dropdown.Header>Instruments</Dropdown.Header>
              <Dropdown.Divider/>
            <Dropdown.Item selected={instrumentDisplay === -2} onClick={() => setInstrumentDisplay(-2)}> None </Dropdown.Item>
            <Dropdown.Item selected={instrumentDisplay === -1} onClick={() => setInstrumentDisplay(-1)}> All </Dropdown.Item>
             {mapMenuItems()}
          </Dropdown.Menu>
        </Dropdown>
        </Button.Group>
        
         <Button.Group>
         <Button basic onClick={() => setOpened(true)}>Export</Button>
        
        </Button.Group>
        </Menu>
        <DragAndFillCard
            onDragStart = {dragStartHandler}
            onDrag = {dragHandler}
            id={'moduleCard'}
            romanNumeralName={setRomanNumeralsByKey(chord, key)}
            moduleName={name}
            handleChangeModuleName={handleChangeModuleName}
            chordName={labInfo && labInfo['chordLab'] && labInfo['chordLab']['name'] ? labInfo['chordLab']['name']: initState['chordLab']['name']}
            chordPositionType={labInfo && labInfo['chordLab'] && labInfo['chordLab']['positionType'] ? labInfo['chordLab']['positionType']: initState['chordLab']['positionType']}
            rhythmName={labInfo && labInfo['rhythmLab'] && labInfo['rhythmLab']['name'] ? labInfo['rhythmLab']['name']: initState['rhythmLab']['name']}
            patternName={labInfo && labInfo['patternLab'] && labInfo['patternLab']['name'] ? labInfo['patternLab']['name']: initState['patternLab']['name']}
            patternType={labInfo && labInfo['patternLab'] && labInfo['patternLab']['type'] ? labInfo['patternLab']['type']: initState['patternLab']['type']}
            positionType={labInfo && labInfo['patternLab'] && labInfo['patternLab']['positionType'] ? labInfo['patternLab']['positionType']: initState['patternLab']['positionType']}
            scaleName={labInfo && labInfo['scaleLab'] && labInfo['scaleLab']['scaleName'] ? labInfo['scaleLab']['name']: initState['scaleLab']['name']}
            countName={labInfo && labInfo['rhythmLab'] && labInfo['rhythmLab']['length'] ? labInfo['rhythmLab']['length'] : initState['rhythmLab']['length']}
            keyName={`Key: ${key}`}
            />
        
        {showDescription && <Form>
        <TextArea onInput={handleDescriptionChange} id={'desc_chordLab'} ref={input => input && input.focus()} placeholder='Description...' value={description} />
        </Form>}
        <ExportModal
         dataType={'module'}
         exportObj={exportObj}
         opened={opened}
         setOpened={setOpened}
         changeParentName={setName}
         changeParentDesc={setDescription}
         />
        </div>
    )
    
}

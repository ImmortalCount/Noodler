import React, {useEffect, useState} from 'react'
import { Accordion, Icon} from 'semantic-ui-react'
import ChordLab from './ChordLab'
import PatternLab from './PatternLab'
import RhythmLab from './RhythmLab'
import ScaleLab from './ScaleLab'
import ModuleLab from './ModuleLab'
import { useDispatch, useSelector} from 'react-redux';
import { setLabData } from '../../store/actions/labDataActions';


export default function Lab({masterInstrumentArray, display, update, setUpdate, labSplit}) {
    const [activeLabIndices, setActiveLabIndices] = useState([0])
    const [importedScaleData, setImportedScaleData] = useState({})
    const [importedChordData, setImportedChordData] = useState({})
    const [importedPatternData, setImportedPatternData] = useState({})
    const [importedRhythmData, setImportedRhythmData] = useState({})
    const [importedModuleData, setImportedModuleData] = useState({})
  
    const dispatch = useDispatch()

    const labData = useSelector(state => state.labData)
    const {labInfo} = labData

    const handleClick = (e, titleProps) => {
        var temp = [...activeLabIndices]
       if (activeLabIndices.includes(titleProps.index) === false){
           temp.push(titleProps.index)
       } else {
           temp = temp.filter(x => x !== titleProps.index);
       }
       setActiveLabIndices(temp)
    }

    const dragOverHandler = e => {
      e.preventDefault();
  }

  //manual update
   useEffect(() => {
    if (update && !labSplit){
      setUpdate(false)
      setImportedScaleData(labInfo['scaleLab'])
      setImportedChordData(labInfo['chordLab'])
      setImportedPatternData(labInfo['patternLab'])
      setImportedRhythmData(labInfo['rhythmLab'])
  }
   }, [update])
 //scale, chord, pattern, rhythm
  const dropHandler = e => {
    var data = JSON.parse(e.dataTransfer.getData("text"));
    if (data['type'] === 'scaleLab'
        || data['type'] === 'chordLab'
        || data['type'] === 'chordLabExport'
        || data['type'] === 'patternLab'
        || data['type'] === 'patternLabExport'
        || data['type'] === 'rhythmLab'
        || data['type'] === 'rhythmLabExport'
        || data['type'] === 'moduleLab'
    ){
      return
    } else {
      if (data['className'] === 'scaleData'){
        setActiveLabIndices([0])
        setImportedScaleData(data['message'])
      } else if (data['className'] === 'chordData'){
        setActiveLabIndices([1])
        setImportedChordData(data['message'])
      } else if (data['className'] ==='patternData'){
        setActiveLabIndices([2])
        setImportedPatternData(data['message'])
      } else if (data['className'] === 'rhythmData'){
        setActiveLabIndices([3])
        setImportedRhythmData(data['message'])
      } else if (data['className'] === 'moduleData'){
        setActiveLabIndices([4])
        setImportedScaleData(data['message']['data']['scaleData'])
        setImportedChordData(data['message']['data']['chordData'])
        setImportedPatternData(data['message']['data']['patternData'])
        setImportedRhythmData(data['message']['data']['rhythmData'])
        const importedModuleDataPacket = {
          author: data['message']['author'],
          authorId: data['message']['authorId'],
          moduleName: data['message']['moduleName'],
          name: data['message']['name'],
          desc: data['message']['desc']
        }
        setImportedModuleData(importedModuleDataPacket)
        //Hard update labinfo because it just wont update normally
        let newInfo = {...labInfo}
        const scaleDataPrototype = {
        name: data['message']['data']['scaleData']['scaleName'],
        scaleName: data['message']['data']['scaleData']['scaleName'],
        binary: data['message']['data']['scaleData']['binary'],
        desc: '',
        scale: data['message']['data']['scaleData']['scale'],
        dataType: 'scale',
        pool: '',
    }
    newInfo['scaleLab'] = scaleDataPrototype
    dispatch(setLabData(newInfo))
      }
    }
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
      e.dataTransfer.clearData();
  }

    return (
        <div style={{display: display ? '' : 'none'}}>
        <div onDragOver={dragOverHandler} onDrop={dropHandler} style={{minWidth: '800px', margin: "2px"}}>
        <Accordion fluid styled>
        <Accordion.Title
          active={activeLabIndices.includes(0)}
          index={0}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Scale Lab
        </Accordion.Title>
        <Accordion.Content active={activeLabIndices.includes(0)}>
            <ScaleLab 
            importedScaleData={importedScaleData}
            masterInstrumentArray = {masterInstrumentArray}
            />
        </Accordion.Content>

        <Accordion.Title
          active={activeLabIndices.includes(1) === 1}
          index={1}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Chord Lab
        </Accordion.Title>
        <Accordion.Content active={activeLabIndices.includes(1)}>
            <ChordLab
             importedChordData={importedChordData}
             masterInstrumentArray = {masterInstrumentArray}
             />
        </Accordion.Content>

        <Accordion.Title
          active={activeLabIndices.includes(2) }
          index={2}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Pattern Lab
        </Accordion.Title>
        <Accordion.Content active={activeLabIndices.includes(2)}>
          <PatternLab 
          importedPatternData={importedPatternData}
          masterInstrumentArray = {masterInstrumentArray}
          />
        </Accordion.Content>

        <Accordion.Title
          active={activeLabIndices.includes(3)}
          index={3}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Rhythm Lab
        </Accordion.Title>
        <Accordion.Content active={activeLabIndices.includes(3)}>
          <RhythmLab importedRhythmData={importedRhythmData}/>
        </Accordion.Content>

        <Accordion.Title
          active={activeLabIndices.includes(4)}
          index={4}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Module Lab
        </Accordion.Title>
        <Accordion.Content active={activeLabIndices.includes(4)}>
          <ModuleLab 
          importedModuleData={importedModuleData}
          masterInstrumentArray = {masterInstrumentArray}
          />
        </Accordion.Content>
      </Accordion>
      </div>
        </div>
    )
}

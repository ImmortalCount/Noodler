import React, {useState} from 'react'
import { Accordion, Icon} from 'semantic-ui-react'
import ChordLab from './ChordLab'
import PatternLab from './PatternLab'
import RhythmLab from './RhythmLab'
import ScaleLab from './ScaleLab'

export default function Lab() {
    const [activeLabIndices, setActiveLabIndices] = useState([3])
    const [importedScaleData, setImportedScaleData] = useState({})
    const [importedChordData, setImportedChordData] = useState({})
    const [importedPatternData, setImportedPatternData] = useState({})
    const [importedRhythmData, setImportedRhythmData] = useState({})

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

 //scale, chord, pattern, rhythm
  const dropHandler = e => {
    var data = JSON.parse(e.dataTransfer.getData("text"));
        
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
    }
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
      e.dataTransfer.clearData();
        

  }
  console.log(importedScaleData, importedChordData, importedPatternData, importedRhythmData)

    return (
        <>
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
            <ScaleLab importedScaleData={importedScaleData}/>
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
            <ChordLab importedChordData={importedChordData}/>
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
          <PatternLab importedPatternData={importedPatternData}/>
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
      </Accordion>
      </div>
        </>
    )
}

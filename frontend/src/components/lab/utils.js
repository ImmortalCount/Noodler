import { Note} from '@tonaljs/tonal';
import * as Tone from 'tone';

export function scaleHandler(scale, options){
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

function arraysAreEqual(arr1, arr2){
    if (arr1.length !== arr2.length){
        return false
    }
    let areEqual = true;
    for (let i = 0; i < arr1.length; i++){
        if (arr1[i] !== arr2[i]){
            areEqual = false;
        }
    }
    return areEqual
}

export function updateLinkedArrays(previousMasterArray, currentMasterArray, slaveArray1){
    //assume equal length between all arrays
    if (JSON.stringify(previousMasterArray) === JSON.stringify(currentMasterArray)){
      return slaveArray1
    }
    let newIndices = [];
    for (let i = 0; i < previousMasterArray.length; i++){
        for (let j = 0; j < currentMasterArray.length; j++){
            if (arraysAreEqual(previousMasterArray[i], currentMasterArray[j])){
                if (newIndices.includes(j) === false){
                    newIndices.push(j)
                }
            }
        }
    }
    let returnArr = [];
    for (let k = 0; k < slaveArray1.length; k++){
        returnArr[newIndices[k]] = slaveArray1[k]
    }

    return returnArr
}


 
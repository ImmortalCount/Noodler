import { Note} from '@tonaljs/tonal';

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
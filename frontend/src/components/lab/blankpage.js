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

function updateLinkedArrays(previousMasterArray, currentMasterArray, slaveArray1){
    //assume equal length between all arrays
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
    console.log(newIndices, 'newIndices')
    let returnArr = [];
    for (let k = 0; k < slaveArray1.length; k++){
        returnArr[newIndices[k]] = slaveArray1[k]
    }

    return returnArr
}

let previousMasterArray =  [['C3'], ['D3'],['E3'], ['F3'], ['G3'], ['B3']]
let currentMasterArray = [['E3'], ['F3'], ['G3'], ['B3'], ['B3'], ['C3'], ['D3']]
let slaveArray1 = [0,1,2,3,4,5,6]
let slaveArray1Result = [2,3,4,5,6,0,1]


// function convertScaleForDispatch(){
//     var arrOfObj = []
//     var blankObj = {data: [{speed: 1, notes: [['']], position: []}], displayOnly: true, highlight: [0,1,2,3,4,5]}
//     var loadedObj = {data: [{speed: 1, notes: notes, position: []}], displayOnly: true, highlight: [0,1,2,3,4,5]}
  
//     for (let h = 0; h < masterInstrumentArray.length; h++){
//       arrOfObj.push(JSON.parse(JSON.stringify(blankObj)))
//     }
  
//     if (instrumentDisplay === -2){
//       return arrOfObj
//     } else if (instrumentDisplay === -1){
//       for (let j = 0; j < arrOfObj.length; j++){
//         arrOfObj[j] = JSON.parse(JSON.stringify(loadedObj))
//       }
//       return arrOfObj
//     } else {
//       arrOfObj[instrumentDisplay - 1] = JSON.parse(JSON.stringify(loadedObj))
//       return arrOfObj
//     }
  
//   }

console.log(updateLinkedArrays(previousMasterArray, currentMasterArray, slaveArray1))


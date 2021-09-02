// import React from 'react'

// export default function leftovers() {
//     var bestFingeringTest = [["2_9", "3_7", "4_5", "5_3"], ["2_9", "3_7", "5_10", "6_8"], ["2_9", "4_12", "5_10", "6_8"]];

// //takes an array of arrays of id names
// function bestFingering(arr){
//     var smallest = Infinity
//     var smallestIndex = 0;
//     for (var h = 0; h < arr.length; h++){
//         var total = 0;
//         for (var i = 0; i < arr[h].length -1; i++){
//             var anchorFret = Number(arr[h][0].split('_')[1]);
//             var movingFret = Number(arr[h][i + 1].split('_')[1]);
//             total += Math.abs(anchorFret - movingFret);
//         }
//         if (total < smallest){
//             smallest = total;
//             smallestIndex = h;
//         }
//         total = 0;
//     }
    
//     return arr[smallestIndex];
// }


// console.log(bestFingering(bestFingeringTest));

//     function positionNamer(notesArr){
//         //generate fretboard
//         var fretboard = [];
//         for (var i = 0; i < tuning.length; i++){
//             var stringNotes = [];
//             var index = findIndex(tuning[i]);
//             for (var j = 0; j < fretNumber; j++){
//                 stringNotes.push(noteValues[index + j]['name'])
//             }
//             fretboard.push(stringNotes)
//         }
    
//         var allPositions = [];
//         //scan etc
//         function alreadyCalled(val){
//             var state = false;
//             for (var m = 0; m < allPositions.length; m++){
//                 if (allPositions[m].indexOf(val) !== -1){
//                     state = true;
//                 }
//         }
//         return state;
//     }   
    
//         //is it complete?
//         var complete = false;
//         //make sure that it hasn't been called before
//         var notesArrIndex = notesArr.length - 1;
//         while (complete === false){
//             //scan strings
//             var singlePosition = [];
//             for (var k = 0;  k < tuning.length;){
//                 var foundFretIndex = fretboard[k].indexOf(notesArr[notesArrIndex]);
//                 if (foundFretIndex !== -1){
//                     var indexID = (k + 1 + "_" + foundFretIndex);
//                     if (alreadyCalled(indexID) === false){
//                         singlePosition.push(indexID);
//                         notesArrIndex--;
//                     }
//                 }
//                 if (notesArrIndex === -1){
//                     allPositions.push(singlePosition);
//                     notesArrIndex = notesArr.length - 1;
//                     k = 0;
//                     singlePosition = [];
//                 }  
//                 if ((k === tuning.length - 1) && (notesArrIndex !== -1)){
//                     complete = true;
//                 }
//                 k++;
//             }
//         }
//         return allPositions;
//     }
//     return (
//         <div>
            
//         </div>
//     )
// }

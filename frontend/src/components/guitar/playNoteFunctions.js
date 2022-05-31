//====Mute a synth
export function setUpMute(allSynths){
    // var vol = new Tone.Volume(-12);
    allSynths['acoustic_guitar_nylon'].volume.value = -16;
    allSynths['acoustic_bass'].volume.value = -16;
    // console.log('what?')
}

//====Play an entire sequence in an alternative way


// function playNoteSequence(sequence, instrumentNumber){
//     function sequenceIntoNotesAndPositions(sequence, tuning){
//         if (tuning === undefined){
//             tuning = ['E4','B3','G3','D3','A2','E2']
//         }
//         var flatData = flattenNotes(sequence);
//         var flatReturn = [];
//         var positionReturn = [];
//         for (var i = 0; i < flatData.length; i++){
//             flatReturn.push(noteStringHandler(flatData[i]))
//         }
//         for (var j = 0; j < flatReturn.length; j++){
//             positionReturn.push(positionNamer(flatReturn[j], tuning))
//         }
//         var returnObj = {};
//         returnObj['notes'] = flatReturn;
//         returnObj['positions'] = positionReturn;
//         return returnObj;
//     }
// var cleanData = sequenceIntoNotesAndPositions(sequence)
// var flatData = cleanData.notes;
// var currentArray = [];
// var playPosition = 0;
// var positions = cleanData.positions
// Tone.Transport.cancel();
// const synthPart = new Tone.Sequence(
//         function(time, note) {
//           if (note !== 'X'){
//             allSynths['acoustic_guitar_nylon'].triggerAttackRelease(noteStringHandler(note), 0.1, time);
              
//           }
//           //hide all
//             var x = document.getElementsByClassName('note_' + instrumentNumber);
//             var y = document.getElementsByClassName('notename_' + instrumentNumber);
//             for (var i = 0; i < x.length; i++){
//                 x[i].setAttribute('visibility', 'hidden');
//                 y[i].setAttribute('visibility', 'hidden');
//                 }
//               //============== Play notes
//               if (note !== 'X'){
//                 currentArray = flatData[playPosition];
//                 if (globalPosition.current < 0){
//                     for (var w = 0; w < currentArray.length; w++){
//                         var x = document.getElementsByClassName(currentArray[w] + '_' + instrumentNumber);
//                         var y = document.getElementsByClassName(currentArray[w] + '_' + instrumentNumber + '_name');
//                         if (x !== undefined && y !== undefined){
//                             for (var j = 0; j < x.length; j++){
//                                 x[j].setAttribute('visibility', '');
//                                 y[j].setAttribute('visibility', '');
//                             }
//                         } else {
//                             console.log('off Model!')
//                         }
//                     }
//                 } else {
//                     var pos = (positions[playPosition][globalPosition.current] || positions[playPosition][positions[playPosition].length -1]);
//                     var tabArray = []
//                     if (pos !== undefined){
//                         for (var w = 0; w < pos.length; w++){
//                             var x = document.getElementById(pos[w] + '_' + instrumentNumber);
//                             var y = document.getElementById(pos[w] + '_' + instrumentNumber + '_name');
//                             x.setAttribute('visibility', '');
//                             y.setAttribute('visibility', '');
//                             tabArray.push(x.getAttribute('id')); 
//                         }
//                         generateTab(tabArray);
//                     } else {
//                         console.log('off Model!')
//                     }
//                 }
//               }

//         if (playPosition < flattenNotes(sequence).length - 1){
//             playPosition++;
//         } else {
//             playPosition = 0;
//         }
//         },
//        sequence,
//         "1n"
//       );
//       synthPart.start();
//       synthPart.loop = 1;
// }



//=====Play Notes Singularly

// function playNotes(){

// function soundNotes(){
//     var globalInt = 500;
//     allSynths['acoustic_guitar_nylon'].triggerAttackRelease(midiData[playPosition], globalInt/1000);
// }
//     var currentArray = [];
//     var previousArray = [];
//     var positions = positionNamer(midiData[playPosition], ['E4','B3','G3','D3','A2','E2']);
//     //notes for tomorrow
//     //check if previous note is an array and current note is an array
//     //make sure all data entering is an array
//     //implement going in reverse
//     //implement various rhythms as well;
    
//     //remove previous notes
//         if (playPosition === 0){
//             if (!Array.isArray(midiData[midiData.length - 1])){
//                 previousArray = [midiData[midiData.length - 1]];
//             } else {
//                 previousArray = midiData[midiData.length - 1];
//             }
//             for (var m = 0; m < previousArray.length; m++){
//                 var q = document.getElementsByClassName(previousArray[m]);
//                 var z = document.getElementsByClassName(previousArray[m] + 'name');
//                 for (var i = 0; i < q.length; i++){
//                     q[i].setAttribute('visibility', 'hidden');
//                     z[i].setAttribute('visibility', 'hidden');
//                 }
//             }
            
//         } else {
//             if (!Array.isArray(midiData[playPosition - 1])){
//                 previousArray = [midiData[playPosition - 1]];
//             } else {
//                 previousArray = midiData[playPosition - 1];
//             }
//             for (var n = 0; n < previousArray.length; n++){
//                 q = document.getElementsByClassName(previousArray[n]);
//                 z = document.getElementsByClassName(previousArray[n] + 'name');
//                 for (var k = 0; k < q.length; k++){
//                     q[k].setAttribute('visibility', 'hidden');
//                     z[k].setAttribute('visibility', 'hidden')
//                 }
//             }
            
//         }
        
//         //reveal current notes
//         if (!Array.isArray(midiData[playPosition])){
//             currentArray = [midiData[playPosition]];
//         } else {
//             currentArray = midiData[playPosition];
//         }
        
//         if (globalPosition.current < 0){
//             for (var w = 0; w < currentArray.length; w++){
//                 var x = document.getElementsByClassName(currentArray[w]);
//                 var y = document.getElementsByClassName(currentArray[w] + 'name');
        
//                 for (var j = 0; j < x.length; j++){
//                     x[j].setAttribute('visibility', '');
//                     y[j].setAttribute('visibility', '');
//                 }
//             }
//         } else {
//             var pos = (positions[globalPosition.current] || positions[positions.length - 1]);
//             var tabArray = []
//             for (var w = 0; w < pos.length; w++){
//                 var x = document.getElementById(pos[w]);
//                 var y = document.getElementById(pos[w] + '_name');
    
//                 x.setAttribute('visibility', '');
//                 y.setAttribute('visibility', '');
//                 tabArray.push(x.getAttribute('id'));
//             }
//             generateTab(tabArray);
//         }
//         //Sound notes
//         soundNotes();
//         //------------
//         if (playPosition < midiData.length - 1){
//             playPosition++;
//         } else {
//             playPosition = 0;
//         }
//     }
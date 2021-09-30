// function playNoteSequence(sequence){
//     var flatData = flattenNotes(sequence);
//     var currentArray = [];
//     var previousArray = [];
//     var positions = positionNamer(flatData[playPosition]);
    
//     const synthPart = new Tone.Sequence(
//             function(time, note) {
//               if (note !== 'X'){
//                   synth.triggerAttackRelease(note, "10hz", time);
//                   console.log(globalPosition)
//               }
//               Tone.Draw.schedule(() => {
//                 if (playPosition === 0){
//                     if (!Array.isArray(flatData[flatData.length - 1])){
//                         previousArray = [flatData[flatData.length - 1]];
//                     } else {
//                         previousArray = flatData[flatData.length - 1];
//                     }
//                     for (var m = 0; m < previousArray.length; m++){
//                         var q = document.getElementsByClassName(previousArray[m]);
//                         var z = document.getElementsByClassName(previousArray[m] + 'name');
//                         for (var i = 0; i < q.length; i++){
//                             q[i].setAttribute('visibility', 'hidden');
//                             z[i].textContent = '';
//                         }
//                     }
                    
//                 } else {
//                     if (!Array.isArray(flatData[playPosition - 1])){
//                         previousArray = [flatData[playPosition - 1]];
//                     } else {
//                         previousArray = flatData[playPosition - 1];
//                     }
//                     for (var n = 0; n < previousArray.length; n++){
//                         q = document.getElementsByClassName(previousArray[n]);
//                         z = document.getElementsByClassName(previousArray[n] + 'name');
//                         for (var k = 0; k < q.length; k++){
//                             q[k].setAttribute('visibility', 'hidden');
//                             z[k].textContent = '';
//                         }
//                     }
                    
//                 }
//                 //reveal current notes
//                 if (!Array.isArray(flatData[playPosition])){
//                     currentArray = [flatData[playPosition]];
//                 } else {
//                     currentArray = flatData[playPosition];
//                 }
                
//                 if (globalPosition < 0){
//                     for (var w = 0; w < currentArray.length; w++){
//                         var x = document.getElementsByClassName(currentArray[w]);
//                         var y = document.getElementsByClassName(currentArray[w] + 'name');
                
//                         for (var j = 0; j < x.length; j++){
//                             x[j].setAttribute('visibility', '');
//                             y[j].textContent = currentArray[w];
//                         }
//                     }
//                 } else {
//                     var pos = (positions[globalPosition] || positions[positions.length - 1]);
//                     var tabArray = []
//                     for (var w = 0; w < pos.length; w++){
//                         var x = document.getElementById(pos[w]);
//                         var y = document.getElementById(pos[w] + '_name');
            
//                         x.setAttribute('visibility', '');
//                         y.textContent = y.getAttribute('class').split(" ")[0].slice(0,2);
//                         tabArray.push(x.getAttribute('id'));
//                     }
//                     generateTab(tabArray);
//                 }
//             }, time)
//             if (playPosition < flattenNotes(midiData).length - 1){
//                 playPosition++;
//             } else {
//                 playPosition = 0;
//             }
//             },
//            sequence,
//             "1n"
//           );
//           synthPart.start();
//           synthPart.loop = 1;
//     }
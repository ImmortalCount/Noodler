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

// function createGuitarSVG(){
//     var stringWidth = 0.5;
//     var y = 10;
//     var x = 80;
//     var svgLength = 40 + (fretNumber * 40)
//     var svgHeight = 20 + ((stringNumber - 1) * 50);

//     var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
//     svg.setAttribute("height", svgHeight);
//     svg.setAttribute("width", svgLength);
//     svg.setAttribute("id", "svg1")
    

//     //neck
//     var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
//     rect.setAttribute("width", "100%");
//     rect.setAttribute("height", "100%");
//     rect.setAttribute("fill", "#BA8C63");
//     svg.appendChild(rect)

    
//     //nut
//     var nut = document.createElementNS("http://www.w3.org/2000/svg", 'line');
//     nut.setAttribute("x1", 40);
//     nut.setAttribute("x2", 40);
//     nut.setAttribute("y1", 0);
//     nut.setAttribute("y2", svgHeight);
//     nut.setAttribute("stroke-width", "5");
//     nut.setAttribute("stroke", "black");
//     svg.appendChild(nut);

//     //frets
//     //Thanks Vincenzo Galilei
//     //Dn = [(L – Dn-1) / 17.817] + Dn-1
//     for (var j = 0; j < fretNumber; j++){
//     var fret = document.createElementNS("http://www.w3.org/2000/svg", 'line');
//     fret.setAttribute('x1', x);
//     fret.setAttribute('x2', x);
//     fret.setAttribute('y1', 0);
//     fret.setAttribute('y2', svgHeight);
//     fret.setAttribute("stroke-width", "4");
//     fret.setAttribute("stroke", "#C0C0C0");
    
//     svg.appendChild(fret);
//     x += 40;
//     //if set to normal, x += 40 each time;
//     }
//     //fret markers
//     //1 3 5 7 12 15 17 19 21 24
//     //12th fret marker
//     var fretMarker121 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
//     fretMarker121.setAttribute('cx', 500);
//     fretMarker121.setAttribute('cy', 85);
//     fretMarker121.setAttribute('r', 10);
//     fretMarker121.setAttribute('fill', 'black');
//     fretMarker121.setAttribute('class', 'fretmarker');
//     fretMarker121.setAttribute('id', 'fretmarker121');
//     svg.appendChild(fretMarker121);

//     var fretMarker122 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
//     fretMarker122.setAttribute('cx', 500);
//     fretMarker122.setAttribute('cy', 185);
//     fretMarker122.setAttribute('r', 10);
//     fretMarker122.setAttribute('fill', 'black');
//     fretMarker122.setAttribute('class', 'fretmarker');
//     fretMarker122.setAttribute('id', 'fretmarker122');
//     svg.appendChild(fretMarker122);

//     //24th fret marker
//     var fretMarker241 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
//     fretMarker241.setAttribute('cx', 980);
//     fretMarker241.setAttribute('cy', 85);
//     fretMarker241.setAttribute('r', 10);
//     fretMarker241.setAttribute('fill', 'black');
//     fretMarker241.setAttribute('class', 'fretmarker');
//     fretMarker241.setAttribute('id', 'fretmarker241');
//     svg.appendChild(fretMarker241);

//     var fretMarker242 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
//     fretMarker242.setAttribute('cx', 980);
//     fretMarker242.setAttribute('cy', 185);
//     fretMarker242.setAttribute('r', 10);
//     fretMarker242.setAttribute('fill', 'black');
//     fretMarker242.setAttribute('class', 'fretmarker');
//     fretMarker242.setAttribute('id', 'fretmarker242');
//     svg.appendChild(fretMarker242);

//     //Rest of the fretmarkers
//     var fretMarkerPositions = [3, 5, 7, 9, 15, 17, 19, 21]
//     for (var i = 0; i < fretMarkerPositions.length; i++){
//     var fretMarker = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
//     fretMarker.setAttribute('cx', 20 + (fretMarkerPositions[i] * 40));
//     fretMarker.setAttribute('cy', 135);
//     fretMarker.setAttribute('r', 10);
//     fretMarker.setAttribute('fill', 'black');
//     fretMarker.setAttribute('class', 'fretmarker');
//     svg.appendChild(fretMarker);
//     }
//     //strings
//     for (var i = 0; i < stringNumber; i++) {
//         var string = document.createElementNS("http://www.w3.org/2000/svg", 'line');
//         string.setAttribute("x1", 0);
//         string.setAttribute("x2", svgLength);
//         string.setAttribute("y1", y);
//         string.setAttribute("y2", y);
//         string.setAttribute("stroke-width", stringWidth);
//         string.setAttribute("stroke", "#71797E");
//         svg.appendChild(string);
//         y += 50;
//         stringWidth += 0.5;
//      };
//     //note
//     var noteX = 20;
//     var noteY = 10;
//     //generate notes
//     for (var k = 0; k < tuning.length; k++){
//         var index = findIndex(tuning[k]);
//         for (var l = 0; l < fretNumber + 1; l++){

//             var note = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
//             note.setAttribute('cx', noteX);
//             note.setAttribute('cy', noteY);
//             note.setAttribute('r', 15);
//             note.setAttribute('fill', shadeHexColor(noteValues[index]["color"], (noteValues[index]["octave"] * 0.06) ));
//             note.setAttribute('stroke', "azure");
//             note.setAttribute('stroke-width', "2");
//             note.setAttribute('class', noteValues[index]["name"] + ' note');
//             note.setAttribute('id', (k + 1) + "_" + l);
//             var noteName = document.createElementNS("http://www.w3.org/2000/svg", 'text');
//             noteName.setAttribute('x', noteX);
//             noteName.setAttribute('y', noteY);
//             noteName.setAttribute('text-anchor', 'middle');
//             noteName.setAttribute('fill', 'black');
//             noteName.setAttribute('dominant-baseline', 'middle');
//             noteName.setAttribute('font-size', '15px');
//             noteName.setAttribute('class', noteValues[index]["name"] + 'name notename')
//             noteName.setAttribute('id', (k + 1) + "_" + l + "_name");
//             noteName.textContent = noteValues[index]["name"];
//             if (scale.indexOf(noteValues[index]["note"]) === -1){
//                 note.setAttribute('visibility', 'hidden');
//                 noteName.setAttribute('visibility', 'hidden');
//             }
//             svg.appendChild(note);
//             svg.appendChild(noteName);

//             noteX += 40;
//             index += 1;
//         }
//         noteY += 50;
//         noteX = 20;
//     }
//     //check for previous guitars
//     const guitarDiv = document.getElementById('divGuitar');
//     const guitarDiv2 = document.getElementById('divGuitar2');
//     if (guitarDiv.firstChild){
//         while (guitarDiv.firstChild){
//             guitarDiv.removeChild(guitarDiv.firstChild)
//         }
//     }
//     let clone = svg.cloneNode(true)
//     //Add to div
//     guitarDiv.appendChild(svg);
//     guitarDiv2.appendChild(clone)
    

// }
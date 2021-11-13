//For Shading and blending using hex colors
//Thanks PimpTrizkit
export function shadeHexColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

export function blendHexColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}

//======HIDE ALL NOTES

export function invisAll(){
    var x = document.getElementsByClassName('note');
    var y = document.getElementsByClassName('notename');
    for (var i = 0; i < x.length; i++){
        x[i].setAttribute('visibility', 'hidden');
        y[i].setAttribute('visibility', 'hidden');
        }
    var z = document.getElementsByClassName('notespecial');
        for (var j = 0; j < z.length; j++){
            z[j].setAttribute('visibility', 'hidden');
        }
}

//=====SHOW ALL NOTES

export function showAll(){
    var x = document.getElementsByClassName('note');
    var y = document.getElementsByClassName('notename');
    for (var i = 0; i < x.length; i++){
        x[i].setAttribute('visibility', '');
        y[i].setAttribute('visibility', '')
        }
    var z = document.getElementsByClassName('notespecial');
    for (var j = 0; j < z.length; j++){
        z[j].setAttribute('visibility', 'hidden');
    }
}

//====SHOW ALL SPECIAL [[DIAMOND]] NOTES

export function showAllSpecial(){
    var x = document.getElementsByClassName('notespecial');
    var y = document.getElementsByClassName('notename');
    for (var i = 0; i < x.length; i++){
        x[i].setAttribute('visibility', '');
        y[i].setAttribute('visibility', '')
        }
    var z = document.getElementsByClassName('note');
    for (var j = 0; j < z.length; j++){
            z[j].setAttribute('visibility', 'hidden');
        }
}

//SHOW ALL SPECIFIED NOTES
// function displayNotes(notesArr, tuning){
//     var displayArr = [];
//     for (var i = 0; i < notesArr.length; i++){
//         for (var j = 0; j < noteValues.length; j++){
//             if (noteValues[j]['note'] === notesArr[i]){
//                 var currentPositions = positionNamer(noteValues[j]['name'], tuning)
//                 for (var k = 0; k < currentPositions.length; k++){
//                     if (currentPositions[k] !== undefined){
//                         displayArr.push(currentPositions[k][0])
//                     }
//                 }
//             }
//         }
//     }
//     for (var l = 0; l < displayArr.length; l++){
//         var x = document.getElementById(displayArr[l]);
//         var y = document.getElementById(displayArr[l] + '_name')
//         x.setAttribute('visibility', '')
//         y.setAttribute('visibility', '')
//     }
//     return displayArr;
// }

//=======Invis 1 element by ID
export function invisById(id){
    var x = document.getElementById(id);
    var y = document.getElementById(id + 'name')
    if (x !== null && y !==null){
        x.setAttribute('visibility', 'hidden')
        y.setAttribute('visibility', 'hidden')
    }
}

//=======Invis by className
export function invisByClassName(){
    var x = document.getElementById('5_7_1');
    var y = document.getElementById('5_7_1_name')
    if (x !== null && y !==null){
        x.setAttribute('visibility', 'hidden')
        y.setAttribute('visibility', 'hidden')
    }
}
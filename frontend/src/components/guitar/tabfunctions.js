// import FileSaver from 'file-saver';

//===Creates tabs
var arrForTab = [];
function generateArraysForTab(tuning){
    for (var i = 0; i < tuning.length; i++){
        arrForTab[i] = '|';
    }
}
generateArraysForTab();
var barCount = 4;
var tabCount = 0;

export function generateTab(ids, tuning){
    //tabs = v for heavy vibrato, b for bend, ~ for classic vibrato 
    // slide up = / slide down = \
    if (Array.isArray(ids) === false){
        ids = [ids];
    } 
    var renderString = '';
    var usedStrings = [];
    //render divider bar
    if (barCount === tabCount){
        for (var k = 0; k < tuning.length; k++){
            arrForTab[k] += "|"
        }
        tabCount = 0;
    }
    //add to tab strings
    for (var i = 0; i < ids.length; i++){
        var stringNumber = Number(ids[i].split('_')[0])
        var fretNumberString = ids[i].split('_')[1]
        for (var l =  4 - fretNumberString.length; l > 0 ; l--){
            fretNumberString += '-';
        }
        arrForTab[stringNumber - 1] += fretNumberString;
        usedStrings.push(stringNumber);
    }
    for (var j = 0; j < tuning.length; j++){
        if (usedStrings.indexOf(j + 1) === -1){
            arrForTab[j] += "----"
        }
    }
    // unused strings
    
    // renderTab
    for (var k = 0; k < arrForTab.length; k++){
        renderString = renderString + arrForTab[k] + '\n'
    }
    tabCount++;
    document.getElementById("tab").innerHTML = renderString
    console.log(renderString);
}

//========Download Tab
export function downloadTab(){
    var FileSaver = require('file-saver');
    var blob = new Blob([document.getElementById("tab").innerHTML], {type: "text/plain;charset=utf-8"})
    FileSaver.saveAs(blob, "tab.txt");
    }

    //To do:
    //Download Tab
    //Figure out why notes are displayed on new board
    // useEffect(() =>{
    //     setTab(tab)
    // }, []);
     /* <p>Tab</p> */
    /* <div id="tab" dangerouslySetInnerHTML={{__html: " \n \n \n \n \n \n "}} style ={{whiteSpace: "pre-line", fontFamily: "monospace, monospace", backgroundColor: 'lightblue', width: '1000px', overflowX: 'scroll', visibility: ""}}> 
    </div> */
    /* <button onClick={() => downloadTab()}>Download tab</button> */
    //
var multipliers = [1, 1, 1, 1, 1, 1, 1];//[m3, m2, m1c, m1, x, y, jury]
function setMultiplier(index, val) {
    multipliers[index] = val;
}
document.getElementById('m3-value').onchange = setMultiplier(0, document.getElementById('m3-value').value);
document.getElementById('m2-value').onchange = setMultiplier(1, document.getElementById('m2-value').value);
document.getElementById('m1c-value').onchange = setMultiplier(2, document.getElementById('m1c-value').value);
document.getElementById('m1-value').onchange = setMultiplier(3, document.getElementById('m1-value').value);
document.getElementById('allow-x-value').onchange = setMultiplier(4, document.getElementById('allow-x-value').value);
document.getElementById('allow-y-value').onchange = setMultiplier(5, document.getElementById('allow-y-value').value);
document.getElementById('allow-jury-value').onchange = setMultiplier(6, document.getElementById('allow-jury-value').value);


function generatePriority(catagory, x, y, jury){
    let prio = Math.random() *.2 +.9;
    // console.log(prio);
    if (catagory == 'M1') {
        prio*=multipliers[3];
    } else if (catagory == 'M1c'){
        prio*=multipliers[2];        
    } else if (catagory == 'M2'){
        prio*=multipliers[1];
    }
    else {
        prio*=multipliers[0];
    }

    if(x) prio*=multipliers[4];
    if(y) prio*=multipliers[5];
    if(jury) prio*=multipliers[6];
    if(x & !y) prio*=multipliers[5]*1.5;
    if(jury & !x) prio*=multipliers[4]*1.75;
    return prio;
}


class referee {
    constructor(name, catagory, state, X, Y, Jury) {
        this.name = name;
        this.catagory = catagory;
        this.state = state;
        this.X = X;
        this.Y = Y;
        this.Jury = Jury;
        this.prio = generatePriority(catagory, X, Y, Jury);
    }

    incrPrio(val) {
        this.prio += val;
    }

    decrPrio(val) {
        this.prio -= val;
    }
    decrPrioX(val){
        this.prio *=val;
    }
}

// console.log(multipliers);
// console.log(new referee('jim', 'm1', 'tx', true, true, false));

// console.log(document.getElementsByClassName('add-official'));

function addNewLine(){
    console.log('entered add new line')
    var refLines = document.getElementsByClassName('official-info');
    var lastRefLine = refLines[refLines.length-1];
    if (refLines.length >=128) {alert('Too many officials. Not fully supported'); return;}
    var newLine = lastRefLine.cloneNode(true);
    newLine.id = 'official-' + (refLines.length +1) + '-info';
    newLine.childNodes[1].innerHTML = refLines.length +1;
    newLine.childNodes[3].id = 'official-' + (refLines.length +1) + '-name';
    newLine.childNodes[5].id = 'official-' + (refLines.length +1) + '-catagory';
    newLine.childNodes[7].id = 'official-' + (refLines.length +1) + '-state';
    newLine.childNodes[9].id = 'official-' + (refLines.length +1) + '-x';
    newLine.childNodes[11].id = 'official-' + (refLines.length +1) + '-y';
    newLine.childNodes[13].id = 'official-' + (refLines.length +1) + '-jury';
    
    console.log(newLine.childNodes);
    lastRefLine.append(newLine);   
}
function removeLine(){
    console.log('line removed');
    var refLines = document.getElementsByClassName('official-info');
    if (refLines.length <2) return;
    var lastRefLine = refLines[refLines.length-1];
    lastRefLine.remove();
}

document.getElementsByClassName('add-official')[0].onclick = function(){addNewLine()};
document.getElementsByClassName('add-official')[1].onclick = function(){addNewLine()};
document.getElementsByClassName('remove-official')[0].onclick = function(){removeLine()};
document.getElementsByClassName('remove-official')[1].onclick = function(){removeLine()};

function generateArrOfOfficials(){
    let arr = [];
    for (let i = 0; i < document.getElementsByClassName('official-info').length; i++) {
        let i1 = i+1;
        const element = document.getElementById('official-' + i1+'-catagory');
        // console.log(element);
        // let str = document.getElementById('official-' +i1 +'-name').value;
        // str += '   ' +document.getElementById('official-' +i1 +'-catagory').options[element.selectedIndex].text;
        // str += '   ' +document.getElementById('official-' +i1 +'-state').value;
        // str += '   ' +document.getElementById('official-' +i1 +'-x').checked;
        // str += '   ' +document.getElementById('official-' +i1 +'-y').checked;
        // str += '   ' +document.getElementById('official-' +i1 +'-jury').checked;
        // console.log(str);
        let name = document.getElementById('official-' +i1 +'-name').value;
        let cat = document.getElementById('official-' +i1 +'-catagory').options[element.selectedIndex].text;
        let state =document.getElementById('official-' +i1 +'-state').value;
        let x =document.getElementById('official-' +i1 +'-x').checked;
        let y =document.getElementById('official-' +i1 +'-y').checked;
        let jury = document.getElementById('official-' +i1 +'-jury').checked;
    
        arr[i] = new referee(name, cat, state, x, y, jury);
        console.log(arr[i].prio);
    }

    return arr;
}
document.getElementById('generate-lists-btn').onclick = function(){generateArrOfOfficials();}



class Mat {
    constructor(){
        this.officials = new Array(128);
    }

    addOfficial(off){
        for (let i =0; i< this.officials.length; i++ ){
            if (this.officials[i] == null){
                this.officials[i] = off;
                return;
            }            
        }
        this.officials.push(off);
    }

    addOfficialAt(off, index){
        this.officials[index] = off;
    }

    size(){
        let count = 0;
        for (let index = 0; index < this.officials.length; index++) {
            if(this.officials[i] == null) continue;
            count++;
        }
        return count;
    }

    trimArr(){
        let temp =[];
        for (let i of this.officials) {
            i && temp.push(i);
        }
        this.officials = temp;
    }

    matAsDiv(matNum){
        this.trimArr();

        console.log(this.officials);
        matNum += '';
        let div = document.createElement('div');
        let matName =document.createElement('strong');;
        if(matNum.toUpperCase() == 'JURY' || matNum == 0){
            matName.innerHTML = 'Jury';
            matNum = 0;
        } else{
            matName.innerHTML = 'Mat ' + matNum;
        }

        let table = document.createElement('table');

        div.appendChild(matName);
        for (let i =0; i< this.officials.length; i++ ) {
            let row= table.insertRow();
            row.insertCell(0);
            if (i ==0){                
                row.cells[0].innerHTML = 'X';
            } else if(i == 1){
                row.cells[0].innerHTML = 'Y';
            }
            else {
                row.cells[0].innerHTML = ' ';
            }

            row.insertCell(1);
            row.cells[1].innerHTML = this.officials[i].name;

            row.insertCell(2);
            row.cells[2].innerHTML = this.officials[i].state;

            row.insertCell(3);
            row.cells[3].innerHTML = this.officials[i].catagory;
        }
        div.appendChild(table);
        return div;
    }
}



// let mat1 = new Mat('off0');
// let off1 = new referee('Mr Ref 1', 'M1', 'TX', true, false, true);
// let off2 = new referee('Mr Ref 2', 'M1C', 'NY', false, true, false);
// let off3 = new referee('Mr Ref 3', 'M2', 'UT', false, false, false);
// let off4 = new referee('Mr Ref 4', 'M3', 'TN', false, false, false);
// mat1.addOfficial(off1);
// mat1.addOfficial(off2);
// mat1.addOfficialAt(off4, 6);
// mat1.addOfficial(off3);
// document.getElementById('list-1').after(mat1.matAsDiv(2));
let arr = [];
for (let int = 0; int < 24; int++){
    arr.push(new referee('ref '+ int, 'M' +(1+ int%3), 'st' + int, 0==int%3, 1==int%3 || 0==int%6, 0==int%8));
}
console.log(arr);

generateLists(4, 2, arr);


function generateLists(numOfMats, numOfSessions, listOfOfficials){
    for (let i = 1; i <= numOfSessions*1.6; i++) {
        let queue = generateQueue(listOfOfficials);
        let listDiv = document.createElement('div', {id: 'list-' +i}), h4 =document.createElement('h4');
        h4.textContent = 'List ' + i;
        listDiv.appendChild(h4);
        let mats = new Array(numOfMats+1);
        for (let j = 0; j <= numOfMats; j++) {
            mats[j] = new Mat();
        }
        for (let j = 0; j < listOfOfficials.length; j++) {
            var ref = queue.pop();
            mats[j%(numOfMats+1)].addOfficial(ref);
            if(j<listOfOfficials.length*.3){
                ref.decrPrioX(j/(1+listOfOfficials.length*.3));
            }
            ref.incrPrio(2);
        }

        for (let j = 0; j <= numOfMats; j++) {
            listDiv.appendChild(mats[j].matAsDiv(j));            
        }
        document.getElementById('generated-lists').appendChild(listDiv);
        listDiv.append(document.createElement('hr'));
   }
}

function generateQueue(list){
    let queue = new PriorityQueue();
    for (let i = 0; i < list.length; i++) {
        queue.push(list[i], list[i].prio);        
    }
    return queue;
}
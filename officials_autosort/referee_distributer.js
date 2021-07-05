var multipliers = [1, 1, 1, 1, 1, 1, 1, 1];//[m3, m2, m1c, m1, x, y, jury, Pref Mats]
var numberOfMats = document.getElementById('number-mats').value, numberOfSessions = document.getElementById('number-sessions').value;
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
document.getElementById('pref-mat-value').onchange = setMultiplier(7, document.getElementById('pref-mat-value').value);

document.getElementById('number-mats').onchange = function changeMatsValue() {
    numberOfMats = document.getElementById('number-mats').value;
    numberOfMats = Math.ceil(numberOfMats);
    document.getElementById('number-mats').value = numberOfMats;
    if (numberOfMats < 1) {
        numberOfMats = 1;
        document.getElementById('number-mats').value = 1;
    }
    if (numberOfMats > 128) {
        numberOfMats = 128;
        document.getElementById('number-mats').value = 128;
    }
    // console.log(numberOfMats);
}
document.getElementById('number-sessions').onchange = function changeSessionsValue() {
    numberOfSessions = document.getElementById('number-sessions').value;
    numberOfSessions = Math.ceil(numberOfSessions);
    document.getElementById('number-sessions').value = numberOfSessions;
    if (numberOfSessions < 1) {
        numberOfSessions = 1;
        document.getElementById('number-sessions').value = 1;
    }
    if (numberOfSessions > 128) {
        numberOfSessions = 128;
        document.getElementById('number-sessions').value = 128;
    }
    // console.log(numberOfSessions);
}

function generatePriority(catagory, x, y, jury, prefMat){
    let prio = Math.random() *.2 +.9;
    // console.log(prio);
    if (catagory == 'M1') {
        prio*=multipliers[3];
    } else if (catagory == 'M1C'){
        prio*=multipliers[2];        
    } else if (catagory == 'M2'){
        prio*=multipliers[1];
    }
    else {
        prio*=multipliers[0];
    }

    if(prefMat) prio*=multipliers[7];   
    if(x) prio*=multipliers[4];
    if(y) prio*=multipliers[5];
    if(jury) prio*=multipliers[6];
    if(x & !y) prio*=multipliers[5]*1.5;
    if(jury & !x) prio*=multipliers[4]*1.75;
    if(jury & x & !y) prio*=multipliers[5]*1.7;
    return prio;
}


function range(string) {
    // console.log('enter range| range: ' + string);
    if (string.length < 1) return new Set();
    
    function makeRangeSet(string) {
      let arr = [];
      let arr1 = commaSepList(string);
      for (let i = 0; i < arr1.length; i++) {
        const e = arr1[i];
        if (e.includes("-")) {
          let a = dashOperatorList(e);
          a.forEach((elm) => {
            arr.push(elm);
          });
          continue;
        }
        arr.push(Number.parseInt(e, 10));
      }
    //   console.log(arr);
      let s = new Set();
      arr.forEach((element) => {
        s.add(element);
      });
      return s;
    }
  
    function commaSepList(string) {
      let arr = string.split(",");
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (isNaN(Number.parseInt(element, 10)) & !element.includes("-")) {
          arr.splice(i, 1);
          i--;
          continue;
        }
      }
      return arr;
    }
    function dashOperatorList(string) {
      let arr = string.split("-");
      let arrN = [];
      let lowNum = Number.parseInt(arr[0], 10),
        highNum = Number.parseInt(arr[1], 10);
      for (let i = lowNum; i <= highNum; i++) {
        arrN.push(i);
      }
      return arrN;
    }
  
    // function setToString(set) {
    //   let str = "";
    //   set.forEach((e) => {
    //     str += " " + e + ",";
    //   });
    //   return str;
    // }
    let s = makeRangeSet(string);
    return s;
  
  }

class referee {
    constructor(name, catagory, state, X, Y, Jury, prefMat) {
        this.name = name;
        this.catagory = catagory;
        this.state = state;
        this.X = X;
        this.Y = Y;
        this.Jury = Jury;
        this.prefMat = prefMat;
        this.hasPrefMat = prefMat.size > 1 ? true : false;
        this.prio = generatePriority(catagory, X, Y, Jury, this.hasPrefMat);
        // console.log(this);
    }

    canJury() {
        return this.Jury;
    }
    canX() {
        return this.X;
    }
    canY() {
        return this.Y;
    }

    canWorkMat(index){
        if(!this.hasPrefMat) return false;

        // console.log(this.name + ' ' + index);
        // console.log(this.prefMat);
        
        return this.prefMat.has(index);
    }

    regenPrio(){
        this.prio = generatePriority(this.catagory, this.X, this.Y, this.Jury, this.hasPrefMat);
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
    // console.log('entered add new line')
    var refLines = document.getElementsByClassName('official-info');
    var lastRefLine = refLines[refLines.length-1];
    if (refLines.length >=128) {alert('Too many officials. Not fully supported'); return;}
    var newLine = lastRefLine.cloneNode(true);
    newLine.id = 'official-' + (refLines.length +1) + '-info';
    newLine.childNodes[1].innerHTML = properLabelText(refLines.length + 1);
    newLine.childNodes[3].id = 'official-' + (refLines.length +1) + '-name';
    newLine.childNodes[5].id = 'official-' + (refLines.length +1) + '-catagory';
    newLine.childNodes[7].id = 'official-' + (refLines.length +1) + '-state';
    newLine.childNodes[9].id = 'official-' + (refLines.length +1) + '-x';
    newLine.childNodes[11].id = 'official-' + (refLines.length +1) + '-y';
    newLine.childNodes[13].id = 'official-' + (refLines.length +1) + '-jury';
    newLine.childNodes[15].id = 'official-' + (refLines.length +1) + '-pref-mat';
    
    // console.log(newLine.childNodes);
    lastRefLine.append(newLine);   
}
function removeLine(){
    // console.log('line removed');
    var refLines = document.getElementsByClassName('official-info');
    if (refLines.length <2) return;
    var lastRefLine = refLines[refLines.length-1];
    lastRefLine.remove();
}

function properLabelText(number) {
    if (number < 10) {
        return '00' + number;
    }
    if (number < 100) {
        return '0' + number;
    }
}

document.getElementsByClassName('add-official')[0].onclick = function(){addNewLine()};
document.getElementsByClassName('add-official')[1].onclick = function(){addNewLine()};
document.getElementsByClassName('remove-official')[0].onclick = function(){removeLine()};
document.getElementsByClassName('remove-official')[1].onclick = function(){removeLine()};

function generateArrOfOfficials(){
    let arr = [];
    // console.log(document.getElementsByClassName('official-info').length);
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
        let prefMats= document.getElementById('official-' +i1 + '-pref-mat').value;
    
        arr[i] = new referee(name, cat, state, x, y, jury, range(prefMats));
        console.log(arr[i] + range(prefMats));
    }

    return arr;
}




class Mat {
    constructor(){
        this.officials = new Array(128);
        this.officials.forEach(element => {
            element = null;
        });
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
    
    addOfficialStartAt(off, index){
        for (let i =index; i< this.officials.length; i++ ){
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

    hasX(){
        if(this.officials[0]==null) return false;
        return true;
    }
    hasY(){
        if(this.officials[1]==null) return false;
        return true;
    }

    size(){
        let count = 0;
        for (let index = 0; index < this.officials.length; index++) {
            if(this.officials[index] == null) continue;
            count++;
        }
        // console.log('counted on mat: ' + count);
        return count;
    }

    numFromState(state){
        let count = 0;
        for (let index = 0; index < this.officials.length; index++) {
            if(this.officials[index] == null || this.officials[index].state != state) continue;
            count++;
        }
        // console.log('counted on mat ' + count + ' from ' + state);
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

        // console.log(this.officials);
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

    toString(){
        let string = '';
        for (let i =0; i< this.officials.length; i++ ){
            if (this.officials[i] != null){
                string+= this.officials[i].name + '   ';
            }            
        }
        return string;
    }
}




document.getElementById('generate-lists-btn').onclick = function(){
    let offList = generateArrOfOfficials();
    // console.log(offList);
    if (offList.length < 5) {
        alert('List generation failed. Add more officials');
        return;
    }
    generateLists(numberOfMats, numberOfSessions, offList);
}



var iteration = 0, maxIterations = 100;
function generateLists(numOfMats, numOfSessions, listOfOfficials){
    removeAllChildNodes(document.getElementById('generated-lists'));
    for (let i = 1; i <= numOfSessions*1.6; i++) {
        for (let r = 0; i%2==0 & r < listOfOfficials.length; r++) listOfOfficials[0].regenPrio();
        let queue = generateQueue(listOfOfficials);
        let listDiv = document.createElement('div', {id: 'list-' +i}), h4 =document.createElement('h4');
        h4.textContent = 'List ' + i;
        listDiv.appendChild(h4);
        let mats = new Array(numOfMats+1);
        for (let j = 0; j <= numOfMats; j++) {
            mats[j] = new Mat();
        }
        //add to jury

        let jurySize = Math.ceil(listOfOfficials.length * .04);
        // console.log(jurySize);
        for (let j = 0; j < jurySize; j++) {
            var ref = queue.pop();
            // console.log(ref.state + ' count on jury = ' + mats[0].numFromState(ref.state));
            // console.log(ref.name + ' '+ (!ref.hasPrefMat|| ref.canWorkMat(0)));
            if(ref.canJury() && mats[0].numFromState(ref.state) ==0 && (!ref.hasPrefMat|| ref.canWorkMat(0)) ){
                mats[0].addOfficial(ref);
                // console.log('add ' + ref.name + ' to jury');
                ref.decrPrioX(.6);
                continue;
            }
            j--;
            // console.log(ref);
            // console.log(ref + ' ref');
            ref.decrPrioX(.9);
            queue.push(ref, ref.prio);
        }
        // console.log('Jury: ' + mats[0].toString());

        let matNum = 1;
        iteration = 0, maxIterations = queue.getSize()*2;
        while(queue.getSize() > 0){
            // console.log('mat num = ' +matNum + '    queue size = ' + queue.getSize());
            let ref = queue.pop();
            // console.log(ref.name + ' '+ matNum + ' '+(!ref.hasPrefMat|| ref.canWorkMat(matNum)));
            if (ref.hasPrefMat && !ref.canWorkMat(matNum)) {
                ref.decrPrioX(.85);
                queue.push(ref, ref.prio);
                iteration+=.5;
                if (maxIterations - iteration > 0) {
                    continue;
                }
                console.log('mat pref failed on iterations ' + iteration);
            }
            var boolPlacedOnMat = refToMat(ref, mats[matNum], maxIterations - iteration);
            if(boolPlacedOnMat){
                // console.log('placed on mat = ' + matNum);
                ref.decrPrioX(numOfMats*.05 *matNum);
                // console.log('total num of mats ' +numOfMats);
                matNum++;
                if(matNum > numOfMats) matNum = 1;
                iteration+=.625;
                // console.log('move to mat = ' +matNum + '    queue size = ' + queue.getSize());
            } else {
                ref.decrPrioX(.7);
                queue.push(ref, ref.prio);
                iteration++;
                // console.log(ref.name +' did not find a place on mat ' + matNum);
                // console.log('iterations = ' + iteration + '   max iterations = ' + maxIterations);
                if(queue.getSize() <= 4) iteration+=4;
            }
        }
        // console.log('exited while loop# ' + i);

        listOfOfficials.forEach(element => {
            // console.log(element.name + ' prio = ' + element.prio);
            element.incrPrio(3);
            element.decrPrioX(1.4);
            // console.log(element);
            // console.log(element.name + ' prio = ' + element.prio);
        });

        // for (let j = 0; j <= numOfMats; j++) {
        //     listDiv.appendChild(mats[j].matAsDiv(j));            
        // }
        

        listDiv.appendChild(mats[0].matAsDiv(0));

        for (let j = 1; j < mats.length; j+=2) {
            const e1 = mats[j].matAsDiv(j);
            let parentDiv = document.createElement('div');
                parentDiv.className = 'mats-pair';
                parentDiv.appendChild(e1);
            if(j < mats.length -1){
                const e2 = mats[j+1].matAsDiv(j+1);
                parentDiv.appendChild(e2);
            }
            listDiv.appendChild(parentDiv);
        }
        document.getElementById('generated-lists').appendChild(listDiv);
        listDiv.append(document.createElement('hr'));
        // console.log(listOfOfficials);
   }
}

function refToMat(official, mat, iterationsLeft){
    // console.log('entered refToMat: ' + official.name + ' mat size = ' +mat.size() + '  from state = ' + mat.numFromState(official.state));
    
    if (iterationsLeft >= -1 && mat.size() < mat.numFromState(official.state) * 4.5) {
        // console.log('too many from state ' + official.state);
        return false;
    }
    
    if(official.canX() && !mat.hasX()){
        mat.officials[0] = official;
        // console.log(official.name + 'is X')
        return true;
    }
    if(official.canY() && !mat.hasY()){
        mat.officials[1] = official;
        // console.log(official.name + 'is Y')
        return true;
    }

    // if( official.canJury() & official.canX() & !official.canY()){
    //     official.decrPrioX(2);
    // }

    switch (official.catagory) {
        case 'M1':
            mat.addOfficialStartAt(official, 4);
            return true;

        case 'M1C':
            mat.addOfficialStartAt(official, 32);
            return true;

        case 'M2':
            mat.addOfficialStartAt(official, 64);
            return true;

        case 'M3':
            mat.addOfficialStartAt(official, 80);
            return true;
    }
    console.log(official.name + 'did not find a spot on this mat || Cat: ' + official.catagory);
    return false;
}

function generateQueue(list){
    let queue = new PriorityQueue();
    for (let i = 0; i < list.length; i++) {
        queue.push(list[i], list[i].prio);        
    }
    return queue;
}

function removeAllChildNodes(par){
    // console.log('clearing ' + par)
    while (par.firstChild) {
        // console.log('remove: ' + par.firstChild);
        par.removeChild(par.firstChild);
    }
}


//test data set
let arr = [45];
if(true){
let off00 = new referee('Mr Ref 00', 'M1', '01', true, false, true, range('0, 1, 2'));

let off01 = new referee('Mr Ref 01', 'M1', '01', true, false, true, range('0-4'));
let off02 = new referee('Mr Ref 02', 'M1', '05', true, false, true, range('0-5'));
let off03 = new referee('Mr Ref 03', 'M1', '08', true, false, true, range('0-4'));
let off04 = new referee('Mr Ref 04', 'M1', '11', true, false, true, range(''));

let off05 = new referee('Mr Ref 05', 'M1', '06', true, false, true, range(''));
let off06 = new referee('Mr Ref 06', 'M1', '04', true, false, true, range(''));
let off07 = new referee('Mr Ref 07', 'M1', '17', true, true, true, range(''));
let off08 = new referee('Mr Ref 08', 'M1', '07', true, true, true, range(''));

let off09 = new referee('Mr Ref 09', 'M1', '09', true, true, false, range('1,2,4,5,8'));
let off10 = new referee('Mr Ref 10', 'M1', '12', true, true, false, range('5-10'));
let off11 = new referee('Mr Ref 11', 'M1', '01', true, true, false, range('4-9'));
let off12 = new referee('Mr Ref 12', 'M1', '15', true, true, false, range(''));

let off13 = new referee('Mr Ref 13', 'M1', '02', true, true, false, range(''));
let off14 = new referee('Mr Ref 14', 'M1', '14', true, true, false, range(''));
let off15 = new referee('Mr Ref 15', 'M1', '18', true, true, false, range(''));
let off16 = new referee('Mr Ref 16', 'M1', '03', true, true, false, range(''));

let off17 = new referee('Mr Ref 17', 'M1', '16', true, true, false, range(''));
let off18 = new referee('Mr Ref 18', 'M1', '10', true, true, false, range(''));
let off19 = new referee('Mr Ref 19', 'M1', '01', true, true, false, range(''));
let off20 = new referee('Mr Ref 20', 'M1', '02', true, true, false, range(''));

let off21 = new referee('Mr Ref 21', 'M1', '08', true, true, false, range(''));
let off22 = new referee('Mr Ref 22', 'M1', '14', true, true, false, range(''));
let off23 = new referee('Mr Ref 23', 'M1', '18', false, true, false, range(''));
let off24 = new referee('Mr Ref 24', 'M1', '15', false, true, false, range(''));

let off25 = new referee('Mr Ref 25', 'M1C', '12', false, true, false, range(''));
let off26 = new referee('Mr Ref 26', 'M1C', '17', false, true, false, range(''));
let off27 = new referee('Mr Ref 27', 'M1C', '06', false, true, false, range(''));
let off28 = new referee('Mr Ref 28', 'M1C', '04', false, true, false, range(''));

let off29 = new referee('Mr Ref 29', 'M1C', '16', false, false, false, range(''));
let off30 = new referee('Mr Ref 30', 'M1C', '05', false, false, false, range(''));
let off31 = new referee('Mr Ref 31', 'M1C', '01', false, false, false, range(''));
let off32 = new referee('Mr Ref 32', 'M1C', '03', false, false, false, range(''));

let off33 = new referee('Mr Ref 33', 'M1C', '07', false, false, false, range(''));
let off34 = new referee('Mr Ref 34', 'M2', '10', false, false, false, range(''));
let off35 = new referee('Mr Ref 35', 'M2', '11', false, false, false, range(''));
let off36 = new referee('Mr Ref 36', 'M2', '09', false, false, false, range(''));

let off37 = new referee('Mr Ref 37', 'M2', '01', false, false, false, range(''));
let off38 = new referee('Mr Ref 38', 'M2', '05', false, false, false, range(''));
let off39 = new referee('Mr Ref 39', 'M2', '03', false, false, false, range(''));
let off40 = new referee('Mr Ref 40', 'M3', '01', false, false, false, range(''));

let off41 = new referee('Mr Ref 41', 'M3', '15', false, false, false, range(''));
let off42 = new referee('Mr Ref 42', 'M3', '18', false, false, false, range(''));
let off43 = new referee('Mr Ref 43', 'M3', '02', false, false, false, range(''));
let off44 = new referee('Mr Ref 44', 'M3', '17', false, false, false, range(''));

arr[00] = off00;
arr[01] = off01;
arr[02] = off02;
arr[03] = off03;
arr[04] = off04;

arr[05] = off05;
arr[06] = off06;
arr[07] = off07;
arr[08] = off08;

arr[09] = off09;
arr[10] = off10;
arr[11] = off11;
arr[12] = off12;

arr[13] = off13;
arr[14] = off14;
arr[15] = off15;
arr[16] = off16;

arr[17] = off17;
arr[18] = off18;
arr[19] = off19;
arr[20] = off20;

arr[21] = off21;
arr[22] = off22;
arr[23] = off23;
arr[24] = off24;

arr[25] = off25;
arr[26] = off26;
arr[27] = off27;
arr[28] = off28;

arr[29] = off29;
arr[30] = off30;
arr[31] = off31;
arr[32] = off32;

arr[33] = off33;
arr[34] = off34;
arr[35] = off35;
arr[36] = off36;

arr[37] = off37;
arr[38] = off38;
arr[39] = off39;
arr[40] = off40;

arr[41] = off41;
arr[42] = off42;
arr[43] = off43;
arr[44] = off44;
}
document.getElementById('generate-test-btn').onclick = function() {
    console.log(arr);
    generateLists(numberOfMats, numberOfSessions, arr);
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

// for (let int = 0; int < 24; int++){
//     arr.push(new referee('ref '+ int, 'M' +(1+ int%3), 'st' + int, 0==int%3, 1==int%3 || 0==int%6, 0==int%8));
// }
// console.log(arr);
// generateLists(4, 2, arr);

// console.log(arr);

// generateLists(8, 1, arr);
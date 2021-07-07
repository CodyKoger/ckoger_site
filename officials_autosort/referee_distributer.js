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

function generatePriority(catagory, x, y, jury, prefMat) {
    let prio = Math.random() * .2 + .9;
    // console.log(prio);
    if (catagory == 'M1') {
        prio *= multipliers[3];
    } else if (catagory == 'M1C') {
        prio *= multipliers[2];
    } else if (catagory == 'M2') {
        prio *= multipliers[1];
    }
    else {
        prio *= multipliers[0];
    }

    if (prefMat) prio *= multipliers[7];
    if (x) prio *= multipliers[4];
    if (y) prio *= multipliers[5];
    if (jury) prio *= multipliers[6];
    if (x & !y) prio *= multipliers[5] * 1.5;
    if (jury & !x) prio *= multipliers[4] * 1.75;
    if (jury & x & !y) prio *= multipliers[5] * 1.7;
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

    canWorkMat(index) {
        if (!this.hasPrefMat) return false;

        // console.log(this.name + ' ' + index);
        // console.log(this.prefMat);

        return this.prefMat.has(index);
    }

    preferedMats() {
        return Array.from(this.prefMat).join(', ')
    }

    regenPrio() {
        this.prio = generatePriority(this.catagory, this.X, this.Y, this.Jury, this.hasPrefMat);
    }

    incrPrio(val) {
        this.prio += val;
    }

    decrPrio(val) {
        this.prio -= val;
    }
    decrPrioX(val) {
        this.prio *= val;
    }
}

// console.log(multipliers);
// console.log(new referee('jim', 'm1', 'tx', true, true, false));

// console.log(document.getElementsByClassName('add-official'));
document.getElementsByClassName('officials-input')[0].appendChild(lineDiv(1));
function addNewLine() {
    // console.log('entered add new line')
    var refLines = document.getElementsByClassName('officials-input')[0].children;
    // console.log(refLines);
    if (refLines.length >= 256) { alert('Too many officials. Not fully supported'); return; }
    document.getElementsByClassName('officials-input')[0].appendChild(lineDiv(refLines.length + 1));

    // console.log(newLine.childNodes);
    // console.log(refLines)
}
//selected Index: M1 = 3; M1C = 2; M2 = 1; M3 = 0
function addNewLineData(name, catIndex, state, x, y, jury, prefMat) {
    // console.log('entered add new line')
    var refLines = document.getElementsByClassName('officials-input')[0].children;
    if (refLines.length >= 256) { alert('Too many officials. Not fully supported'); return; }
    let i = refLines.length + 1;

    document.getElementsByClassName('officials-input')[0].appendChild(lineDiv(refLines.length + 1));

    document.getElementById('official-' + i + '-name').value = name;
    document.getElementById('official-' + i + '-catagory').selectedIndex = catIndex;
    document.getElementById('official-' + i + '-state').value = state;
    document.getElementById('official-' + i + '-x').checked = x;
    document.getElementById('official-' + i + '-y').checked = y;
    document.getElementById('official-' + i + '-jury').checked = jury;
    document.getElementById('official-' + i + '-pref-mat').value = prefMat;
}
function removeLine() {
    // console.log('line removed');
    var refLines = document.getElementsByClassName('official-info');
    if (refLines.length < 2) return;
    var lastRefLine = refLines[refLines.length - 1];
    lastRefLine.remove();
}
function setLineData(lineNum, name, catIndex, state, x, y, jury, prefMat) {

    document.getElementById('official-' + lineNum + '-name').value = name;
    document.getElementById('official-' + lineNum + '-catagory').selectedIndex = catIndex;
    document.getElementById('official-' + lineNum + '-state').value = state;
    document.getElementById('official-' + lineNum + '-x').checked = x;
    document.getElementById('official-' + lineNum + '-y').checked = y;
    document.getElementById('official-' + lineNum + '-jury').checked = jury;
    document.getElementById('official-' + lineNum + '-pref-mat').value = prefMat;
}
function clearData() {
    // console.log(document.getElementsByClassName('officials-input')[0].children)
    let div = document.getElementsByClassName('officials-input')[0].children;

    while (div.length > 0) {
        let divChild = div[0];
        divChild.parentNode.removeChild(divChild);
    }

    document.getElementsByClassName('officials-input')[0].appendChild(lineDiv(1));
}

function lineDiv(index) {
    let newDiv = document.createElement('div');
    newDiv.className = 'official-info';
    newDiv.id = 'official-' + index + '-info';

    var child = document.createElement('label');//label
    child.textContent = properLabelText(index);
    newDiv.appendChild(child);

    child = document.createElement('input');//name
    child.type = 'text';
    child.name = 'official-name';
    child.placeholder = 'Name';
    child.id = 'official-' + index + '-name';
    newDiv.appendChild(child);

    child = document.createElement('select');//catagory
    child.id = 'official-' + index + '-catagory';
    child.name = 'official-catagory';
    var opts = [document.createElement('option'), document.createElement('option'),
    document.createElement('option'), document.createElement('option')];
    opts[0].text = 'M3';
    opts[1].text = 'M2';
    opts[2].text = 'M1C';
    opts[3].text = 'M1';
    child.add(opts[0]); child.add(opts[1]); child.add(opts[2]); child.add(opts[3]);
    newDiv.appendChild(child);

    child = document.createElement('input');//state
    child.type = 'text';
    child.name = 'official-state';
    child.placeholder = 'State';
    child.id = 'official-' + index + '-state';
    child.oninput = 'this.value = this.value.toUpperCase()';
    newDiv.appendChild(child);

    child = document.createElement('input');//X
    child.type = 'checkbox';
    child.name = 'official-x';
    child.id = 'official-' + index + '-x';
    newDiv.appendChild(child);

    child = document.createElement('input');//Y
    child.type = 'checkbox';
    child.name = 'official-y';
    child.id = 'official-' + index + '-y';
    newDiv.appendChild(child);

    child = document.createElement('input');//Jury
    child.type = 'checkbox';
    child.name = 'official-jury';
    child.id = 'official-' + index + '-jury';
    newDiv.appendChild(child);

    child = document.createElement('input');//Preferred Mats
    child.type = 'text';
    child.name = 'official-pref-mat';
    child.id = 'official-' + index + '-pref-mat';
    child.placeholder = 'Mats'
    newDiv.appendChild(child);

    return newDiv;
}

function properLabelText(number) {
    if (number < 10) {
        return '00' + number;
    }
    if (number < 100) {
        return '0' + number;
    }
}

document.getElementsByClassName('add-official')[0].onclick = function () { addNewLine() };
document.getElementsByClassName('add-official')[1].onclick = function () { addNewLine() };
document.getElementsByClassName('remove-official')[0].onclick = function () { removeLine() };
document.getElementsByClassName('remove-official')[1].onclick = function () { removeLine() };
document.getElementsByClassName('clear-data')[0].onclick = function () { clearData() };
document.getElementsByClassName('clear-data')[1].onclick = function () { clearData() };

function generateArrOfOfficials() {
    let arr = [];
    // console.log(document.getElementsByClassName('official-info').length);
    for (let i = 0; i < document.getElementsByClassName('official-info').length; i++) {
        let i1 = i + 1;
        const element = document.getElementById('official-' + i1 + '-catagory');
        // console.log(element);
        let name = document.getElementById('official-' + i1 + '-name').value;
        let cat = document.getElementById('official-' + i1 + '-catagory').options[element.selectedIndex].text;
        let state = document.getElementById('official-' + i1 + '-state').value;
        let x = document.getElementById('official-' + i1 + '-x').checked;
        let y = document.getElementById('official-' + i1 + '-y').checked;
        let jury = document.getElementById('official-' + i1 + '-jury').checked;
        let prefMats = document.getElementById('official-' + i1 + '-pref-mat').value;

        arr[i] = new referee(name, cat, state, x, y, jury, range(prefMats));
        // console.log(arr[i] + range(prefMats));
    }

    return arr;
}

class Mat {
    constructor() {
        this.officials = new Array(128);
        this.officials.forEach(element => {
            element = null;
        });
    }

    addOfficial(off) {
        for (let i = 0; i < this.officials.length; i++) {
            if (this.officials[i] == null) {
                this.officials[i] = off;
                return;
            }
        }
        this.officials.push(off);
    }

    addOfficialStartAt(off, index) {
        for (let i = index; i < this.officials.length; i++) {
            if (this.officials[i] == null) {
                this.officials[i] = off;
                return;
            }
        }
        this.officials.push(off);
    }

    addOfficialAt(off, index) {
        this.officials[index] = off;
    }

    hasX() {
        if (this.officials[0] == null) return false;
        return true;
    }
    hasY() {
        if (this.officials[1] == null) return false;
        return true;
    }

    size() {
        let count = 0;
        for (let index = 0; index < this.officials.length; index++) {
            if (this.officials[index] == null) continue;
            count++;
        }
        // console.log('counted on mat: ' + count);
        return count;
    }

    numFromState(state) {
        let count = 0;
        for (let index = 0; index < this.officials.length; index++) {
            if (this.officials[index] == null || this.officials[index].state != state) continue;
            count++;
        }
        // console.log('counted on mat ' + count + ' from ' + state);
        return count;
    }

    trimArr() {
        let temp = [];
        for (let i of this.officials) {
            i && temp.push(i);
        }
        this.officials = temp;
    }

    matAsDiv(matNum) {
        this.trimArr();

        // console.log(this.officials);
        matNum += '';
        let div = document.createElement('div');
        let matName = document.createElement('strong');;
        if (matNum.toUpperCase() == 'JURY' || matNum == 0) {
            matName.innerHTML = 'Jury';
            matNum = 0;
        } else {
            matName.innerHTML = 'Mat ' + matNum;
        }

        let table = document.createElement('table');

        div.appendChild(matName);
        for (let i = 0; i < this.officials.length; i++) {
            let row = table.insertRow();
            row.insertCell(0);
            if (i == 0) {
                row.cells[0].innerHTML = 'X';
            } else if (i == 1) {
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

    toString() {
        let string = '';
        for (let i = 0; i < this.officials.length; i++) {
            if (this.officials[i] != null) {
                string += this.officials[i].name + '   ';
            }
        }
        return string;
    }
}

document.getElementById('generate-lists-btn').onclick = function () {
    let offList = generateArrOfOfficials();
    // console.log(offList);
    if (offList.length < 5) {
        alert('List generation failed. Add more officials');
        return;
    }
    generateLists(numberOfMats, numberOfSessions, offList);
}

var iteration = 0, maxIterations = 100;
function generateLists(numOfMats, numOfSessions, listOfOfficials) {
    removeAllChildNodes(document.getElementById('generated-lists'));
    // console.log(listOfOfficials)
    // console.log(numOfMats)
    // console.log(numOfSessions)
    let juryOn = document.getElementById('jury-check').checked;
    for (let i = 1; i <= numOfSessions * 1.6; i++) {
        for (let r = 0; i % 2 == 0 & r < listOfOfficials.length; r++) listOfOfficials[0].regenPrio();
        let queue = generateQueue(listOfOfficials);
        let listDiv = document.createElement('div', { id: 'list-' + i }), h4 = document.createElement('h4');
        h4.textContent = 'List ' + i;
        listDiv.appendChild(h4);
        let mats = new Array(numOfMats + 1);
        for (let j = 0; j <= numOfMats; j++) {
            mats[j] = new Mat();
        }
        //add to jury

        let jurySize = Math.ceil(listOfOfficials.length * .04);
        // console.log(jurySize);
        for (let j = 0; j < jurySize & juryOn; j++) {
            var ref = queue.pop();
            // console.log(ref.state + ' count on jury = ' + mats[0].numFromState(ref.state));
            // console.log(ref.name + ' '+ (!ref.hasPrefMat|| ref.canWorkMat(0)));
            if (ref.canJury() && mats[0].numFromState(ref.state) == 0 && (!ref.hasPrefMat || ref.canWorkMat(0))) {
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
        iteration = 0, maxIterations = queue.getSize() * 2;
        while (queue.getSize() > 0) {
            // console.log('mat num = ' +matNum + '    queue size = ' + queue.getSize());
            let ref = queue.pop();
            // console.log(ref.name + ' '+ matNum + ' '+(!ref.hasPrefMat|| ref.canWorkMat(matNum)));
            if (ref.hasPrefMat && !ref.canWorkMat(matNum)) {
                ref.decrPrioX(.85);
                queue.push(ref, ref.prio);
                iteration += .5;
                if (maxIterations - iteration > 0) {
                    continue;
                }
                // console.log('mat pref failed on iterations ' + iteration);
            }
            var boolPlacedOnMat = refToMat(ref, mats[matNum], maxIterations - iteration);
            if (boolPlacedOnMat) {
                // console.log('placed on mat = ' + matNum);
                ref.decrPrioX(numOfMats * .05 * matNum);
                // console.log('total num of mats ' +numOfMats);
                matNum++;
                if (matNum > numOfMats) matNum = 1;
                iteration += .625;
                // console.log('move to mat = ' +matNum + '    queue size = ' + queue.getSize());
            } else {
                ref.decrPrioX(.7);
                queue.push(ref, ref.prio);
                iteration++;
                // console.log(ref.name +' did not find a place on mat ' + matNum);
                // console.log('iterations = ' + iteration + '   max iterations = ' + maxIterations);
                if (queue.getSize() <= 4) iteration += 4;
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


        if (juryOn) listDiv.appendChild(mats[0].matAsDiv(0));

        for (let j = 1; j < mats.length; j += 2) {
            const e1 = mats[j].matAsDiv(j);
            let parentDiv = document.createElement('div');
            parentDiv.className = 'mats-pair';
            parentDiv.appendChild(e1);
            if (j < mats.length - 1) {
                const e2 = mats[j + 1].matAsDiv(j + 1);
                parentDiv.appendChild(e2);
            }
            listDiv.appendChild(parentDiv);
        }
        document.getElementById('generated-lists').appendChild(listDiv);
        listDiv.append(document.createElement('hr'));
        // console.log(listOfOfficials);
    }
}

function refToMat(official, mat, iterationsLeft) {
    // console.log('entered refToMat: ' + official.name + ' mat size = ' +mat.size() + '  from state = ' + mat.numFromState(official.state));

    if (iterationsLeft >= -1 && mat.size() < mat.numFromState(official.state) * 4.5) {
        // console.log('too many from state ' + official.state);
        return false;
    }

    if (official.canX() && !mat.hasX()) {
        mat.officials[0] = official;
        // console.log(official.name + 'is X')
        return true;
    }
    if (official.canY() && !mat.hasY()) {
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

function generateQueue(list) {
    let queue = new PriorityQueue();
    for (let i = 0; i < list.length; i++) {
        queue.push(list[i], list[i].prio);
    }
    return queue;
}

function removeAllChildNodes(par) {
    // console.log('clearing ' + par)
    while (par.firstChild) {
        // console.log('remove: ' + par.firstChild);
        par.removeChild(par.firstChild);
    }
}

// console.log(testSet00);

function importJSONTestSet(param) {
    // console.log(param);
    let arr = new Array();
    for (let i = 0; i < param.length; i++) {
        const e = param[i];
        arr[i] = new referee(e.name, e.catagory, e.state, e.canX, e.canY, e.canJury, range(new String(e.allowedMats)))

    }
    // console.log(arr);
    return arr;
}
var testARR00 = importJSONTestSet(testSet00);

document.getElementById('generate-test-btn').onclick = function () {
    // console.log(testARR00);
    generateLists(numberOfMats, numberOfSessions, testARR00);
}
document.getElementById('inport-test-inputs').onclick = function () {
    console.log(testARR00);
    let elm = testARR00[0];
    setLineData(1, elm.name, 3, elm.state, elm.canX(), elm.canY(), elm.canJury, elm.preferedMats());
    for (let i = 1; i < testARR00.length; i++) {
        const e = testARR00[i];
        let cat;
        switch (e.catagory) {
            case 'M1':
                cat = 3;
                break;

            case 'M1C':
                cat = 2;
                break;
            case 'M2':
                cat = 1;
                break;
            default:
                cat = 0;
                break;
        }
        addNewLineData(e.name, cat, e.state, e.canX(), e.canY(), e.canJury(), e.preferedMats());
    }
}

function submitCSVFile(PapaOBJ) {
    // console.log(PapaOBJ.data);

    let dataSet = PapaOBJ.data;

    function findVal(obj, prop) {
        prop = (prop + "").toLowerCase();
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && prop == 
                (p + "").toLowerCase()) {
                return obj[p];
            }
        }
    }

    function getCat(c) {
        switch (c.toUpperCase()) {
            case 'M1':
                return 3;
            case 'M1C':
                return 2;
            case 'M2':
                return 1;
            default:
                return 0;
        }
    }

    let ele = dataSet[0];
    // console.log(ele)
    setLineData(1, findVal(ele, 'name'), getCat(findVal(ele, 'catagory')), findVal(ele, 'state'),false, false, false, '');

    
    for (let i = 1; i < dataSet.length; i++) {
        
        const e = dataSet[i];
        // console.log(e)
        addNewLineData(findVal(e, 'name'),  getCat(findVal(e, 'catagory')), findVal(e, 'state'),false, false, false, '');
        
    }
}
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
    if (catagory == 'm1') {
        prio*=multipliers[3];
    } else if (catagory == 'm1c'){
        prio*=multipliers[2];        
    } else if (catagory == 'm2'){
        prio*=multipliers[1];
    }
    else {
        prio*=multipliers[0];
    }

    if(x) prio*=multipliers[4];
    if(y) prio*=multipliers[5];
    if(jury) prio*=multipliers[6];
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
}

// console.log(multipliers);
// console.log(new referee('jim', 'm1', 'tx', true, true, false));

console.log(document.getElementsByClassName('add-official'));

function addNewLine(){
    console.log('entered add new line')
}
function removeLine(){
    console.log('line removed')
}

document.getElementsByClassName('add-official')[0].onclick = function(){addNewLine()};
document.getElementsByClassName('add-official')[1].onclick = function(){addNewLine()};
document.getElementsByClassName('remove-official')[0].onclick = function(){removeLine()};
document.getElementsByClassName('remove-official')[1].onclick = function(){removeLine()};
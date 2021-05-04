const root = 1;
const parent = a => (a >>> 1);  //shift number right 1 bit   eg:  0010 1011 >>> 1   =  0001 0101  ==> 43 >>> 1 = 21   ==> x>>>1 = x/2
const leftChild = a => a << 1;   //shift number left 1 bit   eg:  0010 1011 << 1   =  0101 0110  ==> 43 << 1 = 86   ==> x<<1 = 2x
const rightChild = a => (a << 1) +1;

class PriorityQueue {
    constructor(){
        this.heapArr = [[null]];
    }

    getSize(){
        return this.heapArr.length -1;
    }

    peek(){
        return this.heapArr[root][0];
    }


    pop(){
        let topPriority = this.heapArr[root][0];
        this.heapArr[root] = this.heapArr.pop();
        this.siftDown();
        return topPriority;
    }

    push(item, priority){
        
        this.heapArr.push([item, priority]);
        if(this.getSize() == 0){
            return;
        }

        this.siftUp();
    }

    getPriority(index){
        return this.heapArr[index][1];
    }


    siftUp(){
        let index = this.heapArr.length-1;
        const val = this.getPriority(index);
        while(index > root && val > this.getPriority(parent(index))){
            [this.heapArr[parent(index)], this.heapArr[index]] = [this.heapArr[index], this.heapArr[parent(index)]];
            index = parent(index);
        }
    }

    siftDown(){
        if(this.heapArr.length <= 2) return;
        let index = root;
        let val = this.getPriority(index);
        while(index < this.heapArr.length -1){
            if(leftChild(index) >= this.heapArr.length) return; //exits siftDown() when there is no left child
            if(rightChild(index) >= this.heapArr.length){
                if(this.getPriority(leftChild(index)) > val)
                    [this.heapArr[index], this.heapArr[leftChild(index)]] = [this.heapArr[leftChild(index)], this.heapArr[index]];
                return; //exit siftDown() when no right child and swap left child and parent if needed 
            }
            
            let biggerChild = (this.getPriority(leftChild(index)) > this.getPriority(rightChild(index))) ? leftChild(index) : rightChild(index);

            if(this.getPriority(biggerChild) <= val) return;

            [this.heapArr[index], this.heapArr[biggerChild]] = [this.heapArr[biggerChild], this.heapArr[index]];
            
            index = biggerChild;
        }
    }

    toString(){
        let string = '[ ';
        string+= this.heapArr[1][0].toString() + ': ' + this.heapArr[1][1];
        for(let i = 2; i< this.heapArr.length; i++){
            string+=  ', ' +this.heapArr[i][0].toString() + ': ' + this.heapArr[i][1] ;

        }
        string += ']';
        return string;
    }

    toTreeStructureString(){
        let tree = '';
        function treeify(index, array) {
            tree += '\n-';
            let i = index;
            while (i>>>1 >0) {tree+='-';i=i>>>1;}
            tree += '['+array[index]+']';
            if(leftChild(index) >= array.length-1) return;
            else{
                treeify(leftChild(index), array);
            }

            if (rightChild(index) >= array.length -1) return;
            else{
                treeify(rightChild(index), array);                
            }
        }
        treeify(root, this.heapArr);
        return tree;
    }
}

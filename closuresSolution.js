let counter = function (increment) {
    // each counter gets its own private count:
    let count = 0;

    // return a closure that updates and returns the count
    return function () {
        count += increment;
        return count;
    };
};

let countByTwo = counter(2); // adds 2 each call
let countByOne = counter(1); // adds 1 each call

// DO NOT change the lines below
console.log(countByTwo()); // 2
console.log(countByOne()); // 1
console.log(countByTwo()); // 4
console.log(countByOne()); // 2
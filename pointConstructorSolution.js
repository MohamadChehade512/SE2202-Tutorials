// Create a template object (prototype) for a 2D point
let PointPrototype = {
    // properties for coordinates (default to 0)
    x: 0,
    y: 0,

    /*
    Make a property called print that contains a function
    that prints: "(" + [x] + ", " + [y] + ")"
    */
    print: function () {
        console.log("(" + this.x + ", " + this.y + ")");
    }
};

// Function that creates a point object using the prototype
function createPoint(x, y) {
    // Create a new object whose prototype is PointPrototype
    const p = Object.create(PointPrototype);
    p.x = x;
    p.y = y;
    return p;
}

// test the prototype-based objects
// do not change
let p1 = createPoint(3, 4);
p1.print();
p1 = createPoint(10, 15);
p1.print();
p1 = createPoint(-2, 8);
p1.print();

// Now create a constructor function version
function Point(x, y) {
    /*
    Constructor to be called with new to produce
    objects with x and y defined similarly to createPoint.

    print is an instance method (on each object),
    and should use `this` to access coordinates.
    */
    this.x = x;
    this.y = y;

    this.print = function () {
        console.log("(" + this.x + ", " + this.y + ")");
    };
}

/* Test creating objects with the constructor Point.
   The x and y values should match the createPoint tests above. */
let p2 = new Point(3, 4);
p2.print();
p2 = new Point(10, 15);
p2.print();
p2 = new Point(-2, 8);
p2.print();

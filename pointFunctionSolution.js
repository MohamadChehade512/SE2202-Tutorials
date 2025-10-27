function Point(x, y) {
    // Definition from Task 1 (constructor + print)
    this.x = x;
    this.y = y;

    this.print = function () {
        console.log("(" + this.x + ", " + this.y + ")");
    };

    // Returns a NEW Point that is the midpoint between this and p2
    // (x, y) = ((x1 + x2)/2, (y1 + y2)/2)
    this.midpoint = function (p2) {
        const mx = (this.x + p2.x) / 2;
        const my = (this.y + p2.y) / 2;
        return new Point(mx, my);
    };

    // Returns a NEW Point that is the interpolation of this toward p2 by factor s
    // (x, y) = (x1 + (x2 - x1)*s, y1 + (y2 - y1)*s)
    this.scaleTo = function (p2, s) {
        const nx = this.x + (p2.x - this.x) * s;
        const ny = this.y + (p2.y - this.y) * s;
        return new Point(nx, ny);
    };
}

/* Do not change the lines below */
let p1 = new Point(1, 5);
let p2 = new Point(5, 7);
p1.midpoint(p2).print(); // expect (3, 6)
p2.midpoint(p1).print(); // expect (3, 6)

/* Do not change the lines below */
let p3 = new Point(0, 0);
let p4 = new Point(4, 8);
p3.scaleTo(p4, 0.25).print(1, 2); // expect (1, 2)
p4.scaleTo(p3, 0.75).print();     // expect (1, 2)
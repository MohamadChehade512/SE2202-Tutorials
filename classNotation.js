/**
 * Class Version
 * Recreates the Course and Assignment concepts using ES6 classes.
 * Output matches plainObjects.js.
 */

// ----------------- Assignment Class -----------------

class Assignment {
    // Sets up a new Assignment object
    constructor(title, dueDate) {
        this.title = title;
        this.dueDate = dueDate;
    }

    // Prints assignment details
    printAssignment() {
        console.log("   Title: " + this.title + " | Due Date: " + this.dueDate);
    }
}

// ----------------- Course Class -----------------

class Course {
    // Sets up a new Course object
    constructor(courseName, instructor, creditHours, assignments) {
        this.courseName = courseName;
        this.instructor = instructor;
        this.creditHours = creditHours;
        this.assignments = assignments; // array of Assignment objects
    }

    // Prints course and its assignments
    courseInfo() {
        console.log(
            "Course: " + this.courseName +
            " | Instructor: " + this.instructor +
            " | Credit Hours: " + this.creditHours
        );
        console.log("Assignments >>>");
        for (let a of this.assignments) {
            a.printAssignment();
        }
    }
}

// ----------------- Create Assignment Objects -----------------

let a1 = new Assignment("Project Proposal", "Jan 15");
let a2 = new Assignment("Midterm Report", "Feb 20");
let a3 = new Assignment("Final Report", "Mar 30");
let a4 = new Assignment("Presentation", "Apr 10");

// ----------------- Create Course Objects -----------------

let c1 = new Course("Software Engineering", "Dr. Pepper", 3, [a1, a2]);
let c2 = new Course("Data Science", "Dr. Evil", 6, [a3, a4]);

// ----------------- Print Output -----------------
c1.courseInfo();
c2.courseInfo();
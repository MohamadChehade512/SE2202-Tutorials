// assignmentManager.js

// =========================
// Assignment Class
// =========================
class Assignment {
  #grade; // private grade

  constructor(assignmentName, status = "released") {
    this.assignmentName = assignmentName;
    this.status = status;
    this.#grade = null;
  }

  setGrade(grade) {
    this.#grade = grade;

    // Update status based on grade
    if (grade > 50) {
      this.status = "passed";
    } else {
      this.status = "failed";
    }
  }

  getGrade() {
    return this.#grade;
  }
}

// =========================
// Observer Class
// =========================
class Observer {
  notify(studentName, assignmentName, status) {
    let message;

    // These are shaped to match the sample output
    if (status === "released") {
      message = `Observer \u2192 ${studentName}, ${assignmentName} has been released.`;
    } else if (status === "working") {
      message = `Observer \u2192 ${studentName} is working on ${assignmentName}.`;
    } else if (status === "submitted") {
      message = `Observer \u2192 ${studentName} has submitted ${assignmentName}.`;
    } else if (status === "passed") {
      message = `Observer \u2192 ${studentName} has passed ${assignmentName}`;
    } else if (status === "failed") {
      message = `Observer \u2192 ${studentName} has failed ${assignmentName}`;
    } else if (status === "final reminder") {
      // Not in the sample output, but needed for reminders
      message = `Observer \u2192 ${studentName}, ${assignmentName} is on final reminder.`;
    } else {
      message = `Observer \u2192 ${studentName}, ${assignmentName} is now ${status}.`;
    }

    console.log(message);
  }
}

// =========================
// Student Class
// =========================
class Student {
  constructor(fullName, email, observer) {
    this.fullName = fullName;
    this.email = email;
    this.assignmentStatuses = []; // array of Assignment objects
    this.overallGrade = null;
    this.observer = observer;

    // Track pending "working" timers so reminders can submit early
    this._workingTimers = new Map();
  }

  // ----------- basic setters -----------
  setFullName(name) {
    this.fullName = name;
  }

  setEmail(email) {
    this.email = email;
  }

  // ----------- internal helpers -----------

  _findAssignment(assignmentName) {
    return this.assignmentStatuses.find(
      (a) => a.assignmentName === assignmentName
    );
  }

  _ensureAssignment(assignmentName) {
    let assignment = this._findAssignment(assignmentName);
    if (!assignment) {
      assignment = new Assignment(assignmentName, "released");
      this.assignmentStatuses.push(assignment);
      this._updateStatusAndNotify(assignment, "released");
    }
    return assignment;
  }

  _updateStatusAndNotify(assignment, newStatus) {
    assignment.status = newStatus;
    if (this.observer) {
      this.observer.notify(this.fullName, assignment.assignmentName, newStatus);
    }
  }

  _computeOverallGrade() {
    const graded = this.assignmentStatuses
      .map((a) => a.getGrade())
      .filter((g) => typeof g === "number");

    if (graded.length === 0) {
      return null;
    }

    const sum = graded.reduce((acc, g) => acc + g, 0);
    return sum / graded.length;
  }

  // ----------- required methods -----------

  /**
   * updateAssignmentStatus(name, grade?)
   * - If assignment doesn't exist: create it with status "released".
   * - If grade is provided and assignment exists: setGrade on it.
   */
  updateAssignmentStatus(name, grade) {
    let assignment = this._findAssignment(name);

    if (!assignment) {
      assignment = new Assignment(name, "released");
      this.assignmentStatuses.push(assignment);
      this._updateStatusAndNotify(assignment, "released");
    }

    if (grade !== undefined) {
      assignment.setGrade(grade);
      // update overall grade
      this.overallGrade = this._computeOverallGrade();
      // notify pass / fail
      if (this.observer) {
        this.observer.notify(
          this.fullName,
          assignment.assignmentName,
          assignment.status
        );
      }
    }
  }

  /**
   * getAssignmentStatus(name)
   * Returns "Pass", "Fail", raw status string, or "Hasn't been assigned".
   */
  getAssignmentStatus(name) {
    const assignment = this._findAssignment(name);
    if (!assignment) {
      return "Hasn't been assigned";
    }

    if (assignment.status === "passed") return "Pass";
    if (assignment.status === "failed") return "Fail";

    // other statuses like "released", "working", "submitted", "final reminder"
    return assignment.status;
  }

  /**
   * getGrade()
   * Average grade over all assignments that have grades.
   */
  getGrade() {
    this.overallGrade = this._computeOverallGrade();
    return this.overallGrade;
  }

  /**
   * startWorking(assignmentName)
   * - Set status to "working"
   * - Wait 500ms asynchronously, then submitAssignment
   * - If reminder triggers earlier, submission happens early
   */
  startWorking(assignmentName) {
    const assignment = this._ensureAssignment(assignmentName);

    // Mark as working
    this._updateStatusAndNotify(assignment, "working");

    // Clear any existing timer for this assignment
    if (this._workingTimers.has(assignmentName)) {
      clearTimeout(this._workingTimers.get(assignmentName));
    }

    const timerId = setTimeout(() => {
      this.submitAssignment(assignmentName);
      this._workingTimers.delete(assignmentName);
    }, 500);

    this._workingTimers.set(assignmentName, timerId);
  }

  /**
   * submitAssignment(assignmentName)
   * - Change status to "submitted"
   * - After 500ms, randomly assign grade 0-100 and update status to pass/fail
   */
  submitAssignment(assignmentName) {
    // Cancel any pending "startWorking" timer
    if (this._workingTimers.has(assignmentName)) {
      clearTimeout(this._workingTimers.get(assignmentName));
      this._workingTimers.delete(assignmentName);
    }

    const assignment = this._ensureAssignment(assignmentName);

    // If already submitted or graded, do nothing
    if (
      assignment.status === "submitted" ||
      assignment.status === "passed" ||
      assignment.status === "failed"
    ) {
      return;
    }

    // Mark as submitted
    this._updateStatusAndNotify(assignment, "submitted");

    // Asynchronous grading
    setTimeout(() => {
      const grade = Math.floor(Math.random() * 101); // 0–100 inclusive
      assignment.setGrade(grade);

      // Update overall grade
      this.overallGrade = this._computeOverallGrade();

      // Notify pass/fail
      if (this.observer) {
        this.observer.notify(
          this.fullName,
          assignment.assignmentName,
          assignment.status
        );
      }
    }, 500);
  }

  /**
   * Helper used by ClassList for reminders
   * Mark status "final reminder" and notify.
   */
  setFinalReminder(assignmentName) {
    const assignment = this._ensureAssignment(assignmentName);
    this._updateStatusAndNotify(assignment, "final reminder");
  }

  /**
   * Check if a given assignment has been completed
   * (submitted or graded).
   */
  hasCompletedAssignment(assignmentName) {
    const assignment = this._findAssignment(assignmentName);
    if (!assignment) return false;
    return (
      assignment.status === "submitted" ||
      assignment.status === "passed" ||
      assignment.status === "failed"
    );
  }
}

// =========================
// ClassList
// =========================
class ClassList {
  constructor(observer) {
    this.students = [];
    this.observer = observer;
  }

  // Add a new student
  addStudent(student) {
    this.students.push(student);
    console.log(`${student.fullName} has been added to the classlist.`);
  }

  // Remove a student by full name
  removeStudent(fullName) {
    const index = this.students.findIndex(
      (s) => s.fullName === fullName
    );
    if (index !== -1) {
      this.students.splice(index, 1);
    }
  }

  // Find a student by full name
  findStudentByName(fullName) {
    return this.students.find((s) => s.fullName === fullName) || null;
  }

  /**
   * findOutstandingAssignments(assignmentName?)
   * - If assignmentName is provided: return students who have NOT
   *   completed that assignment.
   * - If assignmentName is omitted/undefined: return students who have
   *   any assignment that is released/working/final reminder (i.e. not submitted or graded).
   */
  findOutstandingAssignments(assignmentName) {
    const names = [];

    if (assignmentName) {
      // Specific assignment
      this.students.forEach((student) => {
        if (!student.hasCompletedAssignment(assignmentName)) {
          names.push(student.fullName);
        }
      });
    } else {
      // Any assignment that is released but not yet submitted
      this.students.forEach((student) => {
        const hasOutstanding = student.assignmentStatuses.some((a) => {
          return (
            a.status === "released" ||
            a.status === "working" ||
            a.status === "final reminder"
          );
        });
        if (hasOutstanding) {
          names.push(student.fullName);
        }
      });
    }

    return names;
  }

  /**
   * releaseAssignmentsParallel(assignmentNames)
   * Release each assignment to every student in parallel using Promise.all
   */
  releaseAssignmentsParallel(assignmentNames) {
    const releasePromises = assignmentNames.map((assignmentName) => {
      return new Promise((resolve) => {
        // Simulate async release
        setTimeout(() => {
          this.students.forEach((student) => {
            student.updateAssignmentStatus(assignmentName);
          });
          resolve();
        }, 0);
      });
    });

    return Promise.all(releasePromises);
  }

  /**
   * sendReminder(assignmentName)
   * - Notifies all students who have not yet completed the assignment.
   * - Sets status to "final reminder" (Observer prints).
   * - Causes the assignment to be submitted even if student is still working
   *   or has not started.
   */
  sendReminder(assignmentName) {
    this.students.forEach((student) => {
      if (!student.hasCompletedAssignment(assignmentName)) {
        // Update status to final reminder, triggers Observer
        student.setFinalReminder(assignmentName);
        // Submit immediately (early submission)
        student.submitAssignment(assignmentName);
      }
    });
  }
}


const observer = new Observer();
const classList = new ClassList(observer);

const s1 = new Student("Alice Smith", "alice@example.com", observer);
const s2 = new Student("Bob Jones", "bob@example.com", observer);

classList.addStudent(s1);
classList.addStudent(s2);

// timing may vary because grading is random + async,
// but structure of messages will match the example
classList.releaseAssignmentsParallel(["A1", "A2"]).then(() => {
  s1.startWorking("A1");
  s2.startWorking("A2");

  setTimeout(() => classList.sendReminder("A1"), 200);
});


// Export for Node/Gradescope tests
if (typeof module !== "undefined") {
  module.exports = { Assignment, Student, Observer, ClassList };
}

let allCourses = [];
let visibleCourses = [];
let selectedId = null;

// ----- Course class -----
class Course {
  constructor(raw) {
    this.id = raw.id ?? "N/A";
    this.title = raw.title ?? "Untitled";
    this.department = raw.department ?? "Unknown";
    this.level = raw.level ?? "N/A";
    this.credits = raw.credits ?? "N/A";
    this.instructor = raw.instructor ?? "TBA";
    this.description = raw.description ?? "No description provided.";
    this.semester = raw.semester ?? "N/A";
  }
  getId() { return this.id; }
  getTitle() { return this.title; }
  getSemester() { return this.semester; }
  semesterValue() {
    const map = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };
    const [term, yearStr] = this.semester.split(" ");
    const year = parseInt(yearStr) || 0;
    return year * 10 + (map[term] || 0);
  }
  toDetailsHTML() {
    return `
      <h2>${this.id}</h2>
      <p><strong>Title:</strong> ${this.title}</p>
      <p><strong>Department:</strong> ${this.department}</p>
      <p><strong>Level:</strong> ${this.level}</p>
      <p><strong>Credits:</strong> ${this.credits}</p>
      <p><strong>Instructor:</strong> ${this.instructor}</p>
      <p><strong>Semester:</strong> ${this.semester}</p>
      <p>${this.description}</p>
    `;
  }
}

// ----- File loading -----
document.getElementById("fileInput").addEventListener("change", e => {
  const file = e.target.files[0];
  const error = document.getElementById("errorMsg");
  error.textContent = "";
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error("Not an array");
      allCourses = data.map(obj => new Course(obj));
      selectedId = null;
      populateFilterOptions();
      applyFiltersAndSort();
    } catch (err) {
      console.error(err);
      error.textContent = "Invalid JSON file format.";
      document.getElementById("courseList").innerHTML = "";
      document.getElementById("courseDetails").innerHTML = "";
    }
  };
  reader.readAsText(file);
});

// ----- Populate filters -----
function populateFilterOptions() {
  fillSelectFromField("deptFilter", "department");
  fillSelectFromField("levelFilter", "level");
  fillSelectFromField("creditFilter", "credits");
  fillSelectFromField("instructorFilter", "instructor");
}

function fillSelectFromField(selectId, fieldName) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="All">All</option>';
  const values = new Set(
    allCourses.map(c => c[fieldName]).filter(v => v !== undefined && v !== null && v !== "")
  );
  values.forEach(val => {
    const opt = document.createElement("option");
    opt.value = String(val);
    opt.textContent = String(val);
    select.appendChild(opt);
  });
}

// ----- Filters + sort -----
["deptFilter", "levelFilter", "creditFilter", "instructorFilter", "sortSelect"]
  .forEach(id => document.getElementById(id).addEventListener("change", applyFiltersAndSort));

function applyFiltersAndSort() {
  if (allCourses.length === 0) {
    visibleCourses = [];
    renderCourseList();
    renderDetails(null);
    return;
  }
  const dept = deptFilter.value;
  const level = levelFilter.value;
  const credits = creditFilter.value;
  const instructor = instructorFilter.value;
  const sortMode = sortSelect.value;

  visibleCourses = allCourses.filter(c =>
    (dept === "All" || c.department === dept) &&
    (level === "All" || String(c.level) === level) &&
    (credits === "All" || String(c.credits) === credits) &&
    (instructor === "All" || c.instructor === instructor)
  );

  switch (sortMode) {
    case "id-az": visibleCourses.sort((a,b)=>a.id.localeCompare(b.id)); break;
    case "id-za": visibleCourses.sort((a,b)=>b.id.localeCompare(a.id)); break;
    case "title-az": visibleCourses.sort((a,b)=>a.title.localeCompare(b.title)); break;
    case "title-za": visibleCourses.sort((a,b)=>b.title.localeCompare(a.title)); break;
    case "sem-early": visibleCourses.sort((a,b)=>a.semesterValue()-b.semesterValue()); break;
    case "sem-late": visibleCourses.sort((a,b)=>b.semesterValue()-a.semesterValue()); break;
    case "none":
    default: break;
  }

  renderCourseList();
  const selectedCourse = visibleCourses.find(c => c.id === selectedId) || null;
  renderDetails(selectedCourse);
}

// ----- Render list + details -----
function renderCourseList() {
  const list = document.getElementById("courseList");
  list.innerHTML = "";
  if (visibleCourses.length === 0) {
    list.innerHTML = "<p>No courses match the current filters.</p>";
    return;
  }
  visibleCourses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course-item";
    if (course.id === selectedId) div.classList.add("active");
    div.textContent = course.getId();
    div.addEventListener("click", () => {
      selectedId = course.id;
      renderCourseList();
      renderDetails(course);
    });
    list.appendChild(div);
  });
}

function renderDetails(course) {
  const details = document.getElementById("courseDetails");
  if (!course) {
    details.innerHTML = "<p>Select a course from the list on the left.</p>";
    return;
  }
  details.innerHTML = course.toDetailsHTML();
}

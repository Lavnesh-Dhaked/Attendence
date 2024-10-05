document.getElementById("loadButton").addEventListener("click", () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const contents = e.target.result;
    const students = parseCSV(contents);
    displayStudents(students);
  };

  if (file) {
    reader.readAsText(file);
  } else {
    alert("Please upload a CSV file.");
  }
});

function parseCSV(data) {
  const lines = data.split("\n");
  const students = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  return students;
}

function displayStudents(students) {
  const studentList = document.getElementById("studentList");
  studentList.innerHTML = ""; // Clear existing list

  students.forEach((student, index) => {
    const listItem = document.createElement("li");
    listItem.className = "student";

    // Create the student name span with index
    const studentName = document.createElement("span");
    studentName.className = "student-name";
    studentName.textContent = `${index + 1}. ${student}`;

    // Create the attendance buttons
    const attendanceButtons = document.createElement("div");
    attendanceButtons.className = "attendance-buttons";

    // Create attendance buttons with unique data attributes
    const presentButton = createAttendanceButton(
      "Present",
      `${index + 1}. ${student}`
    );
    const leaveButton = createAttendanceButton(
      "Leave",
      `${index + 1}. ${student}`
    );
    const absentButton = createAttendanceButton(
      "Absent",
      `${index + 1}. ${student}`
    );

    attendanceButtons.appendChild(presentButton);
    attendanceButtons.appendChild(leaveButton);
    attendanceButtons.appendChild(absentButton);

    // Append name and buttons to the list item
    listItem.appendChild(studentName);
    listItem.appendChild(attendanceButtons);
    studentList.appendChild(listItem);
  });
}

function createAttendanceButton(status, studentName) {
  const button = document.createElement("button");
  button.className = "attendance-button";
  button.textContent = status;
  button.setAttribute("data-student", studentName);
  button.setAttribute("data-date", new Date().toLocaleDateString());

  // Add event listener for attendance actions
  button.addEventListener("click", () => {
    // Get all buttons for this student
    const studentButtons = document.querySelectorAll(
      `.attendance-button[data-student="${studentName}"]`
    );

    // Remove previous attendance status from all buttons of this student
    studentButtons.forEach((btn) => {
      btn.classList.remove("present", "leave", "absent");
    });

    // Add attendance status to the clicked button
    button.classList.add(status.toLowerCase());
  });

  return button;
}

document.getElementById("downloadButton").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const students = document.querySelectorAll(".student");

  doc.setFontSize(12);
  doc.text("Attendance Records", 10, 10);
  doc.setFontSize(10);
  let yOffset = 20; // Start Y position for text

  // Add a header for the table
  doc.setFontSize(14);
  doc.text("No.", 10, yOffset);
  doc.text("Student Name", 30, yOffset);
  doc.text("Attendance", 140, yOffset);
  yOffset += 10;
  doc.line(10, yOffset, 200, yOffset); // Draw line below header
  yOffset += 5;

  students.forEach((student, index) => {
    const studentName = student.querySelector(".student-name").textContent;
    const buttons = student.querySelectorAll(".attendance-button");

    // Check for attendance status
    let attendanceStatus = "Absent"; // Default to absent if no selection
    if (buttons[0].classList.contains("present")) {
      attendanceStatus = "Present";
    } else if (buttons[1].classList.contains("leave")) {
      attendanceStatus = "Leave";
    }

    // Add student info to PDF
    doc.text((index + 1).toString(), 10, yOffset);
    doc.text(studentName, 30, yOffset);
    doc.text(attendanceStatus, 140, yOffset);

    yOffset += 10; // Increment Y position for the next line
  });

  doc.save("attendance.pdf");
});

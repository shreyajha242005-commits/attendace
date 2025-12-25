// Load students from localStorage or start empty
let students = JSON.parse(localStorage.getItem("students")) || [];

// DOM elements
const tableBody = document.getElementById("student-table");
const addBtn = document.getElementById("add-student-btn");
const resetBtn = document.getElementById("reset-btn");
const whatsappBtn = document.getElementById("send-whatsapp-btn");

// Initial render
renderTable();

// Event listeners
addBtn.addEventListener("click", addStudent);
resetBtn.addEventListener("click", resetClassList);
whatsappBtn.addEventListener("click", sendToWhatsApp);

// Save students to localStorage
function saveToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Add student
function addStudent() {
  const name = document.getElementById("student-name").value.trim();
  const enroll = document.getElementById("student-enroll").value.trim();

  if (!name || !enroll) return alert("Enter both name and enrollment number.");

  students.push({ name, enroll });
  saveToStorage();

  document.getElementById("student-name").value = "";
  document.getElementById("student-enroll").value = "";

  renderTable();
}

// Reset class list
function resetClassList() {
  if (!confirm("Are you sure you want to reset the class list?")) return;

  students = [];
  localStorage.removeItem("students");
  renderTable();
}

// Render table
function renderTable() {
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.enroll}</td>
      <td><input type="checkbox" id="present-${index}" onclick="toggleAttendance(${index}, true)" /></td>
      <td><input type="checkbox" id="absent-${index}" checked onclick="toggleAttendance(${index}, false)" /></td>
    `;
    tableBody.appendChild(row);
  });
}


function toggleAttendance(index, isPresentChecked) {
  const present = document.getElementById(`present-${index}`);
  const absent = document.getElementById(`absent-${index}`);

  if (isPresentChecked) absent.checked = false;
  else present.checked = false;
}

// Send attendance to WhatsApp
function sendToWhatsApp() {
  const date = document.getElementById("attendance-date").value;
  if (!date) return alert("Please select a date first.");

  const absentList = students
    .filter((_, index) => !document.getElementById(`present-${index}`).checked)
    .map(student => `${student.name} (${student.enroll})`);

  let message = `*Absent Students - ${date}*\n\n❌ *Total Absent (${absentList.length}):*\n`;
  message += absentList.map((s,i) => `${i+1}. ${s}`).join("\n");

  const encoded = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/?text=${encoded}`;
  window.open(whatsappURL, "_blank");
}

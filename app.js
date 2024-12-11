// Function to fetch and display all students
function fetchStudents() {
    fetch('http://localhost:3000/students')
      .then(response => response.json())
      .then(data => {
        const studentList = document.getElementById('students');
        studentList.innerHTML = ''; // Clear existing rows
        data.forEach(student => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${student[0]}</td>
            <td>${student[1]} ${student[2]}</td>
            <td>${student[3]}</td>
            <td>${student[4]}</td>
            <td>
              <button onclick="deleteStudent(${student[0]})">Delete</button>
              <button onclick="updateStudent(${student[0]})">Update</button>
            </td>
          `;
          studentList.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching students:', error));
  }
  
  // Function to add a student
  function addStudent() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
  
    const student = { first_name: firstName, last_name: lastName, email, phone };
    
    fetch('http://localhost:3000/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })
      .then(response => response.json())
      .then(() => fetchStudents())
      .catch(error => console.error('Error adding student:', error));
  }
  
  // Function to delete a student
  function deleteStudent(id) {
    fetch(`http://localhost:3000/students/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => fetchStudents())
      .catch(error => console.error('Error deleting student:', error));
  }
  
  // Function to update a student
  function updateStudent(id) {
    // For simplicity, you can create a simple prompt or form to update student details
    const updatedStudent = {
      first_name: prompt('Enter first name:'),
      last_name: prompt('Enter last name:'),
      email: prompt('Enter email:'),
      phone: prompt('Enter phone:'),
    };
  
    fetch(`http://localhost:3000/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedStudent),
    })
      .then(response => response.json())
      .then(() => fetchStudents())
      .catch(error => console.error('Error updating student:', error));
  }
  
  // Function to search for students by name or email
  function searchStudent() {
    const searchQuery = document.getElementById('search-input').value;
    
    if (searchQuery) {
      // Search for students with matching query
      fetch(`http://localhost:3000/students/search?searchQuery=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
          const studentList = document.getElementById('students');
          studentList.innerHTML = ''; // Clear existing rows
          // If no results are found, inform the user
          if (data.length === 0) {
            studentList.innerHTML = `<tr><td colspan="5">No students found matching "${searchQuery}"</td></tr>`;
          } else {
            data.forEach(student => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${student[0]}</td>
                <td>${student[1]} ${student[2]}</td>
                <td>${student[3]}</td>
                <td>${student[4]}</td>
                <td>
                  <button onclick="deleteStudent(${student[0]})">Delete</button>
                  <button onclick="updateStudent(${student[0]})">Update</button>
                </td>
              `;
              studentList.appendChild(row);
            });
          }
        })
        .catch(error => console.error('Error searching students:', error));
    } else {
      // If search query is empty, show all students
      fetchStudents();
    }
  }
  
  // Initial fetch
  fetchStudents();
  
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('employee-form');
  const employeeList = document.getElementById('employee-list');
  const searchInput = document.getElementById('search');
  const exportBtn = document.getElementById('export-btn');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');
  const closeModal = document.getElementById('closeModal');

  let employees = JSON.parse(localStorage.getItem('employees')) || [];
  let editEmployeeId = null;
  let sortDirection = true;

  // Load existing data
  displayEmployees(employees);

  function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
  }

  // Add or Update Employee
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const photoInput = document.getElementById('photo').files[0];

    reader.onloadend = () => {
      const newEmployee = {
        id: editEmployeeId ? editEmployeeId : Date.now(),
        name: document.getElementById('name').value.trim(),
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        ghanaCard: document.getElementById('ghanaCard').value.trim(),
        address: document.getElementById('address').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        education: document.getElementById('education').value.trim(),
        deployment: document.getElementById('deployment').value.trim(),
        employmentDate: document.getElementById('employmentDate').value,
        bankName: document.getElementById('bankName').value.trim(),
        bankAccount: document.getElementById('bankAccount').value.trim(),
        department: document.getElementById('department').value.trim(),
        role: document.getElementById('role').value.trim(),
        email: document.getElementById('email').value.trim(),
        photo: reader.result || ''
      };

      if (editEmployeeId) {
        employees = employees.map(emp => emp.id === editEmployeeId ? newEmployee : emp);
        editEmployeeId = null;
      } else {
        employees.push(newEmployee);
      }

      saveToLocalStorage();
      displayEmployees(employees);
      form.reset();
    };

    if (photoInput) {
      reader.readAsDataURL(photoInput);
    } else {
      reader.onloadend();
    }
  });

  // Display employees in the table
  function displayEmployees(data) {
    employeeList.innerHTML = '';
    data.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.name}</td>
        <td>${emp.department}</td>
        <td>${emp.role}</td>
        <td>${emp.photo ? `<img src="${emp.photo}" alt="Profile">` : 'N/A'}</td>
        <td>
          <button class="action-btn view-btn" onclick="viewProfile(${emp.id})">View</button>
          <button class="action-btn update-btn" onclick="editEmployee(${emp.id})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteEmployee(${emp.id})">Delete</button>
        </td>
      `;
      employeeList.appendChild(row);
    });
  }

  // View full profile
  window.viewProfile = (id) => {
    const emp = employees.find(emp => emp.id === id);
    modalTitle.textContent = "Employee Profile";

    modalBody.innerHTML = `
      ${emp.photo ? `<img src="${emp.photo}" alt="Profile Picture">` : ''}
      <p><strong>Name:</strong> ${emp.name}</p>
      <p><strong>Gender:</strong> ${emp.gender}</p>
      <p><strong>Date of Birth:</strong> ${emp.dob}</p>
      <p><strong>Ghana Card:</strong> ${emp.ghanaCard}</p>
      <p><strong>Address:</strong> ${emp.address}</p>
      <p><strong>Phone:</strong> ${emp.phone}</p>
      <p><strong>Email:</strong> ${emp.email}</p>
      <p><strong>Education Level:</strong> ${emp.education}</p>
      <p><strong>Deployment:</strong> ${emp.deployment}</p>
      <p><strong>Date of Employment:</strong> ${emp.employmentDate}</p>
      <p><strong>Bank Name:</strong> ${emp.bankName}</p>
      <p><strong>Bank Account:</strong> ${emp.bankAccount}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Role:</strong> ${emp.role}</p>
    `;
    modal.style.display = 'flex';
  };

  closeModal.addEventListener('click', () => modal.style.display = 'none');

  // Edit Employee
  window.editEmployee = (id) => {
    const emp = employees.find(emp => emp.id === id);

    document.getElementById('name').value = emp.name;
    document.getElementById('gender').value = emp.gender;
    document.getElementById('dob').value = emp.dob;
    document.getElementById('ghanaCard').value = emp.ghanaCard;
    document.getElementById('address').value = emp.address;
    document.getElementById('phone').value = emp.phone;
    document.getElementById('education').value = emp.education;
    document.getElementById('deployment').value = emp.deployment;
    document.getElementById('employmentDate').value = emp.employmentDate;
    document.getElementById('bankName').value = emp.bankName;
    document.getElementById('bankAccount').value = emp.bankAccount;
    document.getElementById('department').value = emp.department;
    document.getElementById('role').value = emp.role;
    document.getElementById('email').value = emp.email;

    editEmployeeId = id;
  };

  // Delete Employee
  window.deleteEmployee = (id) => {
    employees = employees.filter(emp => emp.id !== id);
    saveToLocalStorage();
    displayEmployees(employees);
  };

  // Search
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
    displayEmployees(filtered);
  });

  // Export to CSV
  exportBtn.addEventListener('click', () => {
    const csvRows = [
      [
        "Name","Gender","DOB","Ghana Card","Address","Phone","Email","Education",
        "Deployment","Employment Date","Bank Name","Bank Account","Department","Role"
      ].join(",")
    ];

    employees.forEach(emp => {
      csvRows.push([
        emp.name, emp.gender, emp.dob, emp.ghanaCard, emp.address, emp.phone,
        emp.email, emp.education, emp.deployment, emp.employmentDate,
        emp.bankName, emp.bankAccount, emp.department, emp.role
      ].join(","));
    });

    const csvData = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(csvData);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'employees.csv');
    a.click();
  });
});


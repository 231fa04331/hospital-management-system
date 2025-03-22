// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize - hide all departments and doctors
    const departmentLists = document.querySelectorAll('.departments');
    departmentLists.forEach(list => {
        list.style.display = 'none';
    });
    
    const doctorLists = document.querySelectorAll('.doctors');
    doctorLists.forEach(list => {
        list.style.display = 'none';
    });
    
    // Set 'All' location as default selected
    filterByLocation('all');
});

// Toggle departments visibility
function toggleDepartments(departmentId) {
    const departments = document.getElementById(departmentId);
    if (departments.style.display === 'none' || departments.style.display === '') {
        departments.style.display = 'block';
    } else {
        departments.style.display = 'none';
    }
}

// Toggle doctors visibility
function toggleDoctors(header) {
    const doctorsList = header.parentElement.querySelector('.doctors');
    const arrow = header.querySelector('.arrow');
    
    if (doctorsList.style.display === 'none' || doctorsList.style.display === '') {
        doctorsList.style.display = 'block';
        arrow.classList.add('active');
    } else {
        doctorsList.style.display = 'none';
        arrow.classList.remove('active');
    }
}

// Filter hospitals by location
function filterByLocation(location) {
    // Update active button state
    const locationButtons = document.querySelectorAll('.location-btn');
    locationButtons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase() === location || 
            (location === 'all' && button.textContent.trim() === 'All')) {
            button.classList.add('active');
        }
    });
    
    // Filter hospitals
    const hospitals = document.querySelectorAll('.hospital');
    hospitals.forEach(hospital => {
        if (location === 'all') {
            hospital.style.display = 'block';
        } else {
            const hospitalLocation = hospital.getAttribute('data-location');
            hospital.style.display = (hospitalLocation === location) ? 'block' : 'none';
        }
    });
    
    // Clear any existing search results message
    clearNoResultsMessage();
}

// Clear the "No results found" message if it exists
function clearNoResultsMessage() {
    const existingNoResults = document.querySelector('.no-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }
}

// Perform search across hospitals, departments, and doctors
function performSearch() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    
    // If search is empty, reset to current location filter
    if (!searchInput) {
        const activeLocationBtn = document.querySelector('.location-btn.active');
        if (activeLocationBtn) {
            const location = activeLocationBtn.textContent.toLowerCase();
            filterByLocation(location === 'all' ? 'all' : location);
        } else {
            filterByLocation('all');
        }
        return;
    }
    
    // Get search options
    const searchHospitals = document.getElementById('searchHospitals').checked;
    const searchDepartments = document.getElementById('searchDepartments').checked;
    const searchDoctors = document.getElementById('searchDoctors').checked;
    const searchLocations = document.getElementById('searchLocations').checked;
    
    // Get all hospitals
    const hospitals = document.querySelectorAll('.hospital');
    
    // Flag to track if any results were found
    let foundResults = false;
    
    // Reset all departments and doctors to hidden
    document.querySelectorAll('.departments').forEach(dept => {
        dept.style.display = 'none';
    });
    
    document.querySelectorAll('.doctors').forEach(doc => {
        doc.style.display = 'none';
    });
    
    document.querySelectorAll('.arrow').forEach(arrow => {
        arrow.classList.remove('active');
    });
    
    hospitals.forEach(hospital => {
        let showHospital = false;
        const hospitalName = hospital.querySelector('h2').textContent.toLowerCase();
        const location = hospital.querySelector('.hospital-location').textContent.toLowerCase();
        const departments = hospital.querySelectorAll('.department');
        
        // Check if hospital name matches and the option is enabled
        if (searchHospitals && hospitalName.includes(searchInput)) {
            showHospital = true;
            foundResults = true;
        }
        
        // Check if location matches and the option is enabled
        if (searchLocations && location.includes(searchInput)) {
            showHospital = true;
            foundResults = true;
        }
        
        // Check departments and doctors
        departments.forEach(department => {
            const departmentName = department.querySelector('.dept-header span').textContent.toLowerCase();
            const doctors = department.querySelectorAll('.doctor');
            let showDepartment = false;
            
            // Check if department name matches and the option is enabled
            if (searchDepartments && departmentName.includes(searchInput)) {
                showHospital = true;
                showDepartment = true;
                foundResults = true;
            }
            
            // Check if any doctor matches and the option is enabled
            if (searchDoctors) {
                doctors.forEach(doctor => {
                    const doctorName = doctor.textContent.toLowerCase();
                    if (doctorName.includes(searchInput)) {
                        showHospital = true;
                        showDepartment = true;
                        foundResults = true;
                    }
                });
            }
            
            // If this department has matches, show it and its doctors
            if (showDepartment) {
                // Get the hospital's department container
                const deptId = hospital.querySelector('.dept-btn').getAttribute('onclick').match(/'([^']+)'/)[1];
                const deptContainer = document.getElementById(deptId);
                
                // Show the department container
                deptContainer.style.display = 'block';
                
                // Show this specific department's doctors
                const doctorsList = department.querySelector('.doctors');
                doctorsList.style.display = 'block';
                
                // Activate the arrow
                const arrow = department.querySelector('.arrow');
                arrow.classList.add('active');
            }
        });
        
        // Show/hide hospital based on search results
        hospital.style.display = showHospital ? 'block' : 'none';
    });
    
    // Display message if no results found
    const container = document.getElementById('hospitalContainer');
    clearNoResultsMessage();
    
    if (!foundResults) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No matching results found. Please try a different search.';
        container.appendChild(noResults);
    }
}

// Enable search on pressing Enter in the search input
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
});
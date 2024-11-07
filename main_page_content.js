let activeFiltersProjects = new Set();

// Fetch projects.json & display projects, skill buttons & footer
async function fetchProjects() {
    try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const projects = await response.json();

        displayProjects(projects);
        updateSkillButtons(projects);  // Initialize with all skill buttons
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

async function fetchModels() {
    try {
        const response = await fetch('models.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const models = await response.json();

        displayModels(models);
    } catch (error) {
        console.error('Error fetching models:', error);
    }
}

function displayProjects(projects) {
    const projectsList = document.getElementById('projectList');
    projectsList.innerHTML = ''; // Clear previous data

    projects.forEach(project => {
        const projectId = project.name.replace(/\s+/g, '_').toLowerCase();
        const encodedProjectName = encodeURIComponent(project.name);
        const projectLink = `project.html?project=${encodedProjectName}`; // Create link with query parameter

        const article = document.createElement('article');
        article.id = projectId;
        article.className = 'project';
        article.innerHTML = `
            <h3>${project.name}</h3>
            <a href="${projectLink}"><img src="${project.image}" alt="Project Image"></a>
            <p>${project.description || "Project Description Lorem ipsum, dolor sit amet consectetur adipisicing elit."}</p>
            <a href="${projectLink}">View Project</a> <!-- Updated link -->
        `;
        article.setAttribute('data-skills', project.skills.join(', '));  // Maintain original casing
        projectsList.appendChild(article);
    });
}

function displayModels(models) {
    const modelsList = document.getElementById('modelList');
    modelsList.innerHTML = ''; // Clear previous data

    models.forEach(model => {
        const modelId = model.name.replace(/\s+/g, '_').toLowerCase();

        const article = document.createElement('article');
        article.id = modelId;
        article.className = 'model'; // Ensure articles have a common class for filtering
        article.innerHTML = `
            <h3>${model.name}</h3>
            <img src="${model.image}" alt="Image of 3D Model">
        `;
        modelsList.appendChild(article);
    });
}

function updateSkillButtons(items) {
    const skillButtonContainer = document.getElementById('projectSkillButtons');
    skillButtonContainer.innerHTML = ''; // Clear previous data
    const skills = new Set();

    // Collect all unique skills from the items
    items.forEach(item => {
        item.skills.forEach(skill => skills.add(skill));
    });

    // Create buttons for each unique skill
    skills.forEach(skill => {
        const button = document.createElement('button');
        button.textContent = skill;
        button.className = 'skill-button';
        button.onclick = () => toggleFilter(skill, button);
        skillButtonContainer.appendChild(button);
    });
}

function toggleFilter(skill, button) {
    // Toggle the skill in the active filter set
    if (activeFiltersProjects.has(skill)) {
        activeFiltersProjects.delete(skill);
        button.classList.remove('active');
    } else {
        activeFiltersProjects.add(skill);
        button.classList.add('active');
    }
    filterProjects();
}

function filterProjects() {
    const projects = document.querySelectorAll('.project');
    const visibleProjects = [];

    // Filter projects based on selected skills
    projects.forEach(project => {
        const projectSkills = project.getAttribute('data-skills').split(', ');
        const isVisible = activeFiltersProjects.size === 0 || 
            Array.from(activeFiltersProjects).every(skill => projectSkills.includes(skill));
        
        project.style.display = isVisible ? '' : 'none';

        if (isVisible) {
            visibleProjects.push(project);  // Track currently visible projects
        }
    });

    // Update skill buttons based on visible projects
    updateVisibleSkills(visibleProjects);
}

function updateVisibleSkills(visibleProjects) {
    const skillButtonContainer = document.getElementById('projectSkillButtons');
    skillButtonContainer.innerHTML = ''; // Clear previous buttons
    const skills = new Set();

    // Collect skills from currently visible projects only
    visibleProjects.forEach(project => {
        project.getAttribute('data-skills').split(', ').forEach(skill => skills.add(skill));
    });

    // Re-create buttons for each skill found in visible projects
    skills.forEach(skill => {
        const button = document.createElement('button');
        button.textContent = skill;
        button.className = 'skill-button';

        // Add the active class if this skill is currently active
        if (activeFiltersProjects.has(skill)) {
            button.classList.add('active');
        }

        button.onclick = () => toggleFilter(skill, button);
        skillButtonContainer.appendChild(button);
    });
}

// Initialize project fetching and display
fetchProjects();
fetchModels();

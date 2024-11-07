// Function to get URL parameters
function getProjectFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('project'); // Get the project name from the query string
}

// Function to display the project details
async function displayProjectDetails() {
    const projectName = getProjectFromUrl();
    if (projectName) {
        const decodedProjectName = decodeURIComponent(projectName);
        const projects = await fetch('projects.json').then(response => response.json());
        
        // Find the specific project
        const project = projects.find(proj => proj.name === decodedProjectName);
        
        if (project) {
            // Add content to page

            //update title area
            const titleArea = document.getElementById("project-title-area");
            titleArea.innerHTML = `
            <h1>${project.name}</h1>
            <img src="${project.image}" alt="Project Image">
            <p>${project.description}</p>
            `;

            skillsList = document.getElementById("project-skills")
            skillsList.innerHTML = '';
            project.skills.forEach(skill =>{
                appendAsListItem(skill, skillsList)
            });

            linksList = document.getElementById("project-links")
            linksList.innerHTML = "";
            if (project.git){
                const li = document.createElement('li');
                li.innerHTML = `GitHub: <a href=${project.git}>${project.git}</a>`; 
                linksList.appendChild(li);
            }
            if (project.ichIo){
                const li = document.createElement('li');
                li.innerHTML = `Itch.io: <a href=${project.itchIo}>${project.ichIo}</a>`; 
                linksList.appendChild(li);
            }
            if (project.download){
                const li = document.createElement('li');
                li.innerHTML = `<a href=${project.download} download="">Download</a>`; 
                linksList.appendChild(li);
            }
            loadMarkdown(project.bigDescription, 'bigDescription')
        } else {
            document.getElementById('projectDetails').innerHTML = '<p>Project not found.</p>';
        }
    }
}

// Add item to list as li
function appendAsListItem(content, list){
    const li = document.createElement('li');
    li.textContent = content;
    list.appendChild(li);
}

function simpleMarkdownToHTML(markdown) {
    // Very basic Markdown to HTML conversion
    return markdown
        .replace(/(#+)\s*(.*)/g, (_, hashes, title) => `<h${hashes.length}>${title}</h${hashes.length}>`) // Headers
        .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>') // Bold
        .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>') // Italics
        .replace(/~~(.*?)~~/g, '<del>$1</del>') // Strikethrough
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">') // Images
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>') // Links
        .replace(/\n/g, '<br>'); // New lines
}

// Function to fetch Markdown file content
async function fetchMarkdown(file) {
    try {
        const response = await fetch(file);
        
        // Check if the file was found
        if (!response.ok) {
            throw new Error('File not found');
        }
        
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('Error fetching Markdown file:', error);
        return null; // Return null if there's an error
    }
}

// Function to load Markdown content into the specified element
async function loadMarkdown(filePath, contentLocationId) {
    const markdown = await fetchMarkdown(filePath); // Fetch the .md file
    if (markdown) { // Check if markdown content is not null
        const html = simpleMarkdownToHTML(markdown);
        document.getElementById(contentLocationId).innerHTML = html; // Only update HTML if fetch was successful
    }
}

displayProjectDetails();

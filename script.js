const languageDropdown = document.getElementById("languageDropdown");
const fetchRepoBtn = document.getElementById("fetchRepoBtn");
const repoDetails = document.getElementById("repoDetails");
const refreshBtn = document.getElementById("refreshBtn");
const statusMessage = document.getElementById("statusMessage");

const API_URL = "https://api.github.com/search/repositories";

async function populateLanguages() {
    const languages = ["JavaScript", "Python", "Java", "Ruby", "Go"];
    languages.forEach(language => {
        const option = document.createElement("option");
        option.value = language;
        option.textContent = language;
        languageDropdown.appendChild(option);
    });
}

async function fetchRandomRepo(language) {
    toggleLoading(true);
    try {
        const response = await fetch(`${API_URL}?q=language:${language}&sort=stars`);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            displayRandomRepo(data.items);
        } else {
            showStatusMessage("No repositories found for this language.", "error");
        }
    } catch (error) {
        showStatusMessage("Error fetching repository. Try again.", "error");
    } finally {
        toggleLoading(false);
    }
}

function displayRandomRepo(repos) {
    const randomRepo = repos[Math.floor(Math.random() * repos.length)];
    document.getElementById("repoName").textContent = randomRepo.name;
    document.getElementById("repoDescription").textContent = randomRepo.description || "No description available.";
    document.getElementById("repoStars").textContent = randomRepo.stargazers_count;
    document.getElementById("repoForks").textContent = randomRepo.forks_count;
    document.getElementById("repoIssues").textContent = randomRepo.open_issues_count;

    repoDetails.classList.remove("hidden");
    refreshBtn.classList.remove("hidden");
}

function toggleLoading(isLoading) {
    fetchRepoBtn.disabled = isLoading;
    refreshBtn.disabled = isLoading;
    statusMessage.textContent = isLoading ? "Loading..." : "";
}

function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type === "error" ? "error" : "";
}

fetchRepoBtn.addEventListener("click", () => {
    const selectedLanguage = languageDropdown.value;
    if (selectedLanguage) {
        fetchRandomRepo(selectedLanguage);
    } else {
        showStatusMessage("Please select a language.", "error");
    }
});

refreshBtn.addEventListener("click", () => {
    const selectedLanguage = languageDropdown.value;
    if (selectedLanguage) {
        fetchRandomRepo(selectedLanguage);
    }
});

populateLanguages();

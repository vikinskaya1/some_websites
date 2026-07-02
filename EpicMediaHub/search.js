let contentData = []; 
let musicData = [];
let gamesData = [];
let popularData = [];

const MAX_SUGGESTIONS = 8; 

async function loadSearchData() {
    try {
        const [moviesRes, musicRes, gamesRes, popularRes] = await Promise.all([
            fetch('data.json'),
            fetch('music.json'),
            fetch('games.json'),
            fetch('popular.json')
        ]);

        contentData = moviesRes.ok ? await moviesRes.json() : [];
        musicData = musicRes.ok ? await musicRes.json() : [];
        gamesData = gamesRes.ok ? await gamesRes.json() : [];
        popularData = popularRes.ok ? await popularRes.json() : [];

    } catch (error) {
        console.error('Ошибка загрузки данных для поиска:', error);
        contentData = [];
        musicData = [];
        gamesData = [];
        popularData = [];
    }
}

function getAllSearchItems() {
    const movies = contentData.filter(i => i.category === 'movie').map(i => ({ ...i, type: 'movie' }));
    const series = contentData.filter(i => i.category === 'series').map(i => ({ ...i, type: 'series' }));
    const music = musicData.filter(i => ['album', 'artist', 'concert'].includes(i.type)).map(i => ({ ...i, type: 'music' }));
    const games = gamesData.map(i => ({ ...i, type: 'game' }));

    return [...movies, ...series, ...music, ...games];
}

function getItemLink(item) {
    if (item.type === 'movie' || item.type === 'series') {
        return `details.html?title=${encodeURIComponent(item.title)}`;
    } else if (item.type === 'music') {
        if (item.type === 'album') return `details.html?album=${encodeURIComponent(item.title)}`;
        if (item.type === 'artist') return `details.html?artist=${encodeURIComponent(item.name || item.title)}`;
        if (item.type === 'concert') return `details.html?concert=${encodeURIComponent(item.title)}`;
    } else if (item.type === 'game') {
        return `details.html?game=${encodeURIComponent(item.title)}`;
    }
    return '#';
}

function createSearchSuggestionCard(item) {
    const div = document.createElement('div');
    div.textContent = item.title || item.name;
    div.className = `search-suggestion ${item.type}`;
    div.addEventListener('click', () => {
        const searchInput = document.getElementById('searchInput');
        const suggestionsBox = document.getElementById('suggestions');
        searchInput.value = item.title || item.name;
        suggestionsBox.style.display = 'none';
        window.location.href = getItemLink(item);
    });
    return div;
}

async function setupSearch() {
    await loadSearchData();

    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('suggestions');
    if (!searchInput || !suggestionsBox) return;

    searchInput.addEventListener('input', () => {
        const value = searchInput.value.trim().toLowerCase();
        suggestionsBox.innerHTML = '';

        if (!value) {
            suggestionsBox.style.display = 'none';
            return;
        }

        const filtered = getAllSearchItems()
            .filter(item => (item.title || item.name).toLowerCase().includes(value))
            .slice(0, MAX_SUGGESTIONS);

        filtered.forEach(item => suggestionsBox.appendChild(createSearchSuggestionCard(item)));
        suggestionsBox.style.display = filtered.length ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', setupSearch);

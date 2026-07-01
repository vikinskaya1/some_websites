let contentData = [];
let musicData = [];
let gamesData = [];

async function loadData() {
    try {
        const [moviesRes, musicRes, gamesRes] = await Promise.all([
            fetch('data.json'),
            fetch('music.json'),
            fetch('games.json')
        ]);

        contentData = moviesRes.ok ? await moviesRes.json() : [];
        musicData = musicRes.ok ? await musicRes.json() : [];
        gamesData = gamesRes.ok ? await gamesRes.json() : [];

    } catch (error) {
        console.error('Ошибка loadData:', error);
        contentData = [];
        musicData = [];
        gamesData = [];
    }
}

async function loadLayout() {
    try {
        const header = await fetch('header.html').then(res => res.text());
        const footer = await fetch('footer.html').then(res => res.text());
        document.body.insertAdjacentHTML('afterbegin', header);
        document.body.insertAdjacentHTML('beforeend', footer);
    } catch (error) {
        console.error('Ошибка loadLayout:', error);
    }
}

function createGameCard(game) {
    return `
        <div class="album-card">
            <img src="${game.img}" alt="${game.title}" class="album-img"
                 onerror="this.src='https://via.placeholder.com/300x300?text=Game'">
            <div class="album-content">
                <h3>${game.title}</h3>
                <p>Жанр: ${game.genre || '—'}</p>
                <p>Год выхода: ${game.year || '—'}</p>
                <a href="${game.link || '#'}" target="_blank" class="button">Подробнее</a>
            </div>
        </div>
    `;
}

function renderGamesPage() {
    const container = document.querySelector('#cardContainer');
    if (!container) return;
    container.innerHTML = gamesData.map(createGameCard).join('');
}

async function setupSearch() {
    const allData = [...contentData, ...musicData, ...gamesData];

    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('suggestions');
    if (!searchInput || !suggestionsBox) return;

    function getAllSearchItems() {
        return allData.map(item => ({ ...item, type: item.type || item.category || 'unknown' }));
    }

    function getItemLink(item) {
        if (item.type === 'movie' || item.type === 'series') return `details.html?title=${encodeURIComponent(item.title)}`;
        if (item.type === 'album') return `details.html?album=${encodeURIComponent(item.title)}`;
        if (item.type === 'artist') return `details.html?artist=${encodeURIComponent(item.name || item.title)}`;
        if (item.type === 'concert') return `details.html?concert=${encodeURIComponent(item.title)}`;
        if (item.type === 'game') return `details.html?game=${encodeURIComponent(item.title)}`;
        return '#';
    }

    function createSuggestionCard(item) {
        const div = document.createElement('div');
        div.textContent = item.title || item.name;
        div.className = 'search-suggestion';
        div.addEventListener('click', () => {
            searchInput.value = item.title || item.name;
            suggestionsBox.style.display = 'none';
            window.location.href = getItemLink(item);
        });
        return div;
    }

    searchInput.addEventListener('input', () => {
        const value = searchInput.value.trim().toLowerCase();
        suggestionsBox.innerHTML = '';
        if (!value) {
            suggestionsBox.style.display = 'none';
            return;
        }
        const filtered = getAllSearchItems().filter(item =>
            (item.title || item.name).toLowerCase().includes(value)
        );
        filtered.forEach(item => suggestionsBox.appendChild(createSuggestionCard(item)));
        suggestionsBox.style.display = filtered.length ? 'block' : 'none';
    });

    document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    await loadData();
    renderGamesPage();
    await setupSearch();
});
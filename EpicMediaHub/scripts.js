let contentData = [];  // фильмы и сериалы
let popularData = [];
let musicData = [];    // музыка
let gamesData = [];    // игры

// Загружаем все JSON
async function loadData() {
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
        console.error('Ошибка загрузки данных:', error);
        contentData = [];
        musicData = [];
        gamesData = [];
        popularData = [];
    }
}

// Загрузка header/footer
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

// Создание карточки для отображения
function createCard(item) {
    const img = item.img || 'https://via.placeholder.com/200x300?text=EpicMedia';
    return `
        <div class="card">
            <img src="${img}" 
                 alt="${item.title || item.name}" 
                 class="card-img">
            <div class="card-content">
                <h3>${item.title || item.name}</h3>
                ${item.artist ? `<p>${item.artist}${item.year ? ` (${item.year})` : ''}</p>` : ''}
                <a href="${item.link || '#'}" class="button">Посмотреть</a>
            </div>
        </div>
    `;
}

// Рендер карточек фильмов и сериалов
function renderContent() {
    const moviesContainer = document.getElementById('moviesContainer');
    const seriesContainer = document.getElementById('seriesContainer');

    if (!moviesContainer || !seriesContainer) return;

    const movies = contentData.filter(i => i.category === 'movie');
    const series = contentData.filter(i => i.category === 'series');

    moviesContainer.innerHTML = movies.length
        ? movies.map(createCard).join('')
        : '<p>Фильмы не найдены 😢</p>';

    seriesContainer.innerHTML = series.length
        ? series.map(createCard).join('')
        : '<p>Сериалы не найдены 😢</p>';
}

// Рендер популярных карточек
function renderPopular() {
    const popularContainer = document.getElementById('cardContainer');
    if (!popularContainer || !popularData.length) return;

    popularContainer.innerHTML = popularData.map(createCard).join('');
}

// === Универсальный поиск (фильмы, музыка, игры) ===
async function setupSearch() {
    let allData = [...contentData, ...musicData, ...gamesData]; // popularData не нужен

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
// === Конец поиска ===


// Старт
document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    await loadData();
    renderContent();
    renderPopular();

    const title = document.getElementById('hero-title');
    if (title) {
        title.addEventListener('animationend', () => {
            title.classList.add('finished');
        });
    }

    await setupSearch(); // <-- запускаем поиск
});
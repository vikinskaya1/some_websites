let musicData = [];

async function loadData() {
    try {
        const response = await fetch('music.json');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        musicData = await response.json();
    } catch (error) {
        console.error('Ошибка loadData:', error);
        musicData = [];
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

function createAlbumCard(album) {
    const tracks = album.tracks?.map(t => `<li>${t}</li>`).join('') || '';
    const trackSection = tracks
        ? `<div class="tracks-container">
                <button class="btn-more">Показать треки</button>
                <ul class="track-list">${tracks}</ul>
           </div>`
        : '';

    return `
        <div class="album-card">
            <img src="${album.img}" alt="${album.title}" class="album-img" 
                 onerror="this.src='https://via.placeholder.com/300x300?text=Album'">
            <div class="album-content">
                <h3>${album.title}</h3>
                <p>Исполнитель: ${album.artist}</p>
                <p>Год выхода: ${album.year}</p>
                <p>Длительность: ${album.duration}</p>
                ${trackSection}
                <a href="details.html?album=${encodeURIComponent(album.title)}" class="button">Подробнее</a>
            </div>
        </div>
    `;
}

function createArtistCard(artist) {
    return `
        <div class="artist-card">
            <img src="${artist.img}" alt="${artist.name || artist.title}" class="artist-img"
                 onerror="this.src='https://via.placeholder.com/200x200?text=Artist'">
            <h3>${artist.name || artist.title}</h3>
            <p>Год основания: ${artist.founded || '—'}</p>
            <a href="details.html?artist=${encodeURIComponent(artist.name || artist.title)}" class="button">Подробнее</a>
        </div>
    `;
}

function createConcertCard(concert) {
    return `
        <div class="concert-card">
            <img src="${concert.img}" alt="${concert.title}" class="concert-img"
                 onerror="this.src='https://via.placeholder.com/300x200?text=Concert'">

            <h3>${concert.title}</h3>
            <p>Дата: ${concert.date}</p>
            <p>Город: ${concert.city || '—'}</p>

            <a href="details.html?concert=${encodeURIComponent(concert.title)}" class="button">
                Купить билеты
            </a>
        </div>
    `;
}

function createLatestAlbumCard(album) {
    const tracks = album.tracks?.map(t => `<li>${t}</li>`).join('') || '';

    return `
        <div class="latest-album-card">
            <img src="${album.img}" alt="${album.title}" class="latest-album-img"
                 onerror="this.src='https://via.placeholder.com/400x400?text=Album'">

            <div class="latest-album-content">
                <h2>${album.title}</h2>
                <p><strong>Исполнитель:</strong> ${album.artist}</p>
                <p><strong>Год:</strong> ${album.year}</p>
                <p><strong>Длительность:</strong> ${album.duration}</p>

                <ul class="track-list-full">
                    ${tracks}
                </ul>
            </div>
        </div>
    `;
}


function setupTrackButtons() {
    const buttons = document.querySelectorAll('.tracks-container .btn-more');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.parentElement;
            container.classList.toggle('active');
            btn.textContent = container.classList.contains('active') ? 'Скрыть треки' : 'Показать треки';
        });
    });
}

async function setupSearch() {
    let allData = [];

    try {
        const [moviesRes, gamesRes, musicRes] = await Promise.all([
            fetch('data.json'),
            fetch('games.json'),
            fetch('music.json')
        ]);

        const moviesData = moviesRes.ok ? await moviesRes.json() : [];
        const gamesData = gamesRes.ok ? await gamesRes.json() : [];
        const musicDataSearch = musicRes.ok ? await musicRes.json() : [];

        allData = [...moviesData, ...gamesData, ...musicDataSearch];
    } catch (e) {
        console.error('Ошибка загрузки данных для поиска:', e);
    }

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

function renderMusicPage() {
    const latestAlbumContainer = document.querySelector('#latestAlbum .latest-album-container');
    const concertsContainerEl = document.querySelector('#concertsContainer .card-container');
    const artistsContainerEl = document.querySelector('#artistsContainer .card-container');
    const albumsContainerEl = document.querySelector('#albumsContainer .card-container');

    if (!latestAlbumContainer || !concertsContainerEl || !artistsContainerEl || !albumsContainerEl) return;

    const latestAlbum = musicData.find(item =>
        item.type === "latestAlbum" && item.artist === "Linkin Park"
    );

    latestAlbumContainer.innerHTML = latestAlbum
        ? createLatestAlbumCard(latestAlbum)
        : '<p>Новый альбом не найден</p>';

    const concerts = musicData.filter(item => item.type === "concert");
    concertsContainerEl.innerHTML = concerts.map(createConcertCard).join('');

    const artists = musicData.filter(item => item.type === "artist");
    artistsContainerEl.innerHTML = artists.map(createArtistCard).join('');

    const albums = musicData.filter(item => item.type === "album");
    albumsContainerEl.innerHTML = albums.map(createAlbumCard).join('');

    setupTrackButtons();
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    await loadData();
    renderMusicPage();
    await setupSearch(); 
});

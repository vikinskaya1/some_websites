let contentData = [];

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        contentData = await response.json();
    } catch (error) {
        console.error('Ошибка loadData:', error);
        contentData = [];
    }
}

async function loadLayout() {
    try {
        const header = await fetch('header.html').then(res => res.text());
        const footer = await fetch('footer.html').then(res => res.text());

        document.body.insertAdjacentHTML('afterbegin', header);
        document.body.insertAdjacentHTML('beforeend', footer);


        const searchInput = document.getElementById('searchInput');
        const suggestionsBox = document.getElementById('suggestions');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderSuggestions(e.target.value);
            });
        }
        window.searchInput = searchInput;
        window.suggestionsBox = suggestionsBox;

    } catch (error) {
        console.error('Ошибка loadLayout:', error);
    }
}

function renderSuggestions(value) {
    if (!window.suggestionsBox || !window.searchInput) return;
    suggestionsBox.innerHTML = '';

    if (!value) {
        suggestionsBox.style.display = 'none';
        return;
    }

    const filtered = contentData.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.title;
        div.addEventListener('click', () => {
            window.location.href = `details.html?title=${encodeURIComponent(item.title)}`;
        });
        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = filtered.length ? 'block' : 'none';
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Рендер деталей оставила, но пока не вызываю
function renderDetails(title) {
    const movie = contentData.find(item => item.title === title);
    const container = document.getElementById('details-container');
    if (!container) return;

    if (!movie) {
        container.innerHTML = '<p>Фильм не найден 😢</p>';
        return;
    }

    container.innerHTML = `
        <div class="details-card">
            <img src="${movie.img}" alt="${movie.title}" class="details-poster"
                 onerror="this.src='https://via.placeholder.com/300x450?text=EpicMedia'">
            <div class="details-info">
                <h2>${movie.title}</h2>
                ${movie.year ? `<p><strong>Год:</strong> ${movie.year}</p>` : ''}
                ${movie.category ? `<p><strong>Жанр:</strong> ${movie.category}</p>` : ''}
                ${movie.desc ? `<p><strong>Описание:</strong> ${movie.desc}</p>` : ''}
                ${movie.link ? `
                    <div class="details-player">
                        <iframe src="${movie.link}" width="640" height="360" frameborder="0" allowfullscreen></iframe>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadLayout();
    await loadData();

    // Пока что оставила только бесконечную загрузку
    const container = document.getElementById('details-container');
    if (container) {
        container.innerHTML = '<p class="loading">Загрузка</p>';
    }

    // Позже можно вызвать renderDetails(title), когда данные будут готовы
    // const title = getQueryParam('title');
    // if (title) renderDetails(title);
});

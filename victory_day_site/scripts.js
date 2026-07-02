// Testimonial Slider
let slideIndex = 1;

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("testimonial-item");
    let dots = document.getElementsByClassName("dot");

    // Если на странице нет слайдера отзывов - ничего не делаем
    if (slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[slideIndex - 1].classList.add("active");
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
}

showSlides(slideIndex);

// Auto slide change (работает только если на странице есть слайдер)
if (document.getElementsByClassName("testimonial-item").length > 0) {
    setInterval(function () {
        slideIndex++;
        if (slideIndex > 3) { slideIndex = 1; }
        showSlides(slideIndex);
    }, 5000);
}

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
        document.querySelector('nav ul').classList.toggle('active');
    });
}

// Smooth scrolling (только для ссылок на реально существующие якоря на странице)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== Галерея: фильтры и лайтбокс ====================

document.addEventListener('DOMContentLoaded', function () {
    // Фильтры галереи
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Лайтбокс
    const lightbox = document.getElementById('lightbox');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', function () {
                const img = this.querySelector('img');
                const caption = this.querySelector('.gallery-caption');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCaption.textContent = caption ? caption.textContent : img.alt;
                lightbox.classList.add('active');
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
        }

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
        });
    }
});

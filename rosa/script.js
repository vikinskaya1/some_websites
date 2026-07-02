document.addEventListener("DOMContentLoaded", () => {

  const forms = document.querySelectorAll("form");
  const popup = document.getElementById("popup");
  const toast = document.getElementById("toast");

  forms.forEach(form => {
    form.addEventListener("submit", (e) => handleSubmit(e, form));
  });

  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = `toast ${type}`;

    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 2500);
  }

  function handleSubmit(e, form) {
    e.preventDefault();

    const name = form.querySelector('input[type="text"]');
    const phone = form.querySelector('input[type="tel"]');
    const button = form.querySelector("button");

    if (!name.value.trim() || !phone.value.trim()) {
      showToast("Заполните все поля", "error");
      return;
    }

    if (phone.value.trim().length < 7) {
      showToast("Введите корректный номер телефона", "error");
      return;
    }

    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Отправка...";

    setTimeout(() => {
      showToast("Заявка успешно отправлена!");

      form.reset();
      button.disabled = false;
      button.textContent = originalText;

      closePopupIfExists();
    }, 1200);
  }

  window.openForm = function () {
    if (popup) popup.classList.remove("hidden");
  };

  window.closeForm = function () {
    if (popup) popup.classList.add("hidden");
  };

  function closePopupIfExists() {
    if (popup) popup.classList.add("hidden");
  }

});

/* MENU */
function toggleMenu() {
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");

  menu.classList.toggle("active");
  overlay.classList.toggle("active");
}

/* SERVICES */
function toggleService(el) {
  const service = el.parentElement;
  service.classList.toggle("active");
}

window.openForm = function () {
  document.getElementById("popup").classList.remove("hidden");
};

window.closeForm = function () {
  document.getElementById("popup").classList.add("hidden");
};


function filterProjects(type, btn) {
  const cards = document.querySelectorAll(".project-card");
  const buttons = document.querySelectorAll(".filters button");

  buttons.forEach(btn => btn.classList.remove("active"));
  btn.classList.add("active");

  cards.forEach(card => {
    if (type === "all" || card.dataset.type === type) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

/* РАСКРЫТИЕ КАРТОЧКИ */
function toggleProject(btn) {
  const card = btn.closest(".project-card");

  card.classList.toggle("active");

  if (card.classList.contains("active")) {
    btn.textContent = "Свернуть";
  } else {
    btn.textContent = "Подробнее";
  }
}
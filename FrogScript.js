// ============================================
// ПР5: ДИНАМИЧЕСКИЙ РЕНДЕРИНГ КОНТЕНТА
// ============================================

// Имитация базы данных статей (загружаем из LocalStorage или используем начальные данные)
let initialArticles = JSON.parse(localStorage.getItem('myBlogPosts')) || [
    {
        id: 1,
        title: "Slime",
        date: "10 сентября 2026",
        isoDate: "2026-09-10",
        author: "Nikolay Gordeev",
        text: "Милый слайм из игры Genshin Impact. Эта 3D-модель была создана с вниманием к деталям: текстуры, анимация и освещение делают персонажа живым. Идеально подходит для портфолио или игровых проектов.",
        tags: "#genshinimpact",
        imageClass: "image-container_1"
    },
    {
        id: 2,
        title: "Fischl",
        date: "10 сентября 2026",
        isoDate: "2026-09-10",
        author: "Nikolay Gordeev",
        text: "Детализированная модель Fischl — принцессы осуждения из Genshin Impact. Сложный костюм, выразительная поза и качественный риггинг для анимаций. Отличная работа для демонстрации навыков моделирования персонажей.",
        tags: "#genshinimpact",
        imageClass: "image-container_2"
    },
    {
        id: 3,
        title: "Lauma",
        date: "10 сентября 2026",
        isoDate: "2026-09-10",
        author: "Nikolay Gordeev",
        text: "Элегантная модель Lauma с красивым освещением и композицией. Проект демонстрирует работу с материалами, текстурами и рендерингом. Создан в Blender с использованием Cycles для реалистичного результата.",
        tags: "#genshinimpact #blender",
        imageClass: "image-container_3"
    }
];

const postsContainer = document.getElementById('postsContainer');

function renderArticles(articlesArray) {
    // Очищаем контейнер перед каждым рендером
    postsContainer.innerHTML = '';

    // Если ничего не найдено, выводим сообщение
    if (articlesArray.length === 0) {
        postsContainer.innerHTML = '<p class="no-results">Ничего не найдено 😢</p>';
        return;
    }

    // Проходим циклом по каждому объекту в массиве
    articlesArray.forEach(article => {
        // Определяем, какое изображение использовать
        let imageHtml = '';
        if (article.customImage) {
            // Если есть загруженное пользователем изображение
            imageHtml = `<img src="${article.customImage}" alt="${article.title}" style="width: 100%; height: auto; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px;">`;
        } else if (article.imageClass) {
            // Если есть класс для фонового изображения (старые статьи)
            imageHtml = `<div class="${article.imageClass}"></div>`;
        } else {
            // Заглушка для статей без изображения
            imageHtml = `<div style="width: 100%; padding-bottom: 100%; position: relative; background-color: #e0e0e0; border-radius: 8px;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem;">📦</span>
            </div>`;
        }

        // Создаем HTML-шаблон для карточки статьи
        const articleHtml = `
            <article>
                <header>
                    <h3>${article.title}</h3>
                    <p>Опубликовано: <time datetime="${article.isoDate}">${article.date}</time></p>
                    ${imageHtml}
                    <p>by ${article.author}</p>
                </header>
                <p class="article-text short">${article.text}</p>
                <button class="read-more-btn">Читать далее</button>
                <footer>
                    <p>теги: ${article.tags}</p>
                </footer>
                ${article.modelFile && article.modelFileName ?
                    `<a href="${article.modelFile}" download="${article.modelFileName}" class="download-model-btn">
                        📥 Скачать модель (${article.modelFileName.split('.').pop().toUpperCase()})
                    </a>`
                    : ''}
                <button class="like-btn">❤ <span class="like-count">0</span></button>
            </article>
        `;

        // Вставляем сгенерированный HTML внутрь контейнера
        postsContainer.insertAdjacentHTML('beforeend', articleHtml);
    });

    // После рендеринга переинициализируем обработчики для новых элементов
    initializeLikeButtons();
    initializeReadMoreButtons();
}

// Запускаем первичный рендер при загрузке страницы
renderArticles(initialArticles);

// ============================================
// ПР5: ЖИВОЙ ПОИСК
// ============================================

const searchInput = document.getElementById('searchInput');

// Слушаем событие ввода текста в поле поиска
searchInput.addEventListener('input', function(event) {
    // Переводим введенный текст в нижний регистр
    const searchText = event.target.value.toLowerCase().trim();

    // Фильтруем массив статей (поиск по заголовку, тексту и тегам)
    const filteredArticles = initialArticles.filter(article => {
        const inTitle = article.title.toLowerCase().includes(searchText);
        const inText = article.text.toLowerCase().includes(searchText);
        const inTags = article.tags.toLowerCase().includes(searchText);

        // Если текст найден хотя бы в одном из мест — статья проходит фильтр
        return inTitle || inText || inTags;
    });

    // Перерисовываем страницу с отфильтрованными статьями
    renderArticles(filteredArticles);
});

// ============================================
// ПР4: ПЕРЕКЛЮЧАТЕЛЬ ТЕМ
// ============================================

// 1. Находим нашу кнопку по её ID
const themeButton = document.getElementById('themeBtn');

// 2. Вешаем слушатель события клик
themeButton.addEventListener('click', function() {
    // 3. Переключаем класс dark-theme на самом верхнем уровне — у тега body
    document.body.classList.toggle('dark-theme');

    // 4. Меняем текст на кнопке в зависимости от темы
    if (document.body.classList.contains('dark-theme')) {
        themeButton.textContent = '☀ Светлая тема';
    } else {
        themeButton.textContent = '🌙 Темная тема';
    }
});

// ============================================
// ПР4: СЧЁТЧИК ЛАЙКОВ (с переинициализацией)
// ============================================

function initializeLikeButtons() {
    // Находим ВСЕ кнопки лайков на странице
    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(function(button) {
        // Удаляем старые обработчики, если они были
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function() {
            // Находим спан со счетчиком именно внутри этой нажатой кнопки
            const countSpan = newButton.querySelector('.like-count');
            let currentLikes = parseInt(countSpan.textContent);

            // Проверяем, был ли уже поставлен лайк (по классу)
            if (newButton.classList.contains('liked')) {
                // Если лайк уже стоит — убираем его
                currentLikes--;
                countSpan.textContent = currentLikes;
                newButton.classList.remove('liked');
            } else {
                // Если лайка нет — ставим его
                currentLikes++;
                countSpan.textContent = currentLikes;
                newButton.classList.add('liked');
            }
        });
    });
}

// ============================================
// ПР4: СВОРАЧИВАНИЕ/РАЗВОРАЧИВАНИЕ ТЕКСТА (с переинициализацией)
// ============================================

function initializeReadMoreButtons() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');

    readMoreButtons.forEach(function(btn) {
        // Удаляем старые обработчики
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function() {
            // Находим текст, который идет ровно перед этой кнопкой
            const textBlock = newBtn.previousElementSibling;

            textBlock.classList.toggle('short');

            if (textBlock.classList.contains('short')) {
                newBtn.textContent = 'Читать далее';
            } else {
                newBtn.textContent = 'Свернуть';
            }
        });
    });
}

// ============================================
// ПР7: ФОРМА ДОБАВЛЕНИЯ НОВЫХ СТАТЕЙ
// ============================================

// 1. Находим форму и её элементы
const addForm = document.getElementById('addArticleForm');
const postTitleInput = document.getElementById('postTitle');
const postTextInput = document.getElementById('postText');
const postTagsInput = document.getElementById('postTags');
const postImageInput = document.getElementById('postImage');
const postModelInput = document.getElementById('postModel');
const imagePreview = document.getElementById('imagePreview');
const modelInfo = document.getElementById('modelInfo');

// Обработчик предпросмотра изображения
postImageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
    }
});

// Обработчик информации о 3D-модели
postModelInput.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // Размер в МБ
        const fileName = file.name;
        const fileExt = fileName.split('.').pop().toUpperCase();

        modelInfo.innerHTML = `
            <strong>📦 Файл модели:</strong> ${fileName}<br>
            <strong>Формат:</strong> ${fileExt}<br>
            <strong>Размер:</strong> ${fileSize} МБ
        `;
        modelInfo.style.display = 'block';
    } else {
        modelInfo.innerHTML = '';
        modelInfo.style.display = 'none';
    }
});

// 2. Слушаем событие отправки формы (submit)
addForm.addEventListener('submit', function(event) {
    // ОТМЕНЯЕМ ПЕРЕЗАГРУЗКУ СТРАНИЦЫ
    event.preventDefault();

    // 3. Собираем данные из полей ввода
    const titleValue = postTitleInput.value.trim();
    const textValue = postTextInput.value.trim();
    const tagsValue = postTagsInput.value.trim() || "#3dmodel";

    // Валидация данных
    if (titleValue.length < 3) {
        alert('Ошибка: Название модели должно быть не короче 3 символов!');
        return;
    }

    if (textValue.length < 20) {
        alert('Ошибка: Описание слишком короткое. Расскажите подробнее (минимум 20 символов)!');
        return;
    }

    // Обработка изображения
    let imageDataUrl = '';
    const file = postImageInput.files[0];

    // Обработка 3D-модели
    let modelDataUrl = '';
    let modelFileName = '';
    const modelFile = postModelInput.files[0];

    if (file || modelFile) {
        // Если есть файлы, обрабатываем их асинхронно
        const promises = [];

        if (file) {
            promises.push(new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageDataUrl = e.target.result;
                    resolve();
                };
                reader.readAsDataURL(file);
            }));
        }

        if (modelFile) {
            modelFileName = modelFile.name;
            promises.push(new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    modelDataUrl = e.target.result;
                    resolve();
                };
                reader.readAsDataURL(modelFile);
            }));
        }

        Promise.all(promises).then(() => {
            createAndSaveArticle(titleValue, textValue, tagsValue, imageDataUrl, modelDataUrl, modelFileName);
        });
    } else {
        createAndSaveArticle(titleValue, textValue, tagsValue, '', '', '');
    }
});

// Функция создания и сохранения статьи
function createAndSaveArticle(titleValue, textValue, tagsValue, imageDataUrl, modelDataUrl, modelFileName) {
    // Формируем красивую дату для новой статьи (сегодняшний день)
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const isoDate = today.toISOString().split('T')[0]; // Формат YYYY-MM-DD

    // 4. Создаем новый объект статьи
    const newArticle = {
        id: initialArticles.length + 1,
        title: titleValue,
        date: formattedDate,
        isoDate: isoDate,
        author: "Nikolay Gordeev",
        text: textValue,
        tags: tagsValue,
        imageClass: "",
        customImage: imageDataUrl, // Сохраняем изображение как base64
        modelFile: modelDataUrl, // Сохраняем 3D-модель как base64
        modelFileName: modelFileName // Имя файла модели
    };

    // 5. ДОБАВЛЯЕМ СТАТЬЮ В НАШУ "БАЗУ ДАННЫХ" (в начало массива)
    initialArticles.unshift(newArticle);

    // 6. СОХРАНЯЕМ В LocalStorage
    localStorage.setItem('myBlogPosts', JSON.stringify(initialArticles));

    // 7. ОБНОВЛЯЕМ ИНТЕРФЕЙС (перерисовываем список статей)
    renderArticles(initialArticles);

    // 8. Очищаем поля формы для следующей записи
    addForm.reset();
    imagePreview.innerHTML = '';
    imagePreview.style.display = 'none';
    modelInfo.innerHTML = '';
    modelInfo.style.display = 'none';

    // 9. Показываем сообщение об успехе
    alert('✅ 3D-модель успешно добавлена в портфолио!');
}

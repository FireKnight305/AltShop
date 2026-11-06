// 1. Находим нашу кнопку по её ID
const themeButton = document.getElementById('themeBtn');
// 2. Вешаем слушатель события клик
themeButton.addEventListener('click', function() {
    // 3. Переключаем класс dark-theme на самом верхнем уровне — у тега body
    document.body.classList.toggle('dark-theme');
    // 4. Логическое задание: Меняем текст на кнопке в зависимости от темы
    if (document.body.classList.contains('dark-theme')) {
        themeButton.textContent = '
☀ Светлая тема';
    } else {
        themeButton.textContent = '
🌙 Темная тема';
    }
});
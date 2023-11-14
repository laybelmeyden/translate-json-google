const translate = require('translate-google');
const fs = require('fs').promises;

// Устанавливаем язык, с которого будем переводить
translate.from = 'ru';
translate.to = 'en';

// Пример JSON для перевода
const inputJsonPath = './errors.json';  // Укажите путь к вашему JSON-файлу
const outputJsonPath = './translated.json';  // Укажите путь к файлу для сохранения переведенного JSON

// Функция для перевода JSON
async function translateJson(json) {
  const translatedJson = {};

  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];

      // Если значение находится в кавычках, переводим только содержимое
      console.log(`Идет перевод для ключа ${key}`);
      const translatedValue = value.includes('"')
        ? `"${await translate(value.replace(/"/g, ''), { from: 'ru', to: 'en' })}"`
        : await translate(value, { from: 'ru', to: 'en' });

      translatedJson[key] = translatedValue;
      console.log(`Перевод для ключа ${key} завершен`);
    }
  }

  return translatedJson;
}

// Вызываем функцию для перевода JSON
(async () => {
  try {
    console.log('Идет перевод...');
    const inputJson = JSON.parse(await fs.readFile(inputJsonPath, 'utf-8'));
    const result = await translateJson(inputJson);

    // Сохраняем переведенный JSON в файл
    await fs.writeFile(outputJsonPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`Переведенный JSON сохранен в файл: ${outputJsonPath}`);
  } catch (err) {
    console.error('Ошибка перевода:', err);
  }
})();

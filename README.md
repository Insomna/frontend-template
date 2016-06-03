# Шаблон Frontend-workflow

## Чтобы начать

Сборкой нашего проекта займется [Gulp.js](http://gulpjs.com/), 
для его работы на компьютере должен быть установлен [Node.js](https://nodejs.org/en/)

Для сборки готового проекта из имеющихся исходников, нужно выполнить несколько комманд в консоли:

`npm i` - это загрузит все зависимости для сборщика проекта
`bower i` или `bower update` - загрузит все зависимости для самого проекта
`gulp build` - это таск для сборщика, после его выполнения готовый к использованию проект будет помещен в директорию *dist*

## Редактирование проекта

Все исходники проекта находятся в директории *src*

В проекте используются:

1. [LESS](http://lesscss.org/)
2. Чистый HTML разделенный на шаблоны при помощи Gulp-плагина Rigger
3. Spritesmith - автоматический сборщик спрайтов
4. JS

LESS исходники лежат в директории *less*
Файлы начинающиеся с нижнего подчеркивания являются модулями подлючаемыми в главный файл *main.less*
Изображения из которых собирается sprite в директории *img*
Изображения не относящиеся к оформлению проекта - в дирректории *content*


### Пересборка проекта налету

Для того чтобы видеть иземения внесенные в проект моментально, достаточно выполнить одну комманду в консоли

`gulp watch`

При редактировании html возможно придется сохранить файл два раза чтобы увидеть изменения, я пока не нашел причину этого бага

### Важно!

Все изменения нужно вносить в исходные файлы в директории *src*

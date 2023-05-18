### Зависимости

* [Node.js](https://nodejs.org/) 14.8 or newer
* [LAME](https://lame.sourceforge.io)

### Запуск

`npm i`\
\
`npm run dev dir=<path> [save] url=<url>`\
или\
`npm run build`\
`node build/index.js dir=<path> [save] url=<url>`
* `dir` - путь к файлам, можно несколько. Обязательный параметр.
* `save` - если указан, сконвертированные файлы будут сохранены в папке `var/spool/asterisk/<год>/<месяц>/<день>` в зависимости от даты.
* `url` - если указан, список сконвертированных файлов будет отправлен POST запросом на этот адрес.

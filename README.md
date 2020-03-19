
![logo]

Документация к system API /docs/redoc-static.html

# DOCKER

Для того чтобы запустить приложение, используя **docker** нужно:

1) Создать файл .env и внести в него нужные переменные 

- Нельзя указывать переменные:

- `SLACK_EVENT_SERVER_PORT`

2) Настроить файл Caddyfile (для https и настройки LetsEncrypt):

- заменить `#domain#` на ваш домен

- заменить `#email#` на ваш email

3) Выполнить команды:

- `docker build -t exceedteam_bot .`

- `docker exec -it bdaybot_bot_1 npm run db:migrate` для запуска миграций

- `docker exec -it bdaybot_bot_1 npm run db:seed` для добавления начального списка тегов

- `docker-compose up -d`


# Получить токен Slack

https://api.slack.com/apps/{Your APP ID}/oauth

# ENV

`WEATHER_INTERVAL` - Частота обновления погоды в минутах (default: 15)

`WEATHER_API_TOKEN` - Токен API к сервису openweathermap.org (default: b6907d289e10d714a6e88b30761fae22)

`APP_DB` - База данных для приложения (default (SQLite3): dbs/app_database.sqlite3)

`SLACK_API_TOKEN` - токен Slack

`SLACK_EVENT_SERVER_PORT` - порт Event Server Slack (default: 3003)

`SLACK_EVENT_SERVER_SECRET` - cекретный ключ (добавляется в QUERY ?secret={SLACK_EVENT_SERVER_SECRET}) (default: super_secret)

# SLACK

## Path:

`/slack/events?secret={SLACK_EVENT_SERVER_SECRET}` - Events URL

`/slack/interactive?secret={SLACK_EVENT_SERVER_SECRET}` - Interactive URL

# Установка


## Добавить Slash команды в панели управления

### /ventilation_schedule

Request URL - https?: //{YOUR DOMAIN}/slack/slash/ventillation/schedule?secret=super_secret

Short Description - Ventilation Schedule

### /ventilation_add

Request URL - https?: //{YOUR DOMAIN}/slack/slash/ventillation/add?secret=super_secret

Short Description - Ventilation Add

### /settings_admin

Request URL - https?: //{YOUR DOMAIN}/slack/slash/settings/admin?secret=super_secret

Short Description - Settings Admin

### /settings_weather

Request URL - https?: //{YOUR DOMAIN}/slack/slash/settings/weather?secret=super_secret

Short Description - Settings Weather

### /weather

Request URL - https?: //{YOUR DOMAIN}/slack/slash/weather?secret=super_secret

Short Description - Current Weather

### /feedback_add

Request URL - https?: //{YOUR DOMAIN}/slack/slash/feedback/add?secret=super_secret

Short Description - Feedback Add

### /feedback_list

Request URL - https?: //{YOUR DOMAIN}/slack/slash/feedback/list?secret=super_secret

Short Description - Feedback List

### /settings_tag_add

Request URL - https?: //{YOUR DOMAIN}/slack/slash/settings/tag_add?secret=super_secret

Short Description - Settings Tag Add

### /call_start

Request URL - https?: //{YOUR DOMAIN}/slack/slash/call/start?secret=super_secret

Short Description - Начат звонок

### /call_remind

Request URL - https?: //{YOUR DOMAIN}/slack/slash/call/remind?secret=super_secret

Short Description - Напоминание о звонке

### /call_stop

Request URL - https?: //{YOUR DOMAIN}/slack/slash/call/stop?secret=super_secret

Short Description - Звонок завершен

Добавить URL https?: //{YOUR DOMAIN}/slack/interactive?secret=super_secret на странице с настройками интерактивных компонентов

## После добавления бота в Slack необходимо добавить его в канал, в котором он должен работать


[logo]: botImage.png 'Bot Logo'

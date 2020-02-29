# Получить токен Slack

https://api.slack.com/apps/{Your APP ID}/oauth

# ENV

`WEATHER_INTERVAL` - Частота обновления погоды в минутах (default: 15)

`WEATHER_API_TOKEN` - Токен API к сервису openweathermap.org (default: b6907d289e10d714a6e88b30761fae22)

`SLACK_DB` - База данных для Slack (default: sqlite:./slack_database.db)

`APP_DB` - База данных для приложения (default: sqlite:./app_database.db)

`SLACK_API_TOKEN` - токен Slack

`SLACK_EVENT_SERVER_PORT` - порт Event Server Slack (default: 3003)

`SLACK_EVENT_SERVER_SECRET` - cекретный ключ (добавляется в QUERY ?secret={SLACK_EVENT_SERVER_SECRET}) (default: super_secret)

# SLACK

## Slash path:

`/slack/slash/ventillation?secret={SLACK_EVENT_SERVER_SECRET}` - command /ventillation

`/slack/slash/admins?secret={SLACK_EVENT_SERVER_SECRET}` - command /admins


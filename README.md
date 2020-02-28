# Получить токен Slack

https://api.slack.com/apps/{Your APP ID}/oauth

# ENV

`SLACK_DB` - База данных для Slack (default: sqlite:./slack_database.db)

`SLACK_API_TOKEN` - токен Slack

`SLACK_EVENT_SERVER_PORT` - порт Event Server Slack (default: 3003)

`SLACK_EVENT_SERVER_SECRET` - cекретный ключ (добавляется в QUERY ?secret={SLACK_EVENT_SERVER_SECRET}) (default: super_secret)

# SLACK

## Slash path:

`/ventillation?secret={SLACK_EVENT_SERVER_SECRET}` - command /ventillation

`/admins?secret={SLACK_EVENT_SERVER_SECRET}` - command /admins


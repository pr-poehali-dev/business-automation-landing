import json
import os
import re
import urllib.request


SPAM_KEYWORDS = ['casino', 'viagra', 'crypto', 'bitcoin', 'нигерия', 'выигрыш', 'займ', 'кредит без', 'http://', 'https://', 't.me/+', '.onion']


def is_spam(text: str) -> bool:
    t = text.lower()
    if sum(1 for kw in SPAM_KEYWORDS if kw in t) >= 2:
        return True
    if len(re.findall(r'https?://', text)) > 1:
        return True
    if len(text) > 2000:
        return True
    return False


def handler(event: dict, context) -> dict:
    """Отправляет заявку с сайта в Telegram с защитой от спама."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    contact = body.get('contact', '').strip()
    task = body.get('task', '').strip()
    honeypot = body.get('_hp', '')

    if honeypot:
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

    if not contact or not task:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните обязательные поля'})
        }

    if len(task.strip()) < 10:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Опишите задачу подробнее'})
        }

    if is_spam(task) or is_spam(name) or is_spam(contact):
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

    bot_token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_id = os.environ['TELEGRAM_CHAT_ID']

    text = (
        "📩 *Сообщение с сайта*\n\n"
        f"👤 *Имя:* {name or 'не указано'}\n"
        f"📬 *Контакт:* {contact}\n"
        f"📝 *Задача:*\n{task}"
    )

    payload = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }).encode('utf-8')

    req = urllib.request.Request(
        f'https://api.telegram.org/bot{bot_token}/sendMessage',
        data=payload,
        headers={'Content-Type': 'application/json'}
    )
    urllib.request.urlopen(req)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
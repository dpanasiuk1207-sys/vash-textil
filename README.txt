ВАШ ТЕКСТИЛЬ — V13 FINAL

ЩО Є:
- 4 категорії каталогу: Подушки, Ковдри, Постіль, Покривала.
- Горизонтальні rails з плавним скролом.
- Фільтр за категорією, розміром і ціною.
- Сторінка товару з 6 фото + окремим відео-елементом.
- Кошик через localStorage.
- Checkout з доставкою Нова Пошта / Укрпошта.
- Два способи оплати: онлайн або післяплата.
- Google Sheets backend.
- WayForPay TEST через Apps Script; SecretKey не зберігається у GitHub.

ВАЖЛИВО ПРО МЕДІА:
Поточні фото — демонстраційні зовнішні референси. Перед комерційним запуском замініть їх на власні або ліцензовані матеріали. Для відео використано технічний MP4 fallback, щоб плеєр гарантовано мав формат для тесту; це не відео конкретної моделі. Pexels має безкоштовні bedding/pillow відео для заміни.

WAYFORPAY TEST:
Apps Script → Project Settings → Script Properties:
WFP_MERCHANT_ACCOUNT = test_merch_n1
WFP_SECRET_KEY = ключ тестового мерчанта (поточний код містить приклад із офіційної документації; якщо WayForPay видасть інший тестовий ключ, замініть його тут)
WFP_DOMAIN = dpanasiuk1207-sys.github.io/vash-textil
WFP_RETURN_URL = https://dpanasiuk1207-sys.github.io/vash-textil/payment-result.html
WFP_SERVICE_URL = ваш /exec URL Apps Script

google-apps-script.js НЕ завантажувати як фронтенд-скрипт на сайт. Його вміст вставляється в Google Apps Script.

GitHub Pages:
- index.html має бути в корені.
- додайте файл .nojekyll.
- завантажуйте всі файли комплекту.

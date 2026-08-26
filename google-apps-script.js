// Цей код має бути в Google Apps Script, а не виконуватися GitHub Pages.
const SPREADSHEET_ID = '1-2HrDV0NwBm0pvcJ0wygF9gUQqES-heskZDgSgKmAnQ';
const SHEET_NAME = 'Orders';

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Дата','Ім’я','Телефон','Товар','Розмір','Кількість','Доставка','Місто','Відділення','Коментар','Кошик']);
  }
  sh.appendRow([
    new Date(), data.name||'', data.phone||'', data.product||'', data.size||'',
    data.qty||'1', data.delivery||'', data.city||'', data.branch||'',
    data.comment||'', JSON.stringify(data.cart||[])
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}

const fs = require('fs');

(async function () {
  const allCurrencies = JSON.parse(
    fs.readFileSync('./currencies.json', 'utf-8'),
  );
  const monoCurrencies = await fetch(
    'https://api.monobank.ua/bank/currency',
  ).then((r) => r.json());

  const enabled = monoCurrencies.map((c) => c.currencyCodeA);
  enabled.push(980); // UAH (is always in currencyCodeB)

  const result = [];
  for (const code in allCurrencies) {
    result.push({
      numCode: allCurrencies[code].ISOnum,
      code: code,
      name: allCurrencies[code].name,
      enabled: enabled.includes(allCurrencies[code].ISOnum),
    });
  }

  fs.writeFileSync('./result.txt', JSON.stringify(result, null, 2), 'utf-8');
  console.log(
    'DONE. Result is saved to result.txt. Please, review it and paste it to the currency.service.ts file.',
  );
})();

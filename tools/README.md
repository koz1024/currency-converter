Since currencies are being stored just in Service as a piece of code, a tool has been created to generate the array of currencies.

This tool does the following steps:
1. Takes the currencies from the predefined `currencies.json` file.
2. Converts them to the format used in the system.
3. Gathers available currencies from the Monobank's API
4. Compares the two lists and marks currencies as available or not.
5. Saves the result to the `result.txt` file.

To generate the currencies array, run the following command:
```bash
cd tools
node parseCurrencies.js
```

After that, an array of currencies will be generated and placed into the `result.txt` file. You can copy the content of the file and paste it into the `src/currency/currency.service.ts` file as the `currencies` array.

**It's already been done**, so you probably **should not** run this script. 

Please, note that it is a simple script with no edge cases processing nor error handling. If you spot any error you'll have to fix it.

Source of the all currencies is from the following link:
https://github.com/ourworldincode/currency/blob/main/currencies.json
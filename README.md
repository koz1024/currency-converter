## Description

see the document: https://docs.google.com/document/d/1jX124RtoYyuYxHV8ivnRcYkp9UKLjZp72KW25Goz1jQ/edit

The application consists of the client and server sides.

## Installation

#### Pre-requisites
`NodeJS` with `npm` and `Docker` are required to run this application.

Also, a npm package `nest-cli` is required to be installed globally:
```bash
$ npm i -g @nestjs/cli
```

#### Clone the repository
```bash
$ git clone https://github.com/koz1024/currency-converter.git
```

#### Install dependencies & build the app
```bash
$ npm run init 
```
This command will run `npm install` & `npm run build` on both client and server sides.
Also, this command will up the docker container with Redis (required).

**!!!** Make sure that ports `6379` and `3000` are free on your machine. **!!!**

#### To build the backend only [not recommended]
```bash
$ npm install
$ npm run build:server
$ mkdir client/dist
```

## Running the app

#### Locally
```bash
$ npm run start
```
UI: http://127.0.0.1:3000/

Swagger: http://127.0.0.1:3000/api/swagger

To change the frequency of the rates update, you can set the `RATE_UPDATE_FREQUENCY` environment variable (see .env)

## Assumptions

#### Currencies
After a long consideration, I've put list of currencies directly into the `Currency Service`. (List of currencies, not rates!)

The reason is:
- list of currencies will be always in the runtime, no need to fetch it from the database (=> faster).
- world currencies are not changed frequently, so we don't need to have a separate admin panel to manage them.
- thus, we got rid of the database at all.

Also, there is a `tool` to initialize currencies (see respective readme), but it's not needed to run it, since the currencies are already added.  

#### Other assumptions:
- database is not needed. Since any kind of admin panel is not required, we can store the rates in memory (Redis) and currencies in the respective service. 
- cross rate is not a double conversion rate (see below)
- the Monobank API's structure will never be changed :) 

## Double conversion
Since the Monobank API contains only "foreign <-> UAH", to support "foreign <-> foreign" conversion, we need to perform a double conversion.
So, there is a parameter `doubleConversion` in the `POST /api/convert` request which enables this feature (without setting this parameter to the `true` the API will return an error in case of absence of direct rates).

If double conversion is enabled, and it's the only way to convert (no direct rates), the API will perform the following steps:
- convert the source currency to UAH
- convert UAH to the target currency

In the response the `isDoubleConverted` is always sent (true or false, regarding whether the conversion is used or not).


## Cross rate

Inside the Monobank API there are two types of rates:
- buy + sell
- cross

The `cross` rate doesn't seem to be the "double conversion rate". Here is what I found in the internet:
> The "cross price" does not directly imply a double conversion, but it is related to the concept. The cross price is derived from the exchange rates of two currencies against a common third currency, without necessarily undergoing an actual double conversion process. It's a theoretical or calculated exchange rate used for currencies that may not have a direct exchange market.
> 
> Double conversion, on the other hand, involves actually converting one currency to a common currency (like USD or EUR), and then converting that common currency to the target currency. This process incurs two sets of transaction fees and potentially two spreads.
>
> When a bank or exchange service provides a "cross price," they are offering a direct exchange rate that doesn't require the customer to physically go through the double conversion process. However, the rate itself is calculated based on the indirect relationship through a common currency, which conceptually resembles double conversion. The key difference is that the financial institution handles the complexities of deriving this rate, and the customer is presented with a single "cross price" for simplicity and potentially lower costs compared to actually executing a double conversion.

So, my assumption is that cross rate is not a double conversion rate, and it's simply being used in the conversion process, despite the "doubleConversion" parameter.

## Room for improvements

- [ ] **3d party API fallback**. We depend on the Monobank API. If it's down, we'll have only old rates. We can add a fallback to another API to prevent such situations. Also, *cold start:* if the MonoAPI is down, and we have no rates in Redis, the app will not work.
- [ ] **Better file structure.** Since it's a tiny application, I didn't want to overcomplicate the file structure. Currently, inside each module's folder, it's a just heap of files. But in a real-world application, it's better to have a more organized file structure to make the code more maintainable.
- [X] **Unit Tests**. In order to save time, I've done manual testing only. The real application should be covered with unit tests.
- [ ] **Throttling.** Shouldn't we limit the number of requests to our app in order to prevent abuse?
- [ ] **Better UI**. Since the UI is not part of the requirements, I didn't spend much time on it. But it's definitely not production-ready.
- [ ] [Minor] some eslint & prettier rules should be added.
- [ ] [depends on the infrastructure], but I'd move from Nest's "cron" to something like Lambdas or at least to a real cron job.
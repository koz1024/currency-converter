<template>

    <form>
      <div class="">
        <label for="amount">Amount</label>
        <input type="number" id="amount" class="form-control" v-model="amount" />
      </div>
      <div class=" mt-3">
        <label >From currency:</label>
        <CurrencySelector @selected="setFromCurrency" />
      </div>
      <div class=" mt-3">
        <label >To currency:</label>
        <CurrencySelector @selected="setToCurrency" />
      </div>
      <div class="mt-3">
        <label>
          <input type="checkbox" class="form-check-input" v-model="doubleConversion" />
          Enable double conversion
        </label>
      </div>
      <div class="mt-3">
        <button class="w-100 btn btn-lg btn-primary" @click.prevent="convert">Convert</button>
      </div>
      <div class="mt-3 alert alert-success" v-if="result" v-html="result">
      </div>
      <div class="mt-3 alert alert-danger" v-if="error">
        <p>{{ error }}</p>
      </div>
    </form>

</template>

<script>
import CurrencySelector from "@/components/CurrencySelector";
export default {
  name: "CurrencyConverter",
  components: { CurrencySelector },
  data() {
    return {
      isResult: false,
      result: null,
      error: null,
      amount: 0,
      from: null,
      to: null,
      doubleConversion: false,
    };
  },
  methods: {
    setFromCurrency(currency) {
      this.from = currency;
    },
    setToCurrency(currency) {
      this.to = currency;
    },
    convert() {
      if (this.amount > 0) {
        fetch('/api/convert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: this.amount,
            source: this.from,
            target: this.to,
            doubleConversion: this.doubleConversion,
          }),
        })
          .then(response => {
            try {
              const json = response.json();
              return json;
            } catch (e) {
              throw new Error('Invalid response from server');
            }
          })
          .then(data => {
            if (data.error) {
              this.error = data.error;
              this.result = null;
            } else {
              this.result = `<h2>${data.amount} ${this.to}</h2><p>Rate: ${data.rate}</p>`;
              if (data.isDoubleConverted) {
                this.result += `<p><strong>Double conversion rate has been used</strong></p>`;
              }
              this.error = null;
            }
          })
          .catch(error => {
            this.error = error;
            this.result = null;
          });
      }
    },
  },
};
</script>

<style scoped>

</style>
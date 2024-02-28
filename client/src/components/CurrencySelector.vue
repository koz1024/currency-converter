<template>
  <div v-if="isLoading">
    <p>Loading...</p>
  </div>
  <div v-if="isError">
    <p>No currencies</p>
  </div>
  <div v-if="!isLoading && !isError">
    <select class="form-control" @change="setCurrency">
      <option v-for="currency in currencies" :key="currency.code" :value="currency.code">{{ currency.title }}</option>
    </select>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "CurrencySelector",
  data() {
    return {
      isLoading: true,
      isError: false,
      currencies: [],
    }
  },
  created() {
    fetch('/api/currency')
    .then(response => response.json())
    .then(data => {
      this.currencies = ref(data.map(currency => ({
        numCode: currency.numCode,
        code: currency.code,
        title: `${currency.code} (${currency.name})`
      })));
      this.isLoading = false;
      this.$emit('selected', this.currencies[0].code);
    })
    .catch(error => {
      console.error('Error:', error);
      this.isError = true;
      this.isLoading = false;
    });
  },
  methods: {
    setCurrency(currency) {
      this.$emit('selected', currency.target.value);
    }
  }
};
</script>

<style scoped>

</style>
<template>
  <div id="content" class="with-sidebar">
    <div class="container">Pass ID: {{ $route.params.id }}</div>
  </div>
</template>

<script>
import { Pass } from "~/types/Pass";

export default {
  
  middleware: ['auth'],
  data: () => ({
      pass: Pass
  }),

  async fetch() {
    const pass = await this.$axios
      .get("/pass/" + this.$route.params.id)
      .then((r) => {
        return r.data;
      })
    this.pass = pass;
  }
}
</script>

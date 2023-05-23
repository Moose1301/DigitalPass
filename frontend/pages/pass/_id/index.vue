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
      }).catch((err) => {
        console.log(err.response.data)
        return {
          error: err.response.data.error
        }
      });
      if(pass == undefined || pass.error !== undefined) {
        console.log("Error", pass.error);

        this.$router.push("/profile")
        return; 
      }
    this.pass = pass;
  }
}
</script>

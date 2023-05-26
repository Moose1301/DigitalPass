<template>
  <div class="text-center">
    <div class=" 

    bg-black rounded-lg mx-auto mt-8 max-w-sm h-96 text-slate-200"
    >
      <div>
        Issuer: {{ pass.issuedBy }}
      </div>
      <div>
        At: {{ format_date(pass.issuedAt) }}
      </div>
      <div>
        From: {{ pass.roomFrom }}
      </div>
      <div>
        To: {{ pass.roomTo }}
      </div>
      <div class="mx-auto ">
        <img class="w-16 md:w-32 lg:w-32" :src=get_qr_url()>
      </div>
    </div>

  </div>
      

</template>

<script>
import { Pass } from "~/types/Pass";
import moment from "moment";
export default {
  
  middleware: ['auth'],
  data: () => ({
      pass: Pass
  }),
  methods: {
    get_qr_url() {
      return "https://chart.googleapis.com/chart?chs=150x150&cht=qr&choe=UTF-8&chl=" +  this.$route.path
    },
    format_date(value) {
      return moment(String(value)).format("MM/DD HH:mm")
    }
  },
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

<template>
  <div id="content" class="with-sidebar">
    <div class="container">Hello {{ $auth.user.name_first }}</div>

    <div class="table table-responsive border border-5 border-slate-500">
      <table class="table">
        <colgroup>
          <col width="20%" />
          <col width="30%" />
          <col width="50%" />
        </colgroup>
        <thead>
          <tr>
            <th class="border border-collapse border-5 border-slate-500">
              Issuer
            </th>
            <th class="border border-collapse border-5 border-slate-500">
              To Room
            </th>
            <th class="border border-collapse border-5 border-slate-500">
              Issued Time
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pass in passes" :key="pass.id" >
            <td class="border border-collapse border-5 border-slate-500">
              <NuxtLink :to="`/pass/${pass.id}`">
                {{ pass.issuedBy }}
              </NuxtLink>
            </td>
            <td class="border border-collapse border-5 border-slate-500">
              <NuxtLink :to="`/pass/${pass.id}`">
                {{ pass.roomTo }}
              </NuxtLink>
            </td>
            <td class="border border-collapse border-5 border-slate-500">
              <NuxtLink :to="`/pass/${pass.id}`">
                {{ pass.issuedAt }}
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  middleware: ['auth'],
  data: () => ({
      passes: [],
  }),

  async fetch() {
    const passes = await this.$axios
      .get("/pass/self")
      .then((r) => {
        return r.data.passes;
      })
    this.passes = passes;
  }
}
</script>

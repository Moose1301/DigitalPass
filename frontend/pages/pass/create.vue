<template>
  <div id="content" class="with-sidebar">
    <div class="container">
      TODO
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth', 'permission'],
  meta: {
    permission: "PASS_CREATE"
  }

}
</script>
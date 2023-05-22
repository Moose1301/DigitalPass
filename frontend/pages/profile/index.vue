<template>
  <div id="content" class="with-sidebar">
    <div class="container">Hello {{ $auth.user.name_first }} </div>
  </div>
</template>

<script>

export default {
    middleware: ['auth']

}
</script>

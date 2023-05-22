<template>
  <div id="content" class="with-sidebar">
    <div class="container">Pass ID: {{ $route.params.id }}</div>
  </div>
</template>

<script>

export default {
    middleware({ $auth, redirect }) {

    if (!$auth.loggedIn) {
      console.log($auth)
    }
  }
}
</script>

<template>
    <div id="page" :class="page == 'index' ? 'home' : ''">
        <Header/>
        <Nuxt/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            page: this.$route.name
        }
    }
}
</script>
<template>
    <div id="header">
        <div class="nav">
            <div class="container">
                <ul class="left">
                    <NuxtLink to="/"><li :class="$route.name == `index` ? 'active' : ''"><a>Home</a></li></NuxtLink>
                </ul>

                <div class="right">
                    <template v-if="$auth.loggedIn">
                        <NuxtLink :to="`/profile`">
                            <a class="login-button">
                                <i class="mdi mdi-account"></i>
                            </a>
                        </NuxtLink>
                    </template>
                    <NuxtLink to="/login" v-else>
                        <a class="login-button">
                            <i class="mdi mdi-account-plus"></i>
                        </a>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="header-content">
            <div class="container">
                <div class="col logo text-center">
                    <div id="logo">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
    body {
        font-family: 'Karla', sans-serif;
        margin: 0;
    }
</style>
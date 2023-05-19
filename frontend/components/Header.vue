<template>
  <nav class="fixed w-full p-6 bg-slate-500">
    <div class="md:hidden">
      <button @click="drawer">
        <svg
          class="h-8 w-8 fill-current text-zinc-200"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          view-box="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
    <!-- Navbar -->
    <div class="hidden md:block">
      <ul class="flex space-x-8 text-sm font-sans">
        <li>
          <a href="#" class="
          active hover:border-b-2 
          hover:text-zinc-100 
          border-blue-500 pb-1 text-zinc-200">Home
        </a>
        </li>
        <template v-if="$auth.loggedIn">
          <li>
            <NuxtLink to="/profile">
              <a
                href="#"
                class="
                cta hover:border-b-2
                hover:bg-blue-500 px-3 py-2 
                rounded text-zinc-200 
                font-semibold px-4 py-2"
                >`$auth.user.name_first`</a
              >
            </NuxtLink>
          </li>
        </template>
        <NuxtLink to="/login" v-else>
          <li>
            <a class="login-button">
              <a class="
              hover:border-b-2 
              border-blue-500 pb-1
              hover:text-zinc-100 
              text-right text-zinc-200
              px-4 py-2">Sign In</a>
            </a>
          </li>
        </NuxtLink>
      </ul>
    </div>
    <transition
      enter-class="opacity-0"
      enter-active-class="ease-out transition-medium"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-active-class="ease-out transition-medium"
      leave-to-class="opacity-0"
    >
      <div
        @keydown.esc="isOpen = false"
        v-show="isOpen"
        class="z-10 fixed inset-0 transition-opacity"
      >
        <div
          @click="isOpen = false"
          class="absolute inset-0 bg-black opacity-50"
          tabindex="0"
        ></div>
      </div>
    </transition>

    <!-- Drawer Menu -->
    <aside
      class="p-5 transform top-0 left-0 w-64 bg-slate-500 fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="close">
        <button
          class="absolute top-0 right-0 mt-4 mr-4"
          @click="isOpen = false"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <span
        @click="isOpen = false"
        class="flex w-full items-center p-4 border-b"
      >
        <h1 class="text-xl my-4 inline-block text-zinc-100">Digital Pass</h1>
      </span>

      <!--Side Bar Pop out-->
      <ul class="divide-y font-sans">
        <li>
          <a href="#" 
          @click="isOpen = false" 
          class="
          my-4 inline-block text-zinc-200
          hover:text-zinc-100 
          ">Home</a>
        </li>

        <li>
          <template v-if="$auth.loggedIn">
            <NuxtLink to="/profile">
              <a
                href="#"
                class="
                cta bg-blue-white hover:bg-blue-600
                px-3 py-2 rounded 
                hover:text-zinc-100
                text-zinc-200 font-semibold"
                >`$auth.user.name_first`</a
              >
            </NuxtLink>
          </template>
          <NuxtLink to="/login" v-else>
            <a class="login-button">
              <a
                class="
                my-8 w-full text-center 
                font-semibold cta inline-block 
                bg-blue-500 hover:bg-blue-600
                px-3 py-2 rounded text-zinc-200"
                >Sign In
              </a>
            </a>
          </NuxtLink>
        </li>
      </ul>
    </aside>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    drawer() {
      this.isOpen = !this.isOpen
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (process.client) {
          if (isOpen) document.body.style.setProperty('overflow', 'hidden')
          else document.body.style.removeProperty('overflow')
        }
      },
    },
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 27 && this.isOpen) this.isOpen = false
    })
  },
}
</script>



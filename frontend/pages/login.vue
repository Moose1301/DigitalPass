<template>
  <div id="content" class="with-sidebar">
    <div class="container">
      <div class="content full login">
        <div class="section-wrap">
          <div class="section-content">
            <form>
              <div class="form-group">
                <label>Email</label>
                <input placeholder="Email" v-model="email" />
              </div>
              <div class="form-group">
                <label>Password</label>
                <input
                  placeholder="password"
                  type="password"
                  v-model="password"
                />
              </div>
              <button
                type="submit"
                @click.stop.prevent="submit()"
                class="login-btn"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'guest',
  head() {
    return {
      title: 'Login',
    }
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async submit() {
      //this.$toast.show('Logging In');
      await this.$auth
        .loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
            token: ''
          },
        })
        .then(() => {
          //this.$toast.success("Logged in");
          this.$router.push('/profile')
        })
        .catch((err) => {
          if (err.response) {
            alert(err.response.data.error)
            //this.$toast.error(err.response.data.error);
          }
        })
    },
  },
}
</script>
<template>
  <div class="row justify-center">
    <div class="q-mt-xl">
      <div class="logo text-center">
        <img src="~assets/logo.png" alt="logo">
      </div>
      <q-field class="q-mt-xl">
        <q-input
          class="q-mb-sm"
          float-label="用户名"
          v-model="loginForm.username"
          @blur="$v.loginForm.username.$touch"
          :error="$v.loginForm.username.$error"
        />
        <q-input
          float-label="密码"
          v-model="loginForm.password"
          type="password"
          @blur="$v.loginForm.password.$touch"
          :error="$v.loginForm.password.$error"
          @keyup.enter="onLogin"
        />
      </q-field>
      <q-field class="q-mt-lg">
        <q-btn color="primary" class="full-width q-mb-md" @click="onLogin">登录</q-btn>
        <q-btn color="teal" class="full-width" @click="goRegister">注册</q-btn>
      </q-field>
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  validations: {
    loginForm: {
      username: {
        required,
        minLength: minLength(3)
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    onLogin () {
      this.$v.loginForm.$touch()
      if (this.$v.loginForm.$error) {
        this.$q.notify('请检查输入的内容')
        return
      }
      const { username, password } = this.loginForm
      this.login({
        username,
        password
      })
        .then(res => {
          const { data } = res
          if (data.success) {
            if (!data.data.avatar) {
              this.$router.push(`/update-info/${data.data.type}`)
              this.$q.notify('请补充完善信息')
            } else {
              const target = data.data.type === 'boss' ? 'genius' : 'boss'
              this.$router.replace(`/dashboard/${target}`)
            }
          } else {
            this.$q.notify(data.msg)
          }
        })
        .catch(err => {
          this.$q.notify(err.msg)
        })
    },
    goRegister () {
      this.$router.push('/register')
    },
    ...mapActions('user', ['login'])
  }
}
</script>

<style lang="stylus">
</style>

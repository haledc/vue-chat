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
          v-model="form.username"
          @blur="$v.form.username.$touch"
          :error="$v.form.username.$error"
        />
        <q-input
          float-label="密码"
          v-model="form.password"
          type="password"
          @blur="$v.form.password.$touch"
          :error="$v.form.password.$error"
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
  import {required, minLength} from 'vuelidate/lib/validators'
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    validations: {
      form: {
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
      onLogin() {
        this.$v.form.$touch()
        if (this.$v.form.$error) {
          this.$q.notify('请检查输入的内容')
          return
        }
        this.login({
          username: this.form.username,
          password: this.form.password
        })
          .then(data => {
            if (!data.avatar) {
              this.$router.replace(`/update-info/${data.type}`)
            } else {
              const target = data.type === 'boss' ? 'genius' : 'boss'
              this.$router.replace(`/dashboard/${target}`)
            }
          })
      },
      goRegister() {
        this.$router.push('/register')
      },
      ...mapActions('user', ['login'])
    }
  }
</script>

<style lang="stylus">
</style>

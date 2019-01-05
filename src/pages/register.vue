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
          v-model="registerForm.username"
          @blur="$v.registerForm.username.$touch"
          :error="$v.registerForm.username.$error"
        />
        <q-input
          class="q-mb-sm"
          float-label="密码"
          v-model="registerForm.password"
          type="password"
          @blur="$v.registerForm.password.$touch"
          :error="$v.registerForm.password.$error"
        />
        <q-input
          float-label="确认密码"
          v-model="registerForm.repeatPwd"
          type="password"
          @blur="$v.registerForm.repeatPwd.$touch"
          :error="$v.registerForm.repeatPwd.$error"
        />
      </q-field>
      <q-field class="q-mt-md">
        <q-radio v-model="registerForm.type" label="boss" val="boss" color="primary" class="q-mr-md"></q-radio>
        <q-radio v-model="registerForm.type" label="牛人" val="genius" color="teal"></q-radio>
      </q-field>
      <q-field class="q-mt-lg">
        <q-btn color="primary" class="full-width q-mb-md" @click="registerUser">注册</q-btn>
        <q-btn color="teal" class="full-width" @click="goLogin">登录</q-btn>
      </q-field>
    </div>
  </div>
</template>

<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      registerForm: {
        username: '',
        password: '',
        repeatPwd: '',
        type: 'boss'
      }
    }
  },
  validations: {
    registerForm: {
      username: {
        required,
        minLength: minLength(4)
      },
      password: {
        required,
        minLength: minLength(3)
      },
      repeatPwd: {
        required,
        minLength: minLength(3),
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    registerUser () {
      this.$v.registerForm.$touch()
      if (this.$v.registerForm.$error) {
        this.$q.notify('请检查输入的内容')
        return
      }
      const { username, password, type } = this.registerForm
      this.register({
        username,
        password,
        type
      })
        .then(res => {
          const { data } = res
          if (data.success) {
            this.$router.push(`/update-info/${this.registerForm.type}`)
          } else if (data.status === 1) {
            this.$q.notify(data.message)
          }
        })
    },
    goLogin () {
      this.$router.push('/login')
    },
    ...mapActions('user', ['register'])
  }
}
</script>

<style>
</style>

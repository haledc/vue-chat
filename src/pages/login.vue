<template>
  <q-page paddding class="row justify-center">
    <div class="q-mt-xl">
      <div class="logo text-center">
        <img src="~assets/logo.png" alt="logo">
      </div>
      <q-field class="q-mt-xl">
        <q-input
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
        />
      </q-field>
      <q-field class="q-mt-lg">
        <q-btn color="primary" class="full-width q-mb-md" @click="login">登录</q-btn>
        <q-btn color="teal" class="full-width" @click="goRegister">注册</q-btn>
      </q-field>
    </div>
  </q-page>
</template>

<script>
  import {required, minLength} from 'vuelidate/lib/validators'
  import {mapMutations} from 'vuex'

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
          minLength: minLength(4)
        },
        password: {
          required,
          minLength: minLength(3)
        }
      }
    },
    methods: {
      login() {
        this.$v.form.$touch()
        if (this.$v.form.$error) {
          this.$q.notify('请检查输入的内容')
        }
        this.$axios
          .post('/user/login', {
            username: this.form.username,
            password: this.form.password
          })
          .then(res => {
            if (res.data.status === 0) {
              const userData = res.data.result
              this.setUser(userData)
              if (!userData.avatar) {
                this.$router.push(`/update-info/${userData.type}`)
              } else {
                const target = userData.type === 'boss' ? 'genius' : 'boss'
                this.$router.push(`/dashboard/${target}`)
              }
            }
          })
      },
      goRegister() {
        console.log(1)
        this.$router.push('/register')
      },
      ...mapMutations('user', ['setUser'])
    }
  }
</script>

<style lang="stylus">
</style>

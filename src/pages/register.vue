<template>
  <q-page padding class="row justify-center">
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
        <q-input
          float-label="确认密码"
          v-model="form.repeatPwd"
          type="password"
          @blur="$v.form.repeatPwd.$touch"
          :error="$v.form.repeatPwd.$error"
        />
      </q-field>
      <q-field class="q-mt-md">
        <q-radio v-model="form.type" label="boss" val="boss" color="primary" class="q-mr-md"></q-radio>
        <q-radio v-model="form.type" label="牛人" val="genius" color="teal"></q-radio>
      </q-field>
      <q-field class="q-mt-lg">
        <q-btn color="primary" class="full-width" @click="Register">注册</q-btn>
      </q-field>
    </div>
  </q-page>
</template>

<script>
  import {required, minLength, sameAs} from 'vuelidate/lib/validators'

  export default {
    data() {
      return {
        form: {
          username: '',
          password: '',
          repeatPwd: '',
          type: 'boss'
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
        },
        repeatPwd: {
          required,
          minLength: minLength(3),
          sameAsPassword: sameAs('password')
        }
      }
    },
    methods: {
      Register() {
        this.$v.form.$touch()
        if (this.$v.form.$error) {
          this.$q.notify('请检查输入的内容')
        }
        this.$axios
          .post('/user/register', {
            username: this.form.username,
            password: this.form.password,
            type: this.form.type
          })
          .then(res => {
            if (res.data.status === 0) {
              this.$router.push(`/update-info/${this.form.type}`)
            }
          })
      }
    }
  }
</script>

<style>
</style>

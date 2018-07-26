<template>
  <div class="row justify-center">
    <q-toolbar>
      <q-btn round dense icon="arrow_back" @click="back"></q-btn>
      <q-toolbar-title>信息完善页</q-toolbar-title>
    </q-toolbar>
    <div style="width: 80%">
      <avatar-selector @select="selectAvatar" :url="avatarUrl"/>
      <q-field class="col-sx-12">
        <q-input
          v-show="type==='boss'"
          float-label="公司名称"
          v-model="form.company"
          @blur="type==='boss' ? $v.form.company.$touch : null"
          :error="type==='boss' ? $v.form.company.$error : false"
          class="q-mb-sm"
        />
        <q-input
          :float-label="type=== 'boss' ? '招聘职位': '应聘职位'"
          v-model="form.title"
          @blur="$v.form.title.$touch"
          :error="$v.form.title.$error"
          class="q-mb-sm"
        />
        <q-input
          v-show="type==='boss'"
          float-label="职位薪资"
          v-model="form.salary"
          @blur="type === 'boss' ? $v.form.salary.$touch : null"
          :error="type==='boss' ? $v.form.salary.$error : false"
          class="q-mb-sm"
        />
        <q-input
          :float-label="type=== 'boss' ? '职位要求': '简历概述'"
          type="textarea"
          v-model="form.desc"
          @blur="$v.form.desc.$touch"
          :error="$v.form.desc.$error"
        />
      </q-field>
      <q-field class="q-mt-lg">
        <q-btn color="primary" class="full-width" @click="saveInfo">保存并登录</q-btn>
      </q-field>
    </div>
  </div>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'
  import AvatarSelector from '../components/avatar-selector'
  import {mapActions} from 'vuex'

  export default {
    props: {
      type: String,
      required: true
    },
    data() {
      return {
        form: {
          avatar: '',
          company: '',
          title: '',
          salary: '',
          desc: ''
        },
        avatarUrl: ''
      }
    },
    validations() {
      // 根据条件决定检查的选项
      if (this.type === 'boss') {
        return {
          form: {
            avatar: {
              required
            },
            company: {
              required
            },
            title: {
              required
            },
            salary: {
              required
            },
            desc: {
              required
            }
          }
        }
      } else {
        return {
          form: {
            avatar: {
              required
            },
            title: {
              required
            },
            desc: {
              required
            }
          }
        }
      }
    },
    methods: {
      back() {
        this.$q.cookies.remove('userId')
        this.$router.back()
      },
      selectAvatar(targer) {
        this.avatarUrl = targer.url
        this.form.avatar = targer.text
      },
      saveInfo() {
        this.$v.form.$touch()
        console.log(this.$v.form)
        if (this.$v.form.$error) {
          this.$q.notify('请填写完整信息')
          return
        }
        this.updateInfo({
          avatar: this.form.avatar,
          company: this.form.company,
          title: this.form.title,
          salary: this.form.salary,
          desc: this.form.desc
        })
          .then(data => {
            if (data.status === 0) {
              const type = data.result.type
              const target = type === 'boss' ? 'genius' : 'boss'
              this.$router.replace(`/dashboard/${target}`)
            } else if (data.status === 1) {
              this.$q.notify(data.message)
            }
          })
      },
      ...mapActions('user', ['updateInfo'])
    },
    components: {
      AvatarSelector
    }
  }
</script>

<style>
</style>

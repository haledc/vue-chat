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
          @blur="$v.form.company.$touch"
          :error="$v.form.company.$error"
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
          @blur="$v.form.salary.$touch"
          :error="$v.form.salary.$error"
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
        <q-btn color="primary" class="full-width" @click="saveInfo">保存</q-btn>
      </q-field>
    </div>
  </div>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'
  import AvatarSelector from '../components/avatar-selector'
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        form: {
          avatar: '',
          company: '',
          title: '',
          salary: '',
          desc: ''
        },
        avatarUrl: '',
        type: ''
      }
    },
    validations: {
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
    },
    created() {
      this.type = this.$route.params.type
    },
    methods: {
      back() {
        this.$router.back()
      },
      selectAvatar(targer) {
        this.avatarUrl = targer.url
        this.form.avatar = targer.text
      },
      saveInfo() {
        this.$v.form.$touch()
        if (this.$v.form.$error) {
          this.$q.notify('请检查输入的内容')
        }
        this.$axios
          .post('/user/update', {
            avatar: this.form.avatar,
            company: this.form.company,
            title: this.form.title,
            salary: this.form.salary,
            desc: this.form.desc
          })
          .then(res => {
            if (res.data.status === 0) {
              const userData = res.data.result
              this.setUser(userData)
              const target = userData.type === 'boss' ? 'genius' : 'boss'
              this.$router.push(`${target}`)
            }
          })
      },
      ...mapMutations('user', ['setUser'])
    },
    components: {
      AvatarSelector
    }
  }
</script>

<style>
</style>

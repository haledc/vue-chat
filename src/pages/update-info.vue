<template>
  <div class="row justify-center">
    <q-toolbar>
      <q-btn round dense icon="arrow_back" @click="back"></q-btn>
      <q-toolbar-title>信息完善页</q-toolbar-title>
    </q-toolbar>
    <div style="width: 80%">
      <avatar-selector @select="selectAvatar" :url="avatarUrl" />
      <q-field class="col-sx-12">
        <q-input
          v-show="type==='boss'"
          float-label="公司名称"
          v-model="updateForm.company"
          @blur="type==='boss' ? $v.updateForm.company.$touch : null"
          :error="type==='boss' ? $v.updateForm.company.$error : false"
          class="q-mb-sm"
        />
        <q-input
          :float-label="type=== 'boss' ? '招聘职位': '应聘职位'"
          v-model="updateForm.title"
          @blur="$v.updateForm.title.$touch"
          :error="$v.updateForm.title.$error"
          class="q-mb-sm"
        />
        <q-input
          v-show="type==='boss'"
          float-label="职位薪资"
          v-model="updateForm.salary"
          @blur="type === 'boss' ? $v.updateForm.salary.$touch : null"
          :error="type==='boss' ? $v.updateForm.salary.$error : false"
          class="q-mb-sm"
        />
        <q-input
          :float-label="type=== 'boss' ? '职位要求': '简历概述'"
          type="textarea"
          v-model="updateForm.desc"
          @blur="$v.updateForm.desc.$touch"
          :error="$v.updateForm.desc.$error"
        />
      </q-field>
      <q-field class="q-mt-lg">
        <q-btn color="primary" class="full-width" @click="saveInfo">保存并登录</q-btn>
      </q-field>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import AvatarSelector from '../components/avatar-selector'
import { mapActions } from 'vuex'

export default {
  props: {
    type: String,
    required: true
  },
  data () {
    return {
      updateForm: {
        avatar: '',
        company: '',
        title: '',
        salary: '',
        desc: ''
      },
      avatarUrl: ''
    }
  },
  validations () {
    // 根据条件决定检查的选项
    if (this.type === 'boss') {
      return {
        updateForm: {
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
        updateForm: {
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
    back () {
      this.$q.cookies.remove('userId')
      this.$router.back()
    },
    selectAvatar (targer) {
      this.avatarUrl = targer.url
      this.updateForm.avatar = targer.text
    },
    saveInfo () {
      this.$v.updateForm.$touch()
      if (this.$v.updateForm.$error) {
        this.$q.notify('请填写完整信息')
        return
      }
      const { avatar, company, title, salary, desc } = this.updateForm
      this.updateInfo({
        avatar,
        company,
        title,
        salary,
        desc
      })
        .then(res => {
          const { data } = res
          if (data.success) {
            const { type } = data.data
            const target = type === 'boss' ? 'genius' : 'boss'
            this.$router.replace(`/dashboard/${target}`)
          } else {
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

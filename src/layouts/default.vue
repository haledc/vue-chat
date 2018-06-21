<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header>
      <q-toolbar>
        <q-toolbar-title class="text-center">{{toolTitle}}</q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <router-view/>
    </q-page-container>
    <q-layout-footer class="col-xs-12">
      <q-tabs glossy align="justify" class="shadow-2" v-model="activeTab">
        <q-route-tab exact v-if="user.type === 'boss' " slot="title" icon="accessibility" label="牛人"
                     to="/dashboard/genius"/>
        <q-route-tab exact v-else slot="title" icon="accessibility" label="BOSS" to="/dashboard/boss"/>
        <q-route-tab exact slot="title" :alert="alert" icon="message" label="消息" to="/dashboard/msg"/>
        <q-route-tab exact slot="title" icon="perm_identity" label="个人" to="/dashboard/user-center"/>
      </q-tabs>
    </q-layout-footer>
  </q-layout>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        activeTab: '',
        receiveData: '',
        routerList: [
          {
            path: '/genius',
            title: '牛人列表'
          },
          {
            path: '/boss',
            title: 'BOSS列表'
          },
          {
            path: '/msg',
            title: '消息列表'
          },
          {
            path: '/user-center',
            title: '个人中心'
          }
        ]
      }
    },
    created() {
      // 根据路径获取活动按钮的值
      this.activeTab = this.$route.path.split('/')[2]
      this.getTargetList()
      this.getChatMsg()
      this.receiveMsg()
    },
    computed: {
      toolTitle() {
        const path = this.$route.path
        const target = this.routerList.find(item => ('/dashboard' + item.path === path))
        return target.title
      },
      alert() {
        if (this.msgList.length === 0) {
          return false
        }
        return this.msgList[0].filter(it => !it.isRead && it.to === this.user._id).length > 0
      },
      ...mapGetters('user', ['user']),
      ...mapGetters('chat', ['chatMsg', 'msgList'])
    },
    methods: {
      getTargetList() {
        const type = this.user.type === 'boss' ? 'genius' : 'boss'
        this.$axios
          .get(`/user/list?type=${type}`)
          .then(res => {
            if (res.data.status === 0) {
              this.setTargetList(res.data.result)
            }
          })
      },
      getChatMsg() {
        this.$axios
          .get('/user/chatMsg')
          .then(res => {
            if (res.data.status === 0) {
              this.setChatMsg(res.data.result.chat)
            }
          })
      },
      receiveMsg() {
        this.$socket.removeAllListeners()
        this.$socket.on('receiveMsg', data => {
          console.log('receiveMsg at dashboard')
          this.receiveData = data
        })
      },
      ...mapMutations('user', ['setTargetList']),
      ...mapMutations('chat', ['setChatMsg'])
    },
    watch: {
      // 监听路由变化，调整activeBtn的值(解决导航守卫的跳转时出现的bug)
      '$route'() {
        this.activeTab = this.$route.path.split('/')[2]
      },
      receiveData() {
        this.chatMsg.push(this.receiveData)
        this.setChatMsg(this.chatMsg)
      }
    }
  }
</script>

<style>
</style>

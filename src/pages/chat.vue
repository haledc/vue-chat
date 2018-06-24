<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header view="Hff">
      <q-toolbar>
        <q-btn icon="arrow_back" round dense @click="back"></q-btn>
        <q-toolbar-title>{{targetName}}</q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container>
      <q-page padding class="q-mx-sm">
        <div v-for="(msg, i) in filterList"
             :key="i"
             ref="chatList"
        >
          <q-chat-message
            v-show="msg.from === target"
            bgColor="teal"
            :text="[msg.content]"
            :avatar="setAvatar(msg.from)"
          />
          <q-chat-message
            v-show="msg.from === user._id"
            :sent="true"
            textColor="white"
            bgColor="black"
            :text="[msg.content]"
            :avatar="setAvatar(msg.from)"
          />
        </div>
      </q-page>
    </q-page-container>
    <q-layout-footer :reveal="false">
      <q-toolbar>
        <q-btn icon="volume_up" round dense></q-btn>
        <q-item-main class="q-mx-sm">
          <q-input placeholder="请输入..." v-model="message"></q-input>
        </q-item-main>
        <q-btn icon="mood" round dense></q-btn>
        <q-btn icon="send" round dense @click="sendMsg"></q-btn>
      </q-toolbar>
    </q-layout-footer>
  </q-layout>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    props: {
      target: String
    },
    data() {
      return {
        message: '',
        readNum: 0,
        receiveData: ''
      }
    },
    created() {
      this.receiveMsg()
    },
    beforeDestroy() {
      this.readMsg(this.target)
    },
    computed: {
      targetName() {
        return this.targetInfo[this.target].name
      },
      filterList() {
        return this.chatMsg.filter(item => item.chatId.indexOf(this.target) > -1)
      },
      ...mapGetters('user', ['user', 'targetInfo']),
      ...mapGetters('chat', ['chatMsg'])
    },
    methods: {
      back() {
        this.$router.back()
      },
      sendMsg() {
        console.log(1)
        const from = this.user._id
        if (this.message.trim()) {
          this.$socket.emit('sendMsg', {from, to: this.target, msg: this.message})
        }
        this.message = ''
      },
      setAvatar(from) {
        if (from === this.target) {
          return `statics/avatar-img/${this.targetInfo[this.target].avatar}.png`
        } else {
          return `statics/avatar-img/${this.user.avatar}.png`
        }
      },
      receiveMsg() {
        this.$socket.removeAllListeners()
        this.$socket.on('receiveMsg', data => {
          this.receiveData = data
        })
      },
      readMsg() {
        const from = this.target
        this.$axios
          .post('/user/readMsg', {
            from
          })
          .then(res => {
            if (res.data.status === 0) {
              this.readNum = res.data.result.num
            }
          })
      },
      ...mapMutations('chat', ['setChatMsg'])
    },
    watch: {
      receiveData() {
        console.log(1)
        this.chatMsg.push(this.receiveData)
        this.setChatMsg(this.chatMsg)
      }
    }
  }
</script>

<style>
</style>

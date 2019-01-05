<template>
  <q-page padding>
    <q-card
      class="q-mb-sm"
      v-for="chat in msgList"
      :key="chat[chat.length - 1]._id"
      @click.native="onReadMsg(chat)"
    >
      <q-item>
        <q-item-side :avatar="'statics/avatar-img/'+ getTarget(chat).avatar +'.png'"></q-item-side>
        <q-item-main>
          <q-item-tile label>{{getTarget(chat).name}}</q-item-tile>
          <q-item-tile sublabel lines="1">{{chat[chat.length - 1].content}}</q-item-tile>
        </q-item-main>
        <q-item-side>
          <q-btn
            color="red"
            round
            dense
            size="sm"
            v-show="chat.filter(item => !item.isRead && item.to === user._id).length"
          >
            {{chat.filter(item => (!item.isRead && item.to === user._id)).length}}
          </q-btn>
          <q-btn icon="chevron_right" flat dense round />
        </q-item-side>
      </q-item>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['user', 'targetInfo']),
    ...mapGetters('chat', ['msgList'])
  },
  methods: {
    onReadMsg (chat) {
      const lastItem = chat[chat.length - 1]
      // 通过判断发送信息的对象来获取聊天对象
      // 如果是用户自己发的，那么接受的对象(to)就是聊天对象
      // 如果不是用户发到，那么发送的对象(from)就是聊天对象
      const from = lastItem.from === this.user._id ? lastItem.to : lastItem.from
      this.readMsg({ from })
        .then(() => {
          this.$router.push(`/chat/${from}`)
          this.updateChat()
        })
    },
    updateChat () {
      this.getChatMsg()
    },
    getTarget (chat) {
      const lastItem = chat[chat.length - 1]
      const from = lastItem.from === this.user._id ? lastItem.to : lastItem.from
      return this.targetInfo[from]
    },
    ...mapMutations('chat', ['setChatMsg']),
    ...mapActions('chat', ['getChatMsg', 'readMsg'])
  }
}
</script>

<style>
</style>

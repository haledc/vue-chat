<template>
  <q-page padding>
    <q-card>
      <q-item>
        <q-item-side>
          <img :src="'statics/avatar-img/'+user.avatar+'.png'" width="48">
        </q-item-side>
        <q-item-main>
          <q-item-tile label>{{user.username}}</q-item-tile>
          <q-item-tile sublabel>{{user.title}}</q-item-tile>
        </q-item-main>
        <q-item-side v-show="user.company">
          {{user.company}}
          <q-btn icon="chevron_right" flat dense round></q-btn>
        </q-item-side>
      </q-item>
      <q-card-separator/>
      <q-item v-show="user.salary">
        <q-icon name="monetization_on" size="1.5rem" class="q-mr-sm"/>
        <q-item-main>
          {{user.salary}}
        </q-item-main>
      </q-item>
      <q-card-separator/>
      <q-item>
        <q-icon name="stars" size="1.5rem" class="q-mr-sm"/>
        <q-item-main>
          {{user.desc}}
        </q-item-main>
      </q-item>
      <q-card-separator/>
      <q-item>
        <q-item-main>
          <q-btn class="full-width" color="primary" @click="logout">注销</q-btn>
        </q-item-main>
      </q-item>
    </q-card>
  </q-page>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters('user', ['user'])
    },
    methods: {
      logout() {
        this.$axios
          .post('/user/logout')
          .then(res => {
            if (res.data.status === 0) {
              this.$router.push('/login')
              window.localStorage.removeItem('chat_user')
              window.localStorage.removeItem('chat_targetList')
              window.localStorage.removeItem('chat_chatMsg')
            }
          })
      }
    }
  }
</script>

<style>
</style>

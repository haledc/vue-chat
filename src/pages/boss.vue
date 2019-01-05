<template>
  <q-page padding class="q-mx-sm">
    <q-card
      style="width: 100%"
      class="q-mb-md"
      v-for="target in targetList"
      :key="target._id"
      @click.native="goChat(target)">
      <q-item>
        <q-item-side :avatar="'statics/avatar-img/'+target.avatar+'.png'"></q-item-side>
        <q-item-main>
          <q-item-tile label>{{target.username}}</q-item-tile>
          <q-item-tile sublabel>{{target.title}}</q-item-tile>
        </q-item-main>
        <q-item-side v-show="target.company">
          {{target.company}}
        </q-item-side>
      </q-item>
      <q-card-separator />
      <q-item v-show="target.salary">
        {{target.salary}}
      </q-item>
      <q-item>
        {{target.desc}}
      </q-item>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['targetList'])
  },
  methods: {
    goChat (target) {
      this.$router.push(`/chat/${target._id}`)
    }
  }
}
</script>

<style>
</style>

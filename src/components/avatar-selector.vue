<template>
  <div class="q-mt-md">
    <div class="q-headline text-weight-light">
      {{url? '已选择头像 ': '请选择头像 '}}
      <span>
        <img v-show="url" :src="url" alt="selectAvatar" width="24">
      </span>
    </div>
    <div class="flex flex-center q-mt-md">
      <div v-for="avatar in avatarlist" :key="avatar.text" class="col-xs-2 q-mx-xs q-mb-md" @click="selectItem(avatar)">
        <img :src="avatar.url" alt="avatar">
      </div>
    </div>
  </div>
</template>

<script>
  const avatarMap = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'.split(',')
  export default {
    props: {
      url: {
        type: String
      }
    },
    computed: {
      avatarlist() {
        let arr = []
        avatarMap.forEach(item => {
          const url = `statics/avatar-img/${item}.png`
          const text = item
          arr.push({
            url,
            text
          })
        })
        return arr
      }
    },
    methods: {
      selectItem(url) {
        console.log(1)
        console.log(url)
        this.$emit('select', url)
      }
    }
  }
</script>

<style>
</style>

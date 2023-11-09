<script setup>
import store from '../src/stores'
import { onMounted, onUnmounted, reactive, ref, nextTick, watch, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Notification from './views/Layout/Notification.vue'
import { notify } from '@kyvg/vue3-notification'
import View from './views/index.vue'
import request from './utils/request'
// import { languagePack } from "./languages";
const checkLogin = computed(() => store.getters.usersss)

const listNotify = ref([])
// const listNotifyUser = ref([])
// const listID = ref([])
const idGetList = ref('')

async function getListingNotifi() {
  // try {
  await request.get('notify/listing').then((res) => {
    listNotify.value = res.data.data
  })
  // } catch (error) {
  //   notify({ text: languagePack.popbuy_noti_network, type: 'warn' })
  // }
}

// //list-notifi-user + update it
// async function getListNotifyUser() {
//   try {
//       await request.get('notify/user')
//         .then((res) => {
//             listNotifyUser.value = res.data.data
//             listNotifyUser.value.forEach((item)=> {
//                 listID.value.push(item.id)
//             })
//             request.post('notify/viewed', {
//                 listID: listID.value
//             })
//         })
//   } catch (error) {
//     notify({text: languagePack.popbuy_noti_network, type: 'warn' });
//   }

// }

// idGetList.value = setInterval(async()=> {
//   if(checkLogin.value) {
//     getListNotifyUser();
//   }
// }, 30000)

onMounted(() => {
  if (checkLogin.value) {
    getListingNotifi()
    // getListNotifyUser();
  }
})

// watch(checkLogin.value,(val)=>{
//     getListingNotifi();
//     getListNotifyUser();
// })
onUnmounted(() => {
  clearInterval(idGetList.value)
})
</script>

<template v-if="checkLogin">
  <div v-if="checkLogin" class="slide-wrapper" ref="slideWrapper">
    <template v-for="item in listNotify">
      <Notification
        :title="item.title"
        :content="item.content"
        :status="item.status"
        v-if="item.status != 3"
      />
    </template>
    <!-- <template v-for="item in listNotifyUser" :key="item.id">
      <Notification :title="item.title" :content="item.content" :status="item.status" />
    </template> -->
  </div>
  <View />
  <notifications position="top right" />
</template>

<style scoped>
.slide-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  padding-top: 35px;
}

.slide-wrapper .clear-all {
  text-align: center;
}

.slide-wrapper .clear-all a {
  font-size: 13px;
  font-weight: bold;
  color: rgb(30, 35, 35);
}

.vue-notification-group {
  padding-top: 45px;
}
</style>

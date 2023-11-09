<template>
  <footer>
    <div class="footer-tab">
      <ul class="footer-menu">
        <li class="menu-item">
          <RouterLink to="/" class="btn btnft home show">
            <div>
              <i class="bx bx-home" v-if="routeActive != '/'"></i>
              <i class='bx bxs-home' v-else ></i>
            </div>
            <div class="tt">{{ languagePack.footer_home }}</div>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/buy" class="btn btnft buy">
            <div>
              <i class='bx bx-layer' v-if="routeActive != '/buy'"></i>
              <i class='bx bxs-layer' v-else></i>
            </div>
            <div class="tt">{{ languagePack.footer_buy }}</div>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink :to="{ name: 'market' }" class="btn btnft market">
            <div><i class="bx bx-objects-vertical-bottom" v-if="routeActive != '/market'"></i>
              <i class='bx bxs-objects-vertical-bottom' v-else></i></div>
            <div class="tt">{{ languagePack.footer_market }}</div>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/person" class="btn btnft person">
            <div><i class="bx bx-user" v-if="routeActive != '/person'"></i>
              <i class='bx bxs-user' v-else></i></div>
            <div class="tt">{{ languagePack.footer_person }}</div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </footer>
</template>
<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { onLoadIcon } from '../../utils/orther'
import { onMounted, reactive,ref, watch, computed, onUnmounted } from 'vue'
import { languagePack } from '../../languages'
const routeActive = ref('');
const router = useRouter()
const isChangeRoute = computed(() => {
  return router.currentRoute.value.path
})
watch(
  () => isChangeRoute.value,
  (val) => {
    routeActive.value = val
    onLoadIcon()
  }
)
onMounted(() => {
  onLoadIcon()
})
onUnmounted(() => {
  onLoadIcon()
})
</script>

<style scoped>
.footer-tab {
  position: fixed;
  bottom: 0px;
  width: 100%;
  left: 0;
  margin: auto;
  background-color: #f7f7f9;
  border-top: 1px solid #f7f7f9;
}
.tt {
  font-weight: 500;
}
.icon-title {
  color: red;
}
.footer-menu {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding: 5px;
  padding-top: 10px;
  margin: auto;
  height: 60px;
  text-align: center;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
}
.menu-item {
  width: calc(100% / 4);
  list-style-type: none;
  display: block;
  transition: all 1s;
}
.menu-item .btn {
  margin: auto;
  border-radius: 20%;
  font-size: 11px;
}
.menu-item .btn i {
  font-size: 20px;
}
.menu-item a {
  color: rgb(30, 35, 35);
}
.menu-item a {
  text-decoration: none;
}
img {
  width: 16px;
  height: 16px;
  -webkit-user-select: none;
  user-select: none;
}
a {
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
a:hover {
  text-decoration: none;
}
</style>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { languagePack } from '../../../languages'
const emit = defineEmits(['close-popup'])
const closePopup = () => {
  emit('close-popup')
}
onMounted(() => {})
</script>

<template>
  <div class="about">
    <div class="about-content">
      <div class="about-close">
        <div class="close" @click="closePopup">
          <i
            class="bx bx-x"
            style="font-size: 16px; color: #fff; background-color: red; border-radius: 50%"
          ></i>
        </div>
      </div>
      <div class="about-title">
        <h3 for="about">
          {{ languagePack.home_about_intro }}
          <b style="font-weight: 700">{{ languagePack.home_about_intro_appname }}</b>
        </h3>
      </div>
      <div class="about_code">
        <b style="font-weight: 600">{{ languagePack.home_about_intro_appname }}</b>
        {{ languagePack.home_about_detail }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.3);
}
.about-title {
  margin-bottom: 5px;
}
.about-content {
  width: 80%;
  margin: auto;
  padding: 10px 20px 20px 20px;
  text-align: center;
  border-radius: 10px;
  background-color: #fff;
  color: #222;
  border: 1px solid #eeeff0;
  box-shadow: 0 0 2px #eeeff0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.about-close {
  position: relative;
  height: 15px;
}
.close {
  font-weight: 800;
  position: absolute;
  top: -6px;
  right: -20px;
  width: 30px;
  height: 30px;
  color: rgb(30, 35, 35);
}
.about_code {
  font-size: 13px;
  font-weight: 300;
}
.about-image {
  margin: auto;
}
</style>

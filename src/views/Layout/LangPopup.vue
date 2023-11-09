<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
const languages = ref('')
import { languagePack } from '../../languages'
watch(
  () => languages.value,
  (val) => {
    let locations = {
      language: languages.value
    }
    localStorage.setItem('locations', JSON.stringify(locations))
    location.reload()
  }
)
const emit = defineEmits(['close-popup'])
const closePopup = () => {
  emit('close-popup')
}
</script>

<template>
  <div class="languages">
    <div class="languages-content">
      <div class="languages-close">
        <div class="close" @click="closePopup">
          <i
            class="bx bx-x"
            style="font-size: 16px; color: #fff; background-color: red; border-radius: 50%"
          ></i>
        </div>
      </div>
      <div class="languages-title" style="color: #222">
        <label for="languages">{{ languagePack.lang_title }}:</label>
      </div>
      <select v-model="languages" name="languages" id="languages">
        <option value="">{{ languagePack.lang_option }}</option>
        <option value="VN">{{ languagePack.lang_vi }}</option>
        <option value="EN">{{ languagePack.lang_en }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.languages {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.3);
}
.languages-title {
  margin-bottom: 5px;
}
.languages-title label {
  font-weight: 500;
}
.languages-content {
  width: 80%;
  background: #fff;
  margin: auto;
  padding: 10px 20px 30px 20px;
  text-align: center;
  border-radius: 10px;
  border: 1px solid #ebebeb;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
select {
  min-width: 70%;
  padding: 5px 10px;
  border: 1px solid #eeeff0;
  border-radius: 5px;
  outline: none;
}
.languages-close {
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
</style>

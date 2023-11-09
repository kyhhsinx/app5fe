<script setup>
import { onMounted, ref, reactive, defineProps, createApp } from 'vue'
import request from '../../../utils/request'
import { notify } from '@kyvg/vue3-notification'
import { faKaaba } from '@fortawesome/free-solid-svg-icons'
import { languagePack } from '../../../languages'

const img1 = ref('')
const img2 = ref('')
const gttt = ref('')
const namecc = ref('')
const defaultImg = 'https://i.ibb.co/SJ2FzrP/upload-6.png'
const gifloading = ref(false)
const loadingverify = ref(false)
let resultData = reactive({})
const status = ref(true)
const emit = defineEmits(['close-popup'])
const closePopup = () => {
  emit('close-popup')
}
async function uploadImg() {
  loadingverify.value = true

  if (
    img1.value == defaultImg ||
    img2.value == defaultImg ||
    namecc.value == '' ||
    gttt.value == ''
  ) {
    document.querySelector('.err-validate-verify').style.display = 'block'
    loadingverify.value = false
  } else {
    var res = await request.post('user/kyc', {
      frontImage: img1.value,
      backImage: img2.value,
      realName: namecc.value,
      identityCard: gttt.value
    })
    status.value = false
    loadingverify.value = false
  }
}

function turnOffNotiError() {
  document.querySelector('.err-validate-verify').style.display = 'none'
}

async function changeImg(img) {
  document.querySelector('.err-validate-verify').style.display = 'none'
  if (img == 'img1') {
    gifloading.value = true
    img1.value = 'https://suteki.com.vn/theme/frontend/images/loading.gif'
    const image = document.querySelector('#img1')
    convertToBase64(image)
      .then(async (base64String) => {
        var res = await uploadServer(base64String)
        img1.value = res.data.display_url
        gifloading.value = false
      })
      .catch((error) => {
        notify({ title: 'Thông báo', text: 'Ảnh không hợp lệ', type: 'error' })
        gifloading.value = false
        img1.value = defaultImg
      })
  } else {
    gifloading.value = true
    img2.value = 'https://suteki.com.vn/theme/frontend/images/loading.gif'
    const image1 = document.querySelector('#img2')
    convertToBase64(image1)
      .then(async (base64String) => {
        var res = await uploadServer(base64String)
        img2.value = res.data.display_url
        gifloading.value = false
      })
      .catch((error) => {
        notify({ title: 'Thông báo', text: 'Ảnh không hợp lệ', type: 'error' })
        gifloading.value = false
        img2.value = defaultImg
      })
  }
}
async function uploadServer(base64) {
  const data = new FormData()
  data.append('image', base64.split('base64,')[1])
  data.append('key', '2952fb244be64784c09fa1d70fd0d7a4')
  return fetch('https://api.imgbb.com/1/upload', {
    method: 'post',
    body: data
  }).then((res) => res.json())
}
function convertToBase64(fileInput) {
  return new Promise((resolve, reject) => {
    const file = fileInput.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      const base64String = reader.result
      resolve(base64String)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}
function checkMaxLength(input) {
  if (input.value.length > input.maxLength) {
    input.value = input.value.slice(0, input.maxLength)
  }
}
onMounted(() => {
  img1.value = defaultImg
  img2.value = defaultImg
})
</script>
<template>
  <div class="popbuy">
    <div class="popbuy-content">
      <div class="popbuy-close" style="line-height: 10px">
        <div class="close" style="text-align: end">
          <i
            @click="closePopup"
            class="bx bx-x"
            style="font-size: 16px; color: #fff; background-color: red; border-radius: 50%"
          ></i>
        </div>
      </div>
      <div class="popbuy-center" v-if="status">
        <h3 style="font-size: 15px; color: #222; font-weight: 500; text-transform: uppercase">
          {{ languagePack.person_upload_title }}
        </h3>
        <div class="center-time">
          <!-- <div class="center-time__title">
                        <h4>{{ formLang.title }}</h4>
                    </div> -->
          <div class="form-control">
            <label for="name">{{ languagePack.person_upload_name }}: </label>
            <input
              type="text"
              id="name_gt"
              :placeholder="languagePack.person_upload_name_placeholder"
              v-model="namecc"
              @click="turnOffNotiError"
            />
          </div>
          <div class="form-control">
            <label for="cccdnumber">{{ languagePack.person_upload_cccd }}: </label>
            <input
              type="text"
              id="cccdnumber"
              pattern="[0-9]*"
              :placeholder="languagePack.person_upload_placeholder"
              v-model="gttt"
              @click="turnOffNotiError"
            />
          </div>
          <label for="">{{ languagePack.person_upload_front }}</label>
          <div class="center-time__body">
            <img style="width: 50%" onclick="document.getElementById('img1').click()" :src="img1" />
            <input hidden type="file" id="img1" @change="changeImg('img1')" />
          </div>
          <label for="">{{ languagePack.person_upload_back }}</label>
          <div class="center-time__body">
            <img style="width: 50%" onclick="document.getElementById('img2').click()" :src="img2" />
            <input hidden type="file" id="img2" @change="changeImg('img2')" />
          </div>
        </div>
        <div class="center-confirm">
          <p class="err-validate-verify">{{ languagePack.person_upload_err_validate_verify }}</p>
          <button class="btns center-balence__btn btnloading" v-if="gifloading == true" disabled>
            {{ languagePack.person_upload_loading }}
          </button>
          <button
            class="btns center-balence__btn submit-upload"
            @click="uploadImg()"
            v-if="gifloading == false && loadingverify == false"
          >
            {{ languagePack.person_upload_confirm }}
          </button>
          <button class="btns center-balence__btn btnloading" v-if="loadingverify == true" disabled>
            {{ languagePack.person_upload_confirm_loading }}
          </button>
        </div>
      </div>
      <div class="thongbao" v-else>
        <div class="note">
          {{ languagePack.person_upload_confirm_node }}
        </div>
        <button class="btns center-balence__btn" @click="closePopup">
          {{ languagePack.person_upload_confirm_close }}
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.note {
  margin-top: 20px;
}
.popbuy {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.3);
}
.popbuy-content {
  margin: auto;
  padding: 10px 10px 50px 10px;
  text-align: center;
  min-height: 100px;
  background-color: #fff;
  color: #222;
  border: 1px solid #eeeff0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 10px 10px 0 0;
}
.popbuy-top {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #fff;
  padding-top: 40px;
  z-index: 2000;
  border-radius: 15px;
}
.popbuy-center {
  min-height: 150px;
}
.info {
  color: #222;
}
.flex {
  display: flex;
}
.center-time {
  text-align: start;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #222;
}
.center-time__body {
  font-size: 10px;
  text-align: center;
}
.center-time__body img {
  max-height: 90px;
  object-fit: contain;
}
.center-time__body input {
  width: 100%;
  padding: 5px 10px;
}
.center-time__object {
  padding: 5px 15px;
  border: 1px solid gray;
  margin: 5px;
}
.center-time__object:hover {
  background: gray;
}
.select {
  background: gray;
}
.center-mass {
  text-align: start;
  margin-top: 10px;
}
.center-mass__body {
  font-size: 10px;
  margin-bottom: 10px;
}
.center-mass__title {
  font-size: 16px;
  margin-bottom: 5px;
}
.center-mass__object {
  padding: 5px 15px;
  border: 1px solid gray;
  margin: 5px;
}
.center-mass__object:hover {
  background: gray;
}
.center-mass__input {
  border: none;
  font-size: 13px;
  padding: 5px 10px;
  background: #414954;
  width: 70%;
  outline: none;
  color: #222;
}
.center-balence {
  text-align: start;
  font-size: 13px;
  margin: 15px 0px;
}
.center-balence__btn {
  padding: 12px 30px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 5px;
  background: #fd9e00;
  color: #fff;
  margin-top: 25px;
}
.popbuy-bottom {
  font-size: 13px;
  margin-top: 15px;
  margin-bottom: 10px;
}
.popbuy-bottom__label {
  width: 50%;
  text-align: center;
}
.info {
  margin-top: 20px;
}
.info-content {
  margin-top: 20px;
}
.info-content__item {
  width: 33%;
}
.info-content__item div {
  line-height: 30px;
}
.success {
  color: #00eb00;
}
.error {
  color: red;
}

.err-validate-verify {
  margin-block: 10px;
  color: rgb(241, 9, 9);
  display: none;
}

.form-control {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 3px;
  font-weight: 500;
}
.form-control input {
  width: 100%;
  padding: 12px 12px;
  font-size: 13px;
  border-radius: 5px;
  background: #eeeff0;
  border: 1px solid #eeeff0;
  color: #222;
}
.btnloading {
  background-color: #bcbaac;
}
</style>

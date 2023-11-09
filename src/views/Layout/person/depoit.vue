<script setup>
import { onMounted, ref, reactive, defineProps } from 'vue'
import request from '../../../utils/request'
import { notify } from '@kyvg/vue3-notification'
import { formatUsdt, usdToVnd, formatVnd, vndToUsd } from '../../../utils/money'
import { languagePack } from '../../../languages'

let resultData = reactive({})
const amount = ref('1000000')
const noty = ref('0')
const emit = defineEmits(['close-popup'])
const bankData = ref('')
const amountUsd = ref()
async function depointAmount() {
  if (amount.value < 1000000) {
    notify({ title: `${formLang.error}`, text: `${formLang.min}`, type: 'error' })
    return
  }
  document.getElementsByClassName('button_depoint')[0].setAttribute('disabled', '')
  var res = await request.post('user/topup-trans', {
    amount: amount.value
  })
  var result = res.data
  amountUsd.value = await (await vndToUsd(amount.value)).toFixed(3)
  noty.value = result
}
async function loadBankAdmin() {
  var res = await request.get('user/get_bank_admin', {
    amount: amount.value
  })
  var result = res.data
  bankData.value = result.data[0]
}
const closePopup = () => {
  emit('close-popup')
}
</script>
<template>
  <div class="popbuy">
    <div :class="[noty == 0 ? 'popbuy-content' : 'popbuy-content result-content']">
      <div class="popbuy-close" style="line-height: 10px">
        <div class="close" style="text-align: end">
          <i
            @click="closePopup"
            class="bx bx-x"
            style="font-size: 16px; color: #fff; background-color: red; border-radius: 50%;"
          ></i>
        </div>
      </div>
      <div class="popbuy-center">
        <h3 style="font-size: 15px">{{ languagePack.person_depoit_title }}</h3>
        <div class="center-time">
          <!-- <div class="center-time__title">
            <h4></h4>
          </div> -->
          <div class="center-time__body">
            <div class="valueMoney">
              <input
                :placeholder="languagePack.person_depoit_amount_placeholder"
                type="number"
                v-model="amount"
              />
              <p>{{ languagePack.person_depoit_note }}</p>
            </div>
          </div>
        </div>
        <div class="center-confirm">
          <button class="center-balence__btn btns button_depoint" @click="depointAmount()">
            {{ languagePack.person_depoit_confirmbtn }}
          </button>
        </div>
        <div class="center-info" v-if="noty != 0">
          <!-- Thông báo -->
          <!-- <img src="../../../assets/tick.png" alt="tick success" class="img"> -->
          <div class="circle-wrapper">
            <div class="success circle"></div>
            <div class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="#fff"
                class="w-6 h-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <p class="noty">{{ languagePack.person_depoit_noty_title }}</p>
          <p class="noty moneyShow" style="margin: 8px 0px">
            {{ languagePack.person_depoit_depoint_vnd }}: {{ formatVnd(amount) }}
          </p>
          <p class="noty moneyShow" style="margin: 8px 0px">
            {{ languagePack.person_depoit_depoint_usd }}: {{ formatUsdt(amountUsd) }}
          </p>
          <div class="money">
            <button class="center-balence__btn btns" @click="closePopup()">
              {{ languagePack.person_depoit_close }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.circle-wrapper {
  width: 60px;
  height: 60px;

  margin: 10px auto;
}
.circle-wrapper {
  position: relative;
}
.icon {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  width: 20px;
  height: 20px;
}
.popbuy-center h3 {
  margin-bottom: 25px;
}
.valueMoney p {
  margin-top: 5px;
  display: block;
  font-size: 12px;
}
.circle {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 2.5px;
  background-clip: content-box;
  animation: spin 10s linear infinite;
}

.circle-wrapper:active .circle {
  animation: spin 2s linear infinite;
}

.success {
  background-color: #4bb543;
  border: 2.5px dashed #4bb543;
}
@keyframes spin {
  100% {
    transform: rotateZ(360deg);
  }
}
.img {
  width: 100px;
  height: 100px;
}
.center-info {
  position: absolute;
  top: 0;
  font-size: 12px;
  text-align: center;
  background-color: #fff;
  width: 100%;
  min-height: 200px;
  height: 100%;
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
.result-content {
  min-height: 300px;
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
  color: rgb(30, 35, 35);
}
.flex {
  display: flex;
}
.center-time {
  text-align: start;
  margin-top: 10px;
  margin-bottom: 10px;
}
.center-time__body {
  font-size: 10px;
  margin-bottom: 20px;
}
.center-time__body input {
  width: 100%;
  padding: 12px 12px;
  font-size: 13px;
  border-radius: 5px;
  background: #eeeff0;
  border: 1px solid #eeeff0;
  color: #222;
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
  color: rgb(30, 35, 35);
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
}
.money {
  margin-top: 20px;
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

h4 {
  padding: 0px 20px;
}
</style>

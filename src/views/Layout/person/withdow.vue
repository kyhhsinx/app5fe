<script setup>
import { onMounted, ref, reactive, defineProps } from 'vue'
import request from '../../../utils/request'
import { notify } from '@kyvg/vue3-notification'
import { formatUsdt, usdToVnd, formatVnd } from '../../../utils/money'
import { languagePack } from '../../../languages'

let resultData = reactive({})
const amount = ref('100')
const securityCode = ref('')
const amountVND = ref('100')
const noty = ref('0')
const emit = defineEmits(['close-popup', 'reloadListHistory'])
const bank = ref('')
const withdawSuccess = ref(true)
const priceUSD = ref()
const feeWithdrawal = ref()
const minWithdrawal = ref()
const maxWithdrawal = ref()

const props = defineProps({
  securityCode: String,
  balance: String
})

async function get_User_Config() {
  const response = await request.get('user/config/get_config')
  if (response.data.success) {
    feeWithdrawal.value = response.data.data[0].withdrawal_fee
    minWithdrawal.value = response.data.data[0].min_withdrawal
    maxWithdrawal.value = response.data.data[0].max_withdrawal
  }
}

async function getPriceUSD() {
  var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT')
  var data = await reponse.json()
  priceUSD.value = data.rates.VND
}

async function withDawAmount() {
  if (amount.value < parseFloat(minWithdrawal.value)) {
    notify({
      title: `${languagePack.person_wihdraw_fail_title}`,
      text: `${languagePack.person_wihdraw_min_titile} $${minWithdrawal.value}`,
      type: 'error'
    })
    return
  }
  if (amount.value > parseFloat(maxWithdrawal.value)) {
    notify({
      title: `${languagePack.person_wihdraw_fail_title}`,
      text: `${languagePack.person_wihdraw_max_titile} $${maxWithdrawal.value}`,
      type: 'error'
    })
    return
  }
  if (amount.value > parseFloat(props.balance)) {
    notify({
      title: `${languagePack.person_wihdraw_fail_title}`,
      text: `${languagePack.person_wihdraw_not_enough}`,
      type: 'error'
    })
    return
  }
  if (securityCode.value.trim() !== props.securityCode) {
    notify({
      title: `${languagePack.person_wihdraw_fail_title}`,
      text: `${languagePack.person_wihdraw_secode}`,
      type: 'error'
    })
    return
  }

  // const list = await request.get('user/get_trans_history', {
  //   params: {
  //     typeTransaction: 'withdrawal'
  //   }
  // })
  // if (list.data.data.length > 0 && list.data.data[0].status == 'pending') {
  //   console.log('vo day')
  //   notify({
  //     title: `${languagePack.person_wihdraw_fail_title}`,
  //     text: `${languagePack.person_wihdraw_have_pending}`,
  //     type: 'error'
  //   })
  //   return
  // }

  document.getElementsByClassName('btn-withdraw')[0].setAttribute('disabled', '')
  var res = await request.post('user/withdrawal_trans', {
    amount: amount.value
  })

  var result = res.data
  noty.value = result

  if (result.success == true) {
    notify({
      title: `${languagePack.person_wihdraw_success_title}`,
      text: `${languagePack.person_wihdraw_pop_title}`,
      type: 'success'
    })
    //
    emit('reloadListHistory')
    amountVND.value = await usdToVnd(result.transaction.amount)
    setTimeout(() => {
      withdawSuccess.value = false
    }, 1000)
  } else {
    notify({
      title: `${languagePack.person_wihdraw_fail_title}`,
      text: result.message,
      type: 'error'
    })
    document.getElementsByClassName('btn-withdraw')[0].removeAttribute('disabled')
  }
}

const closePopup = () => {
  emit('close-popup')
}

async function checkBank() {
  var res = await request.get('user/check_bank')
  var result = res.data
  if (result.success == true) {
    bank.value = result.bank
    return false
  } else {
    return true
  }
}

onMounted(async () => {
  //get bank
  get_User_Config()
  getPriceUSD()
  var res = checkBank()
  if (!res) {
    notify({
      title: `${languagePack.person_wihdraw_fail_title}`,
      text: `${formLang.bank}`,
      type: 'error'
    })
    closePopup()
  }
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
            style="font-size: 16px; color: white; background: red; border-radius: 50%;"
          ></i>
        </div>
      </div>
      <div class="popbuy-center" v-if="withdawSuccess">
        <h3 style="font-size: 15px">{{ languagePack.person_wihdraw_title }}</h3>
        <div class="center-time">
          <div class="center-time__title">
            <h4>{{ languagePack.person_wihdraw_input_amount }}(USD)</h4>
          </div>
          <div class="center-time__body">
            <div class="valueMoney">
              <input
                :placeholder="languagePack.person_wihdraw_input_amount"
                type="number"
                v-model="amount"
              />
              <p class="note">
                {{ languagePack.person_wihdraw_input_note1 }}
                {{ amount - (amount / 100) * feeWithdrawal }}$ ≈
                {{ formatVnd((amount - (amount / 100) * feeWithdrawal) * priceUSD) }}.
                {{ languagePack.person_wihdraw_input_note2 }} {{ feeWithdrawal }}%).
              </p>
              <!-- <p>{{ formLang.note  }}</p> -->
            </div>
            <div class="securityCode">
              <input type="text" placeholder="Nhập mã bảo mật của bạn" v-model="securityCode" />
              <p class="note">
                {{ languagePack.person_wihdraw_input_note_se }}
              </p>
            </div>
          </div>
        </div>
        <div class="center-confirm">
          <button class="center-balence__btn btns btn-withdraw" @click="withDawAmount()">
            {{ languagePack.person_wihdraw_confirm }}
          </button>
        </div>
        <div class="center-info">
          <p class="noty">
            {{ languagePack.person_wihdraw_bankName }}: <a>{{ bank.bankName }}</a>
          </p>
          <p class="noty">
            {{ languagePack.person_wihdraw_nameUser }}: <a>{{ bank.nameUser }}</a>
          </p>
          <p class="noty">
            {{ languagePack.person_wihdraw_numberCard }}: <a>{{ bank.numberCard }}</a>
          </p>
        </div>
      </div>
      <div class="buy-success" v-else>
        <!-- <img src="../../../assets/tick.png" alt="tick success" class="img" /> -->
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
        <div class="success_title">
          <h4>{{ languagePack.person_wihdraw_success_title }}</h4>
        </div>
        <div class="success_money">
          <h4>{{ formatVnd((amount - (amount / 100) * 2) * priceUSD) }}</h4>
        </div>
        <div class="success_money">
          <button class="center-balence__btn btns" @click="closePopup()">
            {{ languagePack.person_wihdraw_close }}
          </button>
        </div>
        <div class="success_contact">
          <p class="contact_note">{{ languagePack.person_wihdraw_note1 }}</p>
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
.circle-wrapper:active .circle {
  animation: spin 2s linear infinite;
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
.success {
  background-color: #4bb543;
  border: 2.5px dashed #4bb543;
}
@keyframes spin {
  100% {
    transform: rotateZ(360deg);
  }
}
/*  */
.success_title h4 {
  font-size: 14px;
}
.securityCode {
  margin-top: 10px;
}
.popbuy-center h3 {
  margin-bottom: 25px;
}
.center-confirm {
  margin-top: 20px;
}
.img {
  width: 100px;
  height: 100px;
}
.success_money {
  margin-bottom: 30px;
}
.contact_note {
  font-size: 12px;
}
.center-info {
  font-size: 12px;
  margin-top: 20px;
  text-align: start;
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
  border-radius: 10px 10px 0 0 ;
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
}
.center-time__body {
  font-size: 10px;
}
.center-time__body input {
  width: 100%;
  padding: 12px 12px;
  font-size: 13px;
  border-radius: 5px;
  background: #EEEFF0;
  border: 1px solid #EEEFF0;
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

.note {
  display: block;
  margin-top: 5px;
  font-size: 11px;
}
</style>

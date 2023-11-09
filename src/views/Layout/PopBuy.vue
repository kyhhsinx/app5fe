<script setup>
import { onMounted, ref, reactive, defineProps, watch, onUpdated } from 'vue'
import PopCircle from './PopCircle.vue'
import PopResult from './effect/result.vue'
import request from '../../utils/request'
import { formatUsdt, usdToVnd, formatVnd } from '../../utils/money'
import { notify } from '@kyvg/vue3-notification'

import { languagePack } from '../../languages'

const networkErr = ref(true)
const showPopCircle = ref(false)
const showResult = ref(false)
const setTimeThread = ref(60)
const setMassDolar = ref(100)
const priceInitUSD = ref(0)
const setPercent = ref(70)
const setInfo = ref('')
const setOrder = ref('')
const balanceVND = ref(0)
// data resuft

watch(
  () => showPopCircle.value,
  (val) => {
    // leload
    loadCheck()
  }
)

let resultData = reactive({})
async function setResultData() {
  try {
    let res = await request.get(
      'order_history/transaction_result?order_id=' + setOrder.value.newOrder.id
    )
    res = res.data
    if (res.success == true) {
      //set kết quả
      var result = res.dataNow
      resultData.percent = result.profit_percentage
      resultData.type = result.order_type
      resultData.product = props.name
      let win = result.order_result.trim() == 'win' ? true : false
      resultData.win = win
      resultData.percent_money = result.profit
      resultData.amount = result.amount
      return true
    }
  } catch (error) {
    networkErr.value = false
  }
}
const emit = defineEmits(['close-popup', 'refreshListHistory'])
const closePopup = () => {
  emit('close-popup')
}

function setTime(session) {
  setTimeThread.value = session
  if (parseInt(balanceVND.value) < 100000000 && session == 90) {
    notify({ text: languagePack.popbuy_noti_warn_90s, type: 'warn' })
    setTimeThread.value = 60
  } else if (parseInt(balanceVND.value) < 500000000 && session == 120) {
    notify({ text: languagePack.popbuy_noti_warn_120s, type: 'warn' })
    setTimeThread.value = 60
  } else if (parseInt(balanceVND.value) < 1000000000 && session == 180) {
    notify({ text: languagePack.popbuy_noti_warn_180s, type: 'warn' })
    setTimeThread.value = 60
  } else if (parseInt(balanceVND.value) < 3000000000 && session == 300) {
    notify({ text: languagePack.popbuy_noti_warn_300s, type: 'warn' })
    setTimeThread.value = 60
  }
}

function convertString(inputString) {
  var arr = inputString.split('')
  var outputString = arr[0] + arr[1] + arr[2] + '/' + arr[3] + arr[4] + arr[5]
  return outputString
}
function formatNumber(num) {
  num = num.toString()
  while (num.charAt(0) === '0' && num.length > 1) {
    num = num.substr(1)
  }
  return num
}
function setMass(mass) {
  setMassDolar.value = formatNumber(mass)
}
async function getPriceInitUSD() {
  try {
    var reponse = await fetch('https://api.exchangerate-api.com/v4/latest/USDT')
    var data = await reponse.json()
    priceInitUSD.value = data.rates.VND
  } catch (error) {
    notify({ text: languagePack.popbuy_noti_network, type: 'warn' })
  }
}
async function buyForex() {
  document.getElementsByClassName('center-balence__btn')[0].setAttribute('disabled', '')

  await request
    .get('order_history/check_duplicate')
    .then(() => {
      console.log('ok')
    })
    .catch(() => {
      notify({
        title: languagePack.popbuy_noti_error,
        text: languagePack.popbuy_noti_dup_oder,
        type: 'error'
      })
      document.getElementsByClassName('center-balence__btn')[0].removeAttribute('disabled', '')
      throw new Error('duplicate')
    })

  setTimeout(() => {
    document.getElementsByClassName('center-balence__btn')[0].removeAttribute('disabled', '')
  }, 3000)

  if (setTimeThread.value == 0) {
    return
  }

  resultData = {}
  //post data
  var res = await order()
  //end

  if (res) {
    showPopCircle.value = true
    setTimeout(async () => {
      await setResultData()
      if (networkErr.value == false) {
        showPopCircle.value = false
        notify({ text: languagePack.popbuy_noti_network, type: 'warn' })
        return
      } else {
        setTimeout(() => {
          showPopCircle.value = false
          showResult.value = true
          // if (resultData.percent != undefined) {
          //   ////
          // }
        }, 5000)
      }
    }, setTimeThread.value * 1000)
  }

  emit('refreshListHistory', setTimeThread.value)
}
async function order() {
  networkErr.value = true
  if (setMassDolar.value > 1000000) {
    notify({
      title: languagePack.popbuy_noti_error,
      text: languagePack.popbuy_noti_max,
      type: 'error'
    })
    return
  }

  if (setMassDolar.value < 5) {
    notify({ title: languagePack.popbuy_noti_error, text: languagePack.noti_buy_1, type: 'error' })
    return
  }
  // if (setTimeThread.value == 120 && setMassDolar.value < 5) {
  //   notify({ title: languagePack.popbuy_noti_error, text: languagePack.noti_buy_1, type: 'error' })
  //   return
  // }
  // if (setTimeThread.value == 180 && setMassDolar.value < 2000) {
  //   notify({ title: languagePack.popbuy_noti_error, text: languagePack.noti_buy_2, type: 'error' })
  //   return
  // }
  // if (setTimeThread.value == 300 && setMassDolar.value < 30000) {
  //   notify({ title: languagePack.popbuy_noti_error, text: languagePack.noti_buy_3, type: 'error' })
  //   return
  // }

  var res = await request.post('order_history/order', {
    product_name: props.name == 'AUDNOK' ? 'USDVND' : props.name,
    order_type: props.type,
    amount: parseFloat(setMassDolar.value).toFixed(2),
    order_duration: setTimeThread.value + 's'
  })

  if (res.data.success == true) {
    loadCheck()
    setPercent.value = res.data.newOrder.profit_percentage
    setOrder.value = res.data
    return true
  } else {
    notify({ title: `${languagePack.popbuy_noti_error}`, text: res.data.message, type: 'error' })
    return false
  }
}
async function loadCheck() {
  try {
    let user = localStorage.getItem('user')
    if (typeof user == 'string') {
      user = JSON.parse(user)
      await request
        .get('user/getUser', {
          params: {
            id: user.id
          }
        })
        .then((res) => {
          if (res.data.success === true) {
            setInfo.value = res.data
          }
        })
    } else {
      loadding.value = true
    }
  } catch (error) {
    notify({ text: languagePack.popbuy_noti_network + error, type: 'warn' })
  }
}

const props = defineProps({
  name: String,
  type: String,
  info: Object,
  balance: String
})

async function convertVND() {
  balanceVND.value = await usdToVnd(parseFloat(props.balance))
}

onMounted(async () => {
  await convertVND()
  await getPriceInitUSD()
  setInfo.value = props.info
})
</script>
<template>
  <div class="popbuy">
    <div class="popbuy-content">
      <div class="popbuy-close" style="line-height: 10px">
        <div class="close" style="text-align: end" @click="closePopup">
          <i
            class="bx bx-x"
            style="font-size: 16px; color: white; background: red; border-radius: 50%"
          ></i>
        </div>
      </div>
      <div class="popbuy-top" v-if="showPopCircle">
        <!-- <i
                    @click="showPopCircle=false"
                    class="bx bx-x"
                    style="font-size: 15px; color: white; background: red"
                ></i> -->
        <PopCircle :second="setTimeThread" :name="props.name" />
        <div class="info">
          <div class="info-title" style="font-weight: 500; font-size: 15px">
            {{ languagePack.popbuy_infocomand }}
          </div>
          <div class="info-content flex">
            <div class="info-content__item">
              <div class="info-content__item__title">
                {{ languagePack.popbuy_command }}
              </div>
              <div class="info-content__item__data">
                {{
                  props.type == 'long'
                    ? `${languagePack.popbuy_long}`
                    : `${languagePack.popbuy_short}`
                }}
              </div>
            </div>
            <div class="info-content__item">
              <div class="info-content__item__title">
                {{ languagePack.popbuy_mass }}
              </div>
              <div class="info-content__item__data">${{ setMassDolar }}</div>
            </div>
            <div class="info-content__item">
              <div class="info-content__item__title">Earnings</div>
              <div
                :class="[
                  setPercent > 0
                    ? 'info-content__item__data success'
                    : 'info-content__item__data error'
                ]"
              >
                {{ setPercent }}%
              </div>
            </div>
          </div>
          <div class="info-mass flex">
            <div class="info-mass__name" style="margin: auto">
              {{ languagePack.popbuy_product }}:
              {{ props.name == 'AUDNOK' ? 'USD/VND' : convertString(props.name) }}
            </div>
          </div>
        </div>
      </div>
      <div class="popbuy-center">
        <h3 style="font-size: 15px">
          {{ languagePack.popbuy_confirm }}
          {{ props.name == 'AUDNOK' ? 'USD/VND' : convertString(props.name) }}
        </h3>
        <div class="center-time">
          <div class="center-time__title">
            <h4>{{ languagePack.popbuy_typeTime }}</h4>
          </div>
          <div class="center-time__body flex">
            <div
              :class="[
                setTimeThread == 60 ? 'center-time__object select' : 'center-time__object',
                balanceVND > 1 ? '' : 'order_command_disable'
              ]"
              @click="setTime(60)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              60 <span>{{ languagePack.popbuy_time }}</span> {{}}
            </div>
            <div
              :class="[
                setTimeThread == 90 ? 'center-time__object select' : 'center-time__object',
                balanceVND > 100000000 ? '' : 'order_command_disable'
              ]"
              @click="setTime(90)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              90 <span>{{ languagePack.popbuy_time }}</span>
            </div>
            <div
              :class="[
                setTimeThread == 120 ? 'center-time__object select' : 'center-time__object',
                balanceVND > 500000000 ? '' : 'order_command_disable'
              ]"
              @click="setTime(120)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              120 <span>{{ languagePack.popbuy_time }}</span>
            </div>
            <div
              :class="[
                setTimeThread == 180 ? 'center-time__object select' : 'center-time__object',
                balanceVND > 1000000000 ? '' : 'order_command_disable'
              ]"
              @click="setTime(180)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              180 <span>{{ languagePack.popbuy_time }}</span>
            </div>
            <div
              :class="[
                setTimeThread == 300 ? 'center-time__object select' : 'center-time__object',
                balanceVND > 3000000000 ? '' : 'order_command_disable'
              ]"
              @click="setTime(300)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              300 <span>{{ languagePack.popbuy_time }}</span>
            </div>
            <!-- <div
              :class="[
                setTimeThread == 500 ? 'center-time__object select' : 'center-time__object',
                balanceVND > 10000000000 ? '' : 'order_command_disable'
              ]"
              @click="setTime(500)"
            >
              <i class="bx bxs-lock-alt" style="color: rgb(250, 250, 250)"></i>
              500 <span>{{ languagePack.popbuy_time }}</span>
            </div> -->
          </div>
        </div>
        <div class="center-mass">
          <div class="center-mass__title">
            <h4>{{ languagePack.popbuy_volume }}</h4>
          </div>
          <div class="center-mass__body flex">
            <div
              :class="[setMassDolar == 100 ? 'center-mass__object select' : 'center-mass__object']"
              @click="setMass(100)"
            >
              $100
            </div>
            <div
              :class="[setMassDolar == 500 ? 'center-mass__object select' : 'center-mass__object']"
              @click="setMass(500)"
            >
              $500
            </div>
            <div
              :class="[setMassDolar == 1000 ? 'center-mass__object select' : 'center-mass__object']"
              @click="setMass(1000)"
            >
              $1.000
            </div>
            <div
              :class="[
                setMassDolar != 100 && setMassDolar != 500 && setMassDolar != 1000
                  ? 'center-mass__object select'
                  : 'center-mass__object'
              ]"
              @click="setMass('')"
            >
              {{ languagePack.popbuy_other }}
            </div>
          </div>
          <div class="center-mass__body">
            <span class="center-mass__title">$ </span
            ><input
              @change="setMass(setMassDolar)"
              placeholder="0"
              v-model="setMassDolar"
              type="number"
              class="center-mass__input"
              max="10000000"
            />
          </div>
        </div>
        <div class="center-balence">
          <div class="center-balence__title">
            <h4>
              {{ languagePack.popbuy_balance }}: <span>{{ formatUsdt(setInfo.balance) }}</span>
            </h4>
          </div>
        </div>
        <div class="center-confirm">
          <button class="center-balence__btn" @click="buyForex()">
            {{ languagePack.popbuy_orderNow }}
          </button>
        </div>
      </div>
      <div class="popbuy-bottom flex">
        <div class="popbuy-bottom__label" style="text-align: left">
          {{ languagePack.popbuy_product }}:
          <span>{{ props.name == 'AUDNOK' ? 'USD/VND' : convertString(props.name) }}</span>
        </div>
        <div class="popbuy-bottom__label" style="text-align: right">
          {{ languagePack.popbuy_command }} :
          <span>{{
            props.type == 'long' ? `${languagePack.popbuy_long}` : `${languagePack.popbuy_short}`
          }}</span>
        </div>
      </div>
    </div>
    <PopResult :data="resultData" v-if="showResult" @close-popup="showResult = false" />
  </div>
</template>
<style scoped>
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
  background-color: #fff;
  min-height: 350px;
  position: absolute;
  border: 1px solid #ebebeb;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0 0 2px #ebebeb;
  bottom: 0;
  left: 0;
  right: 0;
}

.popbuy-top {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #fff;
  padding-top: 50px;
  z-index: 2000;
  border-radius: 15px;
}
.info-content__item__data {
  font-weight: 500;
}
.popbuy-center {
  min-height: 150px;
}
.popbuy-center h3 {
  font-weight: 500;
}
.info {
  color: #222;
}
.flex {
  display: flex;
}
.center-time {
  text-align: start;
  margin-top: 10px;
}
.center-time__body {
  font-size: 11px;
  flex-wrap: wrap;
}
.center-time__title {
  margin-bottom: 5px;
}
.center-time__title h4 {
  font-weight: 500;
}
.center-time__object {
  padding: 5px 15px;
  background: #eeeff0;
  border: 1px solid #eeeff0;
  margin-right: 10px;
  margin-bottom: 10px;
  color: #222;
  border-radius: 5px;
  font-weight: 500;
}
.center-balence__title h4 {
  font-weight: 500;
}
.center-balence__title h4 span {
  font-weight: 500;
}
.select {
  background: #47cc85;
  color: #fff;
}
.center-mass {
  text-align: start;
  margin-top: 10px;
}
.info-mass__name {
  font-weight: 500;
}
.center-mass__body {
  font-size: 11px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.center-mass__title {
  font-size: 13px;
  margin-bottom: 5px;
  font-weight: 500;
}
.center-mass__title h4 {
  font-weight: 500;
}
.center-mass__object.select {
  color: #fff;
  background: #47cc85;
}
.center-mass__object {
  padding: 5px 15px;
  background: #eeeff0;
  border: 1px solid #eeeff0;
  margin-right: 10px;
  color: #222;
  border-radius: 5px;
  font-weight: 500;
}
.center-mass__object:hover {
  background: #47cc85;
}
.center-mass__input {
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  border-radius: 5px;
  background: #eeeff0;
  border: 1px solid #eeeff0;
  color: #222;
  margin-left: 5px;
  font-weight: 500;
}
.center-balence {
  text-align: start;
  font-size: 13px;
  margin: 15px 0px;
}
.center-confirm .center-balence__btn {
  padding: 10px 30px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 5px;
  background: #fd9e00;
  color: #fff;
  font-weight: 600;
}
.popbuy-bottom {
  font-size: 13px;
  margin-top: 15px;
  margin-bottom: 10px;
}
.popbuy-bottom__label {
  width: 50%;
  font-weight: 500;
}
.popbuy-bottom__label span {
  font-weight: 500;
}
.info {
  margin-top: 20px;
}
.info-content {
  margin-top: 10px;
}
.info-content__item {
  width: 33%;
}
.info-content__item div {
  line-height: 25px;
}
.info-content__item__title {
  font-weight: 500;
}
.success {
  color: #47cc85;
}
.error {
  color: #f93636;
}
.center-time__object i {
  display: none;
}
.order_command_disable {
  border-color: #c0d3c9;
  background-color: #c0d3c9;
  /* pointer-events: none; */
  opacity: 0.5;
  position: relative;
}
.order_command_disable i {
  display: block;
  position: absolute;
  top: 50%;
  right: -5px;
  transform: translate(-50%, -50%);
  color: #222;
  font-size: 13px;
}
.popbuy-top > i {
  position: absolute;
  right: 10px;
  top: 10px;
}
.info-mass {
  margin-top: 10px;
}
</style>

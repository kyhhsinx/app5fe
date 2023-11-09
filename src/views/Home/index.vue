<script setup>
import { ref, computed, watch, provide, onMounted, reactive, onUnmounted } from 'vue'
import PopUser from '../Layout/PopUser.vue'
import LangPopup from '../Layout/LangPopup.vue'
import QrPopup from '../Layout/Qr.vue'
import PopCskh from '../Layout/PopCskh.vue'
import { formatUsdt, usdToVnd, formatVnd } from '../../utils/money.js'
import Depoint from '../Layout/person/depoit.vue'
import Withdraw from '../Layout/person/withdow.vue'
import { onLoadIcon } from '../../utils/orther'
import About from '../Layout/home/About.vue'
import { convertDateTimeMoment } from '../../utils/timeMoment'
import store from '../../stores/index'
import loadApp from '../Layout/LoadApp.vue'
import request from '../../utils/request'
import { OpenPopup } from '../../utils/plugin'
import Item from '../Layout/Item.vue'
import Item1 from '../Layout/Item1.vue'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { languagePack } from '../../languages'
import notiSlider from '../Layout/home/notiSlider.vue'
import { notify } from '@kyvg/vue3-notification'
const captions = ref([])
captions.value = ['Our team', 'About', 'Contact us', 'Our patreon']
const userLogined = ref('')
const infoUser = ref('')
const isLogined = ref(false)
// const showPopupLanguage = ref(false)
// const showPopupQr = ref(false)
const loadding = ref(false)
const showCshk = ref(false)
const symbols = ref('')
const symbolsSlider = ref('')
const hiddenBalance = ref(false)
const isStatus = ref(false)
const showDepoit = ref(false)
const showWithdraw = ref(false)
const showAbout = ref(false)
// const oldPassword = ref('')
// const newPassword = ref('')
// const reNewPassword = ref('')
// const isShowChangePass = ref(false)
// const isShowUserFunc = ref(false)

const idInterval = ref('')
const idInterval1 = ref('')

async function checkAddedBank() {
  var res = await request.get('user/check_bank')
  var result = res.data
  if (result.success == true) {
    showWithdraw.value = true
  } else {
    notify({
      title: `${languagePack.person_wihdraw_fail_title}`,
      text: `${languagePack.noti_content_addbank}`,
      type: 'warn'
    })
    // document.querySelectorAll('.btn-person')[1].setAttribute('disabled', 'disabled')
    // setTimeout(() => {
    //   document.querySelectorAll('.btn-person')[1].removeAttribute('disabled')
    // }, 3000)
  }
}
// async function changePassword() {
//   await request
//     .post('auth/changePassword', {
//       newPassword: newPassword.value,
//       oldPassword: oldPassword.value
//     })
//     .then((res) => {
//       if (res.data.message == 'Password updated successfully.') {
//         notify({
//           title: languagePack.home_changpass_noti_success_tile,
//           text: languagePack.home_changpass_noti_success_ct,
//           type: 'success'
//         })
//       }
//     })
//     .catch((err) => {
//       if ((err.response.data.message = 'Invalid old password.')) {
//         notify({
//           title: languagePack.home_changpass_noti_fail_tile,
//           text: languagePack.home_changpass_noti_fail_ct,
//           type: 'error'
//         })
//       }
//     })
// }
function toggleBalance() {
  hiddenBalance.value = !hiddenBalance.value
}
async function getListSympol(limit) {
  await request
    .get('coinList/listing', {
      params: {
        limit: limit
      }
    })
    .then((res) => {
      symbols.value = {
        data: res.data.data,
        status: isStatus.value
      }
      loadding.value = true
    })
}

const checkLogin = store.getters.usersss

const dataUserNot = ref()
const limitPage = ref(5)
async function loadUserNotification() {
  try {
    await request
      .get('notify/listing_full_user', {
        limit: limitPage.value
      })
      .then(async (res) => {
        dataUserNot.value = res.data.data
        for (let i = 0; i < dataUserNot.value.length; i++) {
          dataUserNot.value[i].time = await convertDateTimeMoment(dataUserNot.value[i].createdAt)
        }
      })
  } catch (error) {
    console.log(error)
  }
}

const locations = JSON.parse(localStorage.getItem('locations'))
const cvTime = ref()

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
            userLogined.value = res.data
            infoUser.value = `ID: ${res.data.id} (${res.data.fullName})`
            isLogined.value = true
          } else {
            isLogined.value = false
            loadding.value = true
          }
        })
    } else {
      isLogined.value = false
      loadding.value = true
    }
  } catch (error) {
    console.log(error)
    loadding.value = false
  }
}
const isLoginedChange = computed(() => store.getters.usersss)
watch(
  () => isLoginedChange.value,
  (val) => {
    loadCheck()
  }
)
watch(
  () => isLogined.value,
  (val) => {
    if (isLogined.value == true) {
      getListSympol(5)
      // idInterval.value = setInterval(() => {
      //   getListSympolSlider(3)
      // }, 3000)
      idInterval1.value = setInterval(() => {
        getListSympol(5)
      }, 3000)
    }
  }
)

/* Thực hiện popup đổi ngôn ngữ */
//notification
const isShowNotification = ref(false)
function show_noti() {
  isShowNotification.value = !isShowNotification.value
  loadUserNotification()
  // function convertDateTime(time) {
  //   const createdAt = time;
  //   cvTime.value =  moment(createdAt).fromNow();
  //   return cvTime.value
  // }
}
function close_noti(e) {
  e.preventDefault()
  isShowNotification.value = false
}

// Gọi hàm để khởi tạo MEIQIA

//
function showCshkPluin() {
  OpenPopup()
}

const testChat = () => {
  var check = store.getters.usersss
  if (check) {
    ;(function (a, b, c, d, e, j, s) {
      a[d] =
        a[d] ||
        function () {
          ;(a[d].a = a[d].a || []).push(arguments)
        }
      ;(j = b.createElement(c)), (s = b.getElementsByTagName(c)[0])
      j.async = true
      j.charset = 'UTF-8'
      j.src = 'https://static.meiqia.com/widget/loader.js'
      s.parentNode.insertBefore(j, s)
    })(window, document, 'script', '_MEIQIA')
    _MEIQIA('entId', '82b44d07da54bee4eecec9810f50bcc3')
    _MEIQIA('language', 'en')
    const token = JSON.parse(localStorage.getItem('user') || '{}')
    const name = token.fullName
    const id = token.id
    _MEIQIA('metadata', {
      name: name + ' (ID: ' + id + ')',
      address: 'idAccount: ' + id
    })
    isDestroy.value = true
  }
}

onMounted(async () => {
  await loadCheck()
  onLoadIcon()
  if (checkLogin) {
    await loadUserNotification()
  }
  //
  watch(isLoginedChange, (newVal, oldVal) => {
    if (newVal == true) {
      testChat()
    }
    if (newVal == false) {
      var check = store.getters.usersss
      if (check) {
        ;(function (a, b, c, d, e, j, s) {
          a[d] =
            a[d] ||
            function () {
              ;(a[d].a = a[d].a || []).push(arguments)
            }
          ;(j = b.createElement(c)), (s = b.getElementsByTagName(c)[0])
          j.async = true
          j.charset = 'UTF-8'
          j.src = 'https://static.meiqia.com/widget/loader.js'
          s.parentNode.insertBefore(j, s)
        })(window, document, 'script', '_MEIQIA')
        _MEIQIA('entId', '82b44d07da54bee4eecec9810f50bcc3')
        _MEIQIA('language', 'en')
        const token = JSON.parse(localStorage.getItem('user'))
        let name = ''
        let id = ''
        if (token == undefined) {
          name = 'Khách hàng vãng lai'
        } else {
          name = token.fullName
          id = token.id
        }

        _MEIQIA('metadata', {
          name: name + ' (ID: ' + id + ')',
          address: 'idAccount: ' + id
        })
      }
    }
  })
})
/* Slider */
onUnmounted(() => {
  clearInterval(idInterval.value)
  clearInterval(idInterval1.value)
})

// check saturday and sunday
function isSaturdayOrSundayNorthAmerica() {
  var currentDate = new Date()
  var currentTimezone = 'America/New_York' // Múi giờ Bắc Mỹ

  // Xác định ngày hiện tại theo múi giờ Bắc Mỹ
  var currentDay = currentDate.toLocaleString('en-US', {
    weekday: 'long',
    timeZone: currentTimezone
  })

  return currentDay === 'Saturday' || currentDay === 'Sunday' || currentDay === 'Friday'
}
var isWeekend = isSaturdayOrSundayNorthAmerica()
</script>

<template>
  <div v-if="loadding == true">
    <div class="main">
      <div class="main-top">
        <div class="left">
          <img width="23" src="../../assets/logo.png" />
          <h1 class="title_app">FireAnt</h1>
        </div>
        <!-- <div class="center">
          <div class="search">
            <i class="bx bx-search" style="color: #4d5565"></i>
            <input class="search-box" />
          </div>
        </div> -->
        <div class="right">
          <!-- <label
            ><i class="bx bx-support" style="color: #4d5565" @click="showCshkPluin()"></i
          ></label> -->
          <label class="ntf" style="display: flex; align-items: center; margin-right: 5px">
            <img src="../../assets/bell2.png" alt="" width="23" @click="show_noti()" />
            <!-- <i class="bx bxs-bell" style="color: #4d5565" @click="show_noti()"></i> -->
          </label>
          <!-- <label
            ><i class="bx bx-world" style="color: #4d5565" @click="showPopupLanguage = true"></i
          ></label> -->
        </div>

        <div class="notification" v-if="isShowNotification">
          <div
            class="tp"
            style="display: flex; justify-content: space-between; align-items: center"
          >
            <h2>{{ languagePack.home_noti_title }}</h2>
            <i
              class="bx bx-x"
              @click="close_noti"
              style="font-size: 16px; color: white; background: red; border-radius: 50%"
            ></i>
          </div>
          <div class="list-notification">
            <div v-if="dataUserNot == null" class="dhnt">
              <span>{{ languagePack.home_noti_datanot }}</span>
            </div>
            <div class="item" v-for="item in dataUserNot">
              <span class="created">
                {{ item.time }}
              </span>
              <h3 class="title">
                {{ item.title }}
              </h3>
              <p class="content">
                {{ item.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <!-- <div style="margin-top: 10px" class="wc">
          <label style="color: #222; font-size: 13px; font-style: italic; font-weight: 500"
            ><i>{{ languagePack.home_welcome }}</i> {{ userLogined.fullName }} !</label
          >
          <span class="user-id">ID: 10000{{ userLogined.id }} </span>
        </div>
        <div class="info flex">
          <div class="info-balance">
            <label
              >{{ languagePack.home_balance }} (USD)<i
                class="bx bxs-down-arrow"
                style="color: #797874; font-size: 12px"
              ></i
            ></label>
            <h1>
              <span>{{
                hiddenBalance == true ? formatUsdt(userLogined.balance) : '*********'
              }}</span>
              &ensp;<i
                :class="[hiddenBalance == true ? 'bx bxs-show' : 'bx bxs-low-vision']"
                style="color: #797874"
                @click="toggleBalance()"
              ></i>
            </h1>
          </div>
          <div class="info-depoit flex" style="justify-content: flex-end">
            <button class="btn" @click="showDepoit = true">{{ languagePack.home_depoint }}</button>
          </div>
        </div> -->
        <div class="infor-center">
          <div class="slider-notification">
            <carousel :items-to-show="1" :wrap-around="true" :autoplay="false">
              <Slide :index="1">
                <div class="carousel__item">
                  <div class="content">
                    <h4>{{ languagePack.home_slide_hd1 }}</h4>
                    <p>{{ languagePack.home_slide_ct1 }}</p>
                  </div>
                  <img src="../../assets/sf1.png" alt="photo" style="min-width: 90px" />
                </div>
              </Slide>
              <Slide :index="2">
                <div class="carousel__item">
                  <div class="content">
                    <h4>{{ languagePack.home_slide_hd2 }}</h4>
                    <p>{{ languagePack.home_slide_ct2 }}</p>
                  </div>
                  <img src="../../assets/gl1.png" alt="photo" style="min-width: 90px" />
                </div>
              </Slide>
              <Slide :index="3">
                <div class="carousel__item">
                  <div class="content">
                    <h4>{{ languagePack.home_slide_hd3 }}</h4>
                    <p>{{ languagePack.home_slide_ct3 }}</p>
                  </div>
                  <img src="../../assets/coi.png" alt="photo" style="min-width: 90px" />
                </div>
              </Slide>
              <template #addons>
                <Pagination />
                <!-- <Navigation /> -->
              </template>
            </carousel>
          </div>
          <div class="right">
            <div class="help">
              <img src="../../assets/light.png" alt="photo" width="35" />
              <h4>{{ languagePack.hom_inf_center }}</h4>
              <p style="color: #464a64">{{ languagePack.home_inf_center_tips }}</p>
            </div>
            <div class="coin-highlight">
              <template v-if="symbols.data">
                <h4>
                  {{ symbols.data[1].symbol == 'AUDNOK' ? 'USD/VND' : symbols.data[1].symbol }}
                </h4>
                <div class="mid">
                  <span
                    :class="[symbols.data[1].data.change1 > 0 ? 'success' : 'error']"
                    style="font-weight: 500"
                    >{{ parseFloat(symbols.data[1].data.lastdaily).toFixed(5) }}</span
                  >
                  <span
                    class="sub"
                    :class="[symbols.data[1].data.change1 > 0 ? 'success' : 'error']"
                    style="
                      font-weight: 500;
                      font-size: 10px;
                      display: inline-block;
                      margin-left: 3px;
                      letter-spacing: -0.5px;
                    "
                    >{{ symbols.data[1].data.change1 }}%</span
                  >
                </div>
                <span class="lastdaily" style="color: #464a64; font-weight: 500; font-size: 10px"
                  >Last daily</span
                >
              </template>
            </div>
          </div>
        </div>
        <div class="noti-sli">
          <div class="img">
            <i class="bx bx-volume-full"></i>
          </div>
          <notiSlider />
        </div>

        <div class="service">
          <h2>{{ languagePack.home_service_title }}</h2>
          <div class="flast flex">
            <div class="flast-item" @click="showDepoit = true">
              <div class="icon">
                <!-- <i class="bx bx-wallet"></i> -->
                <img src="../../assets/depoint.png" alt="" width="30" />
              </div>
              <div class="title">
                {{ languagePack.home_depoint }}
              </div>
            </div>
            <div class="flast-item wdr" @click="checkAddedBank()">
              <div class="icon">
                <!-- <i class="bx bx-money-withdraw"></i> -->
                <img src="../../assets/withdraw.png" alt="" width="30" />
              </div>
              <div class="title">
                {{ languagePack.home_withdraw }}
              </div>
            </div>
            <div class="flast-item" @click="showCshkPluin()">
              <div class="icon">
                <!-- <i class="bx bx-support"></i> -->
                <img src="../../assets/sp.png" alt="" width="30" />
              </div>
              <div class="title">
                {{ languagePack.home_support }}
              </div>
            </div>
            <div class="flast-item" @click="showAbout = true">
              <div class="icon">
                <img src="../../assets/intro.png" alt="" width="30" />
                <!-- <i class="bx bx-info-circle"></i> -->
              </div>
              <div class="title">
                {{ languagePack.home_about }}
              </div>
            </div>
          </div>
        </div>

        <div class="list-data">
          <h2>{{ languagePack.home_list_dt_tt }}</h2>
          <div
            class="list-item list-data__title flex"
            style="color: #222; font-size: 13px; margin-bottom: 2px"
          >
            <div style="width: 10%; font-weight: 500">No.</div>
            <div class="name" style="width: 35%; font-weight: 500">
              {{ languagePack.home_forexmakets }}
              <i class="bx bxs-down-arrow" style="font-size: 10px"></i>
            </div>
            <div class="price" style="width: 25%; text-align: center; font-weight: 500">
              {{ languagePack.home_lastprice }}
            </div>
            <div class="percent" style="width: 30%; text-align: right; font-weight: 500">
              {{ languagePack.home_change24 }}(%)
            </div>
          </div>

          <div>
            <template v-if="isWeekend == false">
              <Item
                v-for="(item, index) in symbols.data"
                :name="item.symbol"
                :vitri="index"
                :data="item.data"
                :class="{ even: index % 2 === 0 }"
              />
            </template>
            <template v-if="isWeekend == true">
              <Item1
                v-for="(item, index) in symbols.data"
                :name="item.symbol"
                :vitri="index"
                :data="item.data"
                :class="{ even: index % 2 === 0 }"
              />
            </template>
          </div>
          <RouterLink
            to="/market"
            style="font-size: 13px; color: #222; font-weight: 500; margin-top: 2px"
            >{{ languagePack.home_more }}
            <i class="bx bx-chevrons-down" style="font-size: 10px; font-weight: 500"></i
          ></RouterLink>
        </div>
      </div>
      <PopUser v-if="!isLogined" />
      <!-- <LangPopup v-if="showPopupLanguage" @close-popup="showPopupLanguage = false" /> -->
      <!-- <QrPopup v-if="showPopupQr" @close-popup="showPopupQr = false" /> -->
      <PopCskh v-if="showCshk" @close-popup="showCshk = false" />
      <Depoint v-if="showDepoit" @close-popup="showDepoit = false" />
      <Withdraw
        v-if="showWithdraw"
        @close-popup="showWithdraw = false"
        :securityCode="userLogined.securityCode"
        :balance="userLogined.balance"
      />
      <About v-if="showAbout" @close-popup="showAbout = false" />
    </div>
  </div>
  <div v-else>
    <loadApp />
  </div>
</template>
<style scoped>
.list-data {
  border-top: 1px solid #ebebeb;
}
.list-data h2 {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
}
.list-item {
  padding-inline: 10px;
}
.carousel__item {
  min-height: 125px;
  color: white;

  min-height: 150px;
  position: relative;
}
.carousel__item .content {
  margin-bottom: 20px;
}
.carousel__item img {
  max-height: 80px;
}
.infor-center {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  margin-top: 20px;
}
.infor-center .slider-notification {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  padding: 20px 10px 10px;
  width: calc(60% - 3px);
  box-shadow: 0 0 2px #ebebeb;
  min-height: 220px;
}
.infor-center .slider-notification .content {
  min-height: 70px;
}
.infor-center .slider-notification .content p {
  color: #222;
  font-size: 10px;
  text-align: left;
}
.infor-center .right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(40% - 3px);
}

.infor-center .right > div {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 2px #ebebeb;
}
.infor-center .right > div h4 {
  font-weight: 500;
  margin-top: 5px;
  color: #222;
}
.infor-center .right > div {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  height: calc(50% - 3px);
  padding: 10px;
}
.coin-highlight .lastdaily {
  font-size: 11px;
}
.carousel {
  height: 100%;
}
.carousel__item img {
  border-radius: 5px;
}
.carousel__item .content h4 {
  font-size: 13px;
  color: #222;
  text-align: left;
  font-weight: 500;
}
.carousel__item .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-content {
  margin-bottom: 56px;
}
.main {
  padding: 45px 15px 10px 15px;
}

.carousel__slide {
  align-items: flex-start;
}
.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.95);
}
.carousel__prev {
  background-color: red;
  color: red;
}
.carousel__icon path {
  fill: red !important;
}
.main-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #222;
  font-size: 20px;
  border-radius: 20px;
}
.left {
  display: flex;
  align-items: center;
}
.left h1 {
  color: #686054;
  font-weight: 600;
}
.left img {
  margin-right: 5px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.info {
  color: #222;
  font-size: 12px;
  padding: 10px 0;
  border-radius: 10px;
  align-items: center;
}
.info-balance {
  width: 60%;
}
.info-depoit {
  width: 40%;
}
h1 span {
  font-weight: 500;
}
h1 {
  font-weight: 300;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.right i {
  margin-left: 8px;
}
.center {
  flex: 1;
  padding-left: 10px;
}
.service h2 {
  border-top: 1px solid #ebebeb;
  margin-top: 10px;
  padding-top: 15px;
  margin-bottom: 15px;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
}
.flast {
  color: #222;
  font-size: 12px;
  text-align: center;
}
.flast-item {
  width: calc(100% / 4);
  text-align: center;
  margin-bottom: 15px;
}
.flast-item .icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  line-height: 50px;
  font-size: 20px;
  color: #fd9e00;
  margin: auto;
  background-image: linear-gradient(#ebebeb, #fff);
  display: flex;
  justify-content: center;
  align-items: center;
}

.flast-item .title {
  font-weight: 500;
  font-size: 13px;
}

.search {
  position: relative;
}
.search i {
  position: absolute;
  z-index: 9;
  margin-top: 6px;
  margin-left: 6px;
  font-size: 17px;
}
.search-box {
  border: none;
  background: #eeeff0;
  border-radius: 10px;
  width: 90%;
  height: 23px;
  top: -5px;
  outline: none;
  color: #222;
  padding-left: 27px;
  font-size: 13px;
}
.btn {
  border: none;
  padding: 5px 10px;
  height: 30px;
  width: 100px;
  background-color: #fd9e00;
  color: #fff;
  cursor: point;
  border-radius: 5px;
  font-weight: 600;
}
.day {
  padding: 5px 15px;
}
/* zhangwei */
.dhnt {
  font-size: 13px;
  margin-top: 10px;
}
.notification {
  background: #eeeff0;
  width: 75%;
  position: absolute;
  top: 135%;
  right: 0;
  z-index: 9999999;
  border-radius: 5px;
  padding: 0 10px 15px 10px;
  border: 1px solid #ebebeb;
}
.notification h2 {
  font-weight: 500;
  font-size: 14px;
  margin-top: 5px;
  text-align: center;
}
.notification .list-notification .item {
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #ebebeb;
  background-color: #fff;
  box-shadow: 0 0 2px #ebebeb;
}
.notification .list-notification .item h3 {
  font-size: 12px;
  font-weight: 500;
}
.notification .list-notification .item p {
  font-size: 11px;
}

.notification .list-notification .created {
  display: block;
  text-align: right;
  font-size: 10px;
}
.notification .list-notification .item:not(:last-child) {
  margin-bottom: 10px;
}
.notification::after {
  content: '';
  position: absolute;
  width: 0px;
  height: 0px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #ebebeb;
  top: -10px;
  right: 9px;
  z-index: 99999999;
}
.wc {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wc .user-id {
  font-size: 12px;
  color: #222;
  font-family: 'Times New Roman', Times, serif;
  font-style: italic;
}

.carousel__slide--prev {
  transform: none;
}

.carousel__item {
  width: 100%;
}
.carousel__pagination-button:hover::after,
.carousel__pagination-button--active::after {
  background-color: #000;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.carousel__pagination {
  position: absolute;
  bottom: 0;
  padding-left: 0;
}
.carousel__pagination-button {
  padding: 1px !important;
}

.btn-sm {
  text-align: center;
  margin-top: 15px;
}

.noti-sli {
  display: flex;
  margin-top: 10px;
  align-items: center;
  color: #222;
}
.noti-sli .img {
  width: 25px;
  text-align: center;
  margin-right: 5px;
}
.noti-sli .img i {
  line-height: 23px;
  font-size: 21px;
}

.even {
  background: #eeeff0;
}
.keen-slider__slide {
  font-size: 13px;
}
.coin-highlight .success {
  color: #47cc85;
}
.coin-highlight .error {
  color: #f93636;
}
</style>

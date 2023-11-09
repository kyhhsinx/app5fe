<script setup>
import { onLoadIcon } from '../../utils/orther'
import { VueElement, onMounted, reactive, ref } from 'vue'
import { formatUsdt, usdToVnd, formatVnd } from '../../utils/money.js'
import PopCskh from '../Layout/PopCskh.vue'
import request from '../../utils/request'
import LangPopup from '../Layout/LangPopup.vue'
import loadApp from '../Layout/LoadApp.vue'
import Depoint from '../Layout/person/depoit.vue'
import Upload from '../Layout/person/upload.vue'
import Info from '../Layout/person/info.vue'
import Bank from '../Layout/person/bank.vue'
import store from '../../stores/index'
import Withdaw from '../Layout/person/withdow.vue'
import { notify } from '@kyvg/vue3-notification'
const infoUser = ref('')
const activeTab = ref('tab1')
const loadding = ref(false)
const lstHistory = ref(false)
const lstToup = ref(false)
const lstWithdraw = ref(false)
const showCshk = ref(false)
const vnd = ref(false)
const userLogined = ref('')
const showDepoit = ref(false)
const showUpload = ref(false)
const showBank = ref(false)
const showInfo = ref(false)
const showWithdaw = ref(false)
const showHtr = ref(false)
const showConfirm = ref(false)
const point = ref(0)
const showPopupLanguage = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const reNewPassword = ref('')
const isShowChangePass = ref(false)

const hidePass1 = ref(false)
const hidePass2 = ref(false)
const hidePass3 = ref(false)

import { languagePack } from '../../languages'
import { OpenPopup } from '../../utils/plugin'
function showCshkPluin() {
  OpenPopup()
}
async function loadCheck() {
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
          point.value = userLogined.value.credit_score
          loadVnd()
          loadding.value = true
        } else {
          loadding.value = true
        }
      })
  } else {
    loadding.value = true
  }
}

async function loadHistory() {
  let user = localStorage.getItem('user')
  if (typeof user == 'string') {
    user = JSON.parse(user)
    await request.get('user/get_trans_history').then((res) => {
      if (res.data.success === true) {
        lstHistory.value = res.data.data.filter((item) => item.typeTransaction !== 'manual')
        lstToup.value = lstHistory.value.filter((item) => item.typeTransaction === 'toup')
        lstWithdraw.value = lstHistory.value.filter((item) => item.typeTransaction === 'withdrawal')
      }
    })
  }
}

async function reloadListHistory() {
  await request.get('user/get_trans_history').then((res) => {
    if (res.data.success === true) {
      lstHistory.value = res.data.data
    }
  })

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
        }
      })
  }

  loadVnd()
}

async function changePassword() {
  if (newPassword.value.length < 4 || reNewPassword.value.length < 4) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.changpasserr1,
      type: 'error'
    })
    return
  }
  if (newPassword.value != reNewPassword.value) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.changpasserr2,
      type: 'error'
    })
    return
  }

  await request
    .post('auth/changePassword', {
      newPassword: newPassword.value,
      oldPassword: oldPassword.value
    })
    .then((res) => {
      if (res.data.message == 'Password updated successfully.') {
        isShowChangePass.value = false
        notify({
          title: languagePack.home_changpass_noti_success_tile,
          text: languagePack.home_changpass_noti_success_ct,
          type: 'success'
        })
      }
    })
    .catch((err) => {
      if ((err.response.data.message = 'Invalid old password.')) {
        notify({
          title: languagePack.home_changpass_noti_fail_tile,
          text: languagePack.home_changpass_noti_fail_ct,
          type: 'error'
        })
      }
    })
}

async function checkAddedBank() {
  var res = await request.get('user/check_bank')
  var result = res.data
  if (result.success == true) {
    showWithdaw.value = true
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
async function logoutFunction() {
  store.dispatch('logout')
  location.reload()
}
async function loadVnd() {
  vnd.value = await usdToVnd(userLogined.value.balance)
}

function changeTab(tabId) {
  activeTab.value = tabId
}

onMounted(() => {
  loadCheck()

  loadHistory()
})
</script>
<template>
  <div class="main" v-if="loadding == true">
    <div class="main-content">
      <div class="tct">
        <div class="persons">
          <div class="persons-balance">
            <div class="persons-balance__title">
              <div class="left" style="font-weight: 500">
                <i
                  class="bx bx-check-shield"
                  style="color: #222; font-size: 18px"
                  v-if="userLogined.status != 3"
                ></i>
                <i v-else class="bx bxs-check-shield" style="color: #10ef26; font-size: 18px"></i>
                {{ languagePack.person_balance }} (USD)
              </div>
              <div class="id">ID: 10000{{ userLogined.id }}</div>

              <!-- <div class="right" style="display: flex; align-items: center"> -->

              <!-- <div class="feel" style="margin-right: 3px">
                <div class="smile" v-if="point > 80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="#47CC85"
                    stroke-width="1.5"
                    width="16px"
                  >
                    <path
                      d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm130.7 57.9c-4.2-13.6 7.1-25.9 21.3-25.9H364.5c14.2 0 25.5 12.4 21.3 25.9C369 368.4 318.2 408 258.2 408s-110.8-39.6-127.5-94.1zm86.9-85.1l0 0 0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0zm160 0l0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0 0 0z"
                    />
                  </svg>
                </div>
                <div class="normal" v-else-if="point > 65">
                  <svg
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="#ffe998"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                </div>
                <div class="sad" v-else>
                  <svg
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="#d5332f"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                </div>
              </div> -->
              <!-- <span>{{ languagePack.credit_score }}: {{ point }}</span> -->
              <!-- </div> -->
            </div>
            <div class="persons-balance__number">
              <div class="right">
                <div class="balance">
                  {{ formatUsdt(userLogined.balance) }}
                </div>
                <div class="balance-detail">≈ {{ vnd == false ? '-----' : formatVnd(vnd) }}</div>
              </div>
            </div>
            <!-- <div class="persons-balance__active">
            <button
              :class="[userLogined.status != 1 ? 'btns btn-person with50' : 'btns btn-person']"
              @click="showDepoit = true"
            >
              {{ languagePack.person_depoit }}
            </button>
            <button
              :class="[userLogined.status != 1 ? 'btns btn-person with50' : 'btns btn-person']"
              @click="checkAddedBank()"
            >
              {{ languagePack.person_withdaw }}
            </button>
            <button
              class="btns btn-person"
              v-if="userLogined.status == 1"
              @click="showUpload = true"
            >
              {{ languagePack.person_confirm }}
            </button>
          </div> -->
          </div>
        </div>
        <!-- <div class="orther">
          <div class="orther-content flex">
            <div class="orther-item" v-if="userLogined.status == 1" @click="showUpload = true">
              <div class="icon">
                <i class="bx bxs-check-shield"></i>
              </div>
              <div class="title">
                {{ languagePack.person_confirm }}
              </div>
            </div>
            <div class="orther-item" @click="showBank = true">
              <div class="icon">
                <i class="bx bxs-bank"></i>
              </div>
              <div class="title">
                {{ languagePack.person_bank }}
              </div>
            </div>
            <div class="orther-item" @click="showDepoit = true">
              <div class="icon">
                <i class="bx bx-wallet"></i>
              </div>
              <div class="title">
                {{ languagePack.person_depoit }}
              </div>
            </div>
            <div class="orther-item" @click="checkAddedBank()">
              <div class="icon">
                <i class="bx bx-money-withdraw"></i>
              </div>
              <div class="title">
                {{ languagePack.home_withdraw }}
              </div>
            </div>
            <div class="orther-item" @click="showCshkPluin()">
              <div class="icon">
                <i class="bx bx-support"></i>
              </div>
              <div class="title">
                {{ languagePack.person_cskh }}
              </div>
            </div>
            <div class="orther-item" @click="logoutFunction()">
              <div class="icon">
                <i class="bx bx-log-in-circle"></i>
              </div>
              <div class="title">
                {{ languagePack.person_logout }}
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="about">
        <ul>
          <li @click="showInfo = true">
            <div class="left">
              <img
                src="../../assets/favicon.png"
                alt="photo"
                width="25"
                style="vertical-align: middle; margin-right: 10px; margin-left: 5px"
              />
              <span>{{ languagePack.person_ab_personal }}</span>
            </div>
            <i class="bx bxs-chevron-right"></i>
          </li>

          <li @click="showHtr = true">
            <div class="left">
              <img src="../../assets/htr.png" alt="" width="30" />
              <span>{{ languagePack.person_ab_lsgd }}</span>
            </div>
            <i class="bx bxs-chevron-right"></i>
          </li>
          <li v-if="userLogined.status == 1" @click="showUpload = true">
            <div class="left">
              <img src="../../assets/veri.png" alt="" width="30" />
              <span>{{ languagePack.person_ab_xm }}</span>
            </div>
            <i class="bx bxs-chevron-right"></i>
          </li>
          <li @click="showBank = true">
            <div class="left">
              <img src="../../assets/bank.png" alt="" width="30" />
              <span>{{ languagePack.person_ab_bank_acc }}</span>
            </div>
            <i class="bx bxs-chevron-right"></i>
          </li>
          <li
            @click="
              () => {
                isShowChangePass = true
              }
            "
          >
            <div class="left">
              <img src="../../assets/lock.png" alt="" width="30" />
              <span>{{ languagePack.person_ab_changepass }}</span>
            </div>
            <i class="bx bxs-chevron-right"></i>
          </li>
          <li @click="showCshkPluin()">
            <div class="left">
              <img src="../../assets/sp.png" alt="" width="30" />
              <span>{{ languagePack.person_ab_cskh }}</span>
            </div>
            <i class="bx bxs-chevron-right"></i>
          </li>
          <li @click="showPopupLanguage = true">
            <div class="left">
              <img src="../../assets/lg.png" alt="" width="30" />
              <span>{{ languagePack.person_ab_lang }}</span>
            </div>
            <i class="bx bxs-chevron-right"></i>
          </li>
          <li @click="logoutFunction()">
            <div class="left">
              <!-- <i class="bx bx-support"></i> -->
              <img src="../../assets/logout.png" alt="" width="30" />
              <span>{{ languagePack.person_ab_logout }}</span>
            </div>
            <i class="bx bxs-chevron-right"></i>
          </li>
        </ul>
      </div>
      <div class="htr" v-if="showHtr">
        <div class="nomo">
          <div data-v-f83b0c25="" class="close" style="text-align: end">
            <i
              data-v-f83b0c25=""
              class="bx bx-x"
              style="font-size: 16px; color: white; background: red; border-radius: 50%"
              @click="showHtr = false"
            ></i>
          </div>
          <div class="command">{{ languagePack.person_historyForm }}</div>
          <div class="tabs">
            <ul class="tab-links">
              <li :class="{ active: activeTab === 'tab1' }" @click="changeTab('tab1')">
                {{ languagePack.person_ab_lsgd_all }}
              </li>
              <li :class="{ active: activeTab === 'tab2' }" @click="changeTab('tab2')">
                {{ languagePack.person_ab_lsgd_dp }}
              </li>
              <li :class="{ active: activeTab === 'tab3' }" @click="changeTab('tab3')">
                {{ languagePack.person_ab_lsgd_wd }}
              </li>
            </ul>
            <div class="tr flex">
              <div class="td" style="width: 10%; border: none">
                {{ languagePack.person_code }}
              </div>
              <div class="td" style="width: 20%; border: none">
                {{ languagePack.person_order }}
              </div>
              <div class="td" style="width: 40%; border: none">{{ languagePack.person_value }}</div>
              <div class="td" style="width: 30%; border: none; text-align: center">
                {{ languagePack.person_status }}
              </div>
            </div>
            <div class="tab-content">
              <div class="tab" :class="{ active: 'tab1' === activeTab }">
                <div
                  class="tr flex"
                  v-for="(item, index) in lstHistory"
                  :class="{ even: index % 2 === 0 }"
                >
                  <div class="td" style="width: 10%; border: none">{{ item.id }}</div>
                  <div class="td" style="width: 20%; border: none">
                    {{
                      item.typeTransaction == 'toup'
                        ? languagePack.person_depoit
                        : languagePack.person_withdaw
                    }}
                  </div>
                  <div class="td" style="width: 40%; border: none">
                    {{
                      item.typeTransaction == 'toup'
                        ? formatUsdt(item.amount_usd)
                        : formatUsdt(item.amount)
                    }}
                  </div>
                  <div
                    :class="[item.status ? 'td ' + item.status : '']"
                    style="width: 30%; border: none; text-align: center"
                  >
                    {{
                      item.status == 'approved' || item.status == 'rejected'
                        ? item.status == 'approved'
                          ? languagePack.person_status_value_success
                          : languagePack.person_status_value_fail
                        : languagePack.person_status_value_pending
                    }}
                  </div>
                </div>
              </div>
              <div class="tab" :class="{ active: 'tab2' === activeTab }">
                <div
                  class="tr flex"
                  v-for="(item, index) in lstToup"
                  :class="{ even: index % 2 === 0 }"
                >
                  <div class="td" style="width: 10%; border: none">{{ item.id }}</div>
                  <div class="td" style="width: 20%; border: none">
                    {{
                      item.typeTransaction == 'toup'
                        ? languagePack.person_depoit
                        : languagePack.person_withdaw
                    }}
                  </div>
                  <div class="td" style="width: 40%; border: none">
                    {{
                      item.typeTransaction == 'toup'
                        ? formatUsdt(item.amount_usd)
                        : formatUsdt(item.amount)
                    }}
                  </div>
                  <div
                    :class="[item.status ? 'td ' + item.status : '']"
                    style="width: 30%; border: none; text-align: center"
                  >
                    {{
                      item.status == 'approved' || item.status == 'rejected'
                        ? item.status == 'approved'
                          ? languagePack.person_status_value_success
                          : languagePack.person_status_value_fail
                        : languagePack.person_status_value_pending
                    }}
                  </div>
                </div>
              </div>
              <div class="tab" :class="{ active: 'tab3' === activeTab }">
                <div
                  class="tr flex"
                  v-for="(item, index) in lstWithdraw"
                  :class="{ even: index % 2 === 0 }"
                >
                  <div class="td" style="width: 10%; border: none">{{ item.id }}</div>
                  <div class="td" style="width: 20%; border: none">
                    {{
                      item.typeTransaction == 'toup'
                        ? languagePack.person_depoit
                        : languagePack.person_withdaw
                    }}
                  </div>
                  <div class="td" style="width: 30%; border: none">
                    {{
                      item.typeTransaction == 'toup'
                        ? formatUsdt(item.amount_usd)
                        : formatUsdt(item.amount)
                    }}
                  </div>
                  <div
                    :class="[item.status ? 'td ' + item.status : '']"
                    style="width: 40%; border: none; text-align: center"
                  >
                    {{
                      item.status == 'approved' || item.status == 'rejected'
                        ? item.status == 'approved'
                          ? languagePack.person_status_value_success
                          : languagePack.person_status_value_fail
                        : languagePack.person_status_value_pending
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrap-changePass" v-if="isShowChangePass">
      <div class="changePassword" v-if="isShowChangePass">
        <div data-v-f83b0c25="" class="close" style="text-align: end">
          <i
            data-v-f83b0c25=""
            class="bx bx-x"
            style="font-size: 16px; color: white; background: red; border-radius: 50%"
            @click="isShowChangePass = false"
          ></i>
        </div>
        <h3>{{ languagePack.home_changpass_title }}</h3>
        <div class="form-control">
          <div class="form-input">
            <input
              :type="hidePass1 ? 'text' : 'password'"
              :placeholder="languagePack.home_changpass_oldpass"
              v-model="oldPassword"
            />
            <i class="bx bx-hide" @click="hidePass1 = !hidePass1" v-if="hidePass1 == true"></i>
            <i class="bx bx-show" @click="hidePass1 = !hidePass1" v-else></i>
          </div>
        </div>
        <div class="form-control">
          <div class="form-input">
            <input
              :type="hidePass2 ? 'text' : 'password'"
              :placeholder="languagePack.home_changpass_newpass"
              v-model="newPassword"
            />
            <i class="bx bx-hide" @click="hidePass2 = !hidePass2" v-if="hidePass2 == true"></i>
            <i class="bx bx-show" @click="hidePass2 = !hidePass2" v-else></i>
          </div>
        </div>
        <div class="form-control">
          <div class="form-input">
            <input
              :type="hidePass3 ? 'text' : 'password'"
              :placeholder="languagePack.home_changpass_renewpass"
              v-model="reNewPassword"
            />
            <i class="bx bx-hide" @click="hidePass3 = !hidePass3" v-if="hidePass3 == true"></i>
            <i class="bx bx-show" @click="hidePass3 = !hidePass3" v-else></i>
          </div>
        </div>
        <div class="btn-sm">
          <button @click="changePassword">{{ languagePack.home_changpass_confirm }}</button>
        </div>
      </div>
    </div>
    <LangPopup v-if="showPopupLanguage" @close-popup="showPopupLanguage = false" />
    <PopCskh v-if="showCshk" @close-popup="showCshk = false" />
    <Depoint v-if="showDepoit" @close-popup="showDepoit = false" />
    <Upload v-if="showUpload" @close-popup="showUpload = false" />
    <Bank v-if="showBank" @close-popup="showBank = false" />
    <Info v-if="showInfo" :info="userLogined" @close-popup="showInfo = false" />
    <Withdaw
      v-if="showWithdaw"
      @close-popup="showWithdaw = false"
      @reloadListHistory="reloadListHistory"
      :securityCode="userLogined.securityCode"
      :balance="userLogined.balance"
    />
  </div>
  <div v-else>
    <loadApp />
  </div>
</template>
<style scoped>
.htr {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999999999;
  background-color: rgba(0, 0, 0, 0.3);
}
.tct {
  padding: 10px;
  border: 1px solid #ebebeb;
  margin-inline: 15px;
  border-radius: 10px;
  padding-bottom: 0;
  box-shadow: 0 0 20px #ebebeb;
}
.orther-content {
  flex-wrap: wrap;
}
.feel > div {
  display: flex;
  align-items: center;
}
.with50 {
  width: calc((100% - 15px) / 2) !important;
}
.command {
  font-weight: 500;
  padding-inline: 10px;
  font-size: 15px;
  text-transform: uppercase;

  margin-bottom: 20px;
}

.main {
  padding-top: 45px;
  min-height: 100vh;
  padding-bottom: 60px;
}
.main-content {
  width: 100%;
  color: #000;
}
.persons-balance__title {
  line-height: 24px;
  font-size: 13px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.persons-balance__number {
  display: flex;
  justify-content: space-between;
}
.persons-balance__number .right {
  padding-left: 5px;
}
.id {
  font-weight: 500;
  font-size: 13px;
}
.persons {
  position: relative;
}

.balance {
  line-height: 24px;
  font-size: 20px;
  font-family: sans-serif;
  font-weight: 500;
}
.balance-detail {
  line-height: 24px;
  font-size: 11px;
  margin-bottom: 10px;
}
.persons {
  min-height: 100px;
}

.btns {
  border: none;
  height: 30px;
  border-radius: 2px;
  margin: auto;
  margin-right: 5px;
  background: #fd9e00;
  width: calc((100% - 15px) / 3);
  color: #fff;
  font-weight: 600;
}
.orther {
  color: #222;
  font-size: 12px;
  border-radius: 10px;
}
.orther-item {
  width: calc(100% / 4);
  text-align: center;
  margin-bottom: 10px;
}
.orther-item .icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  color: #fd9e00;
  margin: auto;
  background-image: linear-gradient(#f7f7f9, #fff);
}
.orther-item .title {
  font-size: 13px;
  font-weight: 500;
}
.flex {
  display: flex;
}
.history {
  color: #222;
  font-size: 12px;
  margin-top: 10px;
  padding: 10px 20px;
  border-radius: 10px;
}
.table_thead {
  width: 100%;
}
.table-thead__item {
  color: gray;
}

.nomo {
  margin: auto;
  padding: 10px 10px 50px 10px;
  text-align: center;
  background-color: #fff;
  color: #222;
  border: 1px solid #eeeff0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 10px 10px 0 0;
  min-height: 350px;
}
.nomo .td {
  width: 25%;
  border-right: 1px solid rgba(128, 128, 128, 0.244);
  text-align: center;
}
.nomo .tr {
  padding: 0px 10px;
  border-top: 1px solid rgba(128, 128, 128, 0.244);
  font-size: 13px;
  line-height: 26px;
}

.nomo .approved {
  color: #47cc85;
}
.nomo .pending {
  color: rgb(72, 124, 255);
}
.nomo .rejected {
  color: #ff3030;
}

.persons-balance__active {
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: -20px;
  transform: translateY(50%);
  z-index: 9;
}
.persons-balance__active button {
  border-radius: 3px;
}
.about {
  margin-inline: 15px;
  padding-left: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.about ul {
  padding: 0;
  color: #222;
}
.about li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  align-items: center;
}
.about li .left {
  display: flex;
  align-items: center;
}
.about li i {
  font-size: 21px;
}
.about li .left img {
  margin-right: 10px;
}
.about li div > i {
  display: inline-block;
  margin-right: 5px;
}

.tab {
  display: none;
}
.tabs .tab-links {
  padding: 0 10px;
}
.tab-links .active {
  background-color: #f7f7f9;
}
.tab.active {
  display: block;
}
.tab-links {
  display: flex;
  padding: 0;
  margin-bottom: 5px;
}
.tab-links li {
  list-style: none;
  margin-right: 10px;
  font-weight: 500;
  padding: 5px 10px;
}

.changePassword {
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
.changePassword h3 {
  font-size: 14px;
  text-align: center;
  text-transform: uppercase;
  font-weight: bolder;
  margin-bottom: 25px;
}
.changePassword .form-input {
  width: 100%;
  font-size: 13px;
  border-radius: 5px;
  background: #eeeff0;
  border: 1px solid #eeeff0;
  color: #222;
  margin-bottom: 25px;
  position: relative;
}
.changePassword .form-input i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 17px;
}
.changePassword .form-input input {
  border: none;
  background: none;
  width: 100%;
  height: 100%;
  padding: 12px;
}
.btn-sm {
  text-align: center;
  margin-top: 15px;
}

.changePassword button {
  padding: 12px 30px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 5px;
  background: #fd9e00;
  color: #fff;
  font-weight: bold;
}
.err-changePassword {
  color: red;
}
.wrap-changePass {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999999999;
  background-color: rgba(0, 0, 0, 0.3);
}
.even {
  background-color: #eeeff0;
}
</style>

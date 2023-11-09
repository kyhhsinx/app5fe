<script setup>
import { ref, inject, defineEmits, onUnmounted, watch, reactive, onMounted } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import store from '../../stores/index'
import request from '../../utils/request'
import { defineProps } from 'vue'
import LangPopup from '../Layout/LangPopup.vue'

import { languagePack } from '../../languages'

const form = ref(1)
const statusLogin = ref(false)
const name = ref('')
const username = ref('')
const password = ref('')
const passwordconfirm = ref('')
const transferCode = ref('')
const loging = ref(false)
const signuping = ref(false)
const showPopupLanguage = ref(false)
const emailFotgot = ref('')
const securityCodeForgot = ref('')
const usernameForgot = ref('')
const forgoting = ref(false)
const hidePassLogin = ref(false)
const hidePassRegister1 = ref(false)
const hidePassRegister2 = ref(false)

import { OpenPopup } from '../../utils/plugin'
function showCshkPluin() {
  OpenPopup()
}

async function forgetPassword() {
  var pattern = /^[\w\.-]+@[\w\.-]+\.\w+$/
  if (!pattern.test(emailFotgot.value)) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.popuser_noti_emailfail,
      type: 'error'
    })
    return
  }

  if (usernameForgot.value.length < 4) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.popuser_noti_usernamefail,
      type: 'error'
    })
    return
  }

  if (securityCodeForgot.value.toString().trim().length != 6) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: `${languagePack.popuser_noti_secodefail}`,
      type: 'error'
    })
    return
  }
  forgoting.value = true

  await request
    .post('user/forgot_passowrd', {
      securityCode: securityCodeForgot.value.trim(),
      emailUser: emailFotgot.value.trim(),
      username: usernameForgot.value.trim()
    })
    .then(() => {
      setTimeout(() => {
        notify({
          title: languagePack.popuser_noti_success,
          text: languagePack.pouser_fogotpass_sended,
          type: 'success'
        })
        setTimeout(() => {
          forgoting.value = false
          chuyenform(1)
        }, 1500)
      }, 2000)
    })
    .catch((err) => {
      if (err.response.data.message == 'Số điện thoại hoặc mã bảo mật không chính xác') {
        notify({
          title: languagePack.popuser_noti_fail,
          text: languagePack.popuser_noti_foget_usernamesecodefail,
          type: 'error'
        })
        forgoting.value = false
      } else {
        notify({
          title: languagePack.popuser_noti_fail,
          text: languagePack.popuser_noti_forget_emailfail,
          type: 'error'
        })
        forgoting.value = false
      }
    })
}
function chuyenform(mtr) {
  form.value = mtr
}
async function register() {
  if (name.value.length < 4) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.popuser_register_namefail,
      type: 'error'
    })
    return
  }
  if (isNaN(username.value.length < 4)) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.popuser_register_usernamefail,
      type: 'error'
    })
    return
  }
  const regex = /^[A-Za-z0-9_]+$/
  if (!regex.test(username.value)) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.popuser_register_usernamefailn,
      type: 'error'
    })
    return
  }

  if (password.value.length < 4) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.popuser_register_passfail,
      type: 'error'
    })
    return
  }
  if (passwordconfirm.value != password.value) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.popuser_register_repassfail,
      type: 'error'
    })
    return
  }
  if (transferCode.value.toString().length != 6) {
    notify({
      title: languagePack.popuser_noti_fail,
      text: languagePack.popuser_noti_secodefail,
      type: 'error'
    })
    return
  }
  signuping.value = true

  await request
    .post('auth/signup', {
      fullName: name.value.trim(),
      username: username.value.trim(),
      password: password.value.trim(),
      securityCode: transferCode.value.trim()
    })
    .then((res) => {
      statusLogin.value = true
      loginAccount()
    })
    .catch((err) => {
      notify({
        title: languagePack.popuser_noti_fail,
        text: languagePack.popuser_register_fail,
        type: 'error'
      })
      signuping.value = false
    })
}

async function loginAccount() {
  loging.value = true
  const user = {
    sdt: username.value.trim(),
    password: password.value.trim()
  }
  await store
    .dispatch('login', {
      user
    })
    .then(() => {
      notify({
        title: languagePack.popuser_noti_success,
        text: languagePack.popuser_login_success,
        type: 'success'
      })
      statusLogin.value = true
      window.location.reload()
    })
    .catch(() => {
      notify({
        title: languagePack.popuser_noti_fail,
        text: languagePack.popuser_login_fail,
        type: 'error'
      })
      loging.value = false
    })
}
onMounted(() => {
  // document.addEventListener('tidioChat-ready', handleTidioReady)
})
</script>
<template>
  <div class="pop-user">
    <div class="pop-user__content">
      <div v-if="form === 1" class="form-login">
        <div class="top">
          <div class="right">
            <label
              ><i class="bx bx-support" style="color: #222" @click="showCshkPluin()"></i
            ></label>
            <label
              ><i class="bx bx-world" style="color: #222" @click="showPopupLanguage = true"></i
            ></label>
          </div>
        </div>
        <div class="title">
          <img src="../../assets/logo.png" alt="photo" height="30" />
          <h1 class="title_app">FireAnt</h1>
        </div>
        <div class="slogan">
          <h3>Welcome to FireAnt</h3>
        </div>
        <div class="contain">
          <form @submit.prevent="loginAccount">
            <div class="form-input">
              <i class="bx bxs-user nom"></i>
              <input v-model="username" :placeholder="languagePack.popuser_input_username" />
            </div>
            <div class="form-input">
              <i class="bx bxs-lock nom"></i>
              <input
                v-model="password"
                :type="hidePassLogin ? 'text' : 'password'"
                :placeholder="languagePack.popuser_input_pass"
              />
              <i
                class="bx bx-hide lock"
                @click="hidePassLogin = !hidePassLogin"
                v-if="hidePassLogin == true"
              ></i>
              <i class="bx bx-show lock" @click="hidePassLogin = !hidePassLogin" v-else></i>
            </div>
            <div class="fogot">
              <a @click="chuyenform(3)">{{ languagePack.popuser_forgot_pass }}</a>
            </div>
            <div class="form-submit">
              <button class="btn btn-login" type="submit" v-if="loging == false">
                {{ languagePack.popuser_login }}
              </button>
            </div>
            <div class="form-submit">
              <button class="btn btnloading" type="submit" disabled v-if="loging == true">
                {{ languagePack.popuser_login_progress }}
              </button>
            </div>
          </form>
          <div class="bottom">
            <p>{{ languagePack.popuser_haveacc }}</p>
            <a @click="chuyenform(2)">{{ languagePack.popuser_register }}</a>
          </div>
        </div>
      </div>

      <div v-if="form === 2" class="form-login">
        <div class="top">
          <div class="right">
            <label
              ><i class="bx bx-support" style="color: #222" @click="showCshkPluin()"></i
            ></label>
            <label
              ><i class="bx bx-world" style="color: #222" @click="showPopupLanguage = true"></i
            ></label>
          </div>
        </div>
        <div class="title">
          <img src="../../assets/logo.png" alt="photo" height="30" />
          <h1 class="title_app">FireAnt</h1>
        </div>
        <div class="slogan">
          <h3>FireAnt Account Signup</h3>
        </div>
        <div class="contain">
          <div class="form-input">
            <i class="bx bx-rename nom"></i>
            <input :placeholder="languagePack.popuser_register_name" v-model="name" />
          </div>
          <div class="form-input">
            <i class="bx bxs-user nom"></i>
            <input :placeholder="languagePack.popuser_register_username" v-model="username" />
          </div>
          <div class="form-input">
            <i class="bx bxs-lock nom"></i>
            <input
              :placeholder="languagePack.popuser_register_pass"
              :type="hidePassRegister1 ? 'text' : 'password'"
              v-model="password"
            />
            <i
              class="bx bx-hide lock"
              @click="hidePassRegister1 = !hidePassRegister1"
              v-if="hidePassRegister1 == true"
            ></i>
            <i class="bx bx-show lock" @click="hidePassRegister1 = !hidePassRegister1" v-else></i>
          </div>
          <div class="form-input">
            <i class="bx bxs-lock nom"></i>
            <input
              :placeholder="languagePack.popuser_register_repass"
              :type="hidePassRegister2 ? 'text' : 'password'"
              v-model="passwordconfirm"
            />
            <i
              class="bx bx-hide lock"
              @click="hidePassRegister2 = !hidePassRegister2"
              v-if="hidePassRegister2 == true"
            ></i>
            <i class="bx bx-show lock" @click="hidePassRegister2 = !hidePassRegister2" v-else></i>
          </div>
          <div class="form-input">
            <i class="bx bx-code nom"></i>
            <input
              :placeholder="languagePack.popuser_register_secode"
              v-model="transferCode"
              type="text"
              pattern="[0-9]*"
            />
          </div>
          <div class="form-submit">
            <button class="btn btn-register" @click="register()" v-if="signuping == false">
              {{ languagePack.popuser_register_btn }}
            </button>
          </div>
          <div class="form-submit">
            <button class="btn btnloading" disabled v-if="signuping == true">
              {{ languagePack.popuser_register_btn_progress }}
            </button>
          </div>
          <div class="bottom">
            <p>{{ languagePack.popuser_haveaccnot }}</p>
            <a @click="chuyenform(1)">{{ languagePack.popuser_login_btn }}</a>
          </div>
        </div>
      </div>
      <div v-if="form === 3" class="form-foget">
        <div class="top">
          <div class="right">
            <label
              ><i class="bx bx-support" style="color: #222" @click="showCshkPluin()"></i
            ></label>
            <label
              ><i class="bx bx-world" style="color: #222" @click="showPopupLanguage = true"></i
            ></label>
          </div>
        </div>
        <div class="title">
          <img src="../../assets/logo.png" alt="photo" height="30" />
          <h1 class="title_app">FireAnt</h1>
        </div>
        <div class="slogan">
          <h3>{{ languagePack.popuser_forget_title }}</h3>
        </div>

        <div class="contain">
          <div class="not">
            <p>{{ languagePack.popuser_forget_not }}</p>
          </div>
          <div class="form-input">
            <i class="bx bx-envelope nom"></i>
            <input :placeholder="languagePack.popuser_forget_email" v-model="emailFotgot" />
          </div>
          <div class="form-input">
            <i class="bx bxs-user nom"></i>
            <input :placeholder="languagePack.popuser_forget_username" v-model="usernameForgot" />
          </div>
          <div class="form-input">
            <i class="bx bx-code nom"></i>
            <input :placeholder="languagePack.popuser_forget_secode" v-model="securityCodeForgot" />
          </div>
          <div class="form-submit">
            <button class="btn btn-register" v-if="forgoting == false" @click="forgetPassword()">
              {{ languagePack.popuser_forget_btn }}
            </button>
          </div>
          <div class="form-submit">
            <button class="btn btnloading" disabled v-if="forgoting == true">
              {{ languagePack.popuser_forget_btnprocess }}
            </button>
          </div>
          <div class="bottom">
            <p>{{ languagePack.popuser_haveaccnot }}</p>
            <a @click="chuyenform(1)">{{ languagePack.popuser_login_btn }}</a>
          </div>
        </div>
      </div>
    </div>
    <LangPopup v-if="showPopupLanguage" @close-popup="showPopupLanguage = false" />
  </div>
</template>
<!-- Phần CSS của login -->
<style scoped>
.fogot {
  text-align: right;
  margin-top: 5px;
}
.top .right label {
  margin-left: 10px;
}
h2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.top .right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -15px;
}
.title img {
  margin-right: 5px;
}
h2 {
  color: #000;
  font-size: 21px;
  font-weight: 500;
}
.slogan h3 {
  font-size: 18px;
  font-weight: 500;
  color: #686054;
  margin-top: 5px;
  text-align: center;
  margin-bottom: 35px;
}

.form-input__center {
  text-align: center;
  width: 100%;
}
.pop-user {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.not {
  margin-top: 25px;
}
.not p {
  font-size: 12px;
  margin-bottom: 20px;
  color: #222;
}
.pop-user__content {
  min-height: 100%;
  top: 0%;
  padding: 50px 20px;
  position: relative;
  width: 100%;
  margin: auto;
  background-color: #ebebeb;
}
.contain {
  position: fixed;
  top: 25%;
  background-color: #fff;
  left: 0;
  right: 0;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  bottom: 0;
}
.close {
  position: absolute;
}

.form-input {
  background: #eeeff0;
  width: 100%;
  font-size: 13px;
  border-radius: 5px;
  color: #222;
  position: relative;
  margin-top: 25px;
}
.form-input i.nom {
  position: absolute;
  font-size: 17px;
  left: 7px;
  top: 50%;
  transform: translateY(-55%);
  z-index: 99;
  color: #222;
}

input {
  border: none;
  display: block;
  width: 100%;
  height: 100%;
  padding: 12px 12px 12px 30px;
  background: none;
}

.logo img {
  vertical-align: middle;
}
a {
  color: rgb(30, 35, 35);
}
.btn {
  margin-top: 20px;
  border: none;
  padding: 11px 30px;
  width: 100%;
  background-color: #fd9e00;
  color: #fff;
  cursor: point;
  border-radius: 5px;
  font-weight: 600;
}

.bottom {
  font-size: 13px;

  padding-bottom: 5px;
  margin-top: 20px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
}
.top .right i {
  font-size: 17px;
}
.bottom a {
  color: #07bc0c;
  display: block;
  font-weight: 600;
  margin-left: 7px;
}
h1 {
  font-size: 21px;
  color: #686054;
  font-weight: 600;
}

.btnloading {
  background-color: #fd9e00;
  border-radius: 5px;
}

/* update */
@media (min-width: 541px) {
  .pop-user__content {
    padding-top: 20%;
  }
  .pop-user__content .bottom {
    padding-inline: 15%;
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
  .pop-user__content {
    padding-top: 10%;
  }

  .pop-user__content .bottom {
    padding-inline: 15%;
  }
}

.languages {
  position: fixed;
  left: 0;
  width: 100%;
  z-index: 9999;
}
.languages-title {
  margin-bottom: 5px;
}
select {
  background: none;
  border: none;
  outline: none;
  color: rgb(21, 118, 245);
  font-size: 12px;
  appearance: none;
  display: none;
}
.btn-register {
  margin-top: 25px;
}
.form-input i.lock {
  right: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 17px;
}
</style>

<script setup>
import { onMounted, ref, reactive, defineProps } from 'vue'
import request from '../../../utils/request'
import { notify } from '@kyvg/vue3-notification'
import { languagePack } from '../../../languages'
let resultData = reactive({})
const nameBank = ref('')
const nameInfo = ref('')
const numberBank = ref('')
const branch = ref('')
const statusBank = ref(false)
// var list_bank = [
//   'Ngân hàng Ngoại thương Việt Nam (Vietcombank)',
//   'Ngân hàng Thương mại Cổ phần Á Châu (ACB)',
//   'Ngân hàng Thương mại Cổ phần Ngoại thương (VietinBank)',
//   'Ngân hàng Quân đội (MBBank)',
//   'Ngân hàng Sài Gòn Thương Tín (Sacombank)',
//   'Ngân hàng Tiên Phong (TPBank)',
//   'Ngân hàng Đông Á (DongA Bank)',
//   'Ngân hàng Công thương Việt Nam (VietinBank)',
//   'Ngân hàng Thương mại Cổ phần Kỹ thương (Techcombank)',
//   'Ngân hàng Công thương (Vietbank)'
// ]
const emit = defineEmits(['close-popup'])
async function saveBank() {
  if (numberBank.value.length < 5) {
    notify({
      title: languagePack.person_bank_noti_fail_title,
      text: languagePack.person_bank_noti_fail_stk,
      type: 'error'
    })
    return
  }

  if (nameBank.value.length < 2) {
    notify({
      title: languagePack.person_bank_noti_fail_title,
      text: languagePack.person_bank_noti_fail_name_bank,
      type: 'error'
    })
    return
  }

  if (nameInfo.value.length < 5) {
    notify({
      title: languagePack.person_bank_noti_fail_title,
      text: languagePack.person_bank_noti_fail_author,
      type: 'error'
    })
    return
  }
  var res = await request.post('user/new_bank', {
    bank_name: nameBank.value.toLocaleUpperCase(),
    number_card: numberBank.value,
    branch_name: branch.value,
    name_user: nameInfo.value
  })
  var result = res.data
  notify({
    title: languagePack.person_bank_noti_success_title,
    text: languagePack.person_bank_noti_success_ct,
    type: 'success'
  })
  closePopup()
}
async function checkBank() {
  var res = await request.get('user/check_bank')
  var result = res.data
  if (result.success == true) {
    var bank = result.bank
    nameBank.value = bank.bankName
    nameInfo.value = bank.nameUser
    numberBank.value = bank.numberCard
    branch.value = bank.branchName
    statusBank.value = false
  } else {
    statusBank.value = true
  }
}
const closePopup = () => {
  emit('close-popup')
}
onMounted(async () => {
  var res = await checkBank()
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
      <div class="popbuy-center" v-if="statusBank">
        <h3
          style="font-size: 15px; font-weight: 500; text-transform: uppercase; margin-bottom: 20px"
        >
          {{ languagePack.person_bank_choose }}
        </h3>
        <div class="ctm">
          <div class="center-time">
            <div class="center-time__title">
              <h4>{{ languagePack.person_bank_info }}</h4>
            </div>
            <div class="center-time__body">
              <input :placeholder="languagePack.person_bank_info_place" v-model="nameBank" />
            </div>
          </div>
          <div class="center-time">
            <div class="center-time__title">
              <h4>{{ languagePack.person_bank_name }}</h4>
            </div>
            <div class="center-time__body">
              <div class="valueMoney">
                <input :placeholder="languagePack.person_bank_name_place" v-model="nameInfo" />
              </div>
            </div>
          </div>
          <div class="center-time">
            <div class="center-time__title">
              <h4>{{ languagePack.person_bank_numberCard }}</h4>
            </div>
            <div class="center-time__body">
              <div class="valueMoney">
                <input
                  :placeholder="languagePack.person_bank_numberCard_place"
                  type="text"
                  pattern="[0-9]*"
                  v-model="numberBank"
                />
              </div>
            </div>
          </div>
          <div class="center-time">
            <div class="center-time__title">
              <h4>{{ languagePack.person_bank_branch }}</h4>
            </div>
            <div class="center-time__body">
              <div class="valueMoney">
                <input :placeholder="languagePack.person_bank_branch_place" v-model="branch" />
              </div>
            </div>
          </div>
          <div class="center-confirm">
            <button class="btns center-balence__btn" @click="saveBank()">
              {{ languagePack.person_bank_save }}
            </button>
          </div>
        </div>
      </div>
      <div class="popbuy-center" v-else>
        <h3
          style="font-size: 15px; font-weight: 500; text-transform: uppercase; margin-bottom: 20px"
        >
          {{ languagePack.person_bank_choose }}
        </h3>
        <div class="ctm">
          <div class="center-time">
            <div class="center-time__title">
              <h4>{{ languagePack.person_bank_info }}:</h4>
              <h4>{{ nameBank }}</h4>
            </div>
          </div>
          <div class="center-time">
            <div class="center-time__title">
              <h4>{{ languagePack.person_bank_name }}:</h4>
              <h4>{{ nameInfo }}</h4>
            </div>
          </div>
          <div class="center-time">
            <div class="center-time__title">
              <h4>{{ languagePack.person_bank_numberCard }}:</h4>
              <h4>{{ numberBank }}</h4>
            </div>
          </div>
          <div class="center-time">
            <div class="center-time__title">
              <h4>{{ languagePack.person_bank_branch }}:{{ branch }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.ctm {
  padding: 10px;

}
.center-confirm {
  margin-top: 20px;
}
.center-info {
  font-size: 11px;
  margin-top: 10px;
  text-align: start;
}
.popbuy {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999999999;
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
  margin-top: 10px;
  margin-bottom: 15px;
}
.center-time h4 {
  font-weight: 500;
}
.center-time__body {
  font-size: 10px;
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
.center-time__body select {
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
.center-confirm .center-balence__btn {
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
</style>

<script setup>
import { languagePack } from '../../../languages'

const emit = defineEmits(['close-popup'])

function cheSoGiua(maBaoMat) {
  var maBaoMatChe = maBaoMat.substring(0, 1) + '****' + maBaoMat.substring(5)

  return maBaoMatChe
}

const closePopup = () => {
  emit('close-popup')
}
const props = defineProps({
  info: Object
})
console.log(props.info)
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
      <div class="ct">
        <h2>{{ languagePack.person_info_ct_title }}</h2>
        <div class="mct">
          <!-- <div class="item">
            <span class="left">ID:</span>
            <span class="right">10000{{ props.info.id }}</span>
          </div> -->
          <div class="item">
            <span class="left">{{ languagePack.person_info_ct_nickname }}: </span>
            <span class="right">{{ props.info.fullName }}</span>
          </div>
          <div class="item">
            <span class="left">Username:</span>
            <span class="right">{{ props.info.username }}</span>
          </div>
          <div class="item">
            <span class="left">{{ languagePack.person_info_security }}:</span>
            <span class="right">{{ cheSoGiua(props.info.securityCode) }}</span>
          </div>
          <div class="item">
            <span class="left">{{ languagePack.person_info_credit_core }}:</span>
            <span class="right">{{
              props.info.credit_score == null ? '---' : props.info.credit_score
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
h2 {
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
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
.mct {
  margin-top: 20px;
  padding: 20px 10px 10px;
  background-color: #ebebeb;
  border-radius: 10px;
}
.mct .item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.left {
  font-weight: 500;
}
</style>

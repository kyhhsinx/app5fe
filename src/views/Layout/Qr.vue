<script setup>
import { onMounted,ref,watch,reactive } from 'vue'
import { languagePack } from '../../languages';
const emit =defineEmits(['close-popup']);
const closePopup = () => {
  emit('close-popup');
};

let formLang = reactive({})
onMounted(()=>{
    onReady("xin chao")
})
function onReady(url)
{
  var qrcode = new QRCode("id_qrcode");
  qrcode.makeCode('xin chào')
}
</script>

<template>
    <div class="qr">
        <div class="qr-content">
          <div class="qr-close"><div class="close" @click="closePopup"><i class='bx bx-x' style="font-size: 16px; color: #fff;; background-color: red; border-radius: 50%;"  ></i></div></div>
          <div class="qr-title"><label for="qr">{{ languagePack.home_qr_code }}:</label></div>
          <div class="qr_code" id="id_qrcode">

          </div>
        </div>
    </div>
</template>

<style scoped>
.qr{
  position: fixed;
  left:0;
  top: 30%;
  width: 100%;
  color: black;
}
.qr-title{
    margin-bottom:5px;
}
.qr-content{
  width:296px;
  margin:auto;
  padding:10px 20px 20px 20px;
  text-align:center;
  border-radius:10px;
  background-color: #fff;
      border: 1px solid #eeeff0;
  color: #222;
}
.qr-close{
  position: relative;
    height: 15px;
}
.close{
    font-weight: 800;
    position: absolute;
    top: -6px;
    right: -20px;
    width: 30px;
    height: 30px;
    color: rgb(30, 35, 35);;
}

.qr-image{
  margin: auto;
}
</style>

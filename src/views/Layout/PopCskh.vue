<script setup>
import { onMounted,ref,watch,reactive } from 'vue'

const languages = ref('')
watch(() => languages.value, (val) => {
    let locations = {
            languge:languages.value
        }
    localStorage.setItem("locations",JSON.stringify(locations))
    location.reload()
})
const emit =defineEmits(['close-popup']);
const closePopup = () => {
  emit('close-popup');
};
</script>
<template>
    <div class="cskh">
        <div class="cskh-content">
          <div class="cskh-close"><div class="close" @click="closePopup"><i class='bx bx-x' style='font-size:25px;color: #fff; border-radius: 50%;'  ></i></div></div>
          <div class="cskh-title"><label for="cskh">Chăm sóc khách hàng</label></div> 
          <div class="cskh_content" id="id_cskh">
                //nhúng chat vào day nhé
          </div>
        </div>
    </div>
</template>

<style scoped>
.cskh{
  position: fixed;
  left:0;
  top: 45px;
  width: 100%;
  border-radius: 10px 10px 0px 0px;
  background:rgb(30, 35, 35);
  min-height:100vh;
  color: black;
  z-index:99999;
}
.cskh-title{
    margin-bottom:5px;
}
.cskh-content{
  margin:auto;
  padding:10px 20px 20px 20px;
  text-align:center;
  border-radius:10px;
}
.cskh-close{
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
    color: rgb(30, 35, 35);
}

.cskh-image{
  margin: auto;
}
</style>

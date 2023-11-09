<script setup>
import {onMounted,defineProps,ref} from 'vue'
import { languagePack } from '../../languages';
function loadSeconds(number){
    let seconds = document.getElementById('seconds')
    let sec_dot = document.querySelector('.sec_dot')
    let ss = document.getElementById('ss')
    var s = number
    let limit = number
    for(let i = 0;i < s + 1;i++){
        setTimeout(()=>{
            sec_dot.style.transform = `rotateZ(${s * 360/limit - 1 }deg)`
            seconds.innerHTML = `<span id="rotate" style='font-size:1.5em;'>${s}</span>` + "<br><span style='font-size:0.55em;'>SECONDS</span>"
            ss.style.strokeDashoffset = 440 - (440 * s) / limit
            
            s = s - 1
            var num = i
            if(num == number){
                load.value = true;
            }
        },1000 * i)
    }
    
}
// const mySpan = document.getElementById("mySpan");
// let currentValue = mySpan.innerText;

// Bắt sự kiện thay đổi giá trị
// mySpan.addEventListener("DOMCharacterDataModified", () => {
//   // Thêm class rotate khi giá trị thay đổi
//   mySpan.classList.add("rotate");

//   // Xóa class rotate sau 1 giây
//   setTimeout(() => {
//     mySpan.classList.remove("rotate");
//   }, 1000);
// });
const load = ref(false)
const props = defineProps({
    second: Number,
    name:String
});
onMounted(()=>{
    loadSeconds(props.second)
})
</script>
<template>
    <div class="circle" style="--clr:#07bc0c;">   
        <div class="dots sec_dot"></div>
        <svg>
            <circle cx="70" cy="70" r="70"></circle> 
            <circle cx="70" cy="70" r="70" id="ss"></circle>
        </svg>
        <div id="seconds" v-if="load == false">
            <span id="rotate" style='font-size:1.7em; font-weight: bold;'>00</span>
            <br>
            <span style='font-size:0.55em; font-weight: 500;'>{{ languagePack.pop_cicle_second }}</span>
        </div>  
    </div>
    <div class="popbuy-wait" v-if="load">
        <img width="50" class="popbuy-wait__icon" height="50" src="../../assets/load.gif"/>
        <div class="popbuy-wait__data" style="margin-top: 10px;"><span style="font-weight: 500;">{{ languagePack.pop_cicle_wait }}</span></div>
    </div>
</template>
<style scoped>
#seconds {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotateY(-90deg);
  }
 
  100% {
    transform: rotateY(90deg);
  }
}
.circle{
    position:reactive;
    width:150px;
    height:150px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin:0 auto;
}
.circle svg{
    position:reactive;
    width:150px;
    height:150px;
    transform: rotate(270deg);
}
.circle svg circle{
    width:100%;
    height:100%;
    fill:transparent;
    stroke-width:10;
    stroke:rgba(7,188,12, 0.3);
    box-shadow:0 0 20px rgb(30, 35, 35),
    0 0 60px rgb(30, 35, 35);
    transform:translate(5px,5px);
}
.circle svg circle:nth-child(2){
    stroke:var(--clr);
    stroke-dasharray: 440;
    stroke-dashoffset: 440;
}
.circle div{
    position:absolute;
    text-align:center;
    font-weight:500;
    color:#222;
    font-size:1.5em;
}
.dots{
    position:absolute;
    width:100%;
    height:100%;
    border-radius:50%;
    display:flex;
    justify-content:center;
    align-items:flex-start;
    z-index:1000;
    transition: all 1s ease-in-out;
}
.dots::before{
    content:"";
    position:absolute;
    top:-3px;
    width:15px;
    height:15px;
    background:var(--clr);
    border-radius:50%;
    box-shadow:0 0 20px var(--clr),
    0 0 60px var(--clr);
}
.popbuy-wait{
    position:absolute;
    top:0;
    width:100%;
    height:100%;
    text-align:center;
    padding-top:35%;
    background: #fff;
    border-radius: 10px;
    z-index: 99999;
}
.popbuy-wait__icon{
    margin:0;
}
.popbuy-wait__data{
    font-size:13px;
}
</style>
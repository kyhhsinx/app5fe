<script setup>
import { onMounted, ref, reactive, defineProps } from 'vue'
import { formatUsdt } from '../../../utils/money'
import request from '../../../utils/request'
import { languagePack } from '../../../languages'
let resultData = reactive({})
const resultWin = ref(true)
const emit = defineEmits(['close-popup'])
const closePopup = () => {
  emit('close-popup')
}
const props = defineProps({
  data: Object
})

const setInfo = ref('')
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
        console.log(res.data)
        setInfo.value = res.data
      })
  }
}
onMounted(async () => {
  loadCheck()
  setTimeout(() => {
    closePopup()
  }, 2000000)
  resultWin.value = props.data.win
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
            style="font-size: 16px; color: white; background: red; border-radius: 50%"
          ></i>
        </div>
      </div>
      <div class="popbuy-center">
        <div class="neon" v-if="resultWin">WIN</div>
        <div class="flux" v-else>LOSE</div>
        <div class="content">
          <!-- <div class="desciption">
              <p :class="[resultWin ? 'kq success flex' : 'kq error' ]">{{ formLang.resultTitle }}</p>
            </div> -->
          <div :class="[resultWin ? 'kq-detail success flex' : 'kq-detail error flex']">
            <div class="kq_detail left">
              <div>
                {{
                  props.data.type == 'long'
                    ? `${languagePack.popbuy_long}`
                    : `${languagePack.popbuy_short}`
                }}
              </div>
            </div>
            <div class="kq_detail center">
              <div>
                {{ props.data.product == 'AUDNOK' ? 'USDVND' : props.data.product }}
              </div>
            </div>
            <div class="kq_detail right">
              <div v-if="typeof props.data.amount == 'undefined'">...</div>
              <div v-else>
                {{
                  resultWin
                    ? '+' + formatUsdt(props.data.percent_money)
                    : '-' + formatUsdt(props.data.amount)
                }}
              </div>
            </div>
          </div>
          <div class="inout">
            <div class="note" style="font-weight: 500">
              {{ languagePack.popresult_balance }}:
              {{ typeof setInfo.balance == 'undefined' ? '...' : formatUsdt(setInfo.balance) }}
            </div>
          </div>
          <div class="closeBottom">
            <button class="center-balence__btn btns" @click="closePopup()">
              {{ languagePack.popbuy_close }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.success {
  color: #47cc85;
}
.error {
  color: #f93636;
}
.closeBottom {
  margin: 15px 0px;
}
.inout {
  margin-top: 10px;
}
.flex {
  display: flex;
}
.kq {
  padding-bottom: 15px;
}
.kq_detail {
  width: calc(100% / 3);
}
.popbuy-content {
  padding: 10px;
  text-align: center;
  background-color: #fff;
  position: absolute;
  border: 1px solid #eeeff0;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0 0 2px #eeeff0;
  bottom: 0;
  left: 0;
  right: 0;
}
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: table;
  background-color: black;
}

@font-face {
  font-family: neon;
  /* src: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/707108/neon.ttf); */
}

.container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

.neon {
  font-family: neon;
  color: #47cc85;
  /* font-size: 15vw; */
  font-size: 60px;
  line-height: 80px;
  margin-bottom: 5px;
  text-shadow: 0 0 3vw #47cc85;
  text-transform: uppercase;
}

.flux {
  font-family: neon;
  color: #f93636;
  /* font-size: 15vw; */
  font-size: 55px;
  line-height: 80px;
  text-shadow: 0 0 3vw #f93636;
  margin-bottom: 18px;
}

.neon {
  animation: neon 1s ease infinite;
  -moz-animation: neon 1s ease infinite;
  -webkit-animation: neon 1s ease infinite;
}

.flux {
  animation: flux 2s linear infinite;
  -moz-animation: flux 2s linear infinite;
  -webkit-animation: flux 2s linear infinite;
  -o-animation: flux 2s linear infinite;
}
@keyframes neon {
  0%,
  100% {
    text-shadow: 0 0 1vw #47cc85, 0 0 3vw #47cc85, 0 0 10vw #47cc85, 0 0 10vw #47cc85,
      0 0 0.4vw #fed128, 0.5vw 0.5vw 0.1vw #806914;
    color: #fed128;
  }
  50% {
    text-shadow: 0 0 0.5vw #47cc85, 0 0 1.5vw #47cc85, 0 0 5vw #47cc85, 0 0 5vw #47cc85,
      0 0 0.2vw47cc85#47cc85, 0.5vw 0.5vw 0.1vw #40340a;
    color: #f4a2a2;
  }
}

@keyframes flux {
  0%,
  100% {
    text-shadow: 0 0 1vw #f93636, 0 0 3vw #f93636, 0 0 10vw #f93636, 0 0 10vw #f93636,
      0 0 0.4vw #8bfdfe, 0.5vw 0.5vw 0.1vw #f93636;
    color: #a57ee9;
  }
  50% {
    text-shadow: 0 0 0.5vw #f93636, 0 0 1.5vw #f93636, 0 0 5vw #f93636, 0 0 5vw #f93636,
      0 0 0.2vw #f93636, 0.5vw 0.5vw 0.1vw #f93636;
    color: #146c80;
  }
}

.btns {
  padding: 10px 30px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 5px;
  background: #fd9e00;
  color: #fff;
}

@media (min-width: 1024px) {
  @keyframes neon {
    0%,
    100% {
      text-shadow: 0 0 0.45vw #fa1c16, 0 0 1.35vw #fa1c16, 0 0 4.5vw #fa1c16, 0 0 4.5vw #fa1c16,
        0 0 0.18vw #fed128, 0.225vw 0.225vw 0.045vw #806914;
      color: #fed128;
    }
    50% {
      text-shadow: 0 0 0.225vw #800e0b, 0 0 0.675vw #800e0b, 0 0 2.25vw #800e0b, 0 0 2.25vw #800e0b,
        0 0 0.09vw #800e0b, 0.225vw 0.225vw 0.045vw #40340a;
      color: #f4a2a2;
    }
  }

  @keyframes flux {
    0%,
    100% {
      text-shadow: 0 0 0.45vw #7d97ff, 0 0 1.35vw #1041ff, 0 0 4.5vw #1041ff, 0 0 4.5vw #1041ff,
        0 0 0.18vw #8bfdfe, 0.225vw 0.225vw 0.045vw #147280;
      color: #a57ee9;
    }
    50% {
      text-shadow: 0 0 0.225vw #2145d8, 0 0 0.675vw #94a8f9, 0 0 2.25vw #082180, 0 0 2.25vw #082180,
        0 0 0.09vw #082180, 0.225vw 0.225vw 0.045vw #0a3940;
      color: #146c80;
    }
  }
}

@media (min-width: 600) {
  @keyframes neon {
    0%,
    100% {
      text-shadow: 0 0 0.75vw #fa1c16, 0 0 2.25vw #fa1c16, 0 0 7.5vw #fa1c16, 0 0 7.5vw #fa1c16,
        0 0 0.3vw #fed128, 0.375vw 0.375vw 0.075vw #806914;
      color: #fed128;
    }
    50% {
      text-shadow: 0 0 0.375vw #800e0b, 0 0 1.125vw #800e0b, 0 0 3.75vw #800e0b, 0 0 3.75vw #800e0b,
        0 0 0.15vw #800e0b, 0.375vw 0.375vw 0.075vw #40340a;
      color: #f4a2a2;
    }
  }

  @keyframes flux {
    0%,
    100% {
      text-shadow: 0 0 0.75vw #7d97ff, 0 0 2.25vw #1041ff, 0 0 7.5vw #1041ff, 0 0 7.5vw #1041ff,
        0 0 0.3vw #8bfdfe, 0.375vw 0.375vw 0.075vw #147280;
      color: #a57ee9;
    }
    50% {
      text-shadow: 0 0 0.375vw #2145d8, 0 0 1.125vw #94a8f9, 0 0 3.75vw #082180, 0 0 3.75vw #082180,
        0 0 0.15vw #082180, 0.375vw 0.375vw 0.075vw #0a3940;
      color: #146c80;
    }
  }
}
</style>

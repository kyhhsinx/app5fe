<script setup>
import { ref, computed, watch, provide, onMounted, reactive } from 'vue'
import PopBuy from '../Layout/PopBuy.vue'
import { RouterLink, useRouter } from 'vue-router'
import request from '../../utils/request'

import loadApp from '../Layout/LoadApp.vue'
import tableItem from '../Layout/tableItem.vue'
import store from '../../stores/index'
import { languagePack } from '../../languages'

const showPopBuy = ref(false)
const coinDefaul = ref('AUDJPY')
const router = useRouter()
const typeCommand = ref(false)
const symbols = ref('')
const loadding = ref(false)
const historys = ref()
const userLogined = ref('')
function convertString(inputString) {
  var arr = inputString.split('')
  var outputString = arr[0] + arr[1] + arr[2] + '/' + arr[3] + arr[4] + arr[5]
  return outputString
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
        }
      })
  }
}
async function getListSympol(limit) {
  await request
    .get('coinList/listing', {
      params: {
        limit: limit
      }
    })
    .then((res) => {
      symbols.value = res.data.data
    })
}
async function loadDataHistory() {
  await request
    .get('order_history/listing', {
      params: {
        limit: 20,
        page: 0
      }
    })
    .then((res) => {
      var result = res.data
      historys.value = result.result
      loadding.value = true
    })
}
const selectForex = ref('')
function loadViewByTradingView(COIN) {
  try {
    let dt = new TradingView.widget({
      autosize: true,
      symbol: COIN,
      interval: '1',
      timezone: 'Etc/UTC',
      theme: 'light',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_legend: true,
      allow_symbol_change: false,
      save_image: false,
      studies: [
        {
          id: 'MASimple@tv-basicstudies',
          inputs: {
            length: 20
          }
        },
        {
          id: 'MASimple@tv-basicstudies',
          inputs: {
            length: 100
          }
        }
      ],
      studies_overrides: {
        'volume.volume.color.0': '#000'
      },
      container_id: 'tradingview'
    })
  } catch (error) {
    console.log(error)
  }
}
function changeForex() {
  coinDefaul.value = selectForex.value
  loadViewByTradingView(coinDefaul.value)
}
function btnShowPopBuy(command) {
  typeCommand.value = command
  showPopBuy.value = true
}
function refreshListHistory(timeThread) {
  setTimeout(() => {
    loadDataHistory()
  }, timeThread * 1000 + 5000)
}
async function logoutFunction() {
  store.dispatch('logout')
  location.reload()
}
onMounted(async () => {
  await loadDataHistory()
  await loadCheck()
  if (router.currentRoute._value.params.id.length > 3) {
    coinDefaul.value = router.currentRoute._value.params.id.replace('/', '')
    loadViewByTradingView(coinDefaul.value)
  } else {
    loadViewByTradingView(coinDefaul.value)
  }
  selectForex.value = coinDefaul.value
  await getListSympol(20)
})
</script>
<template>
  <div>
    <div class="main">
      <div class="top flex">
        <RouterLink to="/market"
          ><i class="bx bx-chevron-left" style="color: #222; font-size: 22px"></i
        ></RouterLink>
        <div class="sl">
          <i class="bx bx-transfer" style="color: #222"></i>
          <select class="select" @change="changeForex" v-model="selectForex">
            <option v-for="(item, index) in symbols" :value="item.symbol">
              {{ item.symbol == 'AUDNOK' ? 'USD/VND' : convertString(item.symbol) }}
            </option>
          </select>
        </div>
        <div class="more">
          <i class="bx bx-dots-horizontal-rounded" style="color: #222; font-size: 22px"></i>
        </div>
      </div>
      <div id="tradingview"></div>
      <div class="btn-active">
        <button class="btns long" @click="btnShowPopBuy('long')">
          {{ languagePack.buy_long }}
        </button>
        <i
          class="bx bxs-bolt bx-tada"
          style="color: #ffcc00; font-size: 23px; vertical-align: middle"
        ></i>
        <button class="btns short" @click="btnShowPopBuy('short')">
          {{ languagePack.buy_short }}
        </button>
      </div>
      <div class="analysis">
        <!-- Phân tích giá -->
      </div>
      <div class="history">
        <div
          class="history-content"
          style="
            line-height: 26px;
            margin-bottom: 50px;
            border: 1px solid rgba(128, 128, 128, 0.243);
          "
        >
          <div class="history-content__title" style="font-weight: 500; padding-inline: 5px">
            {{ languagePack.buy_history }}
          </div>
          <div class="history-content__table">
            <p
              v-if="historys == 0"
              style="font-size: 13px; padding-inline: 5px; padding-bottom: 100px"
            >
              {{ languagePack.buy_have_not_tran }}
            </p>
            <tableItem
              v-for="(item, index) in historys"
              :amount="item.amount"
              :key="index"
              :name="item.name"
              :input="item.entry_price"
              :output="item.exit_price"
              :profit="item.profit.toString()"
              :order_type="item.order_type"
              :order_result="item.order_result"
              :time="item.createdAt"
              :class="{ even: index % 2 === 0 }"
            />
          </div>
        </div>
      </div>

      <PopBuy
        v-if="showPopBuy"
        :balance="userLogined.balance"
        :info="userLogined"
        :name="coinDefaul"
        :type="typeCommand"
        @close-popup="showPopBuy = false"
        @refreshListHistory="refreshListHistory"
      />
    </div>
    <div v-if="loadding == false">
      <loadApp />
    </div>
  </div>
</template>
<style scoped>
.even {
  background-color: #eeeff0;
}
.analysis {
  margin: 5px;
}
.main {
  padding: 10px;
  padding-top: 45px;
  color: #222;
}
#tradingview {
  height: 450px;
  padding-inline: 5px;
}
.top {
  margin-bottom: 10px;
  position: relative;
  margin-top: 5px;
}
.sl {
  color: #222;
  border-radius: 3px;
  position: relative;
  padding-left: 35px;
  padding-right: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.sl i {
  font-weight: 600;
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  font-size: 18px;
}
.select {
  height: 30px;
  outline: none;
  border: none;
  background: none;
  font-size: 16px;
  appearance: none;
  font-weight: 600;
}
.btn-active {
  margin-top: 15px;
  text-align: center;
}
.btns {
  border: none;
  margin: 0 5px;
  color: #fff;
  font-weight: 600;
}
.long {
  background: #47cc85;
  position: relative;
  padding: 9px 25px 9px 25px;
  margin-right: 30px;
  border-radius: 3px;
}
/* .long::after {
  position: absolute;
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-right: 33px solid transparent;
  border-bottom: 33px solid #47cc85;
  left: 100%;
  top: 0;
} */
.short {
  position: relative;
  background: #f93636;
  padding: 9px 25px 9px 25px;
  margin-left: 30px;
  border-radius: 3px;
}
/* .short::after {
  position: absolute;
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-left: 33px solid transparent;
  border-top: 33px solid #f93636;
  right: 100%;
  top: 0;
} */
.history {
  color: #222;
  font-size: 14px;
  margin-top: 10px;
  padding: 10px 5px;
  border-radius: 10px;
}
.table_thead {
  width: 100%;
}
.table-thead__item {
  color: gray;
}
.flex {
  display: flex;
  align-items: center;
  padding-inline: 5px;
}
.more {
  margin-left: auto;
  padding-right: 10px;
}
.table_thead {
  font-size: 10px;
}
</style>

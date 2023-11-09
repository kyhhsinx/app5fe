<script setup>
import { onMounted, ref, reactive, onUnmounted, computed } from 'vue'
import { defineProps } from 'vue'
const props = defineProps({
  name: String,
  data: Object,
  vitri: Number
})
const array = computed(() => {
  return props
})
function convertString(inputString) {
  var arr = inputString.split('')
  var outputString = arr[0] + arr[1] + arr[2] + '/' + arr[3] + arr[4] + arr[5]
  return outputString
}

// random nội dung bài

function randomPercentageOffset(value) {
  var percentage = Math.random() * (0.08 - 0.04) + 0.01 // Random từ 1% đến 5%
  var offset = value * percentage
  var randomSign = Math.random() < 0.5 ? -1 : 1 // Random dấu cộng hoặc trừ
  var randomNumber = randomSign * offset
  var result = value + randomNumber
  return result
}

// zhangweiii
const idIntervalRandomSS = ref('')
const initialValue = props.data.lastdaily

const initialChange = props.data.change2

const dataSS = reactive({
  changeSS: initialChange,
  valueSS: initialValue
})

function reloadPriceSS() {
  idIntervalRandomSS.value = setInterval(() => {
    var price =
      initialValue * (1 + ((Math.random() * 0.5 + 0.1) / 100) * (Math.random() < 0.5 ? -1 : 1))
    // var percent = ((price - initialValue)/initialValue)*100;
    var percent =
      parseFloat(initialChange) +
      (Math.random() * (0.05 - 0.01) + 0.01) * (Math.random() < 0.5 ? -1 : 1)
    var per = parseFloat(randomPercentageOffset(percent)).toFixed(2)
    dataSS.changeSS = per > 0 ? '+' + per : per
    dataSS.valueSS = parseFloat(randomPercentageOffset(price))
  }, 5000)
}
//
onMounted(() => {
  reloadPriceSS()
})
onUnmounted(() => {
  clearInterval(idIntervalRandomSS.value)
})
</script>
<template>
  <RouterLink
    :to="{ name: 'buy', params: { id: array.name } }"
    class="list-item list-data__title flex"
  >
    <div class="stt" style="width: 10%">
      <span :class="[dataSS.changeSS > 0 ? 'btn-success' : 'btn-error']">{{
        props.vitri + 1
      }}</span>
    </div>
    <div class="name" style="width: 35%">
      <div style="font-weight: 500">
        {{ convertString(array.name) == 'AUD/NOK' ? 'USD/VND' : convertString(array.name) }}
      </div>
      <div class="orther">Security data</div>
    </div>
    <div class="price" style="width: 25%">
      <div style="font-weight: 500">{{ parseFloat(dataSS.valueSS).toFixed(5) }}</div>
      <div class="usd-change">{{ parseFloat(dataSS.valueSS).toFixed(5) }} $</div>
    </div>
    <div class="percent" style="width: 30%">
      <button
        style="font-weight: 600"
        :class="[dataSS.changeSS > 0 ? 'btns btn-success' : 'btns btn-error']"
      >
        {{ dataSS.changeSS }}%
      </button>
    </div>
  </RouterLink>
</template>
<style scoped>
.list-item {
  color: #222;
  padding-block: 5px;
  font-size: 13px;
}
.list-item .price {
  text-align: center;
}
.list-item .orther {
  font-size: 9px;
  color: #464a64;
}
.list-item .usd-change {
  color: #464a64;
  font-size: 11px;
}
.list-item .percent {
  text-align: end;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.list-item .btns {
  padding: 5px 15px;
  border: none;
  height: 28px;
  border-radius: 5px;
  width: 75px;
}
.list-item .btn-success {
  background: #47cc85;
  color: #fff;
}
.list-item .btn-error {
  background: #f93636;
  color: #fff;
}
.stt span {
  width: 22px;
  height: 22px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
  display: inline-block;
}
</style>

<script setup>
import { ref, computed, watch, provide, onMounted, reactive, onUnmounted } from 'vue'
import { onLoadIcon } from '../../utils/orther'
import Item from '../Layout/Item.vue'
import Item1 from '../Layout/Item1.vue'

import request from '../../utils/request'
import loadApp from '../Layout/LoadApp.vue'
import { languagePack } from '../../languages'
const loadding = ref(false)
const idInterval = ref('')
const isStatus = ref(false)
const symbols = ref('')
async function getListSympol(limit) {
  try {
    await request
      .get('coinList/listing', {
        params: {
          limit: limit
        }
      })
      .then((res) => {
        isStatus.value = !isStatus.value
        symbols.value = {
          data: res.data.data,
          status: isStatus.value
        }
      })
  } catch (error) {
    console.log(error)
  }
}

function isSaturdayOrSundayNorthAmerica() {
  var currentDate = new Date()
  var currentTimezone = 'America/New_York' // Múi giờ Bắc Mỹ

  // Xác định ngày hiện tại theo múi giờ Bắc Mỹ
  var currentDay = currentDate.toLocaleString('en-US', {
    weekday: 'long',
    timeZone: currentTimezone
  })

  return currentDay === 'Saturday' || currentDay === 'Sunday' || currentDay === 'Friday'
}

var isWeekend = isSaturdayOrSundayNorthAmerica()

onMounted(async () => {
  setTimeout(() => {
    loadding.value = true
  }, 1500)
  await getListSympol(10)
  idInterval.value = setInterval(() => {
    getListSympol(10)
  }, 3000)
})
onUnmounted(() => {
  clearInterval(idInterval.value)
})
</script>

<template>
  <div class="main">
    <div class="main-content">
      <div class="markets">
        <div class="markets-title">
          <h3
            style="
              color: #fd9e00;
              text-align: center;
              margin-bottom: 10px;
              text-transform: uppercase;
              font-size: 16px;
              font-weight: 500;
            "
          >
            {{ languagePack.market_markets }}
          </h3>
        </div>
        <div class="markets-body">
          <div class="list-data">
            <div class="list-item list-data__title flex" style="color: #222; font-size: 13px">
              <div style="width: 10%; font-weight: 500">No.</div>
              <div class="name" style="width: 35%; font-weight: 500">
                {{ languagePack.home_forexmakets }}
                <i class="bx bxs-down-arrow" style="font-size: 10px"></i>
              </div>
              <div class="price" style="width: 25%; text-align: center; font-weight: 500">
                {{ languagePack.home_lastprice }}
              </div>
              <div class="percent" style="width: 30%; text-align: right; font-weight: 500">
                {{ languagePack.home_change24 }}(%)
              </div>
            </div>
            <template v-if="isWeekend == false">
              <Item
                v-for="(item, index) in symbols.data"
                :key="index"
                :name="item.symbol"
                :data="item.data"
                :vitri="index"
                :class="{ even: index % 2 === 0 }"
              />
            </template>
            <template v-if="isWeekend == true">
              <Item1
                v-for="(item, index) in symbols.data"
                :key="index"
                :name="item.symbol"
                :data="item.data"
                :vitri="index"
                :class="{ even: index % 2 === 0 }"
              />
            </template>
            <!-- <a style="font-size:13px;color: #222">{{ languagePack.market_more }} <i class='bx bx-chevrons-down' style="font-size:10px;" ></i></a> -->
          </div>
        </div>
      </div>
    </div>
    <div v-if="loadding == false">
      <loadApp />
    </div>
  </div>
</template>

<style scoped>
.main {
  padding-top: 45px;
}
.main-content {
  width: 100%;
  padding: 10px;
  min-height: 100vh;
}
.flex {
  padding-inline: 5px;
  display: flex;
  align-items: center;
}
.list-data {
  padding: 5px;
}
.even {
  background: #eeeff0;
}
/*  */
</style>

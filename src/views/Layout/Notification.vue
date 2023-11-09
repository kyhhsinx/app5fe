<script setup>
import { defineProps, ref } from 'vue'
const props = defineProps({
  title: String,
  content: String,
  status: String
})

const check = (e) => {
  const targetButton = e.target
  const parentItem = targetButton.closest('.not-wrapper')

  if (parentItem) {
    parentItem.remove()
  }
}

setTimeout(() => {
  var items = document.querySelector('.slide-wrapper').querySelectorAll('.btn-close')
  for (let i = 0; i < items.length; i++) {
    items[i].click()
  }
}, 5500)
</script>

<template>
  <div class="not-wrapper">
    <div class="item">
      <div class="heading">
        <img class="logo" src="../../assets/logo.png" alt="photo" />
        <span class="domain">FireAnt Finance</span>
      </div>
      <div class="ct">
        <div class="m">
          <span class="title">{{ props.title }}</span>
          <p class="content">{{ props.content }}</p>
        </div>
        <i
          class="bx bx-x btn-close"
          @click="check"
          style="font-size: 14px; color: white; background: red; border-radius: 50%"
        ></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-wrapper {
  background-color: #eeeff0;
  border-radius: 6px;
  color: #222;
  padding: 7px;
  margin: 10px;
  font-size: 12px;
  z-index: 100;
  animation: slideInLeft ease 1s, fadeOut 1s 5s forwards;
  border: 1px solid #ebebeb;
  z-index: 999;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateY(calc(-100% + 16px));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

.not-wrapper .heading {
  display: flex;
  align-items: center;
  justify-content: start;
}
.not-wrapper .heading .domain {
  display: inline-block;
  margin-left: 7px;
  font-weight: 500;
  margin-bottom: 5px;
}
.not-wrapper .heading span {
  font-size: 12px;
  font-weight: 500;
  color: #222;
}

.not-wrapper .heading .logo {
  width: 15px;
}
.not-wrapper .ct {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.not-wrapper .ct .title {
  font-weight: 500;
}
.not-wrapper .content {
  display: block;
  margin-right: 15px;
  font-size: 11px;
}
</style>

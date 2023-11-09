<script>

import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import { languagePack } from '../../../languages/index.js'
console.log(languagePack);
const WheelControls = (slider) => {
  // Tạo một biến để lưu trữ interval
  let autoSlideInterval

  // Hàm để chuyển slide tự động
  function autoSlide() {
    // Chuyển đến slide tiếp theo
    slider.next()
  }

  // Bắt đầu tự động chuyển slide
  function startAutoSlide() {
    // Đặt interval để gọi hàm autoSlide sau mỗi 3 giây
    autoSlideInterval = setInterval(autoSlide, 7000)
  }

  // Dừng tự động chuyển slide
  function stopAutoSlide() {
    // Xóa interval
    clearInterval(autoSlideInterval)
  }

  // Khi slider được tạo
  slider.on('created', () => {
    // Bắt đầu tự động chuyển slide
    startAutoSlide()

    // Khi người dùng bắt đầu kéo slider bằng chuột
    slider.container.addEventListener('mousedown', () => {
      // Dừng tự động chuyển slide
      stopAutoSlide()
    })

    // Khi người dùng thả chuột
    slider.container.addEventListener('mouseup', () => {
      // Bắt đầu tự động chuyển slide lại sau khi người dùng thả chuột
      startAutoSlide()
    })
  })
}

export default {
  setup() {
    const [container] = useKeenSlider(
      {
        loop: true,
        rubberband: true,
        vertical: true
      },
      [WheelControls]
    )
    return { container }
  }
}
</script>
<template>
    <div ref="container" class="keen-slider" style="height: 20px; font-size: 12px;">
      <div class="keen-slider__slide" style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Welcome back to our returning members.</div>
      <div class="keen-slider__slide" style="font-weight: 500;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Reduced withdrawal fee from 3% to 2%.</div>
      <div class="keen-slider__slide" style="font-weight: 500;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">24/7 online customer support available.</div>
      <div class="keen-slider__slide" style="font-weight: 500;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Manage your capital wisely for success.</div>
    </div>
  </template>
  

  
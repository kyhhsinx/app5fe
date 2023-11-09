<script setup>
import { onMounted, ref } from 'vue'
import Header from './Layout/Header.vue'
import Footer from './Layout/Footer.vue'
import { useRouter } from 'vue-router'

const checkLoad = ref('load')
//load 
async function checkConnect(){
    checkLoad.value = 'loaded'
}
checkConnect()
</script>

<template>
    <div v-if="checkLoad === 'load'" class="non-data">
        Đang tải
    </div>
    <div v-else class="site">
        <Header  />
            <RouterView />
        <Footer  />
    </div>
</template>

<style scoped>
.site{
    background:'#222222';
    width:100%;
    min-height: 100vh;
}
</style>

<script setup>
   import { defineProps, ref } from 'vue';
   const props = defineProps({
        title: String,
        content: String,
        status: String
    });

     const check = (e) => {
        const targetButton = e.target;
        const parentItem = targetButton.closest('.not-wrapper');

        if (parentItem) {
            parentItem.remove();
        } 
            
     }

</script>

<template>
    <div class="not-wrapper" >
        <div class="item">
            <div class="heading">
                <img class="logo" src="../../assets/logo.png" alt="photo">
                <span class="domain">FireAnt Finance</span>
            </div>
            <div class="ct">
                <div class="m">
                    <h3 class="title">{{ props.title }}</h3>
                     <p class="content">{{ props.content }}</p>
                </div>
                <div class="btn-close" @click="check">
                    <img src="../../assets/close.svg" alt="photo">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .not-wrapper {
        background-color: #fff;
        border-radius: 6px;
        color: rgb(30, 35, 35);
        padding: 15px;
        margin: 15px;
        font-size: 12px;
        z-index: 100;
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.08);
        animation: slideInLeft ease 2s , fadeOut 1s 30s forwards;
            border: 1px solid #ebebeb;
        z-index: 9999999;
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(calc(100% + 16px));
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeOut {
        to{
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
    }
    .not-wrapper .heading span {
        font-size: 13px;
        font-weight: bold;
        color: #000f1d;
    }

    .not-wrapper .heading .logo {
        width: 20px;
    }
    .not-wrapper .ct {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .not-wrapper .ct h3 {
        font-weight: bold;
    }
    .not-wrapper .content {
        display: block;
        margin-right: 15px;
    }

    .not-wrapper .btn-close{
        text-align: center;
    }

    .not-wrapper .btn-close img {
        width: 15px;
        height: 15px;
    }


</style>
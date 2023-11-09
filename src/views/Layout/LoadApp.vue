<template>
  <div class="loader-div">
    <div class="spinner">
      <h3><span class="visually-hidden">visuallyhidden</span></h3>
    </div>
  </div>
</template>
<style scoped>
.loader-div {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f7f7f9;
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
}

.spinner {
  min-height: 275px;
}

.spinner h3 {
  position: relative;
}

.spinner h3:after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 150px;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  margin-left: -20px;
  border-radius: 50%;
  border: 4px solid #ffd593;
  border-top-color:  #fd9e00;
  -webkit-animation: spinner 1s linear infinite;
  animation: spinner 1s linear infinite;
}

@-webkit-keyframes spinner {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinner {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.visually-hidden {
  clip: rect(1px, 1px, 1px, 1px) !important;
  border: 0 !important;
  -webkit-clip-path: inset(50%) !important;
  clip-path: inset(50%) !important;
  height: 1px !important;
  margin: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  white-space: nowrap !important;
  width: 1px !important;
}
</style>

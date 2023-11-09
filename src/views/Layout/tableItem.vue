<template>
    <div class="table_row flex" style="display:flex;     border-top: 1px solid rgba(128,128,128,.244);">
        <div style="width: 24%;text-align: left;" >
            <span style="text-transform: capitalize;">{{ order_type }}</span>
            <span style="display: block;color: #222; font-weight: 500;">{{ amount }}</span>
        </div>

        <div class="table_row_item"  style="width: 34%;">
            <span style="display: block;">{{ name }}</span>
            <span style="display: block;color: #222; font-weight: 500;">{{ input }} - {{ order_result == "pending" ? '?' : output}}</span>
        </div>
        
        <div class="table_row_item"  style="width: 42%;text-align: right;">
            <span style="display: block;">{{ changeDate(time) }}</span>
            <span style="font-weight: 500;" :class="[ order_result == 'win' ? 'win' : 'lose' ]">{{ order_result == "win" ? '+' + profit+'$' : '-'+ amount+'$' }}</span>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    
  name: String,
  input: String,
  output: String,
  profit:String,
  order_type:String,
  order_result:String,
  amount: String,
  time: String
});

function changeDate(inputDateTime = "") {
  // Tạo đối tượng Date từ chuỗi đầu vào
  const dateObj = new Date(inputDateTime);
  // Cộng thêm 7 giờ
  dateObj.setUTCHours(dateObj.getUTCHours() + 7);
  // Lấy thông tin giờ, phút và giây
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();
  // Lấy ngày, tháng và năm
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1; // Lưu ý: Tháng trong JavaScript bắt đầu từ 0, nên cần cộng thêm 1
  const year = dateObj.getUTCFullYear();
  // Tạo chuỗi kết quả
  const outputDateTime = `${day
    .toString()
    .padStart(2, "0")}-${month.toString().padStart(2, "0")}-${year} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} `;
  // console.log(outputDateTime); // Kết quả: 07:22:58 24-05-2023
  return outputDateTime;
}
</script>
<style scoped>
.lose {
    color: #ff3030;
}
.win {
    color: #47CC85;
}
.table_row{
    font-size: 13px;
}
.long{
    color: #47CC85;
}
.short{
    color: red;
}
</style>
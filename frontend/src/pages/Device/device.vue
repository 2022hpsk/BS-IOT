<template>

<div class="table-container">
  <el-table  :data="device_list" style="width: 100%" class="device-table">
    <el-table-column
      sortable
      prop="device_id"
      label="设备ID"
      width="180"
      column-key="device_id"
    />
    <el-table-column prop="name" label="设备名称" width="180" />
    <el-table-column prop="description" label="设备简介"  />
    <el-table-column
      prop="state"
      label="状态"
      width="100"
      
      :filters="[
        { text: '离线', value: '0' },
        { text: '在线', value: '1' },
      ]"
      :filter-method="filterTag2"
    >
      <template #default="scope">
        <el-tag
          :type="scope.row.state === '0' ? '' : 'success'"
          disable-transitions
          >{{ scope.row.state_name }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column
      prop="type"
      label="类型"
      width="150"
      
      :filters="[
        { text: '其他', value: '0' },
        { text: '智能家居设备', value: '1' },
        { text: '智能医疗设备', value: '2' },
        { text: '可穿戴设备', value: '3' },
        { text: '智能车载设备', value: '4' },
        { text: '工业物联网设备', value: '5' },
      ]"
      :filter-method="filterTag1"
      filter-placement="bottom-end"
    >
      <template #default="scope">
        <el-tag
          style="margin-right: 20 auto;"

          disable-transitions
          >{{ scope.row.type_name }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column label="选中查看设备消息">
      <template #default="scope">

        <el-button
          size="small"
          type="danger"
          @click="Choose(scope.row)"
          >Choose</el-button
        >
      </template>
      </el-table-column>
  </el-table>
  </div>

</template>

<script lang="ts" setup>
import {Use_Device, device_list,device_type,Set_Device} from "../../store/device_store"
import axios from 'axios'
import {Url} from "../../store/store"
import {defineUser} from "../../store/store"
import {Set_Message} from "../../store/message_store"
import {_device_id} from "../../store/device_store"
import {onMounted} from 'vue';
import router from "../../router"
const _User = defineUser();
onMounted(() => {
axios.post(Url().prefix+'/device/List',{user_id:_User.user_id}).then(function(response){
                    Set_Device(response.data.data);
                })
})


function Choose(device:device_type):void{
  Use_Device(device.device_id)
  axios.post(Url().prefix+'/Message',{device_id:_device_id}).then(function(response){
                Set_Message(response.data.data);
    })
  router.push('/Message')
}

const filterTag1 = (value: number, row: device_type) => {
  return row.type == value
}
const filterTag2 = (value: number, row: device_type) => {
  return row.state == value
}
</script>
<style scoped>

.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15vh; /* 或者根据需要调整 */
  margin: 5vw;
}

.device-table {
  max-width: 80%; /* 或者根据需要调整，以适应不同屏幕大小 */
  box-shadow: 0 4px 8px rgba(0,0,0,0.2); /* 添加轻微阴影以提升立体感 */
  border-radius: 8px; /* 轻微的圆角 */
  overflow: hidden; /* 确保圆角可见 */
}


</style>

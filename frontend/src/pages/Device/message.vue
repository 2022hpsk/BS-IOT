<template>
  <div class="table-container">
    <el-table  :data="message_list" style="width: 100%" class="device-table">
      <el-table-column
        sortable
        prop="device_id"
        label="设备ID"
        width="180"
        column-key="device_id"
      />
      <el-table-column prop="info" label="设备消息" width="300" />
      <el-table-column prop="lat" label="纬度" width="180" />
      <el-table-column prop="lng" label="经度" width="180" />
      <el-table-column prop="time" label="时间" width="180" />
      <el-table-column
        prop="alert"
        label="状态"
        width="200"
        :filters="[
          { text: '正常消息', value: '0' },
          { text: '报警消息', value: '1' },
        ]"
        :filter-method="filterTag1"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.alert === '1' ? '' : 'success'"
            disable-transitions
            >{{ scope.row.alert_name }}</el-tag
          >
        </template>
      </el-table-column>

    </el-table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import {message_list,message_type,Set_Message} from "../../store/message_store"
  import axios from 'axios'
  import {Url} from "../../store/store"
  import {_device_id} from "../../store/device_store"
  import {onMounted} from 'vue';

  onMounted(() => {
    
    axios.post(Url().prefix+'/Message',{device_id:_device_id}).then(function(response){
                Set_Message(response.data.data);
    })
    //console.log(message_list)
  })

  
  
  
  const filterTag1 = (value: number, row: message_type) => {
    return row.alert == value
  }
  </script>
  <style scoped>
  .table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10vh; /* 或者根据需要调整 */
    margin-left: 2vw;
    margin-right: 2vw;
  }
  
  .device-table {
    max-width: 100%; /* 或者根据需要调整，以适应不同屏幕大小 */
    box-shadow: 0 4px 8px rgba(0,0,0,0.2); /* 添加轻微阴影以提升立体感 */
    border-radius: 8px; /* 轻微的圆角 */
    overflow: hidden; /* 确保圆角可见 */
  }
  
  
  </style>
  
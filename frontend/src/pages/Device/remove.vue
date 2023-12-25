<template>
  <div class="table-container">
    <el-table  ref="tableRef" row-key="date" :data="device_list" style="width: 100%" class="device-table">
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
      <el-table-column label="设备删除">
      <template #default="scope">

        <el-button
          size="small"
          type="danger"
          @click="handleDelete( scope.row)"
          >Delete</el-button
        >
      </template>
    </el-table-column>
    </el-table>
    </div>
  </template>
  
<script lang="ts" setup>
import {device_type,device_list,Set_Device} from "../../store/device_store"
import { ref } from 'vue'
import type { TableInstance } from 'element-plus'
import axios from "axios";
import { ElMessageBox,ElMessage } from 'element-plus'
import {Url} from "../../store/store"
import {defineUser} from "../../store/store"
import router from "../../router";
const _User = defineUser();



function refreshDeviceList():void {
  axios.post(Url().prefix + '/device/List', { user_id: _User.user_id })
    .then(response => {
      Set_Device(response.data.data);
      router.push('/Device')
    })
    .catch(() => {
      ElMessage.error('获取设备列表失败');
    });
}

function handleDelete(row: device_type): void {
  ElMessageBox.confirm('确定要删除这个设备吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    axios.post(Url().prefix + '/device/Delete', { device_id: row.device_id })
      .then(() => {
        ElMessage.success('设备删除成功');
        refreshDeviceList(); // 重新获取设备列表
      })
      .catch(() => {
        ElMessage.error('设备删除失败');
      });
  }).catch(() => {
    ElMessage.info('取消删除');
  });
  // axios.post(Url().prefix + "/device/Delete", { device_id: row.device_id }).then(function (response) {
  //       console.log(response.data)
  //       switch (response.data.state) {
  //           case 1: { //设备删除成功
  //               ElMessage.success('设备删除成功')
  //               refreshDeviceList(); // 重新获取设备列表                
  //               break;
  //           }
  //           default: 
  //               ElMessage.error('数据库错误');
  //               break;
            
  //       }
  //   })
  //   .catch(function () {
  //       ElMessage.error('数据库连接失败');
  //   })

}
  
const tableRef = ref<TableInstance>()
  
  
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
  
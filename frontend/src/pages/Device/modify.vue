<template>
  <div v-if="DeviceData.device_id==0" class="table-container">
    <el-table   row-key="date" :data="device_list" style="width: 100%" class="device-table">
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
      <el-table-column label="设备修改">
      <template #default="scope">
        <el-button
          size="small"
          type="warning"
          @click="Prepare_Modify(scope.row)"
          >Edit</el-button
        >
      </template>
    </el-table-column>

    </el-table>
    </div>
<div v-else class="form-wrapper">
<el-form  :model="DeviceData" label-width='100px' class="Device-form">

    <el-form-item label="设备名称">
      <div width="70px"><el-input v-model="DeviceData.name" placeholder="请填写设备名称" maxlength="32" show-word-limit/></div>
    </el-form-item>
    <el-form-item label="设备类型">
      <div width="70px">
      <el-select v-model="DeviceData.type" clearable placeholder="请选择设备类型">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      </el-select>
      </div>
    </el-form-item>
    <el-form-item label="设备简介">
      <el-input v-model="DeviceData.description" :rows="3"  type="textarea" placeholder="请简要介绍一下该设备" maxlength="128" show-word-limit/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  plain  :icon="Edit" @click="Update_Submit">修 改 设 备</el-button>
      <el-button type="primary"  plain  :icon="Delete" @click="DeviceData.device_id=0">取 消 修 改</el-button>
    </el-form-item>


</el-form>
</div>
</template>
  
<script lang="ts" setup>
import { Edit , Delete} from '@element-plus/icons-vue'
import {device_type,device_list,Set_Device} from "../../store/device_store"
import { reactive} from 'vue'
import router from "../../router";
import axios from "axios";
import { ElMessageBox,ElMessage } from 'element-plus'
import {Url} from "../../store/store"
import {defineUser} from "../../store/store"
const _User = defineUser();
import {onMounted} from 'vue';


const options = [
  {
    value: 1,
    label: '智能家居设备',
  },
  {
    value: 2,
    label: '智能医疗设备',
  },
  {
    value: 3,
    label: '可穿戴设备',
  },
  {
    value: 4,
    label: '智能车载设备',
  },
  {
    value: 5,
    label: '工业物联网设备',
  },
  {
    value: 0,
    label: '其他',
  },
]
const DeviceData = reactive({
    device_id:0,
    name: '',
    type: 0,
    description: '',
})
onMounted(() => {
  axios.post(Url().prefix + '/device/List', { user_id: _User.user_id })
    .then(response => {
      Set_Device(response.data.data);
      
    })
    .catch(() => {
      ElMessage.error('获取设备列表失败');
    });
})
function refreshDeviceList():void {
  axios.post(Url().prefix + '/device/List', { user_id: _User.user_id })
    .then(response => {
      Set_Device(response.data.data);
      
    })
    .catch(() => {
      ElMessage.error('获取设备列表失败');
    });
    router.push('/Device')
}
function Prepare_Modify(row: device_type):void{
  DeviceData.device_id=row.device_id
  DeviceData.type=row.type
  DeviceData.name=row.name
  DeviceData.description=row.description
}
function Update_Submit(): void {

  if(DeviceData.name.length==0 || DeviceData.description.length==0){
        ElMessageBox.alert('设备名称和设备简介不能为空', '修改失败', {
            confirmButtonText: '返回'
        });
        return;
    }
    axios.post(Url().prefix + "/device/Update", {device_id:DeviceData.device_id,name: DeviceData.name, type:DeviceData.type, description:DeviceData.description, }).then(function (response) {
        console.log(response.data)
        switch (response.data.state) {
            case 1: { //创建成功
                ElMessage.success('修改')
                DeviceData.device_id=0
                break;
            }
            default: 
                ElMessage.error('数据库错误');
                DeviceData.device_id=0
                break;
            
        }
    })
    .catch(function () {
        DeviceData.device_id=0
        ElMessage.error('数据库连接失败');
    })
    refreshDeviceList()
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
  
.form-wrapper {
  max-width: 600px; /* 限制表单的最大宽度 */
  margin: 100px auto; /* 上下 50px 边距，左右居中 */
  padding: 70px; /* 内部间距 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  border-radius: 8px; /* 圆角边框 */
  background: #fff; /* 背景色 */
}

.Device-form {
  margin-top: 20px; /* 为表单添加一些顶部边距 */
}  
</style>
  
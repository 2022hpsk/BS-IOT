<script setup lang="ts">
import { reactive} from 'vue'
import { ElMessageBox,ElMessage } from 'element-plus'
import {Url} from "../../store/store"
import {defineUser} from "../../store/store"
const _User = defineUser();
import axios from 'axios'
const DeviceData = reactive({
    name: '',
    type: 0,
    description: '',
    //state:0 //0失败 1成功
})
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
import {  CirclePlusFilled } from '@element-plus/icons-vue'
function Create_Submit(): void{
  if(DeviceData.name.length==0 || DeviceData.description.length==0){
        ElMessageBox.alert('设备名称和设备简介不能为空', '创建失败', {
            confirmButtonText: '返回'
        });
        return;
    }
    axios.post(Url().prefix + "/device/Add", {name: DeviceData.name, type:DeviceData.type, description:DeviceData.description, user_id: _User.user_id}).then(function (response) {
        console.log(response.data)
        switch (response.data.state) {
            case 1: { //创建成功
                ElMessage.success('创建成功')
                break;
            }
            default: 
                ElMessage.error('数据库错误');
                break;
            
        }
    })
    .catch(function () {
        ElMessage.error('数据库连接失败');
    })
}
</script>

<template>
<div class="form-wrapper">
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
      <el-button type="primary"  plain  :icon="CirclePlusFilled" @click="Create_Submit">创 建 设 备</el-button>
    </el-form-item>


</el-form>
</div>
</template>

<style scoped>
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

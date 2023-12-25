<template>
  <div class="form-wrapper">
  <el-form :model="ProfileData" label-width='100px' class="profile-form">
    <el-form-item label="用户名">
      <el-input v-model="name"  disabled/>
    </el-form-item>
    <el-form-item label="密码" v-if="ProfileData.state==1">
      <el-input type="password" v-model="ProfileData.password" v-if="ProfileData.state==1"/>
    </el-form-item>
    <el-form-item label="确认密码" v-if="ProfileData.state==1">
      <el-input type="password" v-model="ProfileData.again" v-if="ProfileData.state==1"/>
    </el-form-item>
    <el-form-item label="电子邮箱" >
      <el-input v-model="email" disabled v-if="ProfileData.state==0"/>
      <el-input v-model="TmpData.email" v-else/>
    </el-form-item>
    <el-form-item label="电话号码">
      <el-input v-model="phone" disabled v-if="ProfileData.state==0"/>
      <el-input v-model="TmpData.phone" v-else maxlength="11" show-word-limit/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-if="ProfileData.state==0" plain :icon="Edit"  @click="Prepare_Modify">修 改</el-button>
      <el-button type="primary" v-if="ProfileData.state==1" plain :icon="Upload" @click="Check_and_Update">提交修改</el-button>
      <el-button type="primary" v-if="ProfileData.state==1" plain :icon="Delete" @click="Un_Modify">退出修改</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script setup lang="ts">
import { Edit,  Upload , Delete} from '@element-plus/icons-vue'
import { reactive,toRefs,watch} from 'vue'
import {defineUser} from "../../store/store"
import {Url} from "../../store/store"
import { ElMessageBox,ElMessage } from 'element-plus'
import axios from 'axios'
const _User = defineUser();
const { name, email, phone } = toRefs(_User);
const ProfileData = reactive({
  state: 0,       //0未修改  1准备修改   2修改成功    3邮箱已被占用 4未知 
  user_id:_User.user_id,
  username: name.value,
  password: '',
  again:'',
  email:email.value,
  phone:phone.value,
  message: ''
})
const TmpData = reactive({
  email:email.value,
  phone:phone.value,
})
watch(_User, (newVal) => {
  ProfileData.username = newVal.name;
  ProfileData.email = newVal.email;
  ProfileData.phone = newVal.phone;
  TmpData.email = newVal.email;
  TmpData.phone = newVal.phone;
});
function Prepare_Modify():void{
  ProfileData.state=1
}
function Un_Modify():void{
  ProfileData.state=0
}
function Check_and_Update(): void {
  if(ProfileData.password.length < 6 ){
        ElMessageBox.alert('密码均需6字节以上', '修改失败', {
            confirmButtonText: '返回'
        });
        return;
    }
    if(TmpData.email.length==0 || TmpData.phone.length==0){
        ElMessageBox.alert('邮箱和手机号不能为空', '修改失败', {
            confirmButtonText: '返回'
        });
        return;
    }
    if(ProfileData.password != ProfileData.again){
        ElMessageBox.alert('密码输入不一致', '修改失败', {
            confirmButtonText: '返回'
            });
        return;
    }
    if(TmpData.phone.length!=11){
        ElMessageBox.alert('手机号要求11位', '修改失败', {
            confirmButtonText: '返回'
            });
        return;
    }
    var emailRegExp2 = /^([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    var emailRegExp3 = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if( 
        (!emailRegExp2.test(TmpData.email) && TmpData.email != '')||
        (!emailRegExp3.test(TmpData.email) && TmpData.email != '')){
        ElMessageBox.alert('邮箱格式不正确', '修改失败', {
            confirmButtonText: '返回'
            });
        return;
    }
    

    axios.post(Url().prefix + "/user/Update", {user_id: ProfileData.user_id,password: ProfileData.password,email:TmpData.email,phone:TmpData.phone}).then(function (response) {
        console.log(response.data)
        switch (response.data.state) {
            case 2: { //修改成功 state变回0
                ProfileData.state = 0;
                ProfileData.email=TmpData.email
                ProfileData.phone=TmpData.phone
                ElMessage.success('成功');
                break;
            }
            case 3: {  //邮箱已被占用
                ProfileData.state = 1;
                ElMessage.error('邮箱已被占用');
                break;
            }
            default:  //未知错误
                ProfileData.state = 1;
                ElMessage.error('未知错误');
                break;
        }
        _User.Set(ProfileData.user_id,ProfileData.username,ProfileData.email,ProfileData.phone,true);
    })
    .catch(function () {
        ProfileData.state = 1;
        ElMessage.error('数据库连接失败');
    })
}
</script>


<style scoped>
.form-wrapper {
  max-width: 600px; /* 限制表单的最大宽度 */
  margin: 100px auto; /* 上下 50px 边距，左右居中 */
  padding: 70px; /* 内部间距 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  border-radius: 8px; /* 圆角边框 */
  background: #fff; /* 背景色 */
}

.profile-form {
  margin-top: 20px; /* 为表单添加一些顶部边距 */
}


</style>

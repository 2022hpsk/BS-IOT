<script setup lang="ts">
import { reactive } from 'vue'
import {Url} from "../../store/store"
import axios from 'axios'
import { ElMessageBox,ElMessage } from 'element-plus'
const RegisterData = reactive({
  state: 0,//0未注册  1注册成功   2 用户名已存在，请检查用户名  3 邮箱已存在，请检查邮箱 4未知错误
  username: '',
  password: '',
  email:'',
  phone:'',
  again:'',
  message: ''
})
function Register_Submit(): void {
    if(RegisterData.username.length < 6 || RegisterData.password.length < 6 ){
        ElMessageBox.alert('用户名和密码均需6字节以上', '注册失败', {
            confirmButtonText: '返回'
        });
        return;
    }
    if(RegisterData.email.length==0 || RegisterData.phone.length==0){
        ElMessageBox.alert('邮箱和手机号不能为空', '注册失败', {
            confirmButtonText: '返回'
        });
        return;
    }
    if(RegisterData.password != RegisterData.again){
        ElMessageBox.alert('密码输入不一致', '注册失败', {
            confirmButtonText: '返回'
            });
        return;
    }
    if(RegisterData.phone.length!=11){
        ElMessageBox.alert('手机号要求11位', '注册失败', {
            confirmButtonText: '返回'
            });
        return;
    }

    var emailRegExp2 = /^([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    var emailRegExp3 = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

    if( 
        (!emailRegExp2.test(RegisterData.email) && RegisterData.email != '')||
        (!emailRegExp3.test(RegisterData.email) && RegisterData.email != '')){
        ElMessageBox.alert('邮箱格式不正确', '注册失败', {
            confirmButtonText: '返回'
            });
        return;
    }
    // console.log(Url().prefix)
    
    axios.post(Url().prefix + "/user/Register", {username: RegisterData.username,password: RegisterData.password,email:RegisterData.email,phone:RegisterData.phone}).then(function (response) {
        console.log(response.data)
        switch (response.data.state) {
            case 1: { //注册成功
                RegisterData.state = 1;
                break;
            }
            case 2: { 
                RegisterData.state = 2;
                RegisterData.message = "用户已经存在";
                break;
            }
            case 3: {
                RegisterData.state = 3;
                RegisterData.message = "邮箱已经存在";
                break;
            }
            default: 
                RegisterData.state = 4;
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

<div class="main-content">
    <div class="common-layout">
    <el-container>
        <el-main>
        <div width=30vw style="margin: 10vh;">

            
            <h1 style="font-size:30px; text-align: center;">账 号 注 册</h1>
            <el-divider />
            

            <el-form  style="margin-top: 6vh;" :model="RegisterData"  label-width=80px v-if="RegisterData.state==0" >
                <el-form-item label="用户名" prop="username" required  >
                    <el-input v-model="RegisterData.username"  maxlength="10"  show-word-limit>
                        <template #suffix><el-icon class="el-input__icon"><UserFilled /></el-icon></template>    
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" required>
                    <el-input v-model="RegisterData.password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="again" required>
                    <el-input v-model="RegisterData.again" show-password />
                </el-form-item>
                <el-form-item label="邮箱" prop="email" required >
                    <el-input v-model="RegisterData.email" >
                    <template #suffix><el-icon class="el-input__icon"><Promotion /></el-icon></template>    
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone" required >
                    <el-input v-model="RegisterData.phone" maxlength="11" show-word-limit>
                    <template #suffix><el-icon class="el-input__icon"><Iphone /></el-icon></template>    
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-right: 6vh;margin-top: 6vh;">
                  <el-button type="warning" size="large" style="margin-right: 6vh;" @click="Register_Submit" plain>注册</el-button>

                </el-form-item>
            </el-form>


            <el-result v-else-if="RegisterData.state == 1" icon="success" >
                <template #sub-title>{{ RegisterData.username }} 注册成功</template>
                <template #extra>
                  <el-button type="primary" size="large" @click=" $router.push('/Login' );" plain>返回登录界面</el-button>
                </template>
            </el-result>
            <el-result v-else icon="error" title="注册失败" >
                <template #sub-title>{{ RegisterData.message }}</template>
                <template #extra>
                  <el-button type="primary" size="large" @click="RegisterData.state = 0;" >重新注册</el-button>
                  <el-button type="primary" size="large" @click=" $router.push('/Login' );"  >返回登录界面</el-button>
                </template>
            </el-result>


          
        </div>
        </el-main>
    </el-container>
    </div>
</div>

</template>


<style scoped>
.el-container{
  max-width: 800px;
  margin: 100px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7); /* Set background color with transparency */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}
.el-container:hover {
      transform: scale(1.02); /* Zoom in the section on hover */
    }
.main-content {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    background: url('../../assets/background2.png') center/cover fixed no-repeat;
    width: 100vw;            /* 视口宽度 */
    height: 100vh;           /* 视口高度 */
    padding: 0;
    margin: 0;
}

</style> 

<script setup lang="ts">
import { reactive } from 'vue'
import {Url} from "../../store/store"
import {Set_Device} from "../../store/device_store"
import {device_list} from "../../store/device_store"
import {defineUser} from "../../store/store"
import axios from 'axios'
import { ElMessage,ElMessageBox } from 'element-plus'
const LoginData = reactive({
  state: 0,//0未登录  1登录成功   2 用户名不存在，请检查用户名  3 密码错误 4 未知错误  
  username: '',
  password: '',
  message: ''
})
const _User = defineUser();

function Login_Submit(): void {
    if(LoginData.username.length < 6 || LoginData.password.length < 6 ){
        ElMessageBox.alert('用户名和密码均需6字节以上', '登录失败', {
            confirmButtonText: '返回'
        });
        return;
    }
    //console.log(Url().prefix)
    //console.log("haha here is a debug~!!!")
    axios.post(Url().prefix + "/user/Login", {username: LoginData.username,password: LoginData.password,}).then(function (response) {
        //console.log(response.data)
        switch (response.data.state) {
            case 1: { //登录成功
                _User.Set(response.data.user_id,response.data.name,response.data.email,response.data.phone,true);
                LoginData.state = 1;

                axios.post(Url().prefix+'/device/List',{user_id:_User.user_id}).then(function(response){
                    Set_Device(response.data.data);
                })
                console.log(device_list)
                //device to do 
                break;
            }
            case 2: { 
                LoginData.state = 2;
                LoginData.message = "用户不存在";
                break;
            }
            case 3: {
                LoginData.state = 3;
                LoginData.message = "密码错误";
                break;
            }
            default: 
                LoginData.state = 4;
                ElMessage.error('数据库发生错误');
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
            <h1 style="font-size:30px; text-align: center;">平 台 登 录</h1>
            <el-divider />
            <el-form  style="margin-top: 6vh;" :model="LoginData"  label-width=80px v-if="LoginData.state==0" >
                <el-form-item label="用户名" prop="username" required>
                    <el-input v-model="LoginData.username" >
                        <template #suffix><el-icon class="el-input__icon"><User /></el-icon></template>    
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" required>
                    <el-input v-model="LoginData.password" show-password />
                </el-form-item>

                <el-form-item style="margin-right: 6vh;margin-top: 6vh;">
                  <el-button type="primary" size="large" style="margin-right: 6vh;" @click="Login_Submit" plain>登录</el-button>
                  <el-button type="warning" size="large" @click="$router.push('/Register')" plain>注册</el-button>
                </el-form-item>
            </el-form>


            <el-result v-else-if="LoginData.state == 1" icon="success" >
                <template #sub-title>{{ LoginData.username }} 登陆成功</template>
                <template #extra>
                  <el-button type="primary" size="large" @click=" $router.push('/Home' );" plain>进入物联网平台主页</el-button>
                </template>
            </el-result>
            <el-result v-else icon="error" title="登录失败" >
                <template #sub-title>{{ LoginData.message }}</template>
                <template #extra>
                  <el-button type="primary" size="large" @click="LoginData.state = 0;" >重新登陆</el-button>
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

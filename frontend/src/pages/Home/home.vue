
<template>

<el-container class="layout-container-demo" style="height: 100vh" >

    <el-aside width="200px" >
        <el-scrollbar >    
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          router=true
        >
          <el-menu-item index="Statistics">
              <el-icon><House  /></el-icon>
              <span>主页-统计信息</span>
          </el-menu-item>

          <el-sub-menu index="2" >
            <template #title>
            <el-icon><setting /></el-icon>
            <span>设备管理</span>
            </template>
              <el-menu-item index="Device">
                <template #title>
                    <span>设备列表</span>
                    <el-icon><MoreFilled /></el-icon>
                </template>
              </el-menu-item>
              <el-sub-menu index="2-2">
                <template #title>
                    <span>设备修改</span>
                    <el-icon><Operation /></el-icon>
                </template>
              <el-menu-item index="Add">
                <span>设备创建</span>
                <el-icon><CirclePlus /></el-icon>
              </el-menu-item>
              <el-menu-item index="Remove">
                <span>设备删除</span>
                <el-icon><Remove /></el-icon>
              </el-menu-item>
              
              <el-menu-item index="Modify">
                <span>设备改动</span>
                <el-icon><InfoFilled /></el-icon>
              </el-menu-item>
                </el-sub-menu>

              <el-menu-item index="Message">
                <span>设备消息</span>
                <el-icon><ChatSquare /></el-icon>
              </el-menu-item>
              <el-menu-item index="Location">
                <span>位置信息</span>
                <el-icon><MapLocation /></el-icon>
            </el-menu-item>
            
            
          </el-sub-menu> 

        </el-menu>
        </el-scrollbar>
        <div class="personal-info">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          router="true"
          class="menu-bottom"
          active-text-color="#fff"
        >
          <el-menu-item index="Profile">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
        </el-menu>
      </div>
</el-aside>
<el-main>
      <router-view></router-view> <!-- 路由匹配的组件将在这里渲染 -->
</el-main>
</el-container>

</template>
  
<script lang="ts" setup>

</script>


<style scoped>



.layout-container-demo .el-header {
  position: relative;
}

.layout-container-demo .el-aside {
  background: #545c64;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.layout-container-demo .el-menu {
  border-right: none;
  flex-grow: 1; /* 让菜单占据大部分空间 */
}

/* 新增样式 */
.personal-info {
  margin-bottom: 15%;
}

.menu-bottom {
  border-right: none;
}
</style>
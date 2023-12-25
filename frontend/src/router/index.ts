import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login/login.vue'
import Register from '../pages/Login/register.vue'
import Home from '../pages/Home/home.vue'
import Statistics from '../pages/Statistics/Statistics.vue'
import Device from '../pages/Device/device.vue'
import Add from '../pages/Device/add.vue'
import Remove from '../pages/Device/remove.vue'
import Modify from '../pages/Device/modify.vue'
import Message from '../pages/Device/message.vue'
import Location from '../pages/Device/location.vue'
import Profile from '../pages/Profile/profile.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [//在这里配置路由
      {
        path: '/',
        redirect: 'Login'
      },
      {
        path: '/Login',
        component: Login
      },
      {
        path: '/Register',
        component: Register
      },

      {
        path: '/Home',
        component: Home,
        redirect:'/Statistics',
        children: [
          {
            path: '/Statistics',
            component: Statistics
          },
          {
            path: '/Device',
            component: Device
          },
          {
            path: '/Add',
            component: Add
          },
          {
            path: '/Remove',
            component: Remove
          },
          {
            path: '/Modify',
            component: Modify
          },
          {
            path: '/Message',
            component: Message
          },
          {
            path: '/Location',
            component: Location
          },
          {
            path: '/Profile',
            component: Profile
          },
          
        ],
      }, 
    ]
})
export default router;
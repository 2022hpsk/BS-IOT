import { defineStore } from 'pinia'

export const Url = defineStore('url', {
  state: () => {
    return {
      //prefix: 'http://192.168.112.35:5321',
      prefix: 'http://127.0.0.1:5321',
    }
  }
})
export const defineUser = defineStore('profile', {
    state: () => ({
      user_id: 1, 
      name: '', 
      email: '',
      phone: '',
      login: false, // true - 已登录
    }),
    persist: true,
    actions: {
      Set(Id:number,Name:string,Email:string,Phone:string,Login: boolean) {
        this.user_id = Id
        this.name = Name
        this.email = Email
        this.phone = Phone
        this.login = Login
      },
    }
  })
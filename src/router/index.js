import Vue from 'vue'
import Router from 'vue-router'
import ChatRoom from '@/components/ChatRoom'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ChatRoom',
      component: ChatRoom
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    }
  ]
})

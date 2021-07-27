import * as VueRouter from "vue-router";

import Index from '../views/index.vue'
import Demo from '../views/demo/index.vue'
import ConfigMap from '../views/config/map.vue'
// @ts-ignore
import ConfigChess from '../views/config/chess.vue'

const routes = [
  {path: '/', component: Index},
  {path: '/demo', component: Demo},
  {path: '/config/map', component: ConfigMap},
  {path: '/config/chess', component: ConfigChess},
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')
const Users = () => import(/* webpackChunkName: "users" */ '../components/user/Users')

const Rights = () => import(/* webpackChunkName: "power" */ '../components/power/Rights')
const Roles = () => import(/* webpackChunkName: "power" */ '../components/power/Roles')

const Cate = () => import(/* webpackChunkName: "goods_cate_params" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "goods_cate_params" */ '../components/goods/Params')

const List = () => import(/* webpackChunkName: "goods_list_add" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName: "goods_list_add" */ '../components/goods/Add')

const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from: 代表从那个路径跳转而来
  // next: 是一个函数，表示放行   next()放行   next('/login')强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

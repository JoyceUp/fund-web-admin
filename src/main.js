import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'


//import 'element-ui/lib/theme-chalk/index.css'
 import './assets/theme-woniu/index.css'
// import './assets/theme/theme-darkblue/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import util from './common/js/util'
import 'font-awesome/css/font-awesome.min.css'
// import './assets/font/iconfont.css'
// import '//at.alicdn.com/t/font_554591_6mth5xk5d6os9k9.css'




Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.filter('money', function (value) {
    if (!value) return '0.00'
    return (value/100).toFixed(2)
})
Vue.filter('moneyFormat', function (value) {
    if (!value) return '0.00'
    return (value/100).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
})
//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();

  if (to.path == '/login') {
    sessionStorage.removeItem('user');
     util.cookieMethod.delCookie('token')
  }
  //let user = JSON.parse(sessionStorage.getItem('user'));
  let token = util.cookieMethod.getCookie('token');

  if (!token && to.path != '/login') {
    next({ path: '/login' })
  } else {
      next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')


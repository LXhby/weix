// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import NProgress from 'nprogress'
import {
  sync
} from 'vuex-router-sync'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import {
  ConfigPlugin,
  DatetimePlugin,
  BusPlugin,
  DevicePlugin,
  ToastPlugin,
  AlertPlugin,
  ConfirmPlugin,
  LoadingPlugin,
  WechatPlugin,
  AjaxPlugin,
  base64,
  cookie
} from 'vux'
import VeeValidate from 'vee-validate'
import VueWechatTitle from 'vue-wechat-title'
import VueTimeago from 'vue-timeago'
import Clipboard from 'v-clipboard'
import qs from 'qs'
import global from '@/components/Global'

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

if(process.env.NODE_ENV != 'development'){
  Raven.config('https://7f9e273e27bf412ebb46e529d4b90bf8@sentry.io/1249416')
      .addPlugin(RavenVue, Vue)
      .install();
}

Vue.use(Vuex)
Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
Vue.use(BusPlugin)
Vue.use(DatetimePlugin)
Vue.use(VueWechatTitle)
Vue.use(Clipboard)

Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'zh-CN',
  locales: {
    // you will need json-loader in webpack 1
    'en-US': require('vue-timeago/locales/en-US.json'),
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
})

const VeeValidateConfig = {
  errorBagName: 'validateErrors', // change if property conflicts
  fieldsBagName: 'fields',
  delay: 0,
  locale: 'zh_CN',
  dictionary: null,
  strict: true,
  classes: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'input|blur',
  inject: true,
  validity: false,
  aria: true
}
Vue.use(VeeValidate, VeeValidateConfig)

Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
})

FastClick.attach(document.body)

Vue.config.productionTip = false
// Vue.http.defaults.baseURL = global.baseUrl + '/xlc/'
// Vue.http.defaults.headers.post['Content-Type'] = 'application/json'

// Vue.http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.http.defaults.withCredentials = true

Vue.http.defaults.retry = 1;
Vue.http.defaults.retryDelay = 500;
Vue.http.defaults.timeout = 30000;

// 得出api地址
let hostname = window.location.hostname
hostname = hostname.substring(hostname.indexOf('.'))
let baseUrl = window.location.protocol+'//api'+hostname;
Vue.prototype.baseUrl = baseUrl
Vue.http.defaults.baseURL = baseUrl + '/xlc/'

Vue.http.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        Vue.$vux.toast.show({
          type: 'cancel',
          text: '网络超时，请检查网络连接，然后刷新页面',
          time: 5000
         })
        return Promise.reject(err);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
    
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return Vue.http(config);
    });
});

const store = new Vuex.Store({}) // 这里你可能已经有其他 module

store.registerModule('vux', { // 名字自己定义
  state: {
    isLoading: false,
    direction: 'forward',
    userInfo: null,
    url: null,
    title: null,
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection (state, payload) {
      state.direction = payload.direction
    },
    setUserInfo (state, payload) {
      if(state.userInfo===null){
        state.userInfo = payload.userInfo
      }
      else {
        Object.assign(state.userInfo, payload.userInfo)
      }
      window.localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
    setUrl (state, payload) {
      state.url = payload
    },
    setTitle (state, payload) {
      state.title = payload
    },
  },
  actions: {
    setUserInfo (context) {
      context.commit('setUserInfo')
    }
  }
})

sync(store, router)

const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
  console.log(store.state.vux)
  store.commit('setTitle', to.meta.title)
  console.log("coookie", cookie.get('papwx_module'))
  if ((!cookie.get('_identity-user') || cookie.get('papwx_module') != 'xlc')) {
    // 第一次访问
    console.log('授权登录')
    cookie.remove('_identity-user');
    cookie.set('papwx_module', 'xlc', {
      domain: hostname,
      path: '/',
      expires: 365
    });
    // 跳转到微信授权页面，微信授权地址通过服务端获得
    Vue.http.get('oauth/get-redirect-url', {
      params: {
        redirectUrl: 'http://' + location.hostname + to.fullPath
      }
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        window.location.href = res.data
      }
    })
  } else if (!store.state.vux.userInfo) {
    console.log(store.state.vux.userInfo)
    // 刷新页面，获取数据存入vuex
    Vue.http.get('oauth/get-current-user').then(res => {
      if (res.status === 200) {
        store.commit('setUserInfo', {userInfo: res.data})
        Vue.http.defaults.auth = {username: res.data.access_token};
        next()
      }
    })
  } else {
    // 已经登录
    console.log('已登录')
    Vue.http.defaults.auth = {username: store.state.vux.userInfo.access_token};
    store.commit('updateLoadingStatus', {
      isLoading: true
    })

    const toIndex = history.getItem(to.path)
    const fromIndex = history.getItem(from.path)

    if (toIndex) {
      if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
        store.commit('updateDirection', {
          direction: 'forward'
        })
      } else {
        store.commit('updateDirection', {
          direction: 'reverse'
        })
      }
    } else {
      ++historyCount
      history.setItem('count', historyCount)
      to.path !== '/' && history.setItem(to.path, historyCount)
      store.commit('updateDirection', {
        direction: 'forward'
      })
    }

    document.title = to.meta.title
    // 处理jssdk签名,兼容history模式
    if (!store.state.vux.url) {
      console.log(document.URL)
      store.commit('setUrl', document.URL)
    }

    if (/\/http/.test(to.path)) {
      let url = to.path.split('http')[1]
      window.location.href = `http${url}`
    } else {
      NProgress.start();
      next()
    }
  }
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {
    isLoading: false
  })
  NProgress.done();
  if (process.env.NODE_ENV === 'production') {
    // ga && ga('set', 'page', to.fullPath)
    // ga && ga('send', 'pageview')
  }
  Vue.nextTick(()=>{
    var url = ''
    // 判断是否是ios微信浏览器
    if (window.__wxjs_is_wkwebview === true) {
        console.log('__wxjs_is_wkwebview');
        if(store.state.vux.url){
            url = store.state.vux.url.split('#')[0]
        }
        else{
          url = window.location.href.split('#')[0]
        }
    } else {
        console.log('is not wkwebview');
        url = window.location.href.split('#')[0]
    }
    console.log('wechat jssdk', url);

    Vue.http.get('wechat/js-sdk-config', {params: {url: url}}).then(response => {
      // js-sdk配置
      Vue.wechat.config(response.data);
    })
  }, 1000)
})

if(process.env.NODE_ENV != 'development'){
  Raven.context(function() {
    /* eslint-disable no-new */
    new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')
  })
}
else {
  /* eslint-disable no-new */
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
}
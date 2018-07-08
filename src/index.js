// 组件挂载到html中
import Vue from 'vue'
import App from './app.vue'
// // 引入图片和样式
// import './assets/styles/style.css'
// import './assets/styles/test-style.styl'
// import './assets/images/1.jpg'
// h参数是vue中的createApp参数
import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
    render:(h) => h(App)  // 声明了组件渲染出来的是app的内容
}).$mount(root) //然后挂载到节点上
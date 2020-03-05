import svga from './svga.vue'

export { svga }
export default {
    install(Vue) {
        Vue.component(svga.name, svga)
    }
}
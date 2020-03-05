<template>
  <canvas />
</template>

<script>
import { Downloader, Parser, Player } from 'svga.lite'
const downloader = new Downloader()
const parser = new Parser()

export default {
  name: 'svga',
  props: {
    src: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      parser,
      player: null,
      canplay: false,  
      needPlay: false,
    }
  },
  async mounted() {
    const player = this.player = new Player(this.$el)
    const { loop = 0, fillMode = 'forwards', playMode = 'forwards', startFrame = 0, endFrame = 0, autoPlay = true } = this.options

    player.set({
      loop,
      fillMode,
      playMode,
      startFrame,
      endFrame,
    })
    const data = await this.parseSvgaData(this.src)
    await player.mount(data)
    // 当调用播放时，避免因资源加载过慢而不能播放
    this.canplay = true
    if (this.needPlay) {
      this.player.start()
    }
    // 事件回调
    player
      .$on('start', () => this.$emit('start'))
      .$on('pause', () => this.$emit('pause'))
      .$on('stop', () => this.$emit('stop'))
      .$on('end', () => this.$emit('end'))
      .$on('clear', () => this.$emit('clear'))
      .$on('process', () => this.$emit('process', player.progress))
      autoPlay && player.start()
  },
  methods: {
    start() {
      if (!this.player) {
        return
      }

      if (this.canplay) {
        this.player.start()
      } else {
        this.needPlay = true
      }
    },
    pause() {
      if (this.player) this.player.pause()
    },
    stop() {
      if (this.player) this.player.stop()
    },
    clear() {
      if (this.player) {
        this.player.clear()
        this.player = null
      }
    },
    async parseSvgaData(src) {
      const rawData = await downloader.get(src)
      return await parser.do(rawData)
    },
  },
  beforeDestroy() {
    this.clear()
  },
}
</script>
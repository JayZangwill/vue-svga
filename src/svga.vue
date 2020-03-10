<template>
  <canvas />
</template>

<script>
import { Downloader, Parser, Player } from 'svga.lite'
const downloader = new Downloader()

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
      parser: null,
      player: null,
      svgaData: null,
      isMount: false,
      canPlay: false,
      needPlay: false,
      parseEnd: false,
      canMount: false,
    }
  },
  async mounted() {
    const player = this.player = new Player(this.$el)
    const { loop = 0, fillMode = 'forwards', playMode = 'forwards', startFrame = 0, endFrame = 0, autoPlay = true, autoMount = true } = this.options

    player.set({
      loop,
      fillMode,
      playMode,
      startFrame,
      endFrame,
    })
    this.svgaData = await this.parseSvgaData(this.src)
    this.$emit('parsed')
    this.parseEnd = true
    this.needMount && this.mount()

    // 事件回调
    player
      .$on('start', () => this.$emit('start'))
      .$on('pause', () => this.$emit('pause'))
      .$on('stop', () => this.$emit('stop'))
      .$on('end', () => this.$emit('end'))
      .$on('clear', () => this.$emit('clear'))
      .$on('process', () => this.$emit('process', player.progress))

    if (autoMount) {
      await this.mount(autoPlay)
      this.canPlay = true

      // 如果start函数在mount结束前被调用，待绑定完成后直接播放
      if (this.needPlay) {
        this.start()
      }
    } else if (autoPlay) {
      this.start()
    }
  },
  methods: {
    start() {
      if (!this.player) {
        return
      }

      if (this.canPlay) {
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
        this.player = this.svgaData = null
      }
    },
    async mount(autoPlay) {
      let result
      if (this.parseEnd) {
        result = await this.player.mount(this.svgaData)
        this.canPlay = this.isMount = true
        if (this.needPlay || autoPlay) {
          this.player.start()
        }
      } else {
        this.needMount = true
      }

      return result
    },
    async parseSvgaData(src) {
      const parser = this.parser = new Parser()
      const rawData = await downloader.get(src)
      return await parser.do(rawData)
    },
  },
  beforeDestroy() {
    this.clear()
  },
}
</script>
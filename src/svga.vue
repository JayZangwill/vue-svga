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
      svgaData: null,
      isMount: false,
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

    // 事件回调
    player
      .$on('start', () => this.$emit('start'))
      .$on('pause', () => this.$emit('pause'))
      .$on('stop', () => this.$emit('stop'))
      .$on('end', () => this.$emit('end'))
      .$on('clear', () => this.$emit('clear'))
      .$on('process', () => this.$emit('process', player.progress))

    if (autoMount) {
      await this.mount(this.svgaData)
    }
  },
  methods: {
    start() {
      if (!this.player) {
        return
      }

      this.player.start()
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
    async mount() {
      const result = await this.player.mount(this.svgaData)
      this.isMount = true
      this.player.start()

      return result
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
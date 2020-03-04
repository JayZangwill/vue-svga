<template>
  <canvas />
</template>

<script>
// https://github.com/svga/SVGAPlayer-Web-Lite
import { Downloader, Parser, Player } from 'svga.lite'
const downloader = new Downloader()
async function parseSvgaData(src) {
  const parser = new Parser()
  const rawData = await downloader.get(src)
  return await parser.do(rawData)
}
export default {
  props: {
    loop: {
      type: Number,
      default: 0,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    fillMode: {
      type: String,
      default: 'forwards',
    },
    src: {
      type: String,
      required: true,
    },
    play: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      player: null,
      canplay: false,  
      needPlay: false,
    }
  },
  watch: {
    play(val) {
      val ? this.start() : this.pause()
    },
  },
  async mounted() {
    const player = this.player = new Player(this.$el)
    player.set({
      loop: this.loop,
      fillMode: this.fillMode,
    })
    const data = await parseSvgaData(this.src)
    await player.mount(data)
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
    this.autoPlay && player.start()
  },
  methods: {
    start() {
      if (this.player) {
        if (this.canplay) {
          this.player.start()
        } else {
          this.needPlay = true
        }
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
  },
  beforeDestroy() {
    this.clear()
  },
}
</script>
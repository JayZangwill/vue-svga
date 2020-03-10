# vue-svga

这是基于[svga.lite](https://github.com/svga/SVGAPlayer-Web-Lite)封装的一个Vue组件

支持其所有[配置](https://github.com/svga/SVGAPlayer-Web-Lite/blob/master/README.zh-CN.md#playerset-%E5%8F%82%E6%95%B0-)，且默认值也保持一致

## 组件接受参数

属性名 |  说明 | 类型 | 默认值 | 必须
-|-|-|-|-
src | 资源链接(需使用`require`包裹链接) | `string` | undefined | 是
options | 包括官网的所有配置，详情见[这里](https://github.com/svga/SVGAPlayer-Web-Lite/blob/master/README.zh-CN.md#playerset-%E5%8F%82%E6%95%B0-) | `object` | {} | 否
options.autoPlay | 加载完毕后是否自动播放 | `boolean` | true | 否

## 安装

```sh
yarn add vue-svga

# 或者

npm i vue-svga
```

## 使用

```javascript
import { svga } from 'vue-svga'

export default {
  components: {
    svga,
  }
}

// 或
import Vue from 'vue'
import svga from 'vue-svga'

Vue.use(svga)
```

```html
<svga :src="require('test.svga')" />
```

### 使用options参数

```html
<svga :src="require('test.svga')" :options="options">
```

```javascript
export default {
  data() {
    return {
      options: {
        loop = 0,
        fillMode = 'forwards',
        playMode = 'forwards',
        startFrame = 0,
        endFrame = 0,
        autoPlay = true
      }
    }
  }
}
```

## 提供的方法

属性名 |  说明
-|-|-
start | 播放svga
pause | 暂停svga
stop | 停止svga
clear | 清空画布

### 使用示例

```html
<svga :src="require('test.svga')" ref="svga">
```

```javascript
this.$refs.svga.start() // 开始播放
this.$refs.svga.pause() // 暂停播放
this.$refs.svga.stop() // 停止播放
this.$refs.svga.clear() // 清空画布
```

## 事件

与[文档](https://github.com/svga/SVGAPlayer-Web-Lite/blob/master/README.zh-CN.md#%E7%AE%80%E5%8D%95%E4%BD%BF%E7%94%A8)保持一致

除此之外还提供了`parsed`事件，svga文件解析完毕后会立刻触发

### 示例

```html
<svga :src="require('test.svga')" @start="start">
```

## 替换元素&动态元素

你可以像[官方文档](https://github.com/svga/SVGAPlayer-Web-Lite/blob/master/README.zh-CN.md#%E6%9B%BF%E6%8D%A2%E5%85%83%E7%B4%A0)一样使用替换元素&动态元素，**不过需要注意的是你需要在`parsed`事件触发后才能操作`svgaData`，同时autoPlay和autoMount属性都要设置为false：**

```html
<svga :src="require('test.svga')" @parsed="parsed" ref="svga" />
```

```javascript
export default {
  data() {
    return {
      options: {
        autoMount: false,
        autoPlay: false
      }
    }
  },
  methods: {
    async parsed() {
      const svga = this.$refs.svga

      const image = new Image()
      image.src = 'https://xxx.com/xxx.png'

      svga.svgaData.images['key'] = image

      await svga.mount()

      svga.start()
    }
  }
}
```

import { Icon, Svg } from './interface'

const baseCss = <String>(prefixIcon: string, size: string) => {
  return `
.${prefixIcon} {
    display: inline-block;
    width: ${size}; 
    height: ${size};
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
}
\n
`
}

/**
 * 生成每一个 iconfont 图标
 * @param name
 * @param svg
 */
const generateStyleClass = <String>(name: string, svg: string) => {
  return `
.${name} {
    background: url(${svg});
}
`
}

export class Match {
  content: string
  prefixIcon: string
  icons: Icon[]
  svgs: Svg[]
  css: string

  constructor(prefixIcon: string = 't-icon', size: string = '16px') {
    this.content = ''
    this.icons = []
    this.svgs = []
    this.prefixIcon = prefixIcon

    /**
     * 最终生成的 css 内容, 等待被写入文件
     */
    this.css = baseCss(prefixIcon, size)
  }

  /**
   * 根据 iconfont.js 匹配 <svg></svg> 标签的内容
   * @param data
   */
  matchesContent(data: string): Match {
    /**
     * 正则表达式标志
     * g - 全局搜索
     * i - 不区分大小写搜索
     * m - 多行搜索
     *
     * /(\<svg(.|\s)*?\<\/svg\>)/gim
     *
     * <svg(.|\s)
     *
     * . 匹配除换行符之外的任何单个字符
     * \s 匹配一个空白符，包括空格、制表符、换页符和换行符
     * (.|\s) = 匹配任意字符，包括空白符
     *
     * * 匹配前一个表达式 0 次或多次，等价于 {0,}
     * ? 匹配前一个表达式 0 次或者1次，等价于 {0, 1}
     *
     * https://www.jianshu.com/p/777cd358a82f
     * 贪婪模式与懒惰模式：
     *  - 贪婪模式：贪婪模式尝试匹配最多字符
     *  - 懒惰模式：在量词后面加上 ? 时，即为懒惰模式，懒惰模式尝试匹配最少字符。
     *    首先尝试匹配空字符串，如果匹配不成功，就多读取一个字符，并再次尝试匹配
     *    直到匹配成功或者整个字符串读取完为止
     *
     *  *? 懒惰模式
     *
     *  (.|\s)*?
     *
     * 这个正则表达式的意思就是匹配 <svg>xxx</svg> 标签的所有内容
     *
     */
    const reg: RegExp = /(\<svg(.|\s)*?\<\/svg\>)/gim
    const content = data.match(reg) || []
    this.content = content.toString()
    return this
  }
  /**
   * 匹配 content svg 标签中的内容
   * 抽离和替换每一个 iconfont，并将每一个 symbol 替换为 svg
   */
  matchesIcon(): Match {
    const { content, prefixIcon } = this
    /**
     * 匹配 content 中所有 symbol 标签内容
     *
     * "<symbol id="icon-location" viewBox="0 0 1024 1024"><path d="M864 383.424h-61.856C802.144 222.72 672 92 512 92V32c194.112 0 352 157.632 352 351.424z" fill="#999999" ></path><path d="M512 992C429.888 992 160 622.272 160 383.424 160 189.632 317.888 32 512 32v60c-160 0-290.144 130.752-290.144 291.424 0 220.032 244.16 532.48 293.856 549.056L512 992z" fill="#999999" ></path><path d="M512 992v-60c47.296-16.384 290.144-322.336 290.144-548.576H864C864 629.76 596.16 992 512 992z m0-450.016c-93.824 0-170.048-73.952-170.048-164.992 0-91.008 76.224-164.992 170.048-164.992s170.048 73.984 170.048 164.992c0 91.04-76.224 164.992-170.048 164.992zM512 272c-59.68 0-108.224 47.104-108.224 104.992 0 57.92 48.544 104.992 108.224 104.992 59.68 0 108.224-47.072 108.224-104.96 0-57.92-48.544-105.024-108.224-105.024z" fill="#999999" ></path></symbol>"
     */
    const reg: RegExp = /(\<symbol(.|\s)*?\<\/symbol\>)/gim

    // symbol 标签组成的数组
    const icons: string[] = content.match(reg) || []

    /**
     * 迭代每一个 symbol 标签
     */
    this.icons = icons.map(s => {
      /**
       * 替换 prefixIcon，默认值为 t-icon
       *
       * example：icon-location => t-icon-location
       */
      s = s.replace('icon-', `${prefixIcon}-`)
      const ids: string[] | null = s.match(/id\=\"(.*?)\"/)
      /**
       * 匹配 iconfont 名称
       */
      const name = (ids && ids[1]) || ''

      /**
       * symbol 标签替换成 svg
       */
      const icon = s.replace(/symbol/gi, 'svg')
      return { name, icon }
    })
    return this
  }
  /**
   * svgs 生成 css
   */
  generateCss() {
    this.svgs.forEach(({ name, svg }) => {
      this.css += generateStyleClass(name, svg)
    })
    return this
  }
  setContent(content: string): Match {
    this.matchesContent(content)
    return this
  }
  /**
   * 将 svg 转换成 dataUrl
   * @param svgStr
   */
  svg2DataUrl(svgStr: string): string {
    svgStr = svgStr.replace(
      /\<svg/,
      `<?xml version="1.0" encoding="utf-8"?><svg version="1.1" width='100%' height='100%' xmlns="http://www.w3.org/2000/svg"`,
    )

    /**
     * 对字符串进行编码
     * encodeURIComponent：
     *  不转义字符：A-Z a-z 0-9 - _ . ! ~ * ' ( )
     *
     * encodeURIComponent 与 encodeURI 区别：
     * var set1 = ";,/?:@&=+$";  // 保留字符
     * var set2 = "-_.!~*'()";   // 不转义字符
     * var set3 = "#";           // 数字标志
     * var set4 = "ABC abc 123"; // 字母数字字符和空格
     *
     * console.log(encodeURI(set1)); // ;,/?:@&=+$
     * console.log(encodeURI(set2)); // -_.!~*'()
     * console.log(encodeURI(set3)); // #
     * console.log(encodeURI(set4)); // ABC%20abc%20123 (the space gets encoded as %20)
     *
     * console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
     * console.log(encodeURIComponent(set2)); // -_.!~*'()
     * console.log(encodeURIComponent(set3)); // %23
     * console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (the space gets encoded as * %20)
     */

    const encoded: string = encodeURIComponent(svgStr)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')
    return `data:image/svg+xml,${encoded}`
  }
  /**
   * 生成 svg
   */
  generateSvg(): Match {
    const { svg2DataUrl, icons } = this
    this.svgs = icons.map(({ name, icon }) => ({ name, svg: svg2DataUrl(icon) }))
    return this
  }
}

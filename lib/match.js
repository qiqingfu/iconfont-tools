'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Match = void 0
var baseCss = function(prefixIcon, size) {
  return (
    '\n.' +
    prefixIcon +
    ' {\n    display: inline-block;\n    width: ' +
    size +
    '; \n    height: ' +
    size +
    ';\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: 100%;\n}\n\n\n'
  )
}
/**
 * 生成每一个 iconfont 图标
 * @param name
 * @param svg
 */
var generateStyleClass = function(name, svg) {
  return '\n.' + name + ' {\n    background: url(' + svg + ');\n}\n'
}
var Match = /** @class */ (function() {
  function Match(prefixIcon, size) {
    if (prefixIcon === void 0) {
      prefixIcon = 't-icon'
    }
    if (size === void 0) {
      size = '16px'
    }
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
  Match.prototype.matchesContent = function(data) {
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
    var reg = /(\<svg(.|\s)*?\<\/svg\>)/gim
    var content = data.match(reg) || []
    this.content = content.toString()
    return this
  }
  /**
   * 匹配 content svg 标签中的内容
   * 抽离和替换每一个 iconfont，并将每一个 symbol 替换为 svg
   */
  Match.prototype.matchesIcon = function() {
    var _a = this,
      content = _a.content,
      prefixIcon = _a.prefixIcon
    /**
     * 匹配 content 中所有 symbol 标签内容
     *
     * "<symbol id="icon-location" viewBox="0 0 1024 1024"><path d="M864 383.424h-61.856C802.144 222.72 672 92 512 92V32c194.112 0 352 157.632 352 351.424z" fill="#999999" ></path><path d="M512 992C429.888 992 160 622.272 160 383.424 160 189.632 317.888 32 512 32v60c-160 0-290.144 130.752-290.144 291.424 0 220.032 244.16 532.48 293.856 549.056L512 992z" fill="#999999" ></path><path d="M512 992v-60c47.296-16.384 290.144-322.336 290.144-548.576H864C864 629.76 596.16 992 512 992z m0-450.016c-93.824 0-170.048-73.952-170.048-164.992 0-91.008 76.224-164.992 170.048-164.992s170.048 73.984 170.048 164.992c0 91.04-76.224 164.992-170.048 164.992zM512 272c-59.68 0-108.224 47.104-108.224 104.992 0 57.92 48.544 104.992 108.224 104.992 59.68 0 108.224-47.072 108.224-104.96 0-57.92-48.544-105.024-108.224-105.024z" fill="#999999" ></path></symbol>"
     */
    var reg = /(\<symbol(.|\s)*?\<\/symbol\>)/gim
    // symbol 标签组成的数组
    var icons = content.match(reg) || []
    /**
     * 迭代每一个 symbol 标签
     */
    this.icons = icons.map(function(s) {
      /**
       * 替换 prefixIcon，默认值为 t-icon
       *
       * example：icon-location => t-icon-location
       */
      s = s.replace('icon-', prefixIcon + '-')
      var ids = s.match(/id\=\"(.*?)\"/)
      /**
       * 匹配 iconfont 名称
       */
      var name = (ids && ids[1]) || ''
      /**
       * symbol 标签替换成 svg
       */
      var icon = s.replace(/symbol/gi, 'svg')
      return { name: name, icon: icon }
    })
    return this
  }
  /**
   * svgs 生成 css
   */
  Match.prototype.generateCss = function() {
    var _this = this
    this.svgs.forEach(function(_a) {
      var name = _a.name,
        svg = _a.svg
      _this.css += generateStyleClass(name, svg)
    })
    console.log(this.css)
    return this
  }
  Match.prototype.setContent = function(content) {
    this.matchesContent(content)
    return this
  }
  /**
   * 将 svg 转换成 dataUrl
   * @param svgStr
   */
  Match.prototype.svg2DataUrl = function(svgStr) {
    svgStr = svgStr.replace(
      /\<svg/,
      '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" width=\'100%\' height=\'100%\' xmlns="http://www.w3.org/2000/svg"',
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
    var encoded = encodeURIComponent(svgStr)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')
    return 'data:image/svg+xml,' + encoded
  }
  /**
   * 生成 svg
   */
  Match.prototype.generateSvg = function() {
    var _a = this,
      svg2DataUrl = _a.svg2DataUrl,
      icons = _a.icons
    this.svgs = icons.map(function(_a) {
      var name = _a.name,
        icon = _a.icon
      return { name: name, svg: svg2DataUrl(icon) }
    })
    return this
  }
  return Match
})()
exports.Match = Match

import { Icon, Svg } from './interface'
export declare class Match {
  content: string
  prefixIcon: string
  icons: Icon[]
  svgs: Svg[]
  css: string
  constructor(prefixIcon?: string, size?: string)
  /**
   * 根据 iconfont.js 匹配 <svg></svg> 标签的内容
   * @param data
   */
  matchesContent(data: string): Match
  /**
   * 匹配 content svg 标签中的内容
   * 抽离和替换每一个 iconfont，并将每一个 symbol 替换为 svg
   */
  matchesIcon(): Match
  /**
   * svgs 生成 css
   */
  generateCss(): this
  setContent(content: string): Match
  /**
   * 将 svg 转换成 dataUrl
   * @param svgStr
   */
  svg2DataUrl(svgStr: string): string
  /**
   * 生成 svg
   */
  generateSvg(): Match
}

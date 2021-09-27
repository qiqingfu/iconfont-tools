import utils from './utils'
import axios from 'axios'
export const INPUT_FILE = 'iconfont.js'

export class Extract {
  path: string
  dirName: string
  targetDir: string
  content: string
  targetFile: string

  constructor(path: string, dirName: string, fileName: string) {
    this.path = path
    this.content = ''
    this.dirName = dirName
    this.targetDir = `${path}/${dirName}`
    this.targetFile = `${path}/${dirName}/${fileName}`
  }

  /**
   * 将生成的 css 设置给 content
   */
  setContent(content: string) {
    this.content = content
  }

  /**
   * 生成一系列要产出的目录文件
   * 1. 创建生成的目录，如果目录已存在，则清空目录中的所有文件
   * 2. 生成 css 文件、wxss 文件
   */
  async generate() {
    await this.generateDir()
    const target = await this.generateStyle()
    return target
  }

  async getIconfontContentByDown(url: string) {
    /**
     * //at.alicdn.com/t/font_2819266_nafd0i0j22o.js
     * 如果是以 // 开头的，加上 https: 协议名
     */
    url = url.indexOf('//') === 0 ? `https:${url}` : url
    const { data } = await axios.get(url).catch(() => {
      throw new Error(`对不起请求iconfont.js文件错误，请检查链接地址：${url}`)
    })
    return data
  }
  async getIconfontContent() {
    const target = `${this.path}/${INPUT_FILE}`
    const content: any = await utils.readFile(target)
    if (content === false) {
      throw new Error(`对不起，当前目录下不存在 iconfont.js 文件：${target}`)
    }
    return content
  }

  /**
   * 生成样式文件
   */
  async generateStyle() {
    const { targetFile } = this
    const cssState = await utils.mkFile(`${targetFile}.css`, this.content)
    if (!cssState) {
      throw new Error(`对不起,生成文件：${this.targetFile}.css 失败`)
    }
    const wxssState = await utils.mkFile(`${targetFile}.wxss`, this.content)
    if (!wxssState) {
      throw new Error(`对不起,生成文件：${this.targetFile}.wxss 失败`)
    }
    return `${targetFile}.css`
  }

  /**
   * 生成目录
   */
  async generateDir() {
    const { targetDir } = this
    /**
     * 删除指定的目录
     */
    await this.clearDir()

    /**
     * 创建新的目录
     */
    const mk = await utils.mkdir(targetDir)
    if (!mk) {
      throw new Error(`创建文件夹：${targetDir} 失败`)
    }
    return targetDir
  }

  async clearDir() {
    const { targetDir } = this
    // 检查 targerDir 目录是否存在
    const exit = await utils.exitDir(targetDir)
    /**
     * 如果目录存在，则删除
     */
    if (exit) {
      const delState = await utils.rmdir(targetDir)
      if (!delState) {
        throw new Error(`删除文件夹:${targetDir} 失败`)
      }
    }
    return targetDir
  }
}

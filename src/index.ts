import { Extract } from './extract'
import { Match } from './match'
import component from './template'
import { OPT } from './interface'

/**
 * 生成指定路径的目录文件
 * @param opt
 */
export const create = async <Promise>(opt: OPT) => {
  const { iconfontUrl, dirName, fileName, path, icon, fontSize } = opt

  /**
   * path：生成的文件路径
   * dirName: 文件夹名称
   * fileName: css 文件名称
   */
  const ex = new Extract(path, dirName, fileName)

  /**
   * icon：设置css的prefix
   * fontSize:设置icon的大小
   */
  const mat = new Match(icon, fontSize)

  /**
   * 如果命令行传入了 iconfontUrl 在线地址，则获取在线图标
   * 未传入 iconfontUrl，则读取 cli 执行所在目录下的 iconfont.js symbol 代码文件
   */
  const iconCtx = iconfontUrl ? await ex.getIconfontContentByDown(iconfontUrl) : await ex.getIconfontContent()

  mat
    .matchesContent(iconCtx)
    .matchesIcon()
    .generateSvg()
    .generateCss()

  /**
   *
   */
  ex.setContent(mat.css)
  const filePath = await ex.generate()

  /**
   * 生成小程序原生组件
   */
  if (opt.component) {
    const componentPath = `${ex.targetDir}/icon`
    await component(componentPath, icon, fileName)
  }

  return filePath
}

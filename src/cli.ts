#!/usr/bin/env node
/**
 * 脚手架命令行的颜色显示
 * https://www.npmjs.com/package/chalk
 */
import chalk from 'chalk'
import { dir } from 'console'
/**
 * 脚手架终端的交互式命令行
 * https://github.com/SBoudrias/Inquirer.js
 */
import inquirer from 'inquirer'
/**
 * 语义化版本规范，实现了版本和版本范围的解析、计算、比较
 * https://github.com/npm/node-semver
 * https://zhuanlan.zhihu.com/p/20747196
 */
import semver from 'semver'
import { create } from './index'
import { OPT } from './interface'

import { generatePath } from './utils'

/**
 * 默认选项数据
 */
const DEFAULT_OPTION: OPT = {
  iconfontUrl: '', // 暂时理解为 iconfont 的在线链接地址
  path: process.cwd(), // 生成的目标路径
  dirName: 'iconfont-weapp', // 设置输出文件夹名称
  fileName: 'iconfont-weapp-icon', // 设置输出文件 css 文件名称
  icon: 't-icon', // 设置 css 文件的 prefix
  fontSize: '16px', // 设置字体的大小
  component: true, // 是否生产小程序原生组件
}

/**
 * 检查 Node 版本号
 */
const checkVersion = () => {
  /**
   * 如果 process.version Node 版本满足 9.x 范围，则返回 true
   */
  if (semver.satisfies(process.version, '9.x')) {
    console.log(chalk.red(`您当前的 Node 版本：${process.version}.\n` + `请提升您的 Node 版本： 10.x 以上`))
    return false
  }
  return true
}

/**
 * 交互式命令行，收集用户的命令行键入数据
 */
const inquirerHandler = async () => {
  // 运行 cli 命令所在的目录路径
  let path = process.cwd()
  // iconfont 的在线链接地址
  let iconfontUrl = ''

  /**
   * 获取命令行参数
   * iconfont-tools --from //at.alicdn.com/t/font_717026_fqwb5om0rvk.js --to ./output/dir-path
   */
  // --from
  const paramsForm = process.argv[2]
  // 在线地址
  const paramsFormUrl = process.argv[3]
  // --to
  const paramsTo = process.argv[4]
  // 生成的目标路径地址
  const paramsToPath = process.argv[5]

  /**
   * 校验命令行参数的正确名和完整性
   */
  if (['--from'].includes(paramsForm)) {
    if (!paramsFormUrl) {
      throw new Error('--from 参数不能为空')
    }
    iconfontUrl = paramsFormUrl
  }

  if (['--to'].includes(paramsTo)) {
    if (!paramsToPath) {
      throw new Error('--to 参数不能为空')
    }
    /**
     * 对生成的目标路径地址做一层处理
     */
    path = await generatePath(paramsToPath)
  }

  /**
   * 获取用户命令行交互的数据
   */
  const { dirName } = await inquirer.prompt({
    type: 'input',
    name: 'dirName',
    message: '设置输出文件夹名称：',
    default: DEFAULT_OPTION.dirName,
  })
  const { fileName } = await inquirer.prompt({
    type: 'input',
    name: 'fileName',
    message: '设置输出文件css文件名称：',
    default: DEFAULT_OPTION.fileName,
  })
  const { icon } = await inquirer.prompt({
    type: 'input',
    name: 'icon',
    message: '设置css文件的prefix：',
    default: DEFAULT_OPTION.icon,
  })
  const { fontSize } = await inquirer.prompt({
    type: 'input',
    name: 'fontSize',
    message: '设置字体的大小：',
    default: DEFAULT_OPTION.fontSize,
  })
  const { component } = await inquirer.prompt({
    type: 'input',
    name: 'component',
    message: '是否生产小程序原生组件：',
    default: DEFAULT_OPTION.component,
  })

  return {
    iconfontUrl,
    path,
    dirName,
    fileName,
    fontSize,
    icon,
    component,
  }
}
/**
 * 主入口函数
 */
const main = async () => {
  /**
   * 首先, 检查用户的 Node 版本号
   */
  const vers = checkVersion()
  if (!vers) {
    return
  }
  const opt: OPT = await inquirerHandler()
  create(opt)
}

main()

import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'

export const getState = <Promise>(filePath: string) => {
  return new Promise(resolve => {
    /**
     * 不推荐在调用 fs.open()，fs.readFile()、fs.writeFile()之前使用 fs.stat() 检查文件是否存在
     * 要检查文件是否存在而不对其进行操作，建议使用 fs.access()
     */
    fs.stat(filePath, (err, stats) => {
      if (err) {
        return resolve(false)
      }
      resolve(stats)
    })
  })
}

/**
 * 检查文件目录是否存在
 * @param filePath 路径 path
 */
export const exitDir = <Promise>(filePath: string) => {
  return new Promise(async resolve => {
    /**
     * fs.stat 成功的结果，文件的状态
     */
    const fileStats: any = await getState(filePath)
    // 文件不存在，返回 false
    if (!fileStats) {
      return resolve(false)
    }
    // 目录不存在，返回 false
    if (!fileStats.isDirectory()) {
      resolve(false)
    }

    // 返回 true
    resolve(true)
  })
}

/**
 * 根据给定的 path，创建新的目录
 * @param path
 */
export const mkdir = <Promise>(filePath: string) => {
  return new Promise(resolve => {
    /**
     * 异步地创建目录
     */
    fs.mkdir(filePath, { recursive: true }, err => {
      if (err) {
        return resolve(false)
      }
      resolve(true)
    })
  })
}

export const rmdir = <Promise>(filePath: string) => {
  return new Promise(resolve => {
    rimraf(filePath, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 将指定的内容写入文件
 * @param filePath
 * @param content
 */
export const mkFile = <Promise>(filePath: string, content: string) => {
  return new Promise(resolve => {
    try {
      fs.writeFileSync(filePath, content)
      resolve(true)
    } catch (error) {
      resolve(false)
    }
  })
}

/**
 * 读取指定文件的内容
 * @param path
 */
export const readFile = <Promise>(filePath: string) => {
  return new Promise(resolve => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      resolve(content)
    } catch (error) {
      resolve(false)
    }
  })
}
export const copy = <Promise>(from: string, to: string) => {
  return new Promise(resolve => {
    try {
      fs.writeFileSync(to, fs.readFileSync(from))
      resolve(true)
    } catch (error) {
      resolve(false)
    }
  })
}

export async function generatePath(flPath: string) {
  let targetPath = flPath
  /**
   * 这是在校验相对路径吗?
   * 如果生成的目标路径是相对路径，就解析为绝对路径
   * 解析的规则：
   *  - 运行当前 cli 所在的路径 + 相对路径
   *  - 通过 path.resolve() 解析
   */
  if (flPath.indexOf('.') === 0) {
    const pwd = process.cwd()
    targetPath = path.resolve(pwd, flPath)
  }

  // 绝对路径目录是否存在
  const isDir = await exitDir(targetPath)

  /**
   * 如果要生成的目录不存在的话，就给用户创建
   */
  if (!isDir) {
    console.log(`对不起，输出目录${targetPath}不存在！`)
    const createSuccess = await mkdir(targetPath)
    if (!createSuccess) {
      throw new Error(`目录${targetPath}创建失败`)
    }
    console.log(`目录${targetPath}创建成功`)
  }
  return targetPath
}

export default {
  generatePath,
  getState,
  exitDir,
  mkdir,
  rmdir,
  mkFile,
  readFile,
  copy,
}

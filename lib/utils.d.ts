export declare const getState: <Promise_1>(filePath: string) => Promise<unknown>;
/**
 * 检查文件目录是否存在
 * @param filePath 路径 path
 */
export declare const exitDir: <Promise_1>(filePath: string) => Promise<unknown>;
/**
 * 根据给定的 path，创建新的目录
 * @param path
 */
export declare const mkdir: <Promise_1>(filePath: string) => Promise<unknown>;
export declare const rmdir: <Promise_1>(filePath: string) => Promise<unknown>;
/**
 * 将指定的内容写入文件
 * @param filePath
 * @param content
 */
export declare const mkFile: <Promise_1>(filePath: string, content: string) => Promise<unknown>;
/**
 * 读取指定文件的内容
 * @param path
 */
export declare const readFile: <Promise_1>(filePath: string) => Promise<unknown>;
export declare const copy: <Promise_1>(from: string, to: string) => Promise<unknown>;
export declare function generatePath(flPath: string): Promise<string>;
declare const _default: {
    generatePath: typeof generatePath;
    getState: <Promise_1>(filePath: string) => Promise<unknown>;
    exitDir: <Promise_2>(filePath: string) => Promise<unknown>;
    mkdir: <Promise_3>(filePath: string) => Promise<unknown>;
    rmdir: <Promise_4>(filePath: string) => Promise<unknown>;
    mkFile: <Promise_5>(filePath: string, content: string) => Promise<unknown>;
    readFile: <Promise_6>(filePath: string) => Promise<unknown>;
    copy: <Promise_7>(from: string, to: string) => Promise<unknown>;
};
export default _default;

export declare const INPUT_FILE = "iconfont.js";
export declare class Extract {
    path: string;
    dirName: string;
    targetDir: string;
    content: string;
    targetFile: string;
    constructor(path: string, dirName: string, fileName: string);
    /**
     * 将生成的 css 设置给 content
     */
    setContent(content: string): void;
    /**
     * 生成一系列要产出的目录文件
     * 1. 创建生成的目录，如果目录已存在，则清空目录中的所有文件
     * 2. 生成 css 文件、wxss 文件
     */
    generate(): Promise<string>;
    getIconfontContentByDown(url: string): Promise<any>;
    getIconfontContent(): Promise<any>;
    /**
     * 生成样式文件
     */
    generateStyle(): Promise<string>;
    /**
     * 生成目录
     */
    generateDir(): Promise<string>;
    clearDir(): Promise<string>;
}

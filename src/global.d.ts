/**
 * 全局类型声明文件
 * 声明编译时全局变量和 .vue 文件的模块类型
 */

/** 编译时注入的开发模式标志 */
declare const __DEV__: boolean

/** .vue 单文件组件模块声明 */
declare module '*.vue' {
  const component: any
  export default component
}

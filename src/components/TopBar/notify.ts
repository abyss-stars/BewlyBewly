// https://github.dev/the1812/Bilibili-Evolved/blob/8a4e422612a7bd0b42da9aa50c21c7bf3ea401b8/src/components/feeds/notify.ts#L1

// import { getCookie, getUserID, setCookie } from '~/utils/main'

/**
 * 顶栏通知更新工具
 * 控制通知和动态数量的轮询间隔
 */

/** 顶栏通知和动态数量的更新间隔（每5分钟更新一次） */
export const updateInterval = 1000 * 60 * 5

// const getLastID = (): string => `${getCookie(`bp_t_offset_${getUserID()}`)}`

// function compareID(currentID: string, lastOffsetID: string): boolean {
//   if (currentID === lastOffsetID)
//     return false
//   else if (Number(currentID) > Number(lastOffsetID))
//     return true
//   else
//     return false
// }

// export function setLastId(id: string) {
//   if (id === null || id === undefined)
//     return

//   if (compareID(id))
//     return

//   setCookie(`bp_t_offset_${getUserID()}`, id, 30)
// }

// export const isNewId = (id: string): boolean => compareID(id, getLastID())

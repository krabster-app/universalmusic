import { getBoundStorage } from '$utils/useTable/useTable.ts'

const TABLE_STORAGE = {}

export const createStore = getBoundStorage(TABLE_STORAGE)

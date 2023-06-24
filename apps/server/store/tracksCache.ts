import { createStore } from '$libs/utils/createStore.ts'
import { TrackInfo } from '$libs/search/domain/types.ts'

export const tracksCache = createStore<TrackInfo, 'id'>('tracksCache', 'id')

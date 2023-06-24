import { COVER_URL_BASE } from '../../../config/config.ts'
import { MBID } from './types.ts'

type CoverSize = '250' | '500' | '1200' | 250 | 500 | 1200

export const getCoverUrl = (mbid: MBID) => {
    return `${COVER_URL_BASE}${mbid}/front-##`
}

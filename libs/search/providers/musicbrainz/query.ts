import { isNoError } from '../../../shared/guards/isNoError.ts'
import { MusicBrainzAnswer } from './types.ts'

export const queryMusicInfo = async (query: string, limit?: number, _offset?: number) => {
    const url = new URL('https://musicbrainz.org/ws/2/recording')
    url.searchParams.set('query', `${query}~0.9 AND ${query}~7`)
    url.searchParams.set('limit', (limit ?? 10).toString())
    const data = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    }).then((r) => r.json() as Promise<MusicBrainzAnswer>).catch((e) => {
        // 503 likely
        return { error: 'rateLimit', details: e }
    })

    if (isNoError<MusicBrainzAnswer>(data)) {
        return data
    }

    return {
        recordings: [],
    }
}

if (import.meta.main) {
    const res = await queryMusicInfo('BONES - LooseScrew', 1)
    console.log(res)
}

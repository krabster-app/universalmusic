import { RouterContext } from 'https://deno.land/x/oak@v12.5.0/router.ts'
import { queryMusicInfo } from '$libs/search/providers/musicbrainz/query.ts'
import { exists } from '$libs/shared/guards/exists.ts'
import { SearchError } from '$libs/shared/errors/search.ts'
import { musicBrainzTransformer } from '$libs/search/providers/musicbrainz/transformer.ts'
import { tracksCache } from '../store/tracksCache.ts'

export const searchService = async (context: RouterContext<'/search'>) => {
    const query = context.request.url.searchParams.get('query')
    if (!exists(query) || query.length < 3) {
        return { error: SearchError.QueryTooShort }
    }
    const data = await queryMusicInfo(query, 5)
    console.log(data)
    const tracks = data.recordings.map(musicBrainzTransformer)
    tracks.forEach((v) => tracksCache.insertUpdate(v.id, v))
    return tracks
}

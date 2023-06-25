import { client, e } from '../../edgeql/client.ts'
import { Cardinality } from '../../edgeql/db/index.ts'
import { TypeSet } from '../../edgeql/db/reflection.ts'
import { TrackArtist, TrackInfo } from '../../search/domain/types.ts'
import { forceType } from '../../shared/guards/forceType.ts'

// export const cacheTrackInfos = (tracks: TrackInfo[]) => {
//     const query = e.params({ items: e.json }, (params) => {
//         return e.for(e.json_array_unpack(params.items), (_item) => {
//             const item = _item as unknown as TrackInfo
//             return e.insert(e.TrackInfo, {
//                 title: e.cast(e.str, item.title),
//                 mbid: e.cast(e.uuid, item.id),
//                 length: e.cast(e.int32, item.length), // length in ms
//                 disambiguation: e.cast(e.str, item.disambiguation),
//                 artists: e.for(
//                     e.array_unpack(item.artists),
//                     (_artist) => {
//                         const artist = _artist as unknown as TrackArtist
//                         return e.insert(e.ArtistInfo, {
//                             mbid: e.cast(e.uuid, artist.artist.id),
//                             name: e.cast(e.str, artist.artist.name)
//                         })
//                     }),
//                 artistFull: string
//                 coverUrl: string | null // http://coverartarchive.org/release/{MBID}/front-250/500/1200
//                 release: TrackRelease | null // main release
//                 tags?: string[]
//             }).unlessConflict((track) => ({
//                 on: track.mbid, // can be any expression
//             }))
//         })
//     })

//     return query.run(client, {
//         items: tracks,
//     })
// }

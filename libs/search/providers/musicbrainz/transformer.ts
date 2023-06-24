import { exists } from '$libs/shared/guards/exists.ts'
import { TrackInfo } from '../../domain/types.ts'
import { getCoverUrl } from './get-cover-url.ts'
import { MusicBrainzRecording } from './types.ts'

export const musicBrainzTransformer = (mbRecording: MusicBrainzRecording): TrackInfo => {
    const release = mbRecording.releases?.find((v) => v.status === 'Official') ?? mbRecording.releases?.at(0)

    return {
        id: mbRecording.id,
        title: mbRecording.title, // track title
        length: mbRecording.length, // length in ms
        disambiguation: mbRecording.disambiguation, // "clean"
        artists: mbRecording['artist-credit'].map((v) => ({
            joinphrase: v.joinphrase,
            name: v.name, // concatßenated artist names
            artist: {
                id: v.artist.id, // inner artist id
                name: v.artist.name, // artist name
            },
        })),
        artistFull: mbRecording['artist-credit'].reduce((acc, v) => {
            return `${acc}${v.name}${v.joinphrase !== undefined ? v.joinphrase : ''}`
        }, ''),
        coverUrl: exists(release) ? getCoverUrl(release.id) : null, // http://coverartarchive.org/release/{MBID}/front-250/500/1200
        release: exists(release)
            ? {
                id: release.id,
                title: release.title,
                status: release.status, // 'Official'
                disambiguation: release.disambiguation,
            }
            : null,
        tags: [],
    }
}

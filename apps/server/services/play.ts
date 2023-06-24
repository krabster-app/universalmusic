import { RouterContext } from 'https://deno.land/x/oak@v12.5.0/router.ts'
import { exists } from '$libs/shared/guards/exists.ts'
import { musicBrainzTransformer } from '$libs/search/providers/musicbrainz/transformer.ts'
import { mpi } from '../mpi.ts'
import { InputMessageKind, OutputMessage, OutputMessageKind } from '$libs/download/domain/worker-messages.ts'
import { MediaSource } from '$libs/media/domain/media-source.ts'
import { tracksCache } from '../store/tracksCache.ts'
import { searchVideos } from '$libs/download/infrastructure/youtube.ts'
import { isNoError } from '$libs/shared/guards/isNoError.ts'

export const playService = async (context: RouterContext<'/play'>) => {
    const body = await context.request.body({ type: 'json' }).value
    if (!Object.prototype.hasOwnProperty.call(body, 'mbid')) {
        return { error: 'NO_TRACK_ID' }
    }
    const mbid = body['mbid']
    console.log(tracksCache.dump())
    const track = tracksCache.get(mbid)!
    const searchQuery = `${track.artistFull} - ${track.title}`
    const video = await searchVideos(searchQuery)

    if (!exists(video)) {
        return { error: 'NO_VIDEO_FOUND' }
    }

    mpi.send({
        type: InputMessageKind.DownloadTask,
        task: {
            id: mbid,
            task: {
                source: MediaSource.YouTube,
                info: {
                    videoId: video?.videoId,
                },
            },
        },
    })

    const result = await mpi.when({
        filter: (message) => message.type === OutputMessageKind.DownloadSuccess && message.id === mbid,
        timeoutMs: 30_000,
    }).catch((e) => {
        return { error: 'DOWNLOADING_ISSUE', details: e }
    })
    if (!isNoError<OutputMessage>(result)) {
        return result
    }
    console.log(result)
    if (result.type === OutputMessageKind.DownloadSuccess) {
        return {
            link: result.download.id,
        }
    } else {
        return { error: 'UNREACHABLE_CODE' }
    }
}

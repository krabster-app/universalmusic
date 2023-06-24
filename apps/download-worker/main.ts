import {
    InputMessage,
    InputMessageKind,
    OutputMessage,
    OutputMessageKind,
} from '$libs/download/domain/worker-messages.ts'
import { MessagePassingInterface } from '../../libs/shared/mpi.ts'
import { ytdlDownload } from './ytdl.ts'

const mpi = new MessagePassingInterface<OutputMessage, InputMessage>(self)

mpi.listen(async (message) => {
    switch (message.type) {
        case InputMessageKind.DownloadTask: {
            const result = await ytdlDownload(message.task.task.info.videoId)
            mpi.send({
                type: OutputMessageKind.DownloadSuccess,
                id: message.task.id,
                download: {
                    id: result.id,
                    serverId: '',
                },
            })
        }
    }
})

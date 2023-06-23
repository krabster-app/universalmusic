import { MediaSource } from '../../media/domain/media-source.ts'
import { YouTubeDownloadTaskInfo } from './youtube.ts'

export type DownloadTaskInfo = { source: MediaSource.YouTube; info: YouTubeDownloadTaskInfo } // TODO: add more when needed

export type DownloadTaskId = string

export type DownloadTask = {
    id: DownloadTaskId
    task: DownloadTaskInfo
}

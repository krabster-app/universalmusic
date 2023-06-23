import { ServerId } from '../../media/domain/server.ts'

export type DownloadId = string

/**
 * Represents a single download that is complete
 * and is stored in a configured cloud service
 */
export type Download = {
    id: DownloadId
    serverId: ServerId
}

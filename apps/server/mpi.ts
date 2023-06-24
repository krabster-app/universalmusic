import { InputMessage, OutputMessage } from '../../libs/download/domain/worker-messages.ts'
import { MessagePassingInterface } from '../../libs/shared/mpi.ts'

const worker = new Worker(import.meta.resolve('$worker/main.ts'), { type: 'module' })

export const mpi = new MessagePassingInterface<InputMessage, OutputMessage>(worker)

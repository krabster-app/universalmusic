import * as edgedb from 'edgedb'
export { default as e } from './db/index.ts'

export const client = edgedb.createClient()

// INCOMPLETE

import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'
import { createFakeHeaders } from '../../shared/http/fake-headers.ts'

const HEADERS = createFakeHeaders({ origin: 'https://youtube.com', host: 'youtube.com' })

export const searchVideos = async (query: string) => {
    const url = new URL('https://youtube.com/results')
    url.searchParams.set('search_query', query)
    const response = await fetch(url, {
        headers: {
            ...HEADERS,
            'X-YouTube-Client-Name': '1',
            'X-YouTube-Client-Version': '2.20211110.00.00',
            'Content-Type': 'text/html; charset=utf-8',
        },
    })
    const text = await response.text()

    const doc = new DOMParser().parseFromString(text, 'text/html')

    if (!doc) {
        throw new Error('Failed to parse HTML')
    }

    const scripts = Array.from(doc.querySelectorAll('script'))

    const ytInitialDataScript = scripts.find((script) => script.textContent?.includes('ytInitialData'))

    if (!ytInitialDataScript) {
        throw new Error('Failed to find ytInitialData script')
    }

    const ytInitialData = ytInitialDataScript.textContent?.match(/ytInitialData\s*=\s*(.*);/)?.[1]

    if (!ytInitialData) {
        throw new Error('Failed to find ytInitialData')
    }

    const ytInitialDataJson = JSON.parse(ytInitialData)

    const videos = ytInitialDataJson
        .contents
        .twoColumnSearchResultsRenderer
        .primaryContents
        .sectionListRenderer
        .contents[0]
        .itemSectionRenderer
        .contents
        .map((content) => {
            const videoRenderer = content.videoRenderer

            if (!videoRenderer) {
                return null
            }

            const videoId = videoRenderer.videoId
            const title = videoRenderer.title.runs[0].text
            const lengthText = videoRenderer.lengthText?.simpleText
            const viewCountText = videoRenderer.viewCountText?.simpleText
            const thumbnail = videoRenderer.thumbnail.thumbnails[0]

            return {
                videoId,
                title,
                lengthText,
                viewCountText,
                thumbnail,
            }
        })

    return videos
}

if (import.meta.main) {
    const res = await searchVideos('BONES - LooseScrew')
    console.log(res)
}

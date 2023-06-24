import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'
import { createFakeHeaders } from '../../shared/http/fake-headers.ts'

const HEADERS = createFakeHeaders({ origin: 'https://youtube.com', host: 'youtube.com' })

const isValidVideoTitle = (videoName: string, query: string) => {
    const keywords = ['cover', 'remix', 'playlist', 'double', 'dual']
    const check = keywords.every((keyword) => {
        if (
            videoName.toLowerCase().includes(keyword) && !query.toLowerCase().includes(keyword) ||
            !videoName.toLowerCase().includes(keyword) && query.toLowerCase().includes(keyword)
        ) {
            return false
        }
        return true
    })
    return check
}

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
        .map((content: any) => {
            const videoRenderer = content.videoRenderer

            if (!videoRenderer) {
                return null
            }

            const videoId = videoRenderer.videoId as string
            const title = videoRenderer.title.runs[0].text as string
            const length = (videoRenderer.lengthText?.simpleText as string).split(':').reduce((acc, v, i, a) => {
                return acc + parseInt(v) * Math.pow(60, a.length - i - 1)
            }, 0) // 0:30 / 2:55 / 1:45:33

            if (length > 7200) return null

            const viewCount = parseInt(
                (videoRenderer.viewCountText?.simpleText as string).match(/((\d\s*)+)/)?.[0]
                    ?.replaceAll(/\s/g, '') ?? '0',
            )

            if (!isValidVideoTitle(title, query)) {
                return null
            }

            return {
                videoId,
                title,
                length,
                viewCount,
            }
        }).filter(Boolean) as {
            videoId: string
            title: string
            length: number
            viewCount: number
        }[]

    return videos.at(0)
}

if (import.meta.main) {
    const res = await searchVideos('BONES - LooseScrew')
    console.log(res)
}

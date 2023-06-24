import ytdl from 'ytdl'

export const ytdlDownload = async (videoId: string) => {
    const stream = await ytdl(videoId, {
        quality: 'highestaudio',
    })

    const chunks: Uint8Array[] = []

    for await (const chunk of stream) {
        chunks.push(chunk)
    }

    const blob = new Blob(chunks)
    await Deno.writeFile(`${videoId}.webm`, new Uint8Array(await blob.arrayBuffer()))
    return { id: videoId }
}

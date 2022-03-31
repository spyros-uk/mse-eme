export { getVideoTestSegments, getAudioTestSegments }

const BASE_URL = "http://localhost:4000/dash/number/"

async function downloadSegment(url: string): Promise<Uint8Array> {
  const headers: HeadersInit = {}
  const response = await fetch(url, { headers })
  const arrayBufferResponse = await response.arrayBuffer()
  return new Uint8Array(arrayBufferResponse)
}

async function getVideoTestSegments(): Promise<ArrayBuffer[]> {
  return getTestSegments([
    "video_6500000/init.mp4",
    "video_6500000/1.mp4",
    "video_6500000/2.mp4",
    "video_6500000/3.mp4",
    "video_6500000/4.mp4",
    "video_6500000/5.mp4",
    "video_6500000/6.mp4",
  ])
}

async function getAudioTestSegments(): Promise<ArrayBuffer[]> {
  return getTestSegments([
    "audio_128000/init.mp4",
    "audio_128000/1.mp4",
    "audio_128000/2.mp4",
    "audio_128000/3.mp4",
    "audio_128000/4.mp4",
    "audio_128000/5.mp4",
    "audio_128000/6.mp4",
  ])
}

async function getTestSegments(list: string[]): Promise<ArrayBuffer[]> {
  const segments = []

  for (const segmentName of list) {
    segments.push(downloadSegment(BASE_URL + segmentName))
  }

  return await Promise.all(segments)
}

export { getVideoTestSegments, getAudioTestSegments }

async function getSegment(url: string): Promise<Uint8Array> {
  const headers: HeadersInit = {}
  const response = await fetch(url, { headers })
  const arrayBufferResponse = await response.arrayBuffer()
  return new Uint8Array(arrayBufferResponse)
}

async function getVideoTestSegments(): Promise<ArrayBuffer[]> {
  const BASE_URL = "http://localhost:4000/dash/number/"
  const segmentNames = [
    "video_6500000/init.mp4",
    "video_6500000/1.mp4",
    "video_6500000/2.mp4",
    "video_6500000/3.mp4",
    "video_6500000/4.mp4",
    "video_6500000/5.mp4",
    "video_6500000/6.mp4",
  ]
  const segments = []

  for (const segmentName of segmentNames) {
    const segment = getSegment(BASE_URL + segmentName)
    segments.push(segment)
  }

  return await Promise.all(segments)
}

async function getAudioTestSegments(): Promise<ArrayBuffer[]> {
  const BASE_URL = "http://localhost:4000/dash/number/"
  const segmentNames = [
    "audio_128000/init.mp4",
    "audio_128000/1.mp4",
    "audio_128000/2.mp4",
    "audio_128000/3.mp4",
    "audio_128000/4.mp4",
    "audio_128000/5.mp4",
    "audio_128000/6.mp4",
  ]
  const segments = []

  for (const segmentName of segmentNames) {
    const segment = getSegment(BASE_URL + segmentName)
    segments.push(segment)
  }

  return await Promise.all(segments)
}

import { createAndAppendVideoElement } from "./domManager"
import { attachMediaSource, signalEndOfStream } from "./mediaSourceManager"
import {
  appendSegmentToSourceBuffer,
  attachAudioSourceBuffer,
  attachVideoSourceBuffer,
  removeSourceBuffer,
} from "./souceBufferManager"
import { getAudioTestSegments, getVideoTestSegments } from "./downloader"
import { promiseFromDomEvent } from "./utils/promiseFromDomEvent"

export { createPlayer }

async function createPlayer(wrapperElement: Element) {
  const videoElement = createAndAppendVideoElement(wrapperElement)
  const mediaSource = await attachMediaSource(videoElement)
  const videoSourceBuffer = attachVideoSourceBuffer(mediaSource)
  const audioSourceBuffer = attachAudioSourceBuffer(mediaSource)

  const videoSegments = await getVideoTestSegments()
  const audioSegments = await getAudioTestSegments()

  for (const videoSegment of videoSegments) {
    await appendSegmentToSourceBuffer(videoSegment, videoSourceBuffer)
  }

  for (const audioSegment of audioSegments) {
    await appendSegmentToSourceBuffer(audioSegment, audioSourceBuffer)
  }

  signalEndOfStream(mediaSource)

  await videoElement.play()

  await promiseFromDomEvent(videoElement, "ended")
  removeSourceBuffer(mediaSource, videoSourceBuffer)
  removeSourceBuffer(mediaSource, audioSourceBuffer)
}

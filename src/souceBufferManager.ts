import { promiseFromDomEvent } from "./utils/promiseFromDomEvent"

export {
  attachVideoSourceBuffer,
  attachAudioSourceBuffer,
  removeSourceBuffer,
  appendSegmentToSourceBuffer,
}

function attachVideoSourceBuffer(
  mediaSource: MediaSource,
  mimeType: string = 'video/mp4;codecs="avc1.4d4020"'
): SourceBuffer {
  return checkMimetypeSupportAndAttachSourceBuffer(mediaSource, mimeType)
}

function attachAudioSourceBuffer(
  mediaSource: MediaSource,
  mimeType: string = 'audio/mp4;codecs="mp4a.40.2"'
): SourceBuffer {
  return checkMimetypeSupportAndAttachSourceBuffer(mediaSource, mimeType)
}

function checkMimetypeSupportAndAttachSourceBuffer(
  mediaSource: MediaSource,
  mimeType: string
): SourceBuffer {
  if (!isMimeTypeSupported(mediaSource, mimeType)) return null
  return attachSourceBuffer(mediaSource, mimeType)
}

function isMimeTypeSupported(
  mediaSource: MediaSource,
  mimeType: string
): boolean {
  if (MediaSource.isTypeSupported(mimeType)) return true

  console.error(`Mime type "${mimeType}" is not supported by this browser`)
  return false
}

function attachSourceBuffer(
  mediaSource: MediaSource,
  mimeType: string
): SourceBuffer {
  return mediaSource.addSourceBuffer(mimeType)
}

function removeSourceBuffer(
  mediaSource: MediaSource,
  sourceBuffer: SourceBuffer
): void {
  return mediaSource.removeSourceBuffer(sourceBuffer)
}

async function appendSegmentToSourceBuffer(
  segment: ArrayBuffer,
  sourceBuffer: SourceBuffer
): Promise<Event> {
  try {
    sourceBuffer.appendBuffer(segment)
    return await promiseFromDomEvent(sourceBuffer, "updateend")
  } catch (e) {
    console.error(e)
  }
}

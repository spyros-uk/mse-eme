import { promiseFromDomEvent } from "./utils/promiseFromDomEvent"

export { attachMediaSource, signalEndOfStream }

async function attachMediaSource(
  videoElement: HTMLVideoElement,
  mediaSource: MediaSource = new MediaSource()
): Promise<MediaSource> {
  checkMediaSourceSupport()

  videoElement.src = URL.createObjectURL(mediaSource)
  await promiseFromDomEvent(mediaSource, "sourceopen")

  return mediaSource
}

function signalEndOfStream(mediaSource: MediaSource): void {
  mediaSource.endOfStream()
}

function checkMediaSourceSupport(): Error | void {
  if (!window.MediaSource)
    throw new Error("MSE is not supported on this browser")
}

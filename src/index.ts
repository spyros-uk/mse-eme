export { createPlayer }

const DEFAULT_AUDIO_MIME = 'audio/mp4;codecs="mp4a.40.2"'
const DEFAULT_VIDEO_MIME = 'video/mp4;codecs="avc1.4d4020"'

async function createPlayer(wrapperElement: Element) {
  console.log("Create player")
  const videoElement = createAndAppendVideoElement(wrapperElement)
  const mediaSource = await attachMediaSource(videoElement)
  console.log(videoElement, mediaSource)
  // TODO: Attach source buffers
}

function createAndAppendVideoElement(wrapperElement: Element) {
  const videoElement = document.createElement("video")
  wrapperElement.append(videoElement)
  return videoElement
}

async function attachMediaSource(
  videoElement: HTMLVideoElement
): Promise<MediaSource> {
  const mediaSource = new MediaSource()
  videoElement.src = URL.createObjectURL(mediaSource)

  await promiseFromDomEvent(mediaSource, "sourceopen")
  return mediaSource
}

function promiseFromDomEvent(target: EventTarget, eventName: string) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject, 10000)
    target.addEventListener(eventName, (e) => {
      clearTimeout(timeout)
      resolve(e)
    })
  })
}

import { promiseFromDomEvent } from "./utils/promiseFromDomEvent"

export { play, hasVideoEnded }

async function play(videoElement: HTMLVideoElement): Promise<void> {
  return videoElement.play()
}

async function hasVideoEnded(videoElement: HTMLVideoElement): Promise<Event> {
  return await promiseFromDomEvent(videoElement, "ended")
}

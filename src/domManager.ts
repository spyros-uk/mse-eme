export { createAndAppendVideoElement }

function createAndAppendVideoElement(wrapperElement: Element) {
  const videoElement = document.createElement("video")
  wrapperElement.append(videoElement)
  return videoElement
}

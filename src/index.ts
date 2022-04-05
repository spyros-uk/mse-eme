import { createAndAppendVideoElement } from "./domManager"
import { attachMediaSource, signalEndOfStream } from "./mediaSourceManager"
import {
  appendSegmentToSourceBuffer,
  attachAudioSourceBuffer,
  attachVideoSourceBuffer,
  removeSourceBuffer,
} from "./souceBufferManager"
import {
  downloadLicenseKey,
  getAudioTestSegments,
  getVideoTestSegments,
} from "./downloader"
import { hasVideoEnded, play } from "./playbackManager"

export { createPlayer }

let ms

async function createPlayer(wrapperElement: Element) {
  const videoElement = createAndAppendVideoElement(wrapperElement)
  const mediaSource = await attachMediaSource(videoElement)
  const videoSourceBuffer = attachVideoSourceBuffer(mediaSource)
  const audioSourceBuffer = attachAudioSourceBuffer(mediaSource)

  ms = mediaSource

  if (!navigator.requestMediaKeySystemAccess)
    return console.error("No EME support from this browser")

  const config: MediaKeySystemConfiguration = {
    initDataTypes: ["cenc"],
    audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
    videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.4D401F"' }],
  }

  const mediaKeySystemAccess = await navigator.requestMediaKeySystemAccess(
    "com.widevine.alpha",
    [config]
  )

  const mediaKeys: MediaKeys = await mediaKeySystemAccess.createMediaKeys()

  try {
    await videoElement.setMediaKeys(mediaKeys)
  } catch (e) {
    console.error("EME failed")
  }

  videoElement.addEventListener(
    "encrypted",
    handleEncrypted(videoElement.mediaKeys)
  )

  const videoSegments = await getVideoTestSegments()
  // const audioSegments = await getAudioTestSegments()

  for (const videoSegment of videoSegments) {
    await appendSegmentToSourceBuffer(videoSegment, videoSourceBuffer)
  }

  // for (const audioSegment of audioSegments) {
  //   await appendSegmentToSourceBuffer(audioSegment, audioSourceBuffer)
  // }

  signalEndOfStream(mediaSource)
  console.log(mediaSource)

  await play(videoElement)
  //
  // await hasVideoEnded(videoElement)
  // removeSourceBuffer(mediaSource, videoSourceBuffer)
  // removeSourceBuffer(mediaSource, audioSourceBuffer)

  // Create media keys and set them in video element
  // Attach an "encrypted" event listener on video element
  // onEncrypted: prepare the request to license server
  // including the initData
}

function handleEncrypted(mediaKeys: MediaKeys) {
  return ({ initDataType, initData }: MediaEncryptedEvent) => {
    console.log("Media keys:", mediaKeys)
    console.log("Encrypted content", initDataType, initData)

    const session: MediaKeySession = mediaKeys.createSession()
    console.log("Session created", session, session.keyStatuses)

    session.addEventListener(
      "message",
      handleMediaKeySessionMessage(session, downloadLicenseKey)
    )

    return session.generateRequest(initDataType, initData)
  }
}

function handleMediaKeySessionMessage(
  session: MediaKeySession,
  downloadLicenseRequest
) {
  return async ({ messageType, message }: MediaKeyMessageEvent) => {
    console.log("Message:", messageType, message)
    const challenge = new Uint8Array(message)
    const key = await downloadLicenseRequest(challenge)
    await session.update(key)
    console.log("Session updated with key", key)

    return session
  }
}
//
// https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel-dash-widevine.ism/dash/
// https://widevine-proxy.appspot.com/proxy
//
//
// tears-of-steel-dash-widevine-audio_eng=128002.dash
// tears-of-steel-dash-widevine-video_eng=2200000-0.dash
// tears-of-steel-dash-widevine-audio_eng=128002-0.dash
// tears-of-steel-dash-widevine-video_eng=2200000-2400.dash
// tears-of-steel-dash-widevine-audio_eng=128002-190464.dash
// tears-of-steel-dash-widevine-video_eng=2200000-4800.dash
// tears-of-steel-dash-widevine-audio_eng=128002-381952.dash
// tears-of-steel-dash-widevine-video_eng=2200000-7200.dash
// tears-of-steel-dash-widevine-video_eng=2200000-9600.dash
// tears-of-steel-dash-widevine-video_eng=2200000-12000.dash
// tears-of-steel-dash-widevine-audio_eng=128002-574464.dash
// tears-of-steel-dash-widevine-audio_eng=128002-765952.dash
// tears-of-steel-dash-widevine-audio_eng=128002-958464.dash
// tears-of-steel-dash-widevine-video_eng=2200000-14400.dash
// tears-of-steel-dash-widevine-audio_eng=128002-1149952.dash
// tears-of-steel-dash-widevine-video_eng=2200000-16800.dash
// tears-of-steel-dash-widevine-video_eng=2200000-19200.dash
// tears-of-steel-dash-widevine-audio_eng=128002-1342464.dash
// tears-of-steel-dash-widevine-audio_eng=128002-1533952.dash
// tears-of-steel-dash-widevine-video_eng=2200000-21600.dash
// tears-of-steel-dash-widevine-video_eng=2200000-24000.dash
// tears-of-steel-dash-widevine-audio_eng=128002-1726464.dash
// tears-of-steel-dash-widevine-video_eng=2200000-26400.dash
// tears-of-steel-dash-widevine-audio_eng=128002-1917952.dash
// tears-of-steel-dash-widevine-audio_eng=128002-2110464.dash
// tears-of-steel-dash-widevine-video_eng=2200000-28800.dash
// tears-of-steel-dash-widevine-video_eng=2200000-31200.dash
// tears-of-steel-dash-widevine-audio_eng=128002-2301952.dash
// tears-of-steel-dash-widevine-video_eng=2200000-33600.dash
// tears-of-steel-dash-widevine-audio_eng=128002-2494464.dash
// tears-of-steel-dash-widevine-audio_eng=128002-2685952.dash
// tears-of-steel-dash-widevine-video_eng=2200000-36000.dash
// tears-of-steel-dash-widevine-audio_eng=128002-2878464.dash
// tears-of-steel-dash-widevine-audio_eng=128002-3069952.dash

const BASE_URL =
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel-dash-widevine.ism/dash/"

const DRM_PROXY = "https://widevine-proxy.appspot.com/proxy"

const videoSegmentList = [
  "tears-of-steel-dash-widevine-video_eng=2200000.dash",
  "tears-of-steel-dash-widevine-video_eng=2200000-0.dash",
  "tears-of-steel-dash-widevine-video_eng=2200000-2400.dash",
  "tears-of-steel-dash-widevine-video_eng=2200000-4800.dash",
  "tears-of-steel-dash-widevine-video_eng=2200000-7200.dash",
  "tears-of-steel-dash-widevine-video_eng=2200000-9600.dash",
  "tears-of-steel-dash-widevine-video_eng=2200000-12000.dash",
  "tears-of-steel-dash-widevine-video_eng=2200000-14400.dash",
  "tears-of-steel-dash-widevine-video_eng=2200000-16800.dash",
]

const audioSegmentList = [
  "tears-of-steel-dash-widevine-audio_eng=128002.dash",
  "tears-of-steel-dash-widevine-audio_eng=128002-0.dash",
  "tears-of-steel-dash-widevine-audio_eng=128002-190464.dash",
  "tears-of-steel-dash-widevine-audio_eng=128002-381952.dash",
  "tears-of-steel-dash-widevine-audio_eng=128002-574464.dash",
  "tears-of-steel-dash-widevine-audio_eng=128002-765952.dash",
  "tears-of-steel-dash-widevine-audio_eng=128002-958464.dash",
  "tears-of-steel-dash-widevine-audio_eng=128002-1149952.dash",
]

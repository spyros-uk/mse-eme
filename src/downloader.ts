export { downloadLicenseKey, getVideoTestSegments, getAudioTestSegments }

const BASE_URL = "http://192.168.8.2:4000/dash/number/"
// const BASE_URL = "http://192.168.8.2:4000/tos/"
const DRM_PROXY_URL = "https://widevine-proxy.appspot.com/proxy"
const IRDETO_PROXY_URL =
  "https://dazn-zero-backend.playback.dazn-test.com/streaming/drm/irdeto/wv?contentId=bitmovin&epid=bitmovin&bid=bitmovin"

async function downloadSegment(url: string): Promise<Uint8Array> {
  const headers: HeadersInit = {}
  const response = await fetch(url, { headers })
  const arrayBufferResponse = await response.arrayBuffer()
  return new Uint8Array(arrayBufferResponse)
}

async function downloadLicenseKey(message: ArrayBuffer): Promise<BufferSource> {
  const headers: HeadersInit = {
    authority: "drm.gateway.indazn.com",
    mode: "no-cors",
    "Content-Type": "application/octet-stream",
  }
  const response = await fetch(DRM_PROXY_URL, {
    headers,
    method: "POST",
    body: message,
  })
  const arrayBufferResponse = await response.arrayBuffer()
  return new Uint8Array(arrayBufferResponse)
}

async function getVideoTestSegments(): Promise<ArrayBuffer[]> {
  const daznProd = [
    "video/dazn-dc1-encrypted_video_1_5_init.mp4",
    "video/dazn-dc1-encrypted_video_1_5_1.mp4",
    "video/dazn-dc1-encrypted_video_1_5_2.mp4",
    // "video/dazn-dc1-encrypted_video_1_5_3.mp4",
    // "video/dazn-dc1-encrypted_video_1_5_4.mp4",
    // "video/dazn-dc1-encrypted_video_1_5_5.mp4",
  ]

  const drm = [
    "video/tears-of-steel-dash-widevine-video_eng=2200000.dash",
    "video/tears-of-steel-dash-widevine-video_eng=2200000-0.dash",
    "video/tears-of-steel-dash-widevine-video_eng=2200000-2400.dash",
    "video/tears-of-steel-dash-widevine-video_eng=2200000-4800.dash",
    "video/tears-of-steel-dash-widevine-video_eng=2200000-7200.dash",
    "video/tears-of-steel-dash-widevine-video_eng=2200000-9600.dash",
    "video/tears-of-steel-dash-widevine-video_eng=2200000-12000.dash",
    "video/tears-of-steel-dash-widevine-video_eng=2200000-14400.dash",
    "video/tears-of-steel-dash-widevine-video_eng=2200000-16800.dash",
  ]

  const nonDrm = [
    "video_6500000/init.mp4",
    "video_6500000/1.mp4",
    "video_6500000/2.mp4",
    "video_6500000/3.mp4",
    "video_6500000/4.mp4",
    "video_6500000/5.mp4",
    "video_6500000/6.mp4",
  ]

  return getTestSegments(nonDrm)
}

async function getAudioTestSegments(): Promise<ArrayBuffer[]> {
  const drm = [
    "audio/tears-of-steel-dash-widevine-audio_eng=128002.dash",
    "audio/tears-of-steel-dash-widevine-audio_eng=128002-0.dash",
    "audio/tears-of-steel-dash-widevine-audio_eng=128002-190464.dash",
    "audio/tears-of-steel-dash-widevine-audio_eng=128002-381952.dash",
    "audio/tears-of-steel-dash-widevine-audio_eng=128002-574464.dash",
    "audio/tears-of-steel-dash-widevine-audio_eng=128002-765952.dash",
    "audio/tears-of-steel-dash-widevine-audio_eng=128002-958464.dash",
    "audio/tears-of-steel-dash-widevine-audio_eng=128002-1149952.dash",
  ]

  const nonDrm = [
    "audio_128000/init.mp4",
    "audio_128000/1.mp4",
    "audio_128000/2.mp4",
    "audio_128000/3.mp4",
    "audio_128000/4.mp4",
    "audio_128000/5.mp4",
    "audio_128000/6.mp4",
  ]

  return getTestSegments(drm)
}

async function getTestSegments(list: string[]): Promise<ArrayBuffer[]> {
  const segments = []

  for (const segmentName of list) {
    segments.push(downloadSegment(BASE_URL + segmentName))
  }

  return await Promise.all(segments)
}

// https://dc1vodmoondazn.akamaized.net/out/u/DC1_yyeyowneqyf71coyrq2b36f2n_BOX_MRB_FEATURE_220323_InTheRing_GGG_Murata_en_1648030197561-encrypted_video_1_5_init.mp4?m=1648030340
// https://dc1vodmoondazn.akamaized.net/out/u/DC1_yyeyowneqyf71coyrq2b36f2n_BOX_MRB_FEATURE_220323_InTheRing_GGG_Murata_en_1648030197561-encrypted_video_1_5_1.mp4?m=1648030340
// https://dc1vodmoondazn.akamaized.net/out/u/DC1_yyeyowneqyf71coyrq2b36f2n_BOX_MRB_FEATURE_220323_InTheRing_GGG_Murata_en_1648030197561-encrypted_video_1_5_2.mp4?m=1648030340
// https://dc1vodmoondazn.akamaized.net/out/u/DC1_yyeyowneqyf71coyrq2b36f2n_BOX_MRB_FEATURE_220323_InTheRing_GGG_Murata_en_1648030197561-encrypted_video_1_5_3.mp4?m=1648030340
// https://dc1vodmoondazn.akamaized.net/out/u/DC1_yyeyowneqyf71coyrq2b36f2n_BOX_MRB_FEATURE_220323_InTheRing_GGG_Murata_en_1648030197561-encrypted_video_1_5_4.mp4?m=1648030340
// https://dc1vodmoondazn.akamaized.net/out/u/DC1_yyeyowneqyf71coyrq2b36f2n_BOX_MRB_FEATURE_220323_InTheRing_GGG_Murata_en_1648030197561-encrypted_video_1_5_5.mp4?m=1648030340

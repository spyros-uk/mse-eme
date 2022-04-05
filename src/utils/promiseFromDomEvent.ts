export { promiseFromDomEvent }

async function promiseFromDomEvent<T>(
  target: EventTarget,
  eventName: string,
  timeout: number = 10000
) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject, timeout)
    target.addEventListener(eventName, (e) => {
      clearTimeout(timeoutId)
      resolve(e)
    })
  })
}

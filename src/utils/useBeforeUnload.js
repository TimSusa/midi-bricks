import { useRef, useEffect } from 'react'

export const useBeforeUnload = (fn, doAddListener) => {
  const cb = useRef(fn) // init with fn, so that type checkers won't assume that current might be undefined

  useEffect(() => {
    cb.current = fn
  }, [fn])

  useEffect(() => {
    const onUnload = cb.current

    doAddListener && window.addEventListener('beforeunload', onUnload)

    return () => window.removeEventListener('beforeunload', onUnload)
  }, [doAddListener])
}

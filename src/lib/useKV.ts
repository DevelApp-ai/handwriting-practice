import { useState, useCallback, useEffect, useMemo } from 'react'

function readStored<T>(key: string): T | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return undefined
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

function writeStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / serialization errors
  }
}

function removeStored(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export function useKV<T = string>(
  key: string,
  initialValue?: T
): readonly [T | undefined, (newValue: T | ((oldValue?: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T | undefined>(() => {
    const stored = readStored<T>(key)
    return stored === undefined ? initialValue : stored
  })

  useEffect(() => {
    const stored = readStored<T>(key)
    setValue(stored === undefined ? initialValue : stored)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (event: StorageEvent) => {
      if (event.key !== key) return
      if (event.newValue === null) {
        setValue(undefined)
        return
      }
      try {
        setValue(JSON.parse(event.newValue) as T)
      } catch {
        // ignore malformed cross-tab updates
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key])

  const userSetValue = useCallback(
    (newValue: T | ((oldValue?: T) => T)) => {
      setValue((current) => {
        const next =
          typeof newValue === 'function'
            ? (newValue as (oldValue?: T) => T)(current ?? initialValue)
            : newValue
        writeStored(key, next)
        return next
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  )

  const deleteValue = useCallback(() => {
    removeStored(key)
    setValue(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return useMemo(() => [value, userSetValue, deleteValue] as const, [value, userSetValue, deleteValue])
}

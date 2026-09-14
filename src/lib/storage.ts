import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'mgos'

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const raw = window.localStorage.getItem(`${PREFIX}.${key}`)
    return raw ? (JSON.parse(raw) as T) : initialValue
  } catch {
    return initialValue
  }
}

/**
 * localStorage-backed state. Every module's data lives entirely on-device;
 * changes made in one tab are broadcast to other tabs via the storage event.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const storageKey = `${PREFIX}.${key}`
  const [value, setValue] = useState<T>(() => readValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // storage full or unavailable — fail silently, data stays in-memory
    }
  }, [storageKey, value])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== storageKey || e.newValue == null) return
      try {
        setValue(JSON.parse(e.newValue) as T)
      } catch {
        /* ignore malformed payloads */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset] as const
}

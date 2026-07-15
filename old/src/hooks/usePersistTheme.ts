import { Dispatch, useEffect, useState } from "react";

type Response<T> = [T, Dispatch<React.SetStateAction<T>>]

function usePersistTheme<T>(key: string, initialValue: T): Response<T> {
  const [value, setValue] = useState(() => {
    const storageValue = localStorage.getItem(key)

    if(storageValue) {
      return JSON.parse(storageValue)
    } else {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default usePersistTheme
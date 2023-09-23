import { useState, useEffect } from 'react'

export function useLangage() {
    const [langage, setLangage] = useState(JSON.parse(localStorage.getItem('language')))

    useEffect(() => {
        setLangage(JSON.parse(localStorage.getItem('language')))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localStorage.getItem('language')])

    const getLang = (key) => {
        return langage?.[key]
    }

    return { getLang }
}
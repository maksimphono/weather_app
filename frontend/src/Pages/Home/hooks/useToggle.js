import React, {useState, useCallback} from "react"

export default function useToggle(items) {
    if (items.length > 2) 
        throw new Error("Only two items are allowed in useToggle")
    const [state, setState] = useState(items[0])

    const toggle = useCallback(() => {
        const index = state === items[0]? 1 : 0
        setState(items[index])
    }, [items])

    return [state, toggle]
}
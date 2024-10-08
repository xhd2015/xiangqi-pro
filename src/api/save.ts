


export async function saveStep(name: string, data: string): Promise<void> {
    await fetch("/api/step/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, data })
    })
}


export async function getStep(name: string): Promise<string> {
    const resp = await fetch("/api/step/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    })
    return await resp.text()
}

export async function listStep(): Promise<string[]> {
    const resp = await fetch("/api/step/list", {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return resp.json()
}
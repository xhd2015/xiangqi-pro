

export async function evalScore(fen: string, player: string): Promise<number> {
    const res = await fetch("/api/eval?fen=" + encodeURIComponent(fen) + "&player=" + encodeURIComponent(player || "")).then(resp => resp.text())
    return Number(res)
}

import { ChessPiece, Camp, Role } from "@/lib/chess/def"

// FEN: https://www.pikafish.com/wiki/index.php?title=FEN%EF%BC%88%E5%B1%80%E9%9D%A2%E7%A0%81%EF%BC%89%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F
// example:
//  3k1a3/4a4/5n3/9/9/9/9/9/9/4KR3 w
// NOTION:
//   number: no pieces
//   k(lower case): black pieces
//   K(upper case): red pieces
//   w RED first
//   b BLACK first

// initial FEN:
//   RNBAKABNR/9/1C5C1/P1P1P1P1P/9/9/p1p1p1p1p/1c5c1/9/rnbakabnr w

// front C:
//  RNBAKABNR/9/1C2C4/P1P3P1P/9/9/p1p3p1p/1c5c1/9/rnbakabnr w

// front c:
//  RNBAKABNR/9/1C5C1/P1P3P1P/9/9/p1p3p1p/1c2c4/9/rnbakabnr
//
// endgame:
//  3A1AB2/1c7/4K4/P7P/7p1/4C4/p4P3/4b4/4a4/4ka3


export const FEN_INIT = "RNBAKABNR/9/1C5C1/P1P1P1P1P/9/9/p1p1p1p1p/1c5c1/9/rnbakabnr"

export const roleLetterMapping: Record<Role, string> = {
    [Role.Chariot]: "R",
    [Role.Horse]: "N",
    [Role.Elephant]: "B",
    [Role.Advisor]: "A",
    [Role.General]: "K",
    [Role.Cannon]: "C",
    [Role.Pawn]: "P",
}
export const letterToRole: Record<string, Role> = (() => {
    const m: Record<string, Role> = {}
    for (let k in roleLetterMapping) {
        m[roleLetterMapping[k]] = Number(k) as Role
    }
    return m
})();

const N_ROWS = 10

export function parseFEN(fen: string): ChessPiece[][] {
    const positions: ChessPiece[][] = Array(N_ROWS).fill(null)
    const rows = fen.split("/")
    for (let i = 0; i < N_ROWS; i++) {
        const row = rows?.[i]
        if (row) {
            positions[N_ROWS - 1 - i] = parseRow(row)
        }
    }
    return positions
}

export function toFEN(positions: ChessPiece[][]): string {
    // detect rows
    let fenRows = []
    for (let i = 9; i >= 0; i--) {
        fenRows.push(rowToFEN(positions?.[i]))
    }
    let reverse = false

    // find RED or BLACK general
    // 0,3; 0,4, 05
    for (let i = 0; i <= 2; i++) {
        for (let j = 3; j <= 5; j++) {
            const p = positions?.[i]?.[j]
            if (p != null && p.role === Role.General) {
                if (p.camp === Camp.RED) {
                    reverse = true
                }
                break
            }
        }
    }
    if (reverse) {
        fenRows.reverse()
    }
    return fenRows.join("/")
}

export function rowToFEN(row: ChessPiece[]): string {
    if (row == null) {
        return "9"
    }
    let pieces = []
    let ns = 0
    for (let i = 0; i < 9; i++) {
        const p = row?.[i]
        if (p == null) {
            ns++
            continue
        }
        if (ns > 0) {
            pieces.push(String(ns))
            ns = 0
        }
        pieces.push(pieceToFEN(p))
    }
    if (ns > 0) {
        pieces.push(String(ns))
    }
    return pieces.join('')
}

export function pieceToFEN(p: ChessPiece): string {
    const letter = roleLetterMapping[p.role]
    if (!letter) {
        return null
    }
    if (p.camp === Camp.RED) {
        return letter
    }
    return letter.toLowerCase()
}


export function parseRow(row: string): ChessPiece[] {
    const pieces: ChessPiece[] = []
    for (let i = 0; i < row.length; i++) {
        const c = row[i]
        if (c >= '0' && c <= '9') {
            const ns = Number(c)
            for (let j = 0; j < ns; j++) {
                pieces.push(null)
            }
            continue
        }
        const up = c.toUpperCase()
        const role = letterToRole[up]
        pieces.push({
            camp: c == up ? Camp.RED : Camp.BLACK,
            role: role,
        })
    }
    return pieces
}
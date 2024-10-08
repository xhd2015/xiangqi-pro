import { ChessPiece, BoardLocation, StatefulPiece, switchCamp } from "./def"

export function mapPositions<T>(positions: StatefulPiece<T>[][], f: (row: number, col: number, piece: StatefulPiece<T>) => StatefulPiece<T>): StatefulPiece<T>[][] {
    return positions?.map?.((row, i) => {
        return row?.map?.((col, j) => {
            return f(i, j, col)
        })
    })
}

export function move<T>(positions: StatefulPiece<T>[][], src: BoardLocation, dst: BoardLocation): StatefulPiece<T>[][] {
    if (src.row === dst.row && src.col === dst.col) {
        return positions
    }
    return mapPositions(positions, (row, col, piece) => {
        if (row === src.row && col === src.col) {
            return null
        }
        if (row === dst.row && col === dst.col) {
            return positions[src.row][src.col]
        }
        return piece
    })
}

export function clone<T>(positions: StatefulPiece<T>[][]): StatefulPiece<T>[][] {
    return mapPositions(positions, (r, c, p) => {
        if (p == null) {
            return null
        }
        return { ...p }
    })
}

export function flip<T>(positions: StatefulPiece<T>[][]) {
    exchangeRow(positions, true)
}

export function turn<T>(positions: StatefulPiece<T>[][]) {
    exchangeRow(positions, false)
}

export function mirror<T>(positions: StatefulPiece<T>[][]) {
    if (positions == null) {
        return null
    }
    // exchange row with 9-row
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j <= 3; j++) {
            const p = positions?.[i]?.[j]
            const revP = positions?.[i]?.[8 - j]
            if (p == null && revP == null) {
                continue
            }
            setPiece(positions, i, j, revP)
            setPiece(positions, i, 8 - j, p)
        }
    }
}


function exchangeRow<T>(positions: StatefulPiece<T>[][], changeCamp?: boolean) {
    if (positions == null) {
        return null
    }
    // exchange row with 9-row
    for (let i = 0; i <= 4; i++) {
        for (let j = 0; j < 9; j++) {
            const p = positions?.[i]?.[j]
            const revP = positions?.[9 - i]?.[j]
            if (p == null && revP == null) {
                continue
            }
            if (changeCamp) {
                if (p != null) {
                    p.camp = switchCamp(p.camp)
                }
                if (revP != null) {
                    revP.camp = switchCamp(revP.camp)
                }
            }
            setPiece(positions, i, j, revP)
            setPiece(positions, 9 - i, j, p)
        }
    }
}

export function setPiece<T>(positions: StatefulPiece<T>[][], row: number, col: number, p: StatefulPiece<T>) {
    const extraRow = row - positions.length + 1
    if (extraRow > 0) {
        positions.push(...Array(extraRow).fill(null))
    }
    let srcRow = positions[row]
    if (srcRow == null) {
        srcRow = []
        positions[row] = srcRow
    }
    const extraCol = col - srcRow.length + 1
    if (extraCol > 0) {
        srcRow.push(...Array(extraCol).fill(null))
    }
    srcRow[col] = p
}
export enum Camp {
    RED = 0,
    BLACK = 1,
}
export enum Role {
    Chariot,
    Horse,
    Elephant,
    Advisor,
    General,
    Cannon,
    Pawn,
}

export interface BoardLocation {
    row: number
    col: number
}

export interface ChessPiece {
    camp: Camp
    role: Role
}

export interface StatefulPiece<T> extends ChessPiece {
    state?: T
}

export const redRoleTextMapping: Record<Role, string> = {
    [Role.Chariot]: "车",
    [Role.Horse]: "马",
    [Role.Elephant]: "相",
    [Role.Advisor]: "仕",
    [Role.General]: "帅",
    [Role.Cannon]: "炮",
    [Role.Pawn]: "兵",
}

export const blackRoleTextMapping: Record<Role, string> = {
    [Role.Chariot]: "車",
    [Role.Horse]: "馬",
    [Role.Elephant]: "象",
    [Role.Advisor]: "士",
    [Role.General]: "将",
    [Role.Cannon]: "砲",
    [Role.Pawn]: "卒",
}

// lightblue like
export const selectedColor = "rgb(176, 224, 230)"

const NUM_COL = 9

export function makeEmptyCols() {
    return Array(NUM_COL).fill(null)
}

export function createInitialPositions(): ChessPiece[][] {
    return [
        [
            { camp: Camp.BLACK, role: Role.Chariot },
            { camp: Camp.BLACK, role: Role.Horse },
            { camp: Camp.BLACK, role: Role.Elephant },
            { camp: Camp.BLACK, role: Role.Advisor },
            { camp: Camp.BLACK, role: Role.General },
            { camp: Camp.BLACK, role: Role.Advisor },
            { camp: Camp.BLACK, role: Role.Elephant },
            { camp: Camp.BLACK, role: Role.Horse },
            { camp: Camp.BLACK, role: Role.Chariot },
        ],
        makeEmptyCols(),
        [
            null,
            { camp: Camp.BLACK, role: Role.Cannon },
            null,
            null,
            null,
            null,
            null,
            { camp: Camp.BLACK, role: Role.Cannon },
            null,
        ],
        [
            { camp: Camp.BLACK, role: Role.Pawn },
            null,
            { camp: Camp.BLACK, role: Role.Pawn },
            null,
            { camp: Camp.BLACK, role: Role.Pawn },
            null,
            { camp: Camp.BLACK, role: Role.Pawn },
            null,
            { camp: Camp.BLACK, role: Role.Pawn },
        ],
        makeEmptyCols(),
        makeEmptyCols(),
        [
            { camp: Camp.RED, role: Role.Pawn },
            null,
            { camp: Camp.RED, role: Role.Pawn },
            null,
            { camp: Camp.RED, role: Role.Pawn },
            null,
            { camp: Camp.RED, role: Role.Pawn },
            null,
            { camp: Camp.RED, role: Role.Pawn },
        ],
        [
            null,
            { camp: Camp.RED, role: Role.Cannon },
            null,
            null,
            null,
            null,
            null,
            { camp: Camp.RED, role: Role.Cannon },
            null,
        ],
        makeEmptyCols(),
        [
            { camp: Camp.RED, role: Role.Chariot },
            { camp: Camp.RED, role: Role.Horse },
            { camp: Camp.RED, role: Role.Elephant },
            { camp: Camp.RED, role: Role.Advisor },
            { camp: Camp.RED, role: Role.General },
            { camp: Camp.RED, role: Role.Advisor },
            { camp: Camp.RED, role: Role.Elephant },
            { camp: Camp.RED, role: Role.Horse },
            { camp: Camp.RED, role: Role.Chariot },
        ],
    ]
}
export const initPositions = createInitialPositions()

export function switchCamp(c: Camp): Camp {
    if (c === Camp.BLACK) {
        return Camp.RED
    }
    return Camp.BLACK
}

export function getChessText(piece: ChessPiece): string {
    let m = redRoleTextMapping
    if (piece?.camp === Camp.BLACK) {
        m = blackRoleTextMapping
    }
    return m[piece?.role]
}

export function isSamePiece(a: ChessPiece, b: ChessPiece) {
    return a.camp === b.camp && a.role === b.role
}
export function isSameLocation(a: BoardLocation, b: BoardLocation) {
    return a.row === b.row && a.col === b.col
}
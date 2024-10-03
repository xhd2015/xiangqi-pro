


export enum Camp {
    RED = 0,
    BLACK = 1,
}
export enum Role {
    Chariot,
    Horse,
    Elephant,
    Guard,
    General,
    Cannon,
    Pawn,
}

export interface Location {
    row: number
    col: number
}

export interface BasicChessPiece {
    camp: Camp
    role: Role
}
export interface PieceLocation extends BasicChessPiece, Location {

}

export const redRoleTextMapping: Record<Role, string> = {
    [Role.Chariot]: "车",
    [Role.Horse]: "马",
    [Role.Elephant]: "相",
    [Role.Guard]: "仕",
    [Role.General]: "帅",
    [Role.Cannon]: "炮",
    [Role.Pawn]: "兵",
}

export const blackRoleTextMapping: Record<Role, string> = {
    [Role.Chariot]: "車",
    [Role.Horse]: "馬",
    [Role.Elephant]: "象",
    [Role.Guard]: "士",
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

export function createInitialPositions(): BasicChessPiece[][] {
    return [
        [
            { camp: Camp.BLACK, role: Role.Chariot },
            { camp: Camp.BLACK, role: Role.Horse },
            { camp: Camp.BLACK, role: Role.Elephant },
            { camp: Camp.BLACK, role: Role.Guard },
            { camp: Camp.BLACK, role: Role.General },
            { camp: Camp.BLACK, role: Role.Guard },
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
            { camp: Camp.RED, role: Role.Guard },
            { camp: Camp.RED, role: Role.General },
            { camp: Camp.RED, role: Role.Guard },
            { camp: Camp.RED, role: Role.Elephant },
            { camp: Camp.RED, role: Role.Horse },
            { camp: Camp.RED, role: Role.Chariot },
        ],
    ]
}
export const initPositions = createInitialPositions()
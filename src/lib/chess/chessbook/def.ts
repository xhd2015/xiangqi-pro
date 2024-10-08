import { ChessPiece, BoardLocation, StatefulPiece } from "../def"

export enum FrontPiece {
    None,
    Front,
    Back,
}

export interface Step {
    name?: string
    description?: string

    piece: ChessPiece
    front?: FrontPiece

    move: Move
    nexts?: Step[]
}

export interface Move {
    from: BoardLocation
    to: BoardLocation
}


export interface StatedStep extends Omit<Step, "nexts"> {
    selected?: boolean
    collapsed?: boolean

    nexts?: StatedStep[]
}

export interface StatedPositionsStep<T> extends Omit<StatedStep, "nexts"> {
    positions?: StatefulPiece<T>[][]
    nexts?: StatedPositionsStep<T>[]
}


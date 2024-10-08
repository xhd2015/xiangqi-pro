import { parseFEN } from "@/lib/chess/fen"
import { useState } from "react"
import { BoardLocation, Camp, ChessPiece, initPositions, switchCamp } from "../lib/chess/def"
import { clone, flip, mapPositions, mirror, move, turn } from "../lib/chess/ops"
import { ChessBoardLayout, ChessBoardLayoutProps, Positions } from "./ChessBoardLayout"

export interface ChessBoardProps extends ChessBoardLayoutProps {
    onMove?: (piece: ChessPiece, from: BoardLocation, to: BoardLocation) => void
}

export function ChessBoard(props: ChessBoardProps) {
    const [playerCamp, setPlayerCamp] = useState(Camp.RED)
    const [placingCamp, setPlacingCamp] = useState(Camp.RED)
    const [selected, setSelected] = useState<BoardLocation>()

    const [positionsList, setPositionList] = useState<Positions[]>([initPositions])
    const [positionIdx, setPositionIdx] = useState(0)

    const appendPositions = (p: Positions) => {
        setPositionIdx(positionIdx + 1)
        setPositionList(l => [...l.slice(0, positionIdx + 1), p])
    }

    function clickPiece(row: number, col: number) {
        let from: ChessPiece = null
        if (selected != null) {
            from = positions?.[selected.row]?.[selected?.col]
        }
        const to = positions?.[row]?.[col]
        const action = movePiece(from, to, placingCamp)
        switch (action) {
            case MoveAction.EAT:
            case MoveAction.MOVE:
                const newPlacing = switchCamp(placingCamp)
                setPlacingCamp(newPlacing)
                appendPositions(move(positions, selected, { row, col }))
                setSelected(null)
                props.onMove?.(from, selected, { row, col })
                break
            case MoveAction.SELECT:
                setSelected({ row, col })
                break
            case MoveAction.UNSELECT:
                setSelected(null)
                break
        }
    }

    const positions = positionsList[positionIdx]
    return <ChessBoardLayout
        {...props}
        positions={positions}
        selected={selected}
        placingCamp={placingCamp}
        playerCamp={playerCamp}

        onClickPiece={clickPiece}
        onParseFen={(fen) => {
            appendPositions(parseFEN(fen))
            setSelected(null)
        }}

        backButtonDisabled={positionIdx - 1 < 0}
        onClickBack={() => {
            setPlacingCamp(switchCamp(placingCamp))
            setPositionIdx(positionIdx - 1)
        }}

        nextButtonDisabled={positionIdx + 1 >= positionsList?.length}
        onClickNext={() => {
            setPlacingCamp(switchCamp(placingCamp))
            setPositionIdx(positionIdx + 1)
        }}

        removeButtonDisabled={selected == null}
        onClickRemove={() => appendPositions(mapPositions(positions, (r, c, p) => {
            if (p == null) {
                return null
            }
            if (selected != null && selected.row == r && selected.col == c) {
                setSelected(null)
                return null
            }
            return p
        }))}

        onClickTurn={() => {
            const p = clone(positions)
            turn(p)
            setPlayerCamp(switchCamp(playerCamp))
            appendPositions(p)
        }}
        onClickFlip={() => {
            const p = clone(positions)
            flip(p)
            appendPositions(p)
            setPlacingCamp(switchCamp(placingCamp))
        }}
        onClickMirror={() => {
            const p = clone(positions)
            mirror(p)
            appendPositions(p)
        }}
        onClickReset={() => {
            let p = initPositions
            setPlacingCamp(Camp.RED)
            if (playerCamp === Camp.BLACK) {
                p = clone(p)
                turn(p)
            }
            setPositionIdx(0)
            setPositionList([p])
        }}
    />
}

export enum MoveAction {
    NONE,
    EAT,
    MOVE,
    SELECT,
    UNSELECT,
}

export function movePiece(from: ChessPiece, to: ChessPiece, placingCamp: Camp): MoveAction {
    if (to == null) {
        if (from != null) {
            return MoveAction.MOVE
        }
        return null
    }
    if (from === to) {
        return MoveAction.UNSELECT
    }
    if (from == null || from.camp === to.camp) {
        if (to.camp === placingCamp) {
            return MoveAction.SELECT
        }
        return null
    }
    return MoveAction.EAT
}
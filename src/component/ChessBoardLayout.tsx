import { toFEN } from "@/lib/chess/fen"
import { Badge, Button, Input } from "antd"
import { CSSProperties, useEffect, useMemo, useState } from "react"
import { BoardLocation, Camp, ChessPiece, selectedColor, StatefulPiece } from "../lib/chess/def"
import { mapPositions } from "../lib/chess/ops"
import { ChessLayout, PieceState } from "./ChessLayout"
import { evalScore } from "@/api/eval"

export type Positions = StatefulPiece<PieceState>[][]

export interface ChessBoardLayoutProps {
    style?: CSSProperties
    className?: string

    positions?: Positions
    selected?: BoardLocation
    placingCamp?: Camp
    playerCamp?: Camp

    chessAside?: any

    onClickPiece?: (row: number, col: number) => void

    onParseFen?: (fen: string) => void

    backButtonDisabled?: boolean
    onClickBack?: () => void

    nextButtonDisabled?: boolean
    onClickNext?: () => void

    removeButtonDisabled?: boolean
    onClickRemove?: () => void
    onClickTurn?: () => void
    onClickFlip?: () => void
    onClickMirror?: () => void
    onClickReset?: () => void
}

export function ChessBoardLayout(props: ChessBoardLayoutProps) {
    const { positions, placingCamp, playerCamp, selected } = props

    const [inputFen, setInputFen] = useState("")
    const [score, setScore] = useState(10)

    // render selected & not selected
    const styledPositions = useMemo(() => {
        return mapPositions(positions, (r, c, p) => {
            if (p == null) {
                return null
            }
            if (selected != null && selected.row == r && selected.col == c) {
                return { ...p, state: { ...p?.state, style: { backgroundColor: selectedColor } } }
            } else {
                return { ...p, state: { ...p?.state, style: undefined } }
            }
        })
    }, [positions, selected])
    const fen = useMemo(() => toFEN(positions), [positions])

    useEffect(() => {
        evalScore(fen + " " + (placingCamp === Camp.RED ? "w" : "b"), (playerCamp === Camp.RED ? "red" : "black")).then(setScore)
    }, [fen, placingCamp, playerCamp])

    const hideUnrelated = true

    return <div
        className={props.className}
        style={{
            // marginTop: "50px",
            // marginLeft: "100px",
            width: "650px",
            ...props.style
        }}
    >
        {
            !hideUnrelated && <>
                <Input.TextArea value={inputFen} onChange={e => setInputFen(e.target.value)} />
                <Button disabled={!inputFen}
                    onClick={() => {
                        props.onParseFen?.(inputFen)
                    }}
                >Parse FEN</Button>
                <div>
                    <span> <Badge color={placingCamp === Camp.RED ? "red" : "black"} ></Badge> Player</span>
                    <span style={{ marginLeft: "4px" }}>Score: {score}</span>
                </div>
            </>
        }

        <ChessLayout
            positions={styledPositions}
            onClickPiece={props.onClickPiece}
            foot={props.chessAside}
            size={40}
        />

        {
            !hideUnrelated && <>

                <div>
                    <Button style={{ marginLeft: "2px" }} onClick={props.onClickBack}
                        disabled={props.backButtonDisabled}
                    >Back</Button>

                    <Button style={{ marginLeft: "2px" }} onClick={props.onClickNext}
                        disabled={props.nextButtonDisabled}
                    >Next</Button>
                </div>

                <div>
                    <Button onClick={props.onClickRemove} disabled={props.removeButtonDisabled}
                    >Remove</Button>

                    <Button style={{ marginLeft: "2px" }} onClick={props.onClickTurn}>Turn</Button>

                    <Button style={{ marginLeft: "2px" }} onClick={props.onClickFlip}>Flip</Button>

                    <Button style={{ marginLeft: "2px" }} onClick={props.onClickMirror}>Mirror</Button>

                    <Button style={{ marginLeft: "2px" }} onClick={props.onClickReset}>Reset</Button>
                </div>

                <div>FEN:</div>
                <Input.TextArea readOnly value={fen} />
            </>
        }
    </div>
}
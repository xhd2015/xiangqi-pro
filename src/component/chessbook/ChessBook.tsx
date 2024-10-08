import { FrontPiece, Move, Step } from "@/lib/chess/chessbook/def"
import { BoardLocation, Camp, ChessPiece, getChessText } from "@/lib/chess/def"
import { CSSProperties } from "react"

export interface ChessBookProps {
    style?: CSSProperties
    className?: string
}

export function ChessBook(props: ChessBookProps) {
    return <div className={props.className} style={props.style}>{ }</div>
}

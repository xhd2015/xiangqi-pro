import { ChessBoard } from "@/component/ChessBoard"
import { CSSProperties } from "react"

export interface ChessLayoutDemoProps {
    style?: CSSProperties
    className?: string
}

export function ChessLayoutDemo(props: ChessLayoutDemoProps) {
    return <ChessBoard />
}
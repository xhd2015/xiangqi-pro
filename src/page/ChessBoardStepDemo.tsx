import { CSSProperties } from "react"
import { ChessBoardStep } from "./ChessBoardStep"

export interface ChessBoardStepDemoProps {
    style?: CSSProperties
    className?: string
}

export function ChessBoardStepDemo(props: ChessBoardStepDemoProps) {
    return <ChessBoardStep />
}
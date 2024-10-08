import { CSSProperties, useEffect, useMemo } from "react"
import { Camp, StatefulPiece, blackRoleTextMapping, redRoleTextMapping } from "../lib/chess/def"

const defaultSize = 65

export interface ChessLayoutProps {
    style?: CSSProperties
    className?: string

    positions?: StatefulPiece<PieceState>[][]
    size?: number

    onClickPiece?: (row: number, col: number, hasPiece: boolean) => void
    foot?: any
}

export interface PieceState {
    style?: CSSProperties
}

export function ChessLayout(props: ChessLayoutProps) {
    const size = props.size > 0 ? props.size : defaultSize
    const scale = size / defaultSize
    const halfSize = size / 2

    const positions = props.positions
    const boxStyle = { height: `${size}px`, width: `${size}px` }

    const rows = 10
    const cols = 9

    const maxHeight = size * rows
    const maxWidth = size * cols
    const halfRows = Math.floor(rows / 2)
    const halfCols = Math.floor(cols / 2)

    return <div className={props.className} style={{
        width: `${maxWidth}px`,
        height: `${maxHeight}px`,
        ...props.style
    }}>
        <div style={{
            position: "relative",
        }}>

            {/* background */}
            <div style={{
                backgroundColor: "#FFEBCD",
                position: "absolute",
                height: `${size * rows}px`,
                width: `${size * cols}px`,
                border: "1px solid black",
            }}>
            </div>

            {/* cross lines */}
            <CrossLine
                style={{
                    left: `${halfCols * size + halfSize}px`,
                    top: `${-0.44 * size + halfSize}px`,
                    height: `${2 * 1.44 * size}px`,
                }}
            />
            <CrossLine
                style={{
                    left: `${halfCols * size + halfSize}px`,
                    top: `${-0.44 * size + (rows - 3) * size + halfSize}px`,
                    height: `${2 * 1.44 * size}px`,
                }}
            />

            {/* special lines markers */}
            <table style={{
                border: "1px solid black", position: "absolute",
                left: `${halfSize}px`,
                top: `${halfSize}px`
            }}>
                <tbody>
                    {
                        Array(rows - 1).fill(0).map((_, i) => <tr key={i}>
                            {
                                Array(cols - 1).fill(0).map((_, j) => <Box key={j}
                                    style={{ border: i == 4 ? undefined : "1px solid black", ...boxStyle }}
                                />)
                            }
                        </tr>)
                    }
                </tbody>
            </table>

            <table style={{
                position: "absolute",
                // top: `${-halfSize}px`,
                // left: `${-halfSize}px`,
            }}>
                <tbody>
                    {
                        Array(rows).fill(0).map((_, i) => <tr key={i}>
                            {
                                Array(cols).fill(0).map((_, j) => {
                                    const piece = positions?.[i]?.[j]
                                    let el
                                    if (piece != null) {
                                        let color
                                        let tm
                                        if (piece.camp === Camp.RED) {
                                            color = "red"
                                            tm = redRoleTextMapping
                                        } else if (piece.camp === Camp.BLACK) {
                                            color = "black"
                                            tm = blackRoleTextMapping
                                        }
                                        const role = tm?.[piece.role]
                                        el = <Piece style={{
                                            color,
                                            ...piece.state?.style,
                                            ...(size === 30 ? {
                                                margin: "5px",
                                                height: "18px",
                                                width: "18px",
                                                fontSize: "0.9em",
                                                borderRadius: "9px",
                                            } : undefined),
                                            ...(size === 40 ? {
                                                margin: "5px",
                                                height: "28px",
                                                width: "28px",
                                                fontSize: "1.25em",
                                                borderRadius: "20px",
                                            } : undefined)
                                        }}
                                            onClick={() => {
                                                props.onClickPiece?.(i, j, true)
                                            }}
                                        >{role}</Piece>
                                    }
                                    return <Box key={j} style={{
                                        ...boxStyle,
                                        // display: "flex",
                                        // flexDirection: "column",
                                        // justifyContent: "center",
                                        // alignItems: "center",
                                        cursor: "pointer"
                                    }}
                                        onClick={() => {
                                            if (el == null) {
                                                props.onClickPiece?.(i, j, false)
                                            }
                                        }}
                                    >{el}</Box>
                                })
                            }
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
        <div style={{
            marginLeft: `${maxWidth}px`,
            width: "max-content",
        }}>
            {props.foot}
        </div>
    </div>
}

function Box(props: { children?: any, style?: CSSProperties, onClick?: () => void }) {
    return <td style={props.style}
        onClick={props.onClick}
    >
        {props.children}
    </td>
}

function Piece(props: { children?: any, style?: CSSProperties, onClick?: () => void }) {
    let scale = 1
    let size = 50 * scale
    const halfSize = size / 2
    return <div
        onClick={props.onClick}
        style={{
            margin: "5px",
            height: `${size}px`,
            width: `${size}px`,
            border: "1px solid black",
            borderRadius: `${halfSize}px`,
            textAlign: "center",
            fontFamily: "Cursive",
            fontSize: `${2.0 * scale}em`,
            backgroundColor: "#FAF0E6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            ...props.style,
        }}>{props.children}</div>
}

function SheerLine(props: { style?: CSSProperties }) {
    return <div style={{
        position: "absolute",
        width: "1px",
        backgroundColor: "black",
        transform: "rotate(45deg)",
        ...props.style,
    }} />
}

function CrossLine(props: { style?: CSSProperties }) {
    return <>
        <SheerLine
            style={{
                ...props.style,
                transform: "rotate(45deg)"
            }}
        />
        <SheerLine
            style={{
                ...props.style,
                transform: "rotate(135deg)"
            }}
        />
    </>
}

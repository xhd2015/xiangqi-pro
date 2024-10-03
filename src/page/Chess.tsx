import { CSSProperties, useState } from "react"
import { BasicChessPiece, blackRoleTextMapping, Camp, initPositions, redRoleTextMapping, selectedColor } from "./chess-def"

import { Location } from "./chess-def"

export interface ChessProps {
    style?: CSSProperties
    className?: string
}

export function Chess(props: ChessProps) {
    const basicWidth = 65
    const basicHeight = 65

    const halfWidth = basicWidth / 2
    const halfHeight = basicHeight / 2

    const boxStyle = { height: `${basicHeight}px`, width: `${basicWidth}px` }

    const [positions, setPositions] = useState(initPositions)

    const [selected, setSelected] = useState<Location>()

    return <div className={props.className} style={{
        position: "relative",

        marginTop: "50px",
        marginLeft: "100px",
        ...props.style
    }}>
        {/* background */}
        <div style={{
            backgroundColor: "#FFEBCD",
            position: "absolute",
            top: `${-halfWidth}px`,
            left: `${-halfHeight}px`,
            width: `${basicWidth * 9}px`,
            height: `${basicHeight * 10}px`,
            border: "1px solid black",
        }}>
        </div>

        {/* cross lines */}
        <div style={{
            position: "absolute",
            left: `${4 * basicWidth}px`,
            top: `${-0.44 * basicHeight}px`,
            height: `${2 * 1.44 * basicWidth}px`,
            width: "1px",
            backgroundColor: "black",
            transform: "rotate(45deg)",
        }} />

        <div style={{
            position: "absolute",
            left: `${4 * basicWidth}px`,
            top: `${-0.44 * basicHeight}px`,
            height: `${2 * 1.44 * basicWidth}px`,
            width: "1px",
            backgroundColor: "black",
            transform: "rotate(135deg)",
        }} />

        <div style={{
            position: "absolute",
            left: `${4 * basicWidth}px`,
            top: `${-0.44 * basicHeight + 7 * basicHeight}px`,
            height: `${2 * 1.44 * basicWidth}px`,
            width: "1px",
            backgroundColor: "black",
            transform: "rotate(45deg)",
        }} />

        <div style={{
            position: "absolute",
            left: `${4 * basicWidth}px`,
            top: `${-0.44 * basicHeight + 7 * basicHeight}px`,
            height: `${2 * 1.44 * basicWidth}px`,
            width: "1px",
            backgroundColor: "black",
            transform: "rotate(135deg)",
        }} />

        {/* special lines markers */}
        <table style={{ border: "1px solid black", position: "absolute" }}>
            <tbody>
                {
                    Array(9).fill(0).map((_, i) => <tr key={i}>
                        {
                            Array(8).fill(0).map((_, j) => <Box key={j}
                                style={{ border: i == 4 ? undefined : "1px solid black", ...boxStyle }}
                            />)
                        }
                    </tr>)
                }
            </tbody>
        </table>

        <table style={{
            position: "absolute",
            top: `${-halfWidth}px`,
            left: `${-halfHeight}px`,
        }}>
            <tbody>
                {
                    Array(10).fill(0).map((_, i) => <tr key={i}>
                        {
                            Array(9).fill(0).map((_, j) => {
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
                                        ...((i === selected?.row && j === selected?.col) ? { backgroundColor: selectedColor } : undefined),
                                    }}
                                        onClick={() => {
                                            if (selected == null) {
                                                setSelected({ row: i, col: j })
                                            } else if (i === selected?.row && j === selected?.col) {
                                                setSelected(null)
                                            } else {
                                                setPositions(move(positions, selected, { row: i, col: j }))
                                                setSelected(null)
                                            }
                                        }}
                                    >{role}</Piece>
                                }
                                return <Box key={j} style={{ ...boxStyle, cursor: "pointer" }}
                                    onClick={() => {
                                        if (el == null) {
                                            if (selected != null) {
                                                setPositions(move(positions, selected, { row: i, col: j }))
                                                setSelected(null)
                                            }
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
}

function move(positions: BasicChessPiece[][], src: Location, dst: Location): BasicChessPiece[][] {
    if (src.row === dst.row && src.col === dst.col) {
        return positions
    }
    return positions.map((row, i) => {
        return row.map((col, j) => {
            if (i === src.row && j === src.col) {
                return null
            }
            if (i === dst.row && j === dst.col) {
                return positions[src.row][src.col]
            }
            return col
        })
    })
}

function Box(props: { children?: any, style?: CSSProperties, onClick?: () => void }) {
    return <td style={props.style}
        onClick={props.onClick}
    >
        {props.children}
    </td>
}

function Piece(props: { children?: any, style?: CSSProperties, onClick?: () => void }) {
    return <div
        onClick={props.onClick}
        style={{
            margin: "5px",
            height: "50px",
            width: "50px",
            border: "1px solid black",
            borderRadius: "25px",
            textAlign: "center",
            fontFamily: "Cursive",
            fontSize: "2.0em",
            backgroundColor: "#FAF0E6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            ...props.style,
        }}>{props.children}</div>
}
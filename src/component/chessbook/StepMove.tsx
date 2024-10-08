import { FrontPiece, Move } from "@/lib/chess/chessbook/def"
import { ChessPiece, Camp, getChessText, Role } from "@/lib/chess/def"

export function StepMove(props: { front?: FrontPiece, piece: ChessPiece, move: Move }) {
    const { front, piece, move } = props

    let camp = Camp.RED
    let role
    if (piece != null) {
        if (piece.camp != null) {
            camp = piece.camp
        }
        role = piece.role
    }
    const isRed = camp === Camp.RED
    const T = (n: number) => {
        if (isRed) {
            return upMove[n] || String(n)
        }
        return String(n)
    }

    const chess = getChessText(piece)

    let srcPos = ''
    let dstNum = 0
    if (front === FrontPiece.Front) {
        srcPos = "前" + chess
    } else if (front === FrontPiece.Back) {
        srcPos = "后" + chess
    } else {
        let srcNum = move.from.col + 1
        if (isRed) {
            srcNum = 10 - srcNum
        }
        srcPos = `${chess}${T(srcNum)}`
    }

    let dir = ""
    if (move.to.row != move.from.row) {
        dstNum = move.to.row - move.from.row
        if (isRed) {
            dstNum = -dstNum
        }
        if (dstNum >= 0) {
            dir = "进"
        } else {
            dir = "退"
            dstNum = -dstNum
        }
        if (role === Role.Horse || role === Role.Advisor || role === Role.Elephant) {
            // use col
            dstNum = move.to.col + 1
            if (isRed) {
                dstNum = 10 - dstNum
            }
        }
    } else {
        dir = "平"
        dstNum = move.to.col + 1
        if (isRed) {
            dstNum = 10 - dstNum
        }
    }

    return `${srcPos}${dir}${T(dstNum)}`
}

function descMove(move: Move): MoveDesc {
    let kind = MoveKind.Horizontal
    let delta = 0
    if (move.from != null && move.to != null) {
        if (move.from.row >= 0 && move.to.row >= 0 && move.from.row != move.to.row) {
            kind = MoveKind.Vertical
            delta = move.to.row - move.from.row
        } else if (move.from.col >= 0 && move.to.col >= 0) {
            delta = move.to.col - move.from.col
        }
    }

    return { kind, delta }
}

interface MoveDesc {
    kind: MoveKind
    delta: number
}

enum MoveKind {
    Horizontal,
    Vertical,
}


const upMove = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
}
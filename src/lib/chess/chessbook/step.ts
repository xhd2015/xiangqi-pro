import { move } from "../ops"
import { StatedPositionsStep, StatedStep, Step } from "./def"

export function pathSame(a: number[], b: number[]) {
    if (a?.length != b?.length) {
        return false
    }
    for (let i = 0; i < a?.length; i++) {
        if (a?.[i] !== b?.[i]) {
            return false
        }
    }
    return true
}

export function toggleSelected<T extends StatedStep>(step: T, path: number[]): T {
    function set(e: T, path: number[]): T {
        if (!path.length) {
            return { ...e, selected: !e.selected }
        }
        const clone: T[] = [...e.nexts] as T[]
        clone[path[0]] = set(clone[path[0]], path.slice(1))
        return { ...e, nexts: clone }
    }
    return set(step, path)
}


export function mapStep<T extends StatedStep>(step: T, path: number[], f: (step: T, isLast: boolean) => T): T {
    if (step == null) {
        return null
    }
    let root = f(step, path.length === 0)
    let s = root
    for (let i = 0; i < path.length; i++) {
        const j = path[i]
        const newChild = f(s.nexts[j] as T, i >= path.length - 1)
        s.nexts[j] = newChild
        s = newChild
    }
    return root
}

export function getTailPath(step: StatedStep): number[] {
    if (step == null) {
        return []
    }
    let path = []
    while (step.nexts?.length) {
        const i = step.nexts.length - 1
        path.push(i)
        step = step.nexts[i]
    }
    return path
}

export function getByPath<T extends StatedStep>(step: T, path: number[]): T {
    if (step == null) {
        return null
    }
    for (let i of path) {
        step = step.nexts[i] as T
    }
    return step
}

export function mapStepTail<T extends StatedStep>(step: T, f: (step: T) => T): T {
    if (step == null) {
        return null
    }
    let root = f(step)
    let s = root
    while (true) {
        const n = s.nexts.length
        if (!(n > 0)) {
            break
        }
        const newChild = f(s.nexts[n - 1] as T)
        s.nexts[n - 1] = newChild
        s = newChild
    }
    return root
}

export function cleanStep(step: Step): Step {
    if (step == null) {
        return null
    }
    const { name, description, front, move } = step
    let piece = step.piece
    let nexts: Step[] = null
    if (step.nexts != null) {
        nexts = step.nexts.map(cleanStep)
    }
    if (piece != null) {
        piece = { camp: piece.camp, role: piece.role }
    }
    return { name, description, piece, front, move, nexts }
}

export function recalcStep<T>(step: StatedPositionsStep<T>) {
    if (step == null) {
        return null
    }
    const positions = step.positions
    if (step.nexts != null) {
        for (let e of step.nexts) {
            e.positions = move(positions, e.move.from, e.move.to)
            recalcStep(e)
        }
    }
}
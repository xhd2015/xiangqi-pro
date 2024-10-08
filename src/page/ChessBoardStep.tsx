import { getStep, listStep, saveStep } from "@/api/save"
import { ChessBoard, MoveAction, movePiece } from "@/component/ChessBoard"
import { ChessBoardLayout, Positions } from "@/component/ChessBoardLayout"
import { ChessStep } from "@/component/chessbook/ChessStep"
import { PieceState } from "@/component/ChessLayout"
import { Dialog, useDialogController } from "@/component/Dialog"
import { StatedPositionsStep, StatedStep, Step } from "@/lib/chess/chessbook/def"
import { cleanStep, getByPath, getTailPath, mapStep, pathSame, recalcStep, toggleSelected } from "@/lib/chess/chessbook/step"
import { BoardLocation, Camp, ChessPiece, initPositions, isSameLocation, isSamePiece, switchCamp } from "@/lib/chess/def"
import { move } from "@/lib/chess/ops"
import { Button, Input, Modal, Select } from "antd"
import { LabeledValue } from "antd/lib/select"
import { CSSProperties, MutableRefObject, useMemo, useRef, useState } from "react"

export interface ChessBoardStepProps {
    style?: CSSProperties
    className?: string
}

export function ChessBoardStep(props: ChessBoardStepProps) {
    const [step, setStep] = useState<StatedPositionsStep<PieceState>>()
    const [selectedPath, setSelectedPath] = useState<number[]>([])

    const [playerCamp, setPlayerCamp] = useState(Camp.RED)
    const [selected, setSelected] = useState<BoardLocation>()

    const selOrTail = useMemo(() => {
        if (selectedPath != null) {
            return selectedPath
        }
        return getTailPath(step)
    }, [step, selectedPath])

    const [positions, placingCamp] = useMemo(() => {
        if (step == null) {
            return [initPositions, Camp.RED]
        }
        const selStep = getByPath(step, selOrTail)
        return [selStep.positions, switchCamp(selStep.piece.camp)]
    }, [step, selOrTail])

    // render selected
    const statedStep = useMemo(() => updateStep(step, selOrTail, (s) => s.selected = true), [step, selOrTail])

    const movePieceStep = (p: ChessPiece, from: BoardLocation, to: BoardLocation) => {
        const newPositions = move(positions, from, to)
        const newStep = { piece: p, move: { from: from, to: to }, positions: newPositions }

        if (step == null) {
            setStep(newStep)
        } else {
            let lastIdx = 0
            const newRootStep = updateStep(step, selOrTail, (clone) => {
                if (clone.nexts == null) {
                    clone.nexts = [newStep]
                } else {
                    // find if there is existing move, if so, reuse
                    let idx = -1
                    for (let i = 0; i < clone.nexts.length; i++) {
                        const child = clone.nexts[i]
                        if (isSamePiece(child.piece, p) && isSameLocation(child.move.from, from) && isSameLocation(child.move.to, to)) {
                            idx = i
                            break
                        }
                    }
                    if (idx < 0) {
                        lastIdx = clone.nexts.length
                        clone.nexts.push(newStep)
                    } else {
                        lastIdx = idx
                    }
                }
            })
            setStep(newRootStep)
            setSelectedPath([...selOrTail, lastIdx])
        }
    }

    return <div><ChessBoardLayout
        style={{
            width: "max-content",
            marginLeft: "2px",
        }}
        // chessAside={}
        positions={positions}
        selected={selected}
        placingCamp={placingCamp}
        playerCamp={playerCamp}
        onClickPiece={(row, col) => {
            let from: ChessPiece = null
            if (selected != null) {
                from = positions?.[selected.row]?.[selected?.col]
            }
            const to = positions?.[row]?.[col]
            const action = movePiece(from, to, placingCamp)
            switch (action) {
                case MoveAction.EAT:
                case MoveAction.MOVE:
                    setSelected(null)
                    movePieceStep(from, selected, { row, col })
                    break
                case MoveAction.SELECT:
                    setSelected({ row, col })
                    break
                case MoveAction.UNSELECT:
                    setSelected(null)
                    break
            }
        }} />
        <div style={{
            marginLeft: "2px",
            // maxWidth: "20em"
        }}>
            <span>Steps:</span>
            <div style={{
                // height: "500px",
                height: "200px",
                overflowY: "scroll",
            }}>
                {
                    step && <ChessStep
                        step={statedStep}
                        onClickStep={(path) => {
                            setSelectedPath(path)
                        }}
                        onToggleCollapse={(path) => {
                            setStep(updateStep(step, path, s => {
                                s.collapsed = !s.collapsed
                            }))
                        }}
                    />
                }
            </div>
            <NoteTaker disableEdit={!step}
                getNote={() => getByPath(step, selOrTail).description}
                onSaveNote={note => {
                    setStep(updateStep(step, selOrTail, (s) => {
                        s.description = note
                    }))
                }} />
            <Loader step={step} onLoadStep={step => setStep(step)} />
        </div>
    </div>
}

interface LoaderProps {
    step?: StatedPositionsStep<PieceState>
    onLoadStep?: (step: StatedPositionsStep<PieceState>) => void
}

function Loader(props: LoaderProps) {
    const { step } = props

    const [showSaveEdit, setShowSaveEdit] = useState(false)
    const [saveName, setSaveName] = useState("")
    const [saving, setSaving] = useState(false)

    const [selectLoad, setSelectLoad] = useState("")
    const [showLoad, setShowLoad] = useState(false)
    const [loadOptions, setLoadOptions] = useState<LabeledValue[]>([])

    return <div>
        <div>
            <Button onClick={() => {
                setShowSaveEdit(true)
                setShowLoad(false)
            }}>Save</Button>
            <Button onClick={() => {
                setShowSaveEdit(false)
                setShowLoad(true)

                listStep().then(list => setLoadOptions(list.map(e => ({ label: e, value: e }))))
            }}>Load</Button>
        </div>
        {
            showSaveEdit &&
            <div>
                <label>Name:</label>
                <Input value={saveName} onChange={e => setSaveName(e.target.value)}></Input>
                <div>
                    <Button style={{ marginRight: "2px" }} onClick={() => {
                        setShowSaveEdit(false)
                    }}>Cancel</Button>
                    <Button type="primary"
                        disabled={!saveName}
                        loading={saving}
                        onClick={() => {
                            const data = JSON.stringify({ step: cleanStep(step), positions: step?.positions || initPositions })
                            setSaving(true)
                            saveStep(saveName, data).then(() => setShowSaveEdit(false)).finally(() => setSaving(false))
                        }}>Confirm</Button>
                </div>
            </div>
        }
        {
            showLoad &&
            <div>
                <label>Select:</label>
                <Select dropdownMatchSelectWidth={false}
                    value={selectLoad}
                    onChange={e => setSelectLoad(e)}
                    options={loadOptions}></Select>
                <div>
                    <Button style={{ marginRight: "2px" }} onClick={() => {
                        setShowLoad(false)
                    }}>Cancel</Button>
                    <Button type="primary"
                        disabled={!selectLoad}
                        onClick={async () => {
                            setSaveName(selectLoad)
                            const loadedData = await getStep(selectLoad)
                            const res = JSON.parse(loadedData)
                            if (res.step) {
                                res.step.positions = res.positions
                            }
                            recalcStep(res.step)
                            props.onLoadStep?.(res.step)
                            setShowLoad(false)
                        }}>Confirm</Button>
                </div>
            </div>
        }
    </div>
}

interface NoteTakerProps {
    disableEdit?: boolean
    getNote?: () => string
    onSaveNote?: (note: string) => void
}

function NoteTaker(props: NoteTakerProps) {
    const [showNoteEdit, setShowNoteEdit] = useState(false)
    const [note, setNote] = useState("")

    return <div>
        <Button disabled={props.disableEdit}
            onClick={() => {
                setShowNoteEdit(e => !e)
                setNote(props.getNote?.() || "")
            }}
        >Take Note</Button>
        {
            showNoteEdit && <>
                <div>
                    <div>Note</div>
                    <Input.TextArea value={note} onChange={e => setNote(e.target.value)} />
                </div>
                <div>
                    <Button style={{ marginRight: "2px" }} onClick={() => {
                        setShowNoteEdit(false)
                    }}>Cancel</Button>
                    <Button type="primary" onClick={() => {
                        props.onSaveNote?.(note)
                        setShowNoteEdit(false)
                    }}>Confirm</Button>
                </div>
            </>
        }
    </div>

}

function updateStep(step: StatedPositionsStep<PieceState>, path: number[], f: (s: StatedPositionsStep<PieceState>) => void): StatedPositionsStep<PieceState> {
    if (step == null) {
        return null
    }

    return mapStep(step, path, (s, isLast) => {
        const clone = { ...s }
        if (clone.nexts != null) {
            clone.nexts = [...clone.nexts]
        }
        if (isLast) {
            f(clone)
        }
        return clone
    })
}
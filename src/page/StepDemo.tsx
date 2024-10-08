import { ChessStep } from "@/component/chessbook/ChessStep"
import { StatedStep, Step } from "@/lib/chess/chessbook/def"
import { pathSame, toggleSelected } from "@/lib/chess/chessbook/step"
import { Camp, Role } from "@/lib/chess/def"
import { CSSProperties, useState } from "react"

export interface StepDemoProps {
    style?: CSSProperties
    className?: string
}

export function StepDemo(props: StepDemoProps) {
    const [selected, setSelected] = useState(null)
    const [step, setStep] = useState<StatedStep>(exampleStep)
    return <ChessStep step={step}
        onClickStep={path => {
            let xstep = step
            if (selected == null) {
                setSelected(path)
            } else {
                // un select
                let same = pathSame(selected, path)
                if (same) {
                    setSelected(null)
                } else {
                    setSelected(path)
                    xstep = toggleSelected(xstep, selected)
                }
            }
            setStep(toggleSelected(xstep, path))
        }}
    />
}

const exampleStep: Step = {
    name: "Good",
    description: "A good step",
    piece: {
        camp: Camp.RED,
        role: Role.Chariot,
    },
    move: {
        from: {
            row: 9,
            col: 8,
        },
        to: {
            row: 8,
            col: 8,
        }
    },
    nexts: [{
        piece: {
            camp: Camp.BLACK,
            role: Role.Horse,
        },
        move: {
            from: {
                row: 0,
                col: 1,
            },
            to: {
                row: 2,
                col: 2,
            }
        },
        nexts: [{
            piece: {
                camp: Camp.RED,
                role: Role.Chariot,
            },
            move: {
                from: {
                    row: 8,
                    col: 8,
                },
                to: {
                    row: 8,
                    col: 7,
                }
            }
        }]
    }]
}
import { StatedStep, Step } from "@/lib/chess/chessbook/def"
import { StepMove } from "./StepMove"

import { RightOutlined, DownOutlined } from "@ant-design/icons"
import { useState } from "react"


export interface ChessStepProps extends RenderStepProps {
    noList?: boolean
}

export function ChessStep(props: ChessStepProps) {
    const step = props.step
    const path = props.path || []

    // const noChildren = !step.nexts?.length
    // const [collapsed, setCollapsed] = useState(false)

    const collapsed = step.collapsed

    const noList = props.noList
    const showBranch = props.showBranch

    const childrenShowBranch = step.nexts?.length > 1

    const UL = (props: { children }) => noList ? <>{props.children}</> : <ul style={{ listStyleType: "none", paddingInlineStart: "8px" }}>{props.children}</ul>
    const LI = (props: { children }) => noList ? <>{props.children}</> : <li style={{ marginLeft: showBranch ? "1em" : undefined }}>{props.children}</li>

    return <UL>
        <RenderStep
            {...props}
            collapsed={collapsed}
        // onToggleCollapse={() => {
        //     setCollapsed(e => !e)
        // }}
        />
        {
            !collapsed && step?.nexts?.map?.((s, i) => <LI key={i}><ChessStep
                noList={step.nexts?.length === 1}
                showBranch={childrenShowBranch}
                step={s}
                path={[...path, i]}
                onToggleCollapse={props.onToggleCollapse}
                onClickStep={props.onClickStep}
            /></LI>)
        }
    </UL>
}

export interface RenderStepProps {
    step?: StatedStep

    path?: number[]
    onClickStep?: (path: number[]) => void
    onToggleCollapse?: (path: number[]) => void

    showBranch?: boolean
    collapsed?: boolean
}

function RenderStep(props: RenderStepProps) {
    const step = props.step
    const path = props.path || []

    const collapsed = props.collapsed
    const Icon = collapsed ? RightOutlined : DownOutlined
    return <div >
        <div style={{
            display: "flex", alignItems: "end",
            ...(step?.selected ? { backgroundColor: "#c9c9ff" } : undefined)
        }}>
            {
                props.showBranch ? <Icon style={{ cursor: "pointer", alignSelf: "center" }} onClick={() => props.onToggleCollapse?.(path)} /> : undefined
            }
            <span style={{ cursor: "pointer" }}
                onClick={() => props.onClickStep?.(path)}
            ><StepMove front={step?.front} piece={step?.piece} move={step?.move} />
            </span>
            {
                step.name && <span style={{ fontStyle: "italic", marginLeft: "2px", fontSize: "smaller", color: "grey" }}>{step.name}</span>
            }
        </div>
        <div style={{ color: "grey" }}>
            {
                step.description
            }
        </div>
    </div>
}
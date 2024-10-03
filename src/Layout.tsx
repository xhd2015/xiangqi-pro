import { CSSProperties } from "react"
import { Outlet } from "react-router"

export interface LayoutProps {
    style?: CSSProperties
    className?: string
}

export function Layout(props: LayoutProps) {
    return <div className={props.className} style={props.style}>

        <a href="/">Home</a>
        <a href="/chess" style={{ marginLeft: "4px" }}>Chess</a>
        <a href="/chess/xiangqijs" style={{ marginLeft: "4px" }}>Chess(XiangqiJS)</a>
        <Outlet />
    </div>
}
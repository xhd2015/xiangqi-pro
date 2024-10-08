import { Modal } from "antd"
import { MutableRefObject, useRef, useState } from "react"

export interface DialogProps {
    title?: string
    children?: any
    controlRef?: MutableRefObject<DialogControler>
    reset?: () => void
    handle?: () => Promise<void>
}

export interface DialogControler {
    open: () => void
}

export function useDialogController(): MutableRefObject<DialogControler> {
    return useRef()
}

export function Dialog(props: DialogProps) {
    const [open, setOpen] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)

    const lastHandling = useRef(false)

    if (props.controlRef != null) {
        props.controlRef.current = {
            open() {
                if (lastHandling.current) {
                    return
                }
                lastHandling.current = true
                setOpen(true)
            }
        }
    }

    return <Modal
        title={props.title}
        open={open}
        onOk={() => {
            if (props.handle == null) {
                setOpen(false)
                lastHandling.current = false
                return
            }
            setConfirmLoading(true)
            props.handle().then(() => {
                setOpen(false)
                lastHandling.current = false
                props.reset?.()
            }).finally(() => {
                setConfirmLoading(false)
            })
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
            lastHandling.current = false
            setOpen(false)
        }}
    >
        {props.children}
    </Modal>
}
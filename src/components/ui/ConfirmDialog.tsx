import { Modal } from './Modal'
import { Button } from './Button'

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} width="max-w-sm">
      <p className="text-[14px] leading-relaxed text-ink/60">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            onConfirm()
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

import { toast } from 'react-toastify'

interface Props {
  title: string
  type: string
}

export default function notify({ title, type }: Props) {
  toast(title, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    type: `${
      type == 'error'
        ? 'error'
        : type == 'info'
        ? 'info'
        : type == 'success'
        ? 'success'
        : type == 'warning'
        ? 'warning'
        : 'default'
    }`
  })
}

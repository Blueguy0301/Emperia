import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

const Popup = props => {
  const [container, setContainer] = useState(null)
  const newWindow = useRef(window)
  useEffect(() => {
    const div = document.createElement('div')
    setContainer(div)
  }, [])

  useEffect(() => {
    if (container) {
      newWindow.current = window.open(
        'emperia.online/chat/dasdad',
        '',
        'width=600,height=400,left=200,top=200'
      )
      newWindow.current.document.body.appendChild(container)
      const curWindow = newWindow.current
      return () => curWindow.close()
    }
  }, [container])
  return container && createPortal(props.children, container)
}

export default Popup

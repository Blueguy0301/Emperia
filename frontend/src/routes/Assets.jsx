import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
const Assets = () => {
  const { fileName } = useParams()
  useEffect(() => {
    const downloadFile = name => {
      const url = `/assets/${name}`
      const link = document.createElement('a')
      link.href = url
      link.download = name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    downloadFile(fileName)
  }, [])

  return <div></div>
}
export default Assets

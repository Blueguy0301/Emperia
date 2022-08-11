import { useEffect, useState } from 'react'
import { search } from '../../utils/search'
const useSearch = (name, given) => {
  const [Names, setNames] = useState([])
  const [Invited, setInvited] = useState([])
  const [error, setError] = useState(null)
  const [Loading, setLoading] = useState(false)
  const [Data, setData] = useState([])
  useEffect(() => {
    setData([])
    setInvited(given)
  }, [given, name])
  useEffect(() => {
    setLoading(true)
    const results = async () => {
      const { sections, names } = await search(
        `https://api.emperia.online/api/search/?name=${name}`
      )
      let temp
      if (Invited.length > 0) {
        temp = {
          names: await names.filter(x => !Invited.includes(x.DisplayName)),
          sections: await sections.filter(x => !Invited.includes(x)),
        }
      } else temp = { names: names, sections: sections }
      setData(prevData => {
        return [
          ...prevData,
          ...temp.names.map(b =>
            b == null
              ? { DisplayName: null, Mail: null }
              : { DisplayName: b.DisplayName, Mail: b.Mail }
          ),
          ...temp.sections.map((b, i) =>
            b == null
              ? { section: null, id: i }
              : { DisplayName: b, Mail: `${b} section` }
          ),
        ]
      })
    }
    results()
  }, [name])
  return { Loading, Names, error, Data }
}

export default useSearch

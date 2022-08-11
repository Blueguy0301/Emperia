import { useState, useEffect, memo } from 'react'
import Cards from './Cards'
import axiosInstance from '../../utils/axiosInstance'
//* no scss. add here instead
function Cardlist(props) {
  let groupByN = (n, data) => {
    let result = []
    for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n))
    return result
  }
  const [view, setView] = useState(false)
  const [Card, setCards] = useState([])
  const source = async () => {
    //* getting links and information for cards
    const information = await axiosInstance.post('/api/events/link', {
      Code: props.code,
    })
    // console.log(Math.ceil(information.data.length / 3))
    let temp = groupByN(3, information.data)
    // console.log(temp)
    setCards(temp)
    // console.log('labas ng view')
  }
  useEffect(() => {
    setView(
      props.data.isOrganizer && props.isFaculty
        ? true
        : props.data.SubmissionView
    )
    // console.log(props.data)
    // console.log(props.data.SubmissionView)
  }, [props.data])

  useEffect(() => {
    source()
    //run source every 2 seconds
    let interval = setInterval(source, 10000)
    return () => clearInterval(interval)
  }, [])
  // console.log('nasa loob ng if')
  //* cards.map here
  return (
    <>
      {view ? (
        Card.map(data => {
          // console.log(data)
          return (
            <>
              <div className="col">
                <div className="row">
                  {data[0] && (
                    <Cards
                      name={data[0] && data[0].uploader}
                      month={data[0] && data[0].date}
                      time={data[0] && data[0].time}
                      url={data[0] && data[0].URL}
                      type={data[0] && data[0].fileType}
                      data={data[0]}
                    />
                  )}
                  {data[1] && (
                    <Cards
                      name={data[1] && data[1].uploader}
                      month={data[1] && data[1].date}
                      time={data[1] && data[1].time}
                      url={data[1] && data[1].URL}
                      type={data[1] && data[1].fileType}
                      data={data[1]}
                    />
                  )}
                  {data[2] && (
                    <Cards
                      name={data[2] && data[2].uploader}
                      month={data[2] && data[2].date}
                      time={data[2] && data[2].time}
                      url={data[2] && data[2].URL}
                      type={data[2] && data[2].fileType}
                      data={data[2]}
                    />
                  )}
                </div>
              </div>
            </>
          )
        })
      ) : (
        <div className="col">
          <div className="overlay">
            <h1> Your are not allowed to view the event!</h1>
          </div>
          <div className="row">
            {[1, 2, 3].map(data => {
              return (
                <Cards
                  type="image"
                  name="Juan dela cruz"
                  month="MM/DD/YY"
                  time="HH:MM am"
                  date="day"
                  data
                />
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default memo(Cardlist)

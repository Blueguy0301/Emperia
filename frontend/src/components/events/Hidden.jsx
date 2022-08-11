import Button from "../Button"
const Hidden = () => {
  return (
    <div className='flex transform-center'>
        <h1>
            The event already ended.
        </h1>
        <Button normal={false} to="/home" content="Go back home"/>
    </div>
  )
}

export default Hidden
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '../../styles/invtedModal.scss'
const invitedModal = invitedUser => {
  const Modal = withReactContent(Swal)
  // console.log(invitedUser)
  const data = () => {
    // console.log(invitedUser)
    Modal.fire({
      title: 'Invited',
      //set width
      width: '400vw',
      html: (
        <div className="invitedUser">
          {invitedUser?.map(user => {
            if (user.type === 'Guest') {
              return (
                <div className="row guest">
                  <h3>{user.Name}</h3>
                  <h4>
                    {user.school} ({user.time ?? 'not yet implemented'})
                  </h4>
                </div>
              )
            }
            return (
              <div className="row student">
                <h3>{user.DisplayName}</h3>
                <h4>{user.section}</h4>
              </div>
            )
          })}
        </div>
      ),
      showConfirmButton: true,
      confirmButtonText: 'Close',
      showCloseButton: true,
      focusConfirm: true,
    })
  }
  return data
}

export default invitedModal

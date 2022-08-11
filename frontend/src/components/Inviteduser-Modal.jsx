import React from 'react'
import '../styles/Inviteduser-Modal-style.scss'

function InviteduserModal(props) {
    return (
        <div className="InviteduserModal">
            <div className="InviteduserModal-BG">
                <div className="InviteduserModal-Header">
                    {/* Header */}
                    <h2>Invited User :</h2>
                </div>

                <div className="InviteduserModal-Body">
                    <div className="InviteduserModal-Searchbox">
                        <input type="text" placeholder="Search box toh pre..." />
                    </div>
                    <h2>Users :</h2>
                    <div className="InviteduserModal-Body-scroll">
                        <div className="InviteduserModal-List">
                            {/* List */}
                            {/* props.name || "Name" === pag walang props.name, yung "Name ang ilalagay" */}
                            <p>{props.name || "Mark Alexis J. Cabrera"}</p>
                            <p>{props.name || "Robert A. Johnson"}</p>
                        </div>
                        <div className="InviteduserModal-Btn">
                            {/* Buttons */}
                            <button className="Btn-Primary">Invite : Invited</button>
                            <h2>Invited</h2>
                        </div>
                    </div>
                    <br />
                </div>
                <div className="InviteduserModal-Footer">
                    {/* Footer */}
                    <h2>wala lang footer toh eh</h2>
                </div>
            </div>
        </div>
    )
}

export default InviteduserModal
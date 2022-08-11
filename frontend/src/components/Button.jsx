// * CHECKED 02.08
import { Link } from "react-router-dom"
const Button = props => {
    const { content, to, normal, event, btn, ...rest } = props
    let button
    if (normal) {
        if (btn) {
            button = (<button className="Btn-Primary" type="button" {...rest}>{content} </button>)
        }
        else {
            button = (<a href={to} className="Btn-Primary" >{content} </a>)
        }
    }
    else {
        button = (<Link to={to} className="Btn-Primary" {...rest}>{content} </Link>)
    }
    return button
}
export default Button
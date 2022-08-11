import {useParams} from 'react-router-dom' 
import { Formik,Form,ErrorMessage,Field } from 'formik'
import * as Yup from 'yup'
import '../styles/Info.scss'
import {addGuest} from '../helper'
function Info  () {
	const {code} = useParams()
	const ValidationSchema = Yup.object({
		Name : Yup.string().required('Name is Required'),
		School : Yup.string().required('School is Required')
	})
	return (
    <>
		<div className="modalBackground">
		  <div className="modalContainer">
		    <div className="header">
		      <h4>Enter the following to continue</h4>
		    </div>
		    <div className="body">
				<Formik
			       initialValues={{Name : '',School : ''}}
				   validationSchema={ValidationSchema}
				   onSubmit={(v)=>{
					   addGuest(v, code)
					   console.log(v)
				   }}
				>
					{
						infoFormik =>(
							<Form>
								<p>Name:</p>
		       					<Field type="text" name='Name' placeholder='Anne Gabrielle'/>
								   <ErrorMessage name="Name">
									   {
										   msg=> <h3>  <i class="fas  fa-info-circle"></i> {msg}</h3>
									   }
								   </ErrorMessage>
		      					<p>School:</p>
		       					<Field type="text" name='School' placeholder='St. School Fisher. Bacoor'/>
								<ErrorMessage name="School">
									{
										msg=> <h3>  <i class="fas  fa-info-circle"></i> {msg}</h3>
									}
								</ErrorMessage>
								<button type="submit" className="Btn-Primary">
									Submit
								</button>
							</Form>
						)
					}

				</Formik>

		    </div>
		  </div>
		</div>
    </>
  )
}
export default Info

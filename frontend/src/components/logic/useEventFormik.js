import { submit } from '../../helper'
import * as Yup from 'yup'
export const validationSchema = Yup.object({
  Name: Yup.string()
    .max(40, 'must be 40 characters or less')
    .required('Name is required'),
  Start: Yup.date().required('Starting date is required'),
  End: Yup.date()
    .min(Yup.ref('Start'), 'End date can not be before Start date')
    .required('Ending date is required'),
  Desc: Yup.string().required('Description is required'),
  code: Yup.string()
    .min(4, 'Invite code must be atleast 4 characters or more')
    .max(12, 'Invite code must be  12 characters or less')
    .required('Invite code is required'),
})
export const onSubmit = async values => {
  console.log(values)
  const data = await submit(values)
  return data
}
export const handleReset = val => {
  formik.resetForm()
}

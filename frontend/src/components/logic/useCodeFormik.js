import * as Yup from 'yup'
import { check } from '../../helper'
export const validationSchema = Yup.object({
    code: Yup.string().min(4, 'code must be atleast 4 characters').max(12, 'code must be  12 characters or less')
})
export const onSubmit = async (values) => {
    const iserror = check(values)
    if (iserror) {
        return "No events found"
    }
}
export const handleReset = (val) => {
    formik.resetForm();
}
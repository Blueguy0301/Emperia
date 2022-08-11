import { useState, useEffect, useRef } from 'react'
import * as Yup from 'yup'
import axiosInstance from '../../utils/axiosInstance'
const useReport = () => {
  const initialValues = {
    userName: ``,
    reportType: false,
    reportDetails: '',
  }
  const validate = Yup.object().shape({
    userName: Yup.string().required('Required'),
    reportType: Yup.boolean().required('Required'),
    reportDetails: Yup.string().required('Required'),
  })
  const onSubmit = async value => {
    console.log(value)
    const result = await axiosInstance.post('/api/test', value)
    return result
  }
  return { initialValues, validate, onSubmit }
}

export default useReport

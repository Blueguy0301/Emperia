//* import swal and swal react
import axiosInstance from '../../utils/axiosInstance'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import SectionModal from '../input-fields/Section_modal'
import { useEffect, useState } from 'react'
const modal = withReactContent(Swal)
/**
 * @param  {String} Name
 * @param  {String} Section
 */
export const createSection = async () => {
  const { value, isConfirmed } = await modal.fire({
    title: 'Create Section',
    icon: 'warning',
    html: <SectionModal />,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, create it!',
    preConfirm: () => {
      const section = document.getElementById('section').value
      if (section === '') {
        Swal.showValidationMessage('Please fill all fields')
      }
      return { section }
    },
  })
  console.log(isConfirmed)
  const returnValue =
    isConfirmed &&
    value.section &&
    (await axiosInstance.post('/api/admin/create', { section: value.section }))
  return returnValue.data
}
export const updateSection = async (Name, Section, sections) => {
  const result = await modal.fire({
    title: 'Update Section',
    icon: 'info',
    html: <SectionModal update={true} Section={Section} sections={sections} />,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Update Section',
    preConfirm: () => {
      const section = document.getElementById('section').value
      // console.log(section)
      if (section === 'Select a section') {
        Swal.showValidationMessage('Select another option')
      }
      return { section }
    },
  })
  if (result.isConfirmed && result.value) {
    const { section } = result.value
    const { data } = await axiosInstance.post(`/api/admin/update/`, {
      _id: Name,
      params: {
        section,
      },
    })
    data.success &&
      (await modal.fire({
        title: 'Section updated',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }))
    return data
  }
}
export const deleteSection = async (Name, id, Section) => {
  const result = await modal.fire({
    title: `Delete`,
    icon: 'warning',
    text: `Are you sure you want to delete ${
      Name.split(' ').length < 2
        ? Name.split(' ')[1]
        : Name.split(' ')[Name.split(' ').length - 1]
    }'s section?`,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  })
  if (result.isConfirmed) {
    const { data } = await axiosInstance.post(`/api/admin/update/`, {
      _id: id,
      params: {
        section: 'No Section',
      },
    })
    if (data.success) {
      Swal.fire({
        title: 'Deleted',
        text: `${
          Name.split(' ').length < 2
            ? Name.split(' ')[1]
            : Name.split(' ')[Name.split(' ').length - 1]
        }'s section has been deleted`,
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
      })
    }
    return data
  }
}
export const useSection = (Name, Section) => {}
//add a add admin
export const addAdmin = async (id, name, level) => {
  const result = await modal.fire({
    title: `${level === 'Admin' ? 'Remove' : 'Add'} Admin?`,
    icon: 'warning',
    text: `Are you sure you want to ${
      level === 'Admin' ? 'remove' : 'add'
    } ${name} as an admin?`,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: level === 'Admin' ? 'Yes, remove it!' : 'Yes, add it!',
    cancelButtonText: 'No, cancel!',
  })
  if (result.isConfirmed) {
    const { data } = await axiosInstance.post(`/api/admin/update`, {
      _id: id,
      params: { Level: !level.includes('Admin') ? 'Admin' : 'Student' },
    })
    data.success &&
      (await modal.fire({
        title: 'Level updated',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }))
    return data
  }
}
export const DeleteWholeSection = async sections => {
  const result = await modal.fire({
    title: 'Delete A Section',
    icon: 'warning',
    html: <SectionModal update={true} sections={sections} />,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Update Section',
    preConfirm: () => {
      const section = document.getElementById('section').value
      if (section === 'Select a section') {
        Swal.showValidationMessage('Invalid Section')
      }
      return { section }
    },
  })
  if (result.isConfirmed && result.value) {
    const { section } = result.value
    console.log(section)
    const { data } = await axiosInstance.post(`/api/admin/delete/`, {
      params: {
        sectionName: section,
      },
    })
    data.success &&
      (await modal.fire({
        title: 'Section deleted',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }))
    return { data, result: section }
  }
}

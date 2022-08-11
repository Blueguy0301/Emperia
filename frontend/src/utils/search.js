import axios from 'axios'
const resources = {}
const makeRequestCreator = () => {
  let cancel
  return async query => {
    if (cancel != undefined) {
      // Cancel the previous request before making a new request
      cancel.cancel()
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source()
    try {
      if (resources[query]) {
        // Return result if it exists
        return resources[query]
      } else {
        const res = await axios.get(query, {
          cancelToken: cancel.token,
          secure: true,
          httpOnly: false,
          withCredentials: true,
          credentials: 'include',
        })
        const result = res.data
        // Store response
        resources[query] = result
        console.log(res.data)
        return result
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if request was cancelled
        console.log('Request canceled', error.message)
      } else {
        // Handle usual errors
        console.log('Something went wrong: ', error.message)
      }
    }
  }
}
export const search = makeRequestCreator()

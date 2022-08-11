const fs = require('fs')

module.exports = {
  saveFile: async (event, filename, SFPath) => {
    //save file on /mnt/amalivestorage/video/${event}
    const path = `/mnt/emperia-storage/video/${event.toLowerCase()}`
    const filePath = `${path}/${filename}`
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    //check if the file already exists
    if (fs.existsSync(`${path}/${filename}`)) {
      //check how many same files exist
      let count = 0
      while (fs.existsSync(`${path}/${filename} ${count}`)) {
        count++
      }
      filename = `${filename} ${count}`
    }
    fs.readFile(SFPath, (err, data) => {
      if (err) throw err
      const result = fs.writeFile(filePath, data, err => {
        if (err) throw err
      })
      //*delete the temp file after saving
      fs.unlink(SFPath, err => {
        if (err) throw err
      })
      // console.log(result)
    })
  },
  DeleteEvent: async event => {
    const path = `/mnt/emperia-storage/video/${event}`
    if (fs.existsSync(path)) {
      fs.rmdirSync(path, { recursive: true })
      return true
    } else {
      return false
    }
  },
  DeleteFile: async (event, fileName) => {
    const path = `/mnt/emperia-storage/video/${event}/${fileName}`
    if (fs.existsSync(path)) {
      fs.unlinkSync(path)
      return true
    } else {
      return false
    }
  },
  CreateFolder: async event => {
    const path = `/mnt/emperia-storage/video/${event}`
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  },
}

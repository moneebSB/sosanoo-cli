const fs = require('fs-extra')
const path = require('path')
const utils = require('./utils')

utils.findRootProjectPath(process.env.INIT_CWD).then(rootPath => {
  const sourceDir = path.join(__dirname, 'templates')
  const destDir = path.join(rootPath, 'ignite/templates')

  fs.pathExists(destDir, (err, exists) => {
    if (err) {
      console.error('Error checking directory existence:', err)
    } else if (exists) {
      console.log(`The directory ${destDir} already exists. Skipping copy.`)
    } else {
      fs.copy(sourceDir, destDir, err => {
        if (err) {
          console.error('Error copying folder:', err)
        } else {
          console.log(`Successfully copied ${sourceDir} to ${destDir}`)
        }
      })
    }
  })
})

// //* takes a screenshot every n seconds

// const CronJob = require('cron').CronJob,
//   axios = require('axios'),
//   helpers = require('./helpers'),
//   config = require('../api/stream.config'),
//   port = config.rtmp_server.http.port,
//   n = '*/5 * * * * *'
// // * let n be proportional to time
// const job = new CronJob(
//   n,
//   function () {
//     axios
//       .get('http://localhost:' + port + '/api/streams')
//       .then(response => {
//         let streams = response.data
//         if (typeof (streams['live'] !== undefined)) {
//           let live_streams = streams['live']
//           for (let stream in live_streams) {
//             if (!live_streams.hasOwnProperty(stream)) continue
//             helpers.generateStreamThumbnail(stream)
//           }
//         }
//       })
//       .catch(error => {
//         console.log(error)
//       })
//   },
//   null,
//   true
// )

// module.exports = job

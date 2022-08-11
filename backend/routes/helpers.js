//* generates thumbnail for the video
const spawn = require('child_process').spawn,
    config = require('../api/stream.config.js'),
    cmd = config.rtmp_server.trans.ffmpeg;
//* cmd = kung san i e enter ang @args
//* args  =  kung ano yung i e enter sa cmd.
const generateStreamThumbnail = (stream_key) => {
    const args = [
        '-y',
        '-i', 'http://127.0.0.1:5000/live/' + stream_key + '/index.m3u8',
        '-ss', '00:00:01',
        '-vframes', '1',
        '-vf', 'scale=535:-1',
        'server/thumbnails/' + stream_key + '.png',
    ];
    spawn(cmd, args, {
        detached: true,
        stdio: 'ignore'
    }).unref();
};

module.exports = {
    generateStreamThumbnail: generateStreamThumbnail
};


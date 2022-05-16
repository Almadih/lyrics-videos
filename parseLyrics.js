const fs = require('fs');

// extract lyrics, end and start time into json file
function parseLyrics(fileName) {
  //extract artist and song name
  const file = fs.readFileSync(fileName, 'utf8');
  const artist = file.match(/ar: (.*)/)[1].replace(']',' ').trim();
  const name = file.match(/ti: (.*)/)[1].replace(']',' ').trim();
  const lines = file.split('\n').slice(6).filter(line => line.length > 0);
  const lyrics = lines.map((line,index) => {
    const time = line.match(/\[(\d+:\d+\.\d+)\]/);
    const [min, sec] = time[1].split(':');
    let startTime = parseFloat(min) * 60 + parseFloat(sec);
    startTime = parseInt(startTime * 1000);
    // const startTime =  parseInt(min) * 60 + parseInt(sec);
    const text = line.replace(/\[\d+:\d+\.\d+\]/g, '');
    const nextLine = lines[index + 1];
    let endTime = startTime + 10000;
    if(nextLine) {
    const nextTime = nextLine.match(/\[(\d+:\d+\.\d+)\]/);
    const [nextMin, nextSec] = nextTime[1].split(':');
    endTime =  (nextMin) * 60 + parseFloat(nextSec);
    endTime = parseInt(endTime * 1000);
    }
    return {startTime, endTime, text};
  })
  

  fs.writeFileSync('lyrics.json', JSON.stringify({artist, name, lyrics}));
}


parseLyrics('blue-bird.lrc')
// 현재 시간
console.log(new Date().getTime());
var endDate = new Date(); // 현재 시간

var difference = endDate.getTime();
difference = Math.floor(difference / 1000 / 60 / 60); // 초간격
console.log('time difference for hour: ' + difference + 'h');

difference -=
  Math.floor(difference / 1000 / 60 / 60 / 24) * 1000 * 60 * 60 * 24; // 일간격

difference -= Math.floor(difference / 1000 / 60 / 60) * 1000 * 60 * 60; // 시간간격

difference -= Math.floor(difference / 1000 / 60) * 1000 * 60; // 분간격
console.log();

import {
  AngryIcon,
  ChevronsDownIcon,
  ChevronsUpIcon,
  FrownIcon,
  LaughIcon,
  MehIcon,
  SmileIcon,
  UnfoldVerticalIcon,
} from 'lucide-react-native';

const dateToDateISOString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const getYesterdaysDateString = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  return dateToDateISOString(date);
};

const getTodaysDateString = () => {
  return dateToDateISOString();
};

const getCurrentTimeString = () => {
  return new Date().toISOString().split('T')[1].split('.')[0];
};

const convertHoursToString = (hours: number) => {
  if (hours == 0) return 'none';

  let timeStr = '';
  if (hours >= 1) {
    timeStr = timeStr + Math.floor(hours) + ' hour' + (hours >= 2 ? 's' : '');
  }

  let minutes = hours - Math.floor(hours);
  if (minutes > 0) {
    if (timeStr.length) timeStr = timeStr + ' ';
    timeStr = timeStr + minutes * 60 + ' mins';
  }

  return timeStr;
};

const convertMoodsToLineData = (mood: {time: string; value: number}[]) => {
  const data = mood.map(e => {
    const dateTime = new Date();
    dateTime.setDate(dateTime.getDate() - 1);
    const [hours, minutes, seconds] = e.time.split(':').map(t => Number(t));
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);
    dateTime.setSeconds(seconds);
    return {
      timestamp: dateTime,
      value: e.value,
    };
  });

  return data.map(e => {
    return {x: e.timestamp, y: e.value};
  });
};

const convertEvaluation = (value: number) => {
  const options = [
    {title: 'BAD', icon: ChevronsDownIcon, color: 'red'},
    {title: 'OK', icon: UnfoldVerticalIcon, color: 'orange'},
    {title: 'GOOD', icon: ChevronsUpIcon, color: 'green'},
  ];

  return options[value];
};

const convertMoodToIcon = (value: number) => {
  const idx = Math.round(value);

  return [AngryIcon, FrownIcon, MehIcon, SmileIcon, LaughIcon][idx];
};

export {
  convertEvaluation,
  convertHoursToString,
  convertMoodToIcon,
  convertMoodsToLineData,
  dateToDateISOString,
  getCurrentTimeString,
  getTodaysDateString,
  getYesterdaysDateString,
};


import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
const locations = JSON.parse(localStorage.getItem('locations'));
const lang = locations.languge;


export async function convertDateTimeMoment(time) {
  if (lang === 'VN') {
    dayjs.locale('vi');
    return dayjs(time).fromNow();
  } else {
    return dayjs(time).fromNow();
  }
}
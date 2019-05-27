/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var moment = require('moment');

moment.locale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'YYYY-MM-DD',
      LL: 'YYYY年MM月DD日',
      LLL: 'YYYY年MM月DD日Ah点mm分',
      LLLL: 'YYYY年MM月DD日ddddAh点mm分',
      l: 'YYYY-M-D',
      ll: 'YYYY年M月D日',
      lll: 'YYYY年M月D日 HH:mm',
      llll: 'YYYY年M月D日dddd HH:mm'
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (hour, meridiem) {
      if (hour === 12) {
          hour = 0;
      }
      if (meridiem === '凌晨' || meridiem === '早上' ||
          meridiem === '上午') {
          return hour;
      } else if (meridiem === '下午' || meridiem === '晚上') {
          return hour + 12;
      } else {
          // '中午'
          return hour >= 11 ? hour : hour + 12;
      }
  },
  meridiem: function (hour, minute, isLower) {
      const hm = hour * 100 + minute;
      if (hm < 600) {
          return '凌晨';
      } else if (hm < 900) {
          return '早上';
      } else if (hm < 1130) {
          return '上午';
      } else if (hm < 1230) {
          return '中午';
      } else if (hm < 1800) {
          return '下午';
      } else {
          return '晚上';
      }
  },
  calendar: {
      sameDay: '[今天]LT',
      nextDay: '[明天]LT',
      nextWeek: '[下]ddddLT',
      lastDay: '[昨天]LT',
      lastWeek: '[上]ddddLT',
      sameElse: 'L'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function (number, period) {
      switch (period) {
          case 'd':
          case 'D':
          case 'DDD':
              return number + '日';
          case 'M':
              return number + '月';
          case 'w':
          case 'W':
              return number + '周';
          default:
              return number;
      }
  },
  relativeTime: {
      future: '%s内',
      past: '%s前',
      s: '几秒',
      ss: '%d秒',
      m: '1分钟',
      mm: '%d分钟',
      h: '1小时',
      hh: '%d小时',
      d: '1天',
      dd: '%d天',
      M: '1个月',
      MM: '%d个月',
      y: '1年',
      yy: '%d年'
  },
  week: {
      // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
      dow: 1, // Monday is the first day of the week.
      doy: 4  // The week that contains Jan 4th is the first week of the year.
  }
})

export const formatDateString = (timestamp) => {
  if (timestamp === undefined) {
    return '';
  }
  const date = new Date(parseInt(timestamp) * 1000);
  const year = date.getFullYear();
  const month = parseInt(date.getMonth()) + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const formatStringWithHtml = (originString) => {
  if (originString === undefined) {
    return '';
  }
  const newString = originString
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return newString;
};

//创建到现在多长时间
export const timeFromnow = (value) => {
  if(String(value).search(/-/g) > -1) { //有‘-’
    value = value.replace(/-/g, "/"); //兼容ios
  }
  let date = moment(new Date(value), "YYYYMMDD").fromNow();
  return date;
};

//上下午
export const timeStamp = (value) => {
  if(String(value).search(/-/g) > -1) { //有‘-’
    value = value.replace(/-/g, "/"); //兼容ios
  }
  var daytime = moment(new Date(value)).utc().utcOffset(8).format('a');
  return daytime;
};

//截取时间
export const Hour = (value) => {
  return value.slice(11);
};

//天数
export const timesDay = (value) => {
  var days = value / 1000 / 60 / 60 / 24;
		days = days.toFixed();
		return days + "天";
};

//日期格式化01
export const dateFormat = (value) => {
  if(String(value).search(/-/g) > -1) { //有‘-’
    value = value.replace(/-/g, "/"); //兼容ios
  }
  return moment(new Date(value)).utc().utcOffset(8).format("YYYY-MM-DD HH:mm");
};

////日期格式化03
export const dateListFormat = (value) => {
  if(String(value).search(/-/g) > -1) { //有‘-’
    value = value.replace(/-/g, "/"); //兼容ios
  }
  return moment(new Date(value)).utc().utcOffset(8).format("YYYY-MM-DD");
};

//日期格式化02
export const getDate = (value) => {
  if(String(value).search(/-/g) > -1) { //有‘-’
    value = value.replace(/-/g, "/"); //兼容ios
  }
  return moment(new Date(value)).utc().utcOffset(8).format("YYYY/MM/DD");
};

//from now
export const fromCurrent = (val) => {
  return moment(val).startOf('minutes').fromNow();
};

//替换换行
export const parseNewLine = (val) => {
  var vals = val.split('\n'),res = "";
		vals.forEach(function(e) {
			res += '<p>' + e + '</p>';
		});
		return res;
};

//去除标签
export const delTag = (val) => {
  var desc = val.replace(/<[^>img]+>/g, "\n");
		var vals = desc.split('\n'),res = "";
		vals.forEach(function(e) {
			res += '<p>' + e + '</p>';
		});
		return res;
};
export const delTag2 = (val) => {
  var desc = val.replace(/<[^>]+>/g, "\n");
		var vals = desc.split('<br />'),
			res = "";
		return vals;
};
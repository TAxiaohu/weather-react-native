import * as UtilsApi from '../utils/utils';

export const fetchCurrentCity = () => { // 获取当前城市
  UtilsApi.getProvince()
  return fetch('https://restapi.amap.com/v3/ip?key=4a1284a5fe7fd1e835c45c27b7f7598b')
    .then((res) => res.json());
}

export const fetchWeather = (cityname) => { // 获取天气
  return fetch(`https://free-api.heweather.com/s6/weather?key=23cc001144a54567a6570864eccdc29b&location=${cityname}`)
    // return fetch(`http://guolin.tech/api/weather?key=41dd96cb90344217acbf5fe0813f16cd&cityid=${cityname}`)
    .then((response) => response.json());
}

export const fetchAirQuality = (cityname) => { // 获取空气质量
  return fetch(`https://free-api.heweather.com/s6/air/now?key=23cc001144a54567a6570864eccdc29b&location=${cityname}`)
    .then((response) => response.json());
}

export const fetchLiveWeather = (cityname) => { //获取实况天气
  return fetch(`https://free-api.heweather.com/s6/weather/now?key=23cc001144a54567a6570864eccdc29b&location=${cityname}`)
    .then(res => res.json());
}

export const fetchCity = (level, params) => { //获取城市
  let urlstr = '';
  const provinceData = params.provinceData;
  const cityData = params.cityData
  if (level === 0) {
    urlstr = 'http://guolin.tech/api/china';
  } else if (level === 1) {
    urlstr = `http://guolin.tech/api/china/${provinceData.id}`;
  } else if (level === 2) {
    urlstr = `http://guolin.tech/api/china/${provinceData.id}/${cityData.id}`;
  }
  return fetch(urlstr)
    .then((response) => response.json());
}
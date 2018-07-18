import city from './city.json';

export const getProvince = () => {
  const aaa = city.find(i => i.id === 2);
  return console.log(aaa);
}


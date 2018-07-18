import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ListView
} from 'react-native';

import * as WeatherApi from '../services/weather';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const lifeStatus = {
  "comf": '舒适度指数',
  "cw": '洗车指数',
  "drsg": '穿衣指数',
  "flu": '感冒指数',
  "sport": '运动指数',
  "trav": '旅游指数',
  "uv": '紫外线指数',
  "air": '空气质量指数',
};

class HomeScreen extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      isLoading: true,
      quiltyColor: true,
      refreshing: false,
      dataSource: ds,
      suggegstions: {},
      aqi: {},
      liveWeather: {},
      title: '北京',
    }
  }

  componentDidMount() {
    WeatherApi.fetchCurrentCity().then(res => {
      this.setupData(res.city);
    });
  }

  setupData = (cityname) => {
    const promise1 = WeatherApi.fetchAirQuality(cityname).then(res => {
      console.log(res);
      this.setState({
        aqi: res.HeWeather6[0].air_now_city,
      });
    });
    const promise2 = WeatherApi.fetchLiveWeather(cityname).then(res => {
      this.setState({
        liveWeather: res.HeWeather6[0].now,
      });
    });
    const promise3 = WeatherApi.fetchWeather(cityname).then(res => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(res.HeWeather6[0].daily_forecast),
        suggegstions: res.HeWeather6[0].lifestyle,
        // aqi: res.HeWeather6[0].aqi,
        title: res.HeWeather6[0].basic.admin_area,
        des: res.HeWeather6[0].now.cond_txt,
        temp: res.HeWeather6[0].now.tmp,
      });
    });
    Promise.all([promise1, promise2, promise3])
      .then(() => {
        console.log(2222);
        this.setState({
          refreshing: false,
          isLoading: false,
        });
      }).catch(() => { })
  }

  _onRefresh() {
    this.setupData(this.state.title);
  }

  HandleDate = (date) => {
    const week = new Date(date).getDay();
    const weekText = {
      0: '星期日',
      1: '星期一',
      2: '星期二',
      3: '星期三',
      4: '星期四',
      5: '星期五',
      6: '星期六',
    };
    return weekText[week];
  }

  reanderHeader = () => {
    return (
      <View style={styles.header}>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 44, marginBottom: 10 }}>
          <Text style={styles.headerTitle}>{this.state.title}</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('City', {
            name: this.state.title, currentLevel: 0, callBack: (data) => {
              this.setupData(data);
            }
          })}>
            <Image source={require('../assets/address.png')} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerDes}>{this.state.des}</Text>
        <Text style={styles.headerTepe}>{this.state.temp}℃</Text>
      </View>
    );
  }

  reanderForecast = () => { //未来天气预报
    return (
      <View style={styles.forecast}>
        <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>未来三天天气:</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <View style={styles.listView}>
              <Text style={{ color: 'white', flex: 1 }}>{this.HandleDate(rowData.date)}</Text>
              <Text style={{ color: 'white', flex: 2 }}>{rowData.cond_txt_d}</Text>
              <Text style={{ color: 'white', flex: 1 }}>{rowData.tmp_max}</Text>
              <Text style={{ color: 'white', flex: 1 }}>{rowData.tmp_min}</Text>
            </View>
          )} />
      </View>
    );
  }

  renderToDayStatus = () => { // 今天状况
    const { liveWeather } = this.state;
    console.log(liveWeather);
    return (
      <View>
        {/* <Text>今天：当前${}</Text> */}
      </View>
    )
  }

  renderAirquilty = () => {
    const { aqi } = this.state;
    return (
      <View>
        <View style={styles.suggestion}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 20 }}>
            <Text style={{ color: 'white', fontSize: 20 }}>空气质量：</Text>
            <Text style={{ color: 'red', fontSize: 17 }}>{aqi.qlty}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.airQuiltyDes}>AQI指数</Text>
              <Text style={styles.airQuiltyValue}>{aqi.aqi}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.airQuiltyDes}>PM2.5</Text>
              <Text style={styles.airQuiltyValue}>{aqi.pm25}</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.airQuiltyDes}>PM10</Text>
              <Text style={styles.airQuiltyValue}>{aqi.pm10}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.airQuiltyDes}>臭氧指数(o3)</Text>
              <Text style={styles.airQuiltyValue}>{aqi.o3}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  renderSuggestion = () => {
    let { suggegstions } = this.state;
    return (
      <View style={styles.suggestion}>
        <Text style={{ color: 'white', fontSize: 20, marginBottom: 20, marginTop: 20, marginLeft: 20 }}>生活建议</Text>
        {suggegstions.map((item, index) =>
          <Text key={index} style={styles.suggestionDes}>
            {lifeStatus[item.type]}：{item.brf}
            {"\n"}
            {item.txt}
          </Text>
        )}
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('../assets/weather-bg.jpg')} style={{ width: screenWidth, height: screenHeight }}>
          <ScrollView style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />
            }>
            {this.reanderHeader()}
            {this.reanderForecast()}
            {/* {this.renderToDayStatus()} */}
            {this.renderAirquilty()}
            {this.renderSuggestion()}
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44
  },
  header: {
    flex: 1,
    backgroundColor: '#0000',
    alignItems: 'center'
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 44,
    backgroundColor: 'red',
    width: screenWidth,
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    marginRight: 20,
  },
  headerTepe: {
    color: 'white',
    fontSize: 40,
    marginTop: 20,
    marginBottom: 44,
  },
  headerDes: {
    color: 'white',
    fontSize: 20,
  },
  forecast: {
    backgroundColor: '#fff0',
    margin: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  suggestion: {
    margin: 20,
    backgroundColor: '#0007',
  },
  suggestionDes: {
    fontSize: 16,
    color: 'white',
    marginBottom: 18,
    marginLeft: 20,
    marginRight: 20
  },
  airQuiltyDes: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginTop: 10,
    marginBottom: 10
  },
  airQuiltyValue: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    marginBottom: 10
  }
})

export default HomeScreen;
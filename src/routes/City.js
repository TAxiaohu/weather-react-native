import React, { Component } from 'react';
import { TouchableOpacity, ActivityIndicator, View, Text, FlatList } from "react-native";
import * as WeatherApi from '../services/weather';
class City extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerMode: 'float',
    gesturesEnabled: true,
    headerTitle: `${navigation.state.params.name}`,
    headerLeft: (
      <TouchableOpacity onPress={() => {
        navigation.goBack(null)
      }}>
        <Text style={{ color: 'white', fontSize: 18, marginLeft: 8 }}>返回</Text>
      </TouchableOpacity>
    ),
    headerStyle: {
      backgroundColor: '#6666ff',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontSize: 20
    }
  });

  componentDidMount() {
    this.setupData(0)
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currentLevel: 0, // 0:province, 1:city, 2:county;
      provinces: [{}],
      provinceData: {},
      cityData: {}
    };
  }

  setupData = (level) => {
    WeatherApi.fetchCity(level, this.state).then(res => {
      this.setState({
        loading: false,
        provinces: res,
        currentLevel: level,
      });
    })
  }

  touchChange = (item) => {
    const { navigation } = this.props;
    const { state, setParams, goBack } = navigation;
    this.props.navigation.setParams({ name: item.name });
    let level = this.state.currentLevel;
    if (this.state.currentLevel === 0) {
      this.setState({
        provinceData: item,
      });
    } else if (this.state.currentLevel === 1) {
      this.setState({
        cityData: item,
      })
    }

    if (this.state.currentLevel === 2) {
      state.params.callBack(item.weather_id) // 回调
      goBack(null)
    } else {
      this.setState({ currentLevel: level + 1 }, () => {
        setParams({ currentLevel: level + 1 })
        this.setState({ loading: true });
        this.setupData(this.state.currentLevel)
      });
    }
  }

  render() {
    if (this.state.loading) {
      return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>)
    }
    return (
      <FlatList style={{ backgroundColor: 'white' }}
        data={this.state.provinces}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'center', height: 44 }}
              onPress={() => this.touchChange(item)}>
              <Text style={{ color: 'gray', fontSize: 20 }} >{item.name} </Text>
            </TouchableOpacity>
          )
        }}
        ItemSeparatorComponent={() => {
          return (
            <View style={{ height: 1, backgroundColor: '#eee' }} />
          )
        }}
        keyExtractor={
          (item, index) => item.id
        }
      />
    )
  }
}

export default City;
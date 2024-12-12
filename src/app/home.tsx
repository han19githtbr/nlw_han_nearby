import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps"

import { api } from "@/services/api";
import * as Location from "expo-location";
import { Categories, CategoriesProps } from "@/components/categories";
import { Places } from "@/components/places";
import { PlaceProps } from "@/components/place";

type MarketsProps = PlaceProps & {
  latitude: number
  longitude: number
}

const currentLocation = {
  latitude: -22.88438855720397,
  longitude: -43.11090148894244,
}


export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([])
  
  const [category, setCategory] = useState("")
  const [markets, setMarkets] = useState<MarketsProps[]>([])

  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
      setCategory(data[0].id)
    } catch (error) {
      console.log(error);
      Alert.alert("Categorias", "Não foi possível carregar as cagetorias.");
    }
  }

  async function fetchMarkets() {
    try {
      if(!category) {
        return
      }

      const {data} = await api.get("/markets/category/" + category)
      setMarkets(data)
      
    } catch (error) {
      Alert.alert("Locais", "Não foi possível carregar os locais.")
    }
  }

  async function getCurrentLocation() {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync()

      if (granted) {
        const location = await Location.getCurrentPositionAsync()
        console.log(location)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCurrentLocation()
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMarkets()
  }, [category])

  return <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
    <Categories 
      data={categories} 
      onSelect={setCategory} 
      selected={category} 
    />

    <MapView 
      style={{ flex: 1 }}
      initialRegion={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }}
    >
      <Marker 
        identifier="current"
        coordinate={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        }}
        image={require("@/assets/location.png")}
      />

      {markets.map((item) => (
        <Marker
          key={item.id}
          identifier={item.id}
          coordinate={{
            latitude: item.latitude,
            longitude: item.longitude,
          }}
          image={require("@/assets/pin.png")}
        />
      ))}
      
    </MapView>  

    <Places data={markets} />
  </View>;
}

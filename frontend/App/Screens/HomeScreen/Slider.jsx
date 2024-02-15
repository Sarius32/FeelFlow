import { View, Text, StyleSheet, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalApi from '../../Utils/GlobalApi'
import Heading from '../../Components/Heading';

export default function Slider() {
    const [slider, setSlider] = useState([]);
    useEffect(() => {
        getSliders();
    }, [])

    const getSliders = () => {
        GlobalApi.getSlider().then(resp => {
            console.log('resp', resp.sliders);
            setSlider(resp?.sliders)
        })
    }
  return (
    <View>
      <Heading text={'Lorem Ipsum'}/>
      <FlatList
        data={slider}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
            <View style={{marginRight: 20}}>
                <Image source={{uri:item?.image?.url}} style={styles.sliderImage}/>
            </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontFamily: 'lato',
        marginBottom: 10
    },
    sliderImage: {
        width: 150,
        height: 150,
        borderRadius: 20,
        objectFit: 'contain'
        
    }
})
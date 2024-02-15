import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalApi from '../../Utils/GlobalApi'
import Heading from '../../Components/Heading';
import Colors from '../../Utils/Colors';

export default function Categories() {

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        getCategories();
    }, [])
    const getCategories = () => {
        GlobalApi.getCategories().then(resp => {
            setCategories(resp?.categories)
        })
    }
  return (
    <View style={{marginTop: 10}}>
      <Heading text={'Lorem Ipsum'} isViewAll={true}/>
      <FlatList
        data={categories}
        numColumns={4}
        renderItem={({item, index}) => index<=3&&(
            <View style={styles.container}> 
                <View style={styles.iconContainer}>
                    <Image source={{uri:item?.icon?.url}}
                    style={{width: 30, height: 30}}/>
                </View>
                <Text style={{fontFamily:'lato', marginTop:5 }}>{item?.name}</Text>
            </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center'
    },
    iconContainer: {
        backgroundColor:Colors.LIGHT_GREY,
        padding: 17,
        borderRadius: 99
    }
})
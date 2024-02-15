import { View, Text, Image, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import Colors from '../../Utils/Colors';
import { FontAwesome } from '@expo/vector-icons'

export default function Header() {
    const {user, isLoading} = useUser();
  return user&& (
    <View style={styles.container}>
        <View style={styles.profileMainContainer}>
            <View style={styles.profileContainer}>
                <Image source={{uri:user?.imageUrl}} style={styles.userImage}/>
                <View>
                    <Text style={{color: Colors.WHITE, fontFamily: 'lato'}}>Welcome,</Text>
                    <Text style={{color: Colors.WHITE, fontSize: 20, fontFamily: 'lato'}}>{user?.firstName}</Text>
                </View>
            </View>
            <FontAwesome name='bookmark-o' size={27} color={Colors.WHITE} />
        </View>
        <View style={styles.searchBarContainer}>
            <TextInput placeholder='Search' style={styles.textInput}/>
            <FontAwesome name='search' size={24} color={Colors.PRIMARY} style={styles.searchbtn}/>
          
        </View>
   </View>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: Colors.PRIMARY,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    profileMainContainer:{
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    profileContainer: {
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        gap: 10
    },
    textInput: {
        padding: 7,
        paddingHorizontal: 16,
        backgroundColor: Colors.WHITE,
        borderRadius: 8,
        width: '85%',
        fontSize: 16,
        fontFamily: 'lato'
    },
    searchBarContainer: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10
    },
    searchbtn: {
        backgroundColor:Colors.WHITE,
        padding: 10,
        borderRadius: 8
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 99
    }
})
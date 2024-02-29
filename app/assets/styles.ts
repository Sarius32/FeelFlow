import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  box: {
    width: '65%', // Adjust the width as needed
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center', // Center children horizontally
  },
  text: {
    color: 'black',
    marginBottom: 10, // Creates space between the text and the slider
    textAlign: 'center', // Center the text horizontally
    fontSize: 16, // Adjust the font size as needed
  },
  slider: {
    width: '75%',
    // alignSelf: 'stretch', // Ensure the slider stretches to match the box width
    height: 40, // Adjust the height as needed
    marginHorizontal: 20, // Add horizontal margin if needed for the slider to not touch the box edges
  },
});

export default styles;

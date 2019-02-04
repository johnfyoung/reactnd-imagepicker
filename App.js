import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageEditor,
  TouchableOpacity,
  Image
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';

export default class App extends React.Component {
  state = {
    status: null,
    image: null
  }

  componentDidMount() {
    Permissions.getAsync(Permissions.CAMERA_ROLL)
      .then((result) => {
        const { status } = result;
        this.setState(() => ({ status }))
      })
      .catch((error) => {
        console.warn('Error getting Camera Roll permission: ', error);

        this.setState(() => ({
          status: 'undetermined'
        }))
      })
  }

  askPermission = () => {
    return Permissions.askAsync(Permissions.CAMERA_ROLL)
      .then((result) => {
        const status = result.status;
        this.setState(() => ({ status }));
      })
      .catch((error) => {
        console.warn('Error asking Location permission: ', error);
      })
  }

  pickImage = () => {
    this.askPermission()
      .then(() => {
        if (this.state.status === 'granted') {
          ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [2, 1],
          }).then((result) => {
            if (result.cancelled) {
              return
            }

            ImageEditor.cropImage(
              result.uri,
              {
                offset: { x: 0, y: 0 },
                size: { width: result.width, height: result.height },
                displaySize: { width: 290, height: 100 },
                resizeMode: 'contain'
              },
              (uri) => this.setState(() => ({ image: uri })),
              () => console.log(error)
            );
          })
        } else {
          return () => (<View><Text>No permissions</Text></View>)
        }
      });

  }

  render() {
    const { image } = this.state;
    return (
      <View style={styles.container} >
        <TouchableOpacity onPress={this.pickImage}>
          <Text>Open Camera Roll</Text>
        </TouchableOpacity>

        {image && (
          <Image style={styles.img} source={{ uri: image }} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 150,
    height: 150,

  }
});

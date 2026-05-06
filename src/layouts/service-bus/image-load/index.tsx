import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Text, ImageBackground, Image, View } from 'react-native';

import {Avatar } from "@ui-kitten/components";

import { CachedImage } from '@georstat/react-native-image-cache';

class ImageLoad extends PureComponent<{   deleted?: boolean }> {
  static propTypes = {
    isShowActivity: PropTypes.bool,
    cahcedImage: PropTypes.bool
  };

  static defaultProps = {
    isShowActivity: true,
    cachedImage: true
    };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isError: false
    };
  }

  onLoadEnd(){
    this.setState({
      isLoaded: true
    });
  }

  onError(){
    this.setState({
      isError: true
    });
  }

   getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

getSrcUri(uri) {
  return {uri: uri};
}

  render() {
    const {
      style, source, resizeMode, borderRadius, backgroundColor, children,
      loadingStyle, placeholderSource, placeholderStyle,
      customImagePlaceholderDefaultStyle
    } = this.props;
    return(
      <View>
       
        
       
        
        
       
       

          {!this.state.isLoaded && this.state.isError && (
          <View>
            <View style={[styles.cardImg, styles.cardAvatar, { backgroundColor: this.getRandomColor()}]}>
                  <Text style={styles.cardAvatarText}>
                    {this.props.name[0]}
                  </Text>
            </View>
          
          </View>
              
          )}	
          {this.props.deleted && (
          <View>
            <View style={[styles.cardImg, styles.cardAvatar, { backgroundColor: this.getRandomColor()}]}>
                  <Text style={styles.cardAvatarText}>
                    {this.props.name[0]}
                  </Text>
            </View>
          
          </View>
              
          )}	

           <CachedImage
              onLoadEnd={this.onLoadEnd.bind(this)}
              onError={this.onError.bind(this)}
              style={[styles.backgroundImage, style]}
              maxAge={2}
              source={source}
              resizeMode="cover"/>  
      </View>
    );
  }
}

const styles = {
  backgroundImage: {
    position: 'absolute',
    borderRadius: 50,
    overflow: 'hidden',
    top: -2,
    left: -4
  },
  backgroundImageExists: {
    position: 'relative',
    borderRadius: 50,
    overflow: 'hidden'
  },
  activityIndicator: {
    position: 'absolute',
    margin: 'auto',
    zIndex: 9,
  },
  viewImageStyles: {
    flex: 1,
    backgroundColor: '#e9eef1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imagePlaceholderStyles: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewChildrenStyles: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'transparent'
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 20,
  },
  cardAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  cardImg1: {
    //top: 500,
    width: 42,
    height: 42,
    borderRadius: 20,
  },
  cardAvatar1: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    marginRight: 'auto',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  }
}

export default ImageLoad;
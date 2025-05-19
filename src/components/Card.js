import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import CartaVerso from '../assets/images/Carta.jpg';

export default function Card({ pokemon, isFlipped, onPress, cardSize }) {
  const pokemonId = pokemon.id || pokemon.url.split('/')[6];
  const [rotateAnim] = useState(new Animated.Value(0));
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isFlipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [isFlipped]);
  
  const frontInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg']
  });
  
  const backInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };


  const pokemonImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${pokemonId}.png`;
  const fallbackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

 
  const isGen1 = pokemonId <= 151;
  
 
  const imageSource = imageError || !isGen1 
    ? { uri: fallbackImageUrl } 
    : { uri: pokemonImageUrl };
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.card, cardSize && { width: cardSize, height: cardSize }]} 
      activeOpacity={0.9}
    >
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.cardSide, styles.cardFront, frontAnimatedStyle]}>
          <Image
            source={imageSource}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        </Animated.View>
        
        <Animated.View style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}>
          <Image 
            source={CartaVerso} 
            style={styles.cardBackImage}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 5,
    aspectRatio: 1,
    minWidth: 70,
    perspective: 1000,
  },
  cardContainer: {
    flex: 1,
    position: 'relative',
  },
  cardSide: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  cardFront: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9bbc0f', // Verde claro do GameBoy
    borderColor: '#0f380f', // Verde escuro do GameBoy
  },
  cardBack: {
    backgroundColor: '#306230', // Verde médio do GameBoy
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0f380f', // Verde escuro do GameBoy
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  cardBackImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#306230', // Verde médio do GameBoy
  }
});
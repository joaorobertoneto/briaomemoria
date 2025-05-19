import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import GameBoard from '../components/GameBoard';

export default function HomeScreen() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [selection, setSelection] = useState(0); 
  const [blinkTitle, setBlinkTitle] = useState(true); 

  
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkTitle(prev => !prev);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  const startGame = (level) => {
    try {
      setDifficulty(level);
      setGameStarted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = (index) => {
    setSelection(index);
  };

  if (gameStarted) {
    return <GameBoard difficulty={difficulty} setGameStarted={setGameStarted} />;
  }

  return (
    <View style={styles.container}>
    
      <View style={styles.gameFrame}>
      
        <View style={styles.gameScreen}>
      
          <Image 
            source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/25.png' }} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={[styles.title, blinkTitle ? styles.visible : styles.hidden]}>
            POKéMON MEMORY
          </Text>
          
          <View style={styles.pressStartContainer}>
            <Text style={styles.pressStart}>PRESS START</Text>
          </View>

          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={[styles.button, selection === 0 && styles.selectedButton]} 
              onPress={() => startGame(6)}
              onFocus={() => handleSelect(0)}
            >
              <Text style={styles.buttonArrow}>{selection === 0 ? '▶' : ' '}</Text>
              <Text style={styles.buttonText}>EASY (6 POKéMON)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, selection === 1 && styles.selectedButton]} 
              onPress={() => startGame(8)}
              onFocus={() => handleSelect(1)}
            >
              <Text style={styles.buttonArrow}>{selection === 1 ? '▶' : ' '}</Text>
              <Text style={styles.buttonText}>MEDIUM (8 POKéMON)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, selection === 2 && styles.selectedButton]} 
              onPress={() => startGame(10)}
              onFocus={() => handleSelect(2)}
            >
              <Text style={styles.buttonArrow}>{selection === 2 ? '▶' : ' '}</Text>
              <Text style={styles.buttonText}>HARD (10 POKéMON)</Text>
            </TouchableOpacity>
          </View>

        
          <Text style={styles.copyright}>©2025 POKÉMON MEMORY GAME</Text>
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9a9a9a', // Cor do GameBoy original
    padding: 20,
  },
  gameFrame: {
    width: width > 500 ? 500 : width - 40,
    height: height > 750 ? 700 : height - 80,
    backgroundColor: '#8b8b8b',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#636363',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  gameScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: '#9bbc0f', // Verde clássico do GameBoy
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderWidth: 4,
    borderColor: '#0f380f', // Borda escura do GameBoy
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f380f', // Verde escuro
    textAlign: 'center',
    letterSpacing: -1,
    marginTop: 20,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0.2,
  },
  pressStartContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  pressStart: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#306230', // Verde escuro
    fontWeight: 'bold',
  },
  menuContainer: {
    width: '80%',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  selectedButton: {
    backgroundColor: '#306230', // Verde escuro semi-transparente
  },
  buttonArrow: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#0f380f',
    marginRight: 5,
    width: 20,
    textAlign: 'center',
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#0f380f',
    fontWeight: 'bold',
  },
  copyright: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: '#306230',
    position: 'absolute',
    bottom: 10,
  }
});
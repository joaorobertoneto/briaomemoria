import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Text, Image, Dimensions } from 'react-native';
import axios from 'axios';
import Card from './Card';

export default function GameBoard({ difficulty, setGameStarted }) {
  const [pokemons, setPokemons] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [numColumns, setNumColumns] = useState(4);
  const [cardSize, setCardSize] = useState(80); 


  const calculateLayout = () => {
    const { width } = Dimensions.get('window');
    const padding = 20; 
    const cardMargin = 10; 
    const minCardSize = 80; 
    const maxCardSize = 150;

    const availableWidth = width - padding;
    const maxColumns = Math.floor(availableWidth / minCardSize);
    const minColumns = Math.ceil(availableWidth / maxCardSize);
    
 
    const columns = Math.max(2, Math.min(maxColumns, difficulty <= 6 ? 4 : 6));
    

    const size = Math.floor((availableWidth - (columns * cardMargin)) / columns);
    

    const adjustedSize = Math.min(maxCardSize, Math.max(minCardSize, size));
    
    return { columns, cardSize: adjustedSize };
  };

  useEffect(() => {
    const updateLayout = () => {
      const { columns, cardSize: size } = calculateLayout();
      setNumColumns(columns);
      setCardSize(size);
    };

    const dimensionListener = Dimensions.addEventListener('change', updateLayout);
    

    updateLayout();


    return () => {
      dimensionListener.remove();
    };
  }, [difficulty]);

  useEffect(() => {
    fetchPokemons();
  }, [difficulty]);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const totalPokemons = 151; 
      const randomIds = [];
      
      while (randomIds.length < difficulty) {
        const randomId = Math.floor(Math.random() * totalPokemons) + 1;
        
        if (!randomIds.includes(randomId)) {
          try {
            const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
            const genus = pokemonResponse.data.genera.find(g => g.language.name === 'en')?.genus || '';
            
            if (!genus.includes('legendary') && !genus.includes('mythical')) {
              randomIds.push(randomId);
            }
          } catch (error) {
            console.warn(`Erro ao buscar Pokémon ${randomId}:`, error.message);
          }
        }
      }

      const pokemonPromises = randomIds.map(id => 
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      );
      
      const responses = await Promise.all(pokemonPromises);
      const pokemonData = responses.map(res => res.data);
      
      const pokemonPairs = [...pokemonData, ...pokemonData];
      const shuffledPokemons = shuffleArray(pokemonPairs);
      
      setPokemons(shuffledPokemons);
    } catch (error) {
      console.error("Erro ao buscar Pokémon:", error);
      setError("Erro ao carregar Pokémon");
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleCardPress = (index) => {
    if (selectedCards.length === 2 || matchedCards.includes(index)) return;
    
    setSelectedCards([...selectedCards, index]);
    
    if (selectedCards.length === 0) {
    
    } else if (selectedCards.length === 1) {
    
      setAttempts(attempts + 1);
      
      const [firstIndex] = selectedCards;
      if (pokemons[firstIndex].name === pokemons[index].name) {
        setMatchedCards([...matchedCards, firstIndex, index]);
        setMatches(matches + 1);
      }
      setTimeout(() => setSelectedCards([]), 1000);
    }
  };

 
  useEffect(() => {
    if (matchedCards.length > 0 && matchedCards.length === pokemons.length) {
     
      setTimeout(() => {
        alert(`Parabéns! Você completou o jogo em ${attempts} tentativas!`);
      }, 1000);
    }
  }, [matchedCards, pokemons]);

  if (loading) {
    return (
      <View style={[styles.board, styles.center]}>
        <Image 
          source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
          style={styles.loadingImage}
        />
        <Text style={styles.loadingText}>CARREGANDO...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.board, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setGameStarted(false)}
        >
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!pokemons || pokemons.length === 0) {
    return (
      <View style={[styles.board, styles.center]}>
        <Text style={styles.errorText}>Nenhum Pokémon encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setGameStarted(false)}
        >
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <View style={styles.infoPanel}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>TENTATIVAS:</Text>
          <Text style={styles.infoValue}>{attempts}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ACERTOS:</Text>
          <Text style={styles.infoValue}>{matches}</Text>
        </View>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setGameStarted(false)}
        >
          <Text style={styles.backButtonText}>MENU</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.cardsContainer}>
        <FlatList
          data={pokemons}
          numColumns={numColumns}
          key={numColumns} 
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.cardsContent}
          renderItem={({ item, index }) => (
            <Card
              pokemon={item}
              isFlipped={selectedCards.includes(index) || matchedCards.includes(index)}
              onPress={() => handleCardPress(index)}
              cardSize={cardSize}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9bbc0f', // Verde claro do GameBoy
    padding: 10,
  },
  board: {
    flex: 1,
    backgroundColor: '#9bbc0f',
    padding: 15,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#0f380f', // Verde escuro do GameBoy
    borderRadius: 0,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#306230', // Verde médio
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#9bbc0f', // Verde claro
  },
  infoValue: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e0f8cf', // Verde mais claro
  },
  cardsContainer: {
    flex: 1,
    backgroundColor: '#306230', // Verde médio
    borderRadius: 0,
    padding: 10,
    borderWidth: 2,
    borderColor: '#0f380f', // Verde escuro
  },
  cardsContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#306230', // Verde médio
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#0f380f', // Verde escuro
  },
  backButtonText: {
    color: '#e0f8cf', // Verde mais claro
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  loadingImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  loadingText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#0f380f',
    fontWeight: 'bold',
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#0f380f',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
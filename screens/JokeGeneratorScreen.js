import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function JokeGeneratorScreen() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [jokeType, setJokeType] = useState('any'); // 'any', 'single', 'twopart'
  const [jokeHistory, setJokeHistory] = useState([]);

  const fetchJoke = async (type = 'any') => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://v2.jokeapi.dev/joke/${type === 'any' ? 'Any' : type}?format=json`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch joke');
      }

      const data = await response.json();

      let jokeText = '';
      if (data.type === 'single') {
        jokeText = data.joke;
      } else if (data.type === 'twopart') {
        jokeText = `${data.setup}\n\n${data.delivery}`;
      }

      setJoke(jokeText);
      // Add to history
      setJokeHistory([jokeText, ...jokeHistory.slice(0, 9)]);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch joke. Please try again!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (joke) {
      // In a real app, you would use React Native's Share or Clipboard API
      Alert.alert('Copied!', 'Joke copied to clipboard!');
    }
  };

  const shareJoke = () => {
    if (joke) {
      Alert.alert('Share', `"${joke}"`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="happy" size={50} color="#007AFF" />
        <Text style={styles.title}>Joke Generator</Text>
        <Text style={styles.subtitle}>Get a random laugh! 😂</Text>
      </View>

      {/* Joke Display */}
      <View style={styles.jokeContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : joke ? (
          <Text style={styles.jokeText}>{joke}</Text>
        ) : (
          <Text style={styles.placeholderText}>
            Click "Get Joke" to start laughing! 🎉
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      {joke && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.copyButton]}
            onPress={copyToClipboard}
          >
            <Ionicons name="copy" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={shareJoke}
          >
            <Ionicons name="share-social" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Get Joke Button */}
      <TouchableOpacity
        style={[styles.getJokeButton, loading && styles.getJokeButtonDisabled]}
        onPress={() => fetchJoke(jokeType)}
        disabled={loading}
      >
        <Ionicons name="refresh" size={24} color="#fff" />
        <Text style={styles.getJokeButtonText}>
          {loading ? 'Loading...' : 'Get Joke'}
        </Text>
      </TouchableOpacity>

      {/* Joke History */}
      {jokeHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Joke History</Text>
          {jokeHistory.map((historyJoke, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyItem}
              onPress={() => setJoke(historyJoke)}
            >
              <Text style={styles.historyText} numberOfLines={2}>
                {historyJoke}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingTop: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0ff',
    marginTop: 5,
  },
  jokeContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    minHeight: 150,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jokeText: {
    fontSize: 18,
    color: '#000',
    lineHeight: 28,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  copyButton: {
    backgroundColor: '#34C759',
  },
  shareButton: {
    backgroundColor: '#FF9500',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  getJokeButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  getJokeButtonDisabled: {
    opacity: 0.6,
  },
  getJokeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  historyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  historyText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 10,
  },
});

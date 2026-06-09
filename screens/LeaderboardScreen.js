import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Simulate leaderboard data
    const mockLeaderboard = [
      { id: 1, name: 'ProGamer', kills: 25, score: 2500, kills_by: 'None', rank: 1 },
      { id: 2, name: 'Shadow', kills: 22, score: 2200, kills_by: 'ProGamer', rank: 2 },
      { id: 3, name: 'Phoenix', kills: 20, score: 2000, kills_by: 'Shadow', rank: 3 },
      { id: 4, name: 'Ninja', kills: 18, score: 1800, kills_by: 'Phoenix', rank: 4 },
      { id: 5, name: 'Tiger', kills: 15, score: 1500, kills_by: 'Ninja', rank: 5 },
      { id: 6, name: 'Falcon', kills: 12, score: 1200, kills_by: 'Tiger', rank: 6 },
      { id: 7, name: 'Hunter', kills: 10, score: 1000, kills_by: 'Falcon', rank: 7 },
      { id: 8, name: 'Ghost', kills: 8, score: 800, kills_by: 'Hunter', rank: 8 },
      { id: 9, name: 'Viking', kills: 5, score: 500, kills_by: 'Ghost', rank: 9 },
      { id: 10, name: 'Ranger', kills: 3, score: 300, kills_by: 'Viking', rank: 10 },
    ];
    setLeaderboard(mockLeaderboard);
  }, []);

  const renderLeaderboardItem = ({ item }) => (
    <View style={[styles.leaderboardItem, item.rank <= 3 && styles.topRankItem]}>
      <View style={styles.rankBadge}>
        {item.rank <= 3 ? (
          <Ionicons
            name={item.rank === 1 ? 'trophy' : 'medal'}
            size={20}
            color={item.rank === 1 ? '#FFD60A' : item.rank === 2 ? '#C0C0C0' : '#CD7F32'}
          />
        ) : (
          <Text style={styles.rankNumber}>#{item.rank}</Text>
        )}
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerStats}>{item.kills} kills • {item.score} pts</Text>
      </View>

      <View style={styles.deathInfo}>
        <Text style={styles.deathLabel}>Killed by</Text>
        <Text style={styles.deathName}>{item.kills_by}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="podium" size={40} color="#FFD60A" />
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Top Players</Text>
      </View>

      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD60A',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
  },
  leaderboardItem: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  topRankItem: {
    borderLeftColor: '#FFD60A',
    backgroundColor: '#333333',
  },
  rankBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerStats: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  deathInfo: {
    alignItems: 'flex-end',
  },
  deathLabel: {
    fontSize: 10,
    color: '#999',
  },
  deathName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginTop: 2,
  },
});

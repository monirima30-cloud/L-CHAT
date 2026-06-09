import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ navigation }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: width / 2 - 15, y: height / 2 - 15 });
  const [enemies, setEnemies] = useState([]);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [mapZone, setMapZone] = useState({ x: 0, y: 0, width: width, height: height });
  const [gameTime, setGameTime] = useState(300); // 5 minutes
  const [playersAlive, setPlayersAlive] = useState(100);
  const gameLoopRef = useRef(null);

  const startGame = () => {
    setGameStarted(true);
    setHealth(100);
    setScore(0);
    setGameTime(300);
    setPlayersAlive(100);
    setPlayerPos({ x: width / 2 - 15, y: height / 2 - 15 });
    generateEnemies();
  };

  const generateEnemies = () => {
    const newEnemies = [];
    for (let i = 0; i < 15; i++) {
      newEnemies.push({
        id: i,
        x: Math.random() * (width - 30),
        y: Math.random() * (height - 150),
        health: 100,
        size: 30,
      });
    }
    setEnemies(newEnemies);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 0) {
          endGame('Time Over!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      // Shrink map zone
      setMapZone((prev) => ({
        ...prev,
        width: Math.max(100, prev.width - 1),
        height: Math.max(100, prev.height - 1),
        x: prev.x + 0.5,
        y: prev.y + 0.5,
      }));

      // Move enemies randomly
      setEnemies((prev) =>
        prev.map((enemy) => ({
          ...enemy,
          x: Math.max(
            mapZone.x,
            Math.min(mapZone.x + mapZone.width - 30, enemy.x + (Math.random() - 0.5) * 4)
          ),
          y: Math.max(
            mapZone.y,
            Math.min(mapZone.y + mapZone.height - 30, enemy.y + (Math.random() - 0.5) * 4)
          ),
        }))
      );

      // Check collision with enemies
      setEnemies((prev) =>
        prev.filter((enemy) => {
          const distance = Math.sqrt(
            Math.pow(playerPos.x - enemy.x, 2) + Math.pow(playerPos.y - enemy.y, 2)
          );
          if (distance < 40) {
            setHealth((h) => Math.max(0, h - 5));
            return false;
          }
          return true;
        })
      );

      // Decrease players alive randomly
      setPlayersAlive((prev) => Math.max(1, prev - Math.random()));
    }, 500);

    return () => clearInterval(interval);
  }, [gameStarted, playerPos, mapZone]);

  useEffect(() => {
    if (health <= 0) {
      endGame('You are dead!');
    }
  }, [health]);

  const movePlayer = (direction) => {
    setPlayerPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;
      const step = 20;

      switch (direction) {
        case 'up':
          newY = Math.max(mapZone.y, prev.y - step);
          break;
        case 'down':
          newY = Math.min(mapZone.y + mapZone.height - 30, prev.y + step);
          break;
        case 'left':
          newX = Math.max(mapZone.x, prev.x - step);
          break;
        case 'right':
          newX = Math.min(mapZone.x + mapZone.width - 30, prev.x + step);
          break;
      }

      return { x: newX, y: newY };
    });
  };

  const shootEnemy = () => {
    if (enemies.length > 0) {
      const closestEnemy = enemies.reduce((closest, enemy) => {
        const distClosest = Math.sqrt(
          Math.pow(playerPos.x - closest.x, 2) + Math.pow(playerPos.y - closest.y, 2)
        );
        const distEnemy = Math.sqrt(
          Math.pow(playerPos.x - enemy.x, 2) + Math.pow(playerPos.y - enemy.y, 2)
        );
        return distEnemy < distClosest ? enemy : closest;
      });

      setEnemies((prev) => prev.filter((e) => e.id !== closestEnemy.id));
      setScore((prev) => prev + 10);
    }
  };

  const endGame = (reason) => {
    setGameStarted(false);
    Alert.alert('Game Over', `${reason}\n\nScore: ${score}\nPlayers Killed: ${100 - Math.floor(playersAlive)}`, [
      {
        text: 'Play Again',
        onPress: startGame,
      },
      {
        text: 'Main Menu',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <View style={styles.lobbyContainer}>
          <Ionicons name="game-controller" size={80} color="#007AFF" />
          <Text style={styles.lobbyTitle}>Battle Royale</Text>
          <Text style={styles.lobbySubtitle}>100 Players, 1 Winner</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.gameContainer}>
      {/* Game Stats */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Ionicons name="heart" size={20} color="#ff3b30" />
          <Text style={styles.statText}>{Math.floor(health)}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="star" size={20} color="#FFD60A" />
          <Text style={styles.statText}>{Math.floor(score)}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="people" size={20} color="#34C759" />
          <Text style={styles.statText}>{Math.floor(playersAlive)}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="time" size={20} color="#007AFF" />
          <Text style={styles.statText}>{Math.floor(gameTime / 60)}:{String(gameTime % 60).padStart(2, '0')}</Text>
        </View>
      </View>

      {/* Game Map */}
      <View
        style={[
          styles.gameMap,
          {
            borderWidth: 2,
            borderColor: '#ff3b30',
          },
        ]}
      >
        {/* Player */}
        <View
          style={[
            styles.player,
            {
              left: playerPos.x,
              top: playerPos.y,
            },
          ]}
        >
          <Ionicons name="person" size={30} color="#007AFF" />
        </View>

        {/* Enemies */}
        {enemies.map((enemy) => (
          <View
            key={enemy.id}
            style={[
              styles.enemy,
              {
                left: enemy.x,
                top: enemy.y,
              },
            ]}
          >
            <Ionicons name="person" size={30} color="#ff3b30" />
          </View>
        ))}

        {/* Shrinking Zone Indicator */}
        <View
          style={[
            styles.zoneIndicator,
            {
              left: mapZone.x,
              top: mapZone.y,
              width: mapZone.width,
              height: mapZone.height,
            },
          ]}
        />
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Movement Buttons */}
        <View style={styles.dPad}>
          <TouchableOpacity
            style={styles.dPadButton}
            onPress={() => movePlayer('up')}
          >
            <Ionicons name="chevron-up" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.dPadRow}>
            <TouchableOpacity
              style={styles.dPadButton}
              onPress={() => movePlayer('left')}
            >
              <Ionicons name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dPadButton}
              onPress={() => movePlayer('down')}
            >
              <Ionicons name="chevron-down" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dPadButton}
              onPress={() => movePlayer('right')}
            >
              <Ionicons name="chevron-forward" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.shootButton]}
            onPress={shootEnemy}
          >
            <Ionicons name="game-controller" size={30} color="#fff" />
            <Text style={styles.buttonLabel}>SHOOT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lobbyContainer: {
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 30,
    borderRadius: 20,
  },
  lobbyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  lobbySubtitle: {
    fontSize: 16,
    color: '#999',
    marginVertical: 10,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameMap: {
    flex: 1,
    backgroundColor: '#0a7e2e',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  player: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  enemy: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFD60A',
    borderStyle: 'dashed',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#2a2a2a',
    padding: 15,
    gap: 20,
  },
  dPad: {
    alignItems: 'center',
    gap: 5,
  },
  dPadButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dPadRow: {
    flexDirection: 'row',
    gap: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shootButton: {
    backgroundColor: '#ff3b30',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

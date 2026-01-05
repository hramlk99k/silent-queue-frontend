import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const history = [
    { id: 1, room: 'Laundry', date: 'Jan 2, 2026', time: '14:00' },
    { id: 2, room: 'Common Room', date: 'Jan 1, 2026', time: '19:30' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity History</Text>
      <ScrollView>
        {history.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.dot} />
            <View>
              <Text style={styles.roomText}>{item.room}</Text>
              <Text style={styles.dateText}>{item.date} at {item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  historyCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', 
    padding: 15, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: '#333' 
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#007AFF', marginRight: 15 },
  roomText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dateText: { color: '#666', fontSize: 13 }
});
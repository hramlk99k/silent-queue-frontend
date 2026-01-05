import { useFocusEffect } from '@react-navigation/native';
import { Clock, RefreshCcw, Trash2 } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '../config'; // Import the IP address we set up
import { Colors } from '../theme/colors';

export default function QueueScreen() {
  const insets = useSafeAreaInsets();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get data from Backend
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run this when the screen loads
 useFocusEffect(
  useCallback(() => {
    fetchBookings();
  }, [])
);
const handleDelete = async (id) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the deleted item from the local state so it disappears immediately
      setBookings(bookings.filter(item => item._id !== id));
    }
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
  const renderItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.cardInfo}>
        <Text style={styles.roomText}>{item.roomType}</Text>
        <View style={styles.timeRow}>
          <Clock color={Colors.textSecondary} size={14} />
          <Text style={styles.timeText}>
            Ends: {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
      <Text style={styles.statusBadge}>{item.status}</Text>
      <TouchableOpacity onPress={() => handleDelete(item._id)}>
      <Trash2 color="#FF4444" size={20} />
    </TouchableOpacity>
    </View>

  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Queue</Text>
        <TouchableOpacity onPress={fetchBookings}>
          <RefreshCcw color="#fff" size={20} />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primaryGlow} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={item => item._id} // MongoDB uses _id
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No active bookings found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  listContent: { paddingBottom: 100 },
  bookingCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333'
  },
  roomText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  timeText: { color: '#888', fontSize: 14 },
  statusBadge: { color: '#4ADE80', fontSize: 12, fontWeight: 'bold' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 50 }
});
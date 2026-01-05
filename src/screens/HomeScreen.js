import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '../config';

const { width } = Dimensions.get('window');
const GRID_SPACING = 18;
const SQUARE_SIZE = (width - (GRID_SPACING * 3)) / 2;
const NAV_BLUE = '#007AFF'; 

const Countdown = ({ initialMinutes }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const formatTime = (total) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  return <Text style={styles.timerText}>{formatTime(seconds)}</Text>;
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeRoom, setActiveRoom] = useState('');

  const [roomStatuses, setRoomStatuses] = useState({
    "Laundry": { status: 'occupied', sub: 'Laundry Room' },
    "Sauna": { status: 'available', sub: 'Shared' },
    "Common Room": { status: 'available', sub: 'Social Area' }
  });

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();
      const base = {
        "Laundry": { status: 'occupied', sub: 'Laundry Room' },
        "Sauna": { status: 'available', sub: 'Shared' },
        "Common Room": { status: 'available', sub: 'Social Area' }
      };
      if (Array.isArray(data)) {
        data.forEach(b => { if (base[b.roomType]) base[b.roomType].status = 'reservedByMe'; });
      }
      setRoomStatuses(base);
    } catch (e) { console.error(e); }
  };

  useFocusEffect(useCallback(() => { fetchStatus(); }, []));

  const handleAction = async (roomName) => {
    const state = roomStatuses[roomName]?.status;
    if (state === 'occupied') return;
    if (state === 'reservedByMe') { navigation.navigate('My Queue'); return; }

    try {
      const res = await fetch(`${API_URL}/bookings/occupy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomType: roomName, apartment: 'Apt 12B', durationMinutes: 30 }),
      });
      if (res.ok) { setActiveRoom(roomName); setModalVisible(true); fetchStatus(); }
    } catch (e) { console.error(e); }
  };

  const RoomCard = ({ name, isSquare = false }) => {
    const room = roomStatuses[name];
    const state = room.status;
    const themeColor = state === 'available' ? '#00FF66' : state === 'reservedByMe' ? '#FFD700' : '#FF3131';

    return (
      <View style={[styles.outerGlow, { shadowColor: themeColor }, isSquare ? { width: SQUARE_SIZE } : { width: '100%' }]}>
        <TouchableOpacity activeOpacity={0.85} style={{flex: 1}} onPress={() => handleAction(name)}>
          <LinearGradient 
            colors={[themeColor + '60', themeColor + '15', '#000000']} 
            locations={[0, 0.4, 0.9]}
            style={[styles.card, isSquare ? styles.squareHeight : styles.fullHeight, { borderColor: themeColor + 'CC' }]}
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.roomTitle}>{name.toUpperCase()}</Text>
                <Text style={styles.roomSub}>{room.sub}</Text>
              </View>

              <View style={styles.centerSection}>
                {state === 'reservedByMe' ? (
                  <View style={styles.timerAlign}>
                    <Countdown initialMinutes={30} />
                    <Text style={styles.yellowSub}>TIME REMAINING</Text>
                  </View>
                ) : (
                  <Text style={[styles.statusMain, { color: themeColor, textShadowColor: themeColor, textShadowRadius: 30 }]}>
                    {state === 'available' ? 'AVAILABLE' : 'IN USE'}
                  </Text>
                )}
              </View>
              
              <View style={styles.footer}>
                <View style={[styles.actionBtn, { backgroundColor: themeColor, shadowColor: themeColor }]}>
                   <Text style={styles.btnText}>
                    {state === 'available' ? 'RESERVE' : state === 'occupied' ? 'BUSY' : 'VIEW'}
                   </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[NAV_BLUE, '#0055BB']}
            style={styles.logoNeonFrame}
          >
            <View style={styles.logoInnerBlack}>
              <Text style={styles.logoText}>Q</Text>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.brandName}>SILENT-QUEUE</Text>
          <Text style={styles.aptInfo}>Apt 12B • Premium Access</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          <RoomCard name="Laundry" isSquare />
          <RoomCard name="Sauna" isSquare />
          <RoomCard name="Common Room" />
        </View>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalGlow, { borderColor: '#00FF66', shadowColor: '#00FF66' }]}>
            <Text style={styles.modalTitle}>SUCCESS</Text>
            <Text style={styles.modalText}>{activeRoom} Reserved.</Text>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.confirmText}>START</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', paddingHorizontal: 25, paddingVertical: 10, alignItems: 'center' },
  
  // LOGO FIX
  logoContainer: {
    padding: 12, // Space for the glow
    margin: -12, // Offset so it doesn't move the logo position
  },
  logoNeonFrame: {
    width: 48,
    height: 48,
    borderRadius: 14,
    padding: 2, // Border thickness
    justifyContent: 'center',
    alignItems: 'center',
    // NUCLEAR GLOW
    shadowColor: NAV_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 20,
  },
  logoInnerBlack: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    textShadowColor: NAV_BLUE,
    textShadowRadius: 10,
  },
  
  headerText: { marginLeft: 15 },
  brandName: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  aptInfo: { color: '#666', fontSize: 13, fontWeight: '700', marginTop: -2 },
  
  scrollArea: { padding: GRID_SPACING },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  outerGlow: { marginBottom: 20, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 40, elevation: 30 },
  card: { borderRadius: 30, borderWidth: 1.5, overflow: 'hidden' }, 
  squareHeight: { height: width * 0.72 },
  fullHeight: { height: 175 },
  
  cardContent: { flex: 1, padding: 20, justifyContent: 'space-between' },
  roomTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  roomSub: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 'bold' },
  
  centerSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusMain: { fontSize: 30, fontWeight: '900', textAlign: 'center' },
  
  timerAlign: { alignItems: 'center' },
  timerText: { color: '#FFD700', fontSize: 50, fontWeight: '900', textShadowColor: '#FFD700', textShadowRadius: 35 },
  yellowSub: { color: '#FFD700', fontSize: 11, fontWeight: 'bold', marginTop: 12 },
  
  footer: { alignItems: 'flex-end' },
  actionBtn: { 
    paddingHorizontal: 22, paddingVertical: 10, borderRadius: 25, 
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15, elevation: 15
  },
  btnText: { color: '#000', fontWeight: '900', fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalGlow: { width: '80%', padding: 40, backgroundColor: '#000', borderRadius: 40, borderWidth: 3, alignItems: 'center', shadowOpacity: 1, shadowRadius: 50 },
  modalTitle: { color: '#00FF66', fontSize: 32, fontWeight: '900', marginBottom: 10 },
  modalText: { color: '#fff', textAlign: 'center', marginBottom: 35 },
  confirmBtn: { backgroundColor: '#00FF66', paddingHorizontal: 45, paddingVertical: 15, borderRadius: 20 },
  confirmText: { color: '#000', fontWeight: '900' }
});
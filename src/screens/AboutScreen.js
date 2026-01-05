import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_BLUE = '#007AFF';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  const InfoCard = ({ label, value, color = '#333' }) => (
    <View style={styles.cardWrapper}>
      <LinearGradient 
        colors={['#1a1a1a', '#000']} 
        style={styles.infoCard}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: color }]}>{value}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>ABOUT</Text>
        <Text style={styles.subtitle}>SILENT-QUEUE v1.0.4</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard label="DEVELOPED BY" value="Hira Malik" color="#fff" />
        <InfoCard label="LOCATION" value="Stockholm" color="#fff" />
        <InfoCard label="SYSTEM STATUS" value="OPERATIONAL" color="#00FF66" />
        
        <TouchableOpacity style={styles.buttonWrapper}>
          <LinearGradient 
            colors={[NAV_BLUE + '40', '#000']} 
            style={styles.buttonCard}
          >
            <Text style={[styles.btnText, {color: NAV_BLUE}]}>TERMS OF SERVICE</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonWrapper}>
          <LinearGradient 
            colors={['#FF3131' + '40', '#000']} 
            style={styles.buttonCard}
          >
            <Text style={[styles.btnText, {color: '#FF3131'}]}>REPORT AN ISSUE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 30, alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  subtitle: { color: '#444', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  content: { padding: 20 },
  cardWrapper: { marginBottom: 15, borderRadius: 20, overflow: 'hidden' },
  infoCard: { padding: 20, borderWidth: 1, borderColor: '#222', borderRadius: 20 },
  label: { color: '#666', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
  value: { fontSize: 18, fontWeight: '700' },
  buttonWrapper: { marginBottom: 15, borderRadius: 20, overflow: 'hidden' },
  buttonCard: { 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#222', 
    borderRadius: 20, 
    alignItems: 'center' 
  },
  btnText: { fontWeight: '900', letterSpacing: 1, fontSize: 14 }
});
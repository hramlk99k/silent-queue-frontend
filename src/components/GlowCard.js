import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const { width } = Dimensions.get('window');

export default function GlowCard({ title, subtitle, value, footer, glowColor, isFullWidth }) {
  const cardWidth = isFullWidth ? width - 40 : (width / 2) - 30;

  return (
    <View style={{ marginBottom: 20 }}>
      <Shadow
        distance={15}
        startColor={`${glowColor}33`} // 33 adds transparency to the hex
        offset={[0, 4]}
        stretch
      >
        <View style={[styles.card, { width: cardWidth }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{value}</Text>
          </View>

          <Text style={styles.footerText}>{footer}</Text>
        </View>
      </Shadow>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    padding: 20,
    height: 180,
    borderWidth: 1,
    borderColor: '#333',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  valueContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  valueText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  footerText: { color: '#666', fontSize: 11, textAlign: 'left' }
});
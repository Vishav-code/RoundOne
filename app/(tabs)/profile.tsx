import { StyleSheet, Text, View } from 'react-native';

export default function TrainScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Train</Text>
      <Text style={styles.subtitle}>Workout generator coming next.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
});
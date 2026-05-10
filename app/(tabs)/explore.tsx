import { Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

const articles = [
  {
    title: 'Rising Kickboxing Prospects Are Changing the Sport',
    source: 'Combat Weekly',
    date: 'Today',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed',
    description:
      'A new generation of technical strikers is using footwork, feints, and hybrid training methods to dominate amateur and pro circuits.',
  },
  {
    title: 'Why Cardio Is Becoming the Biggest Weapon in Modern Fighting',
    source: 'Fight IQ Journal',
    date: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1517438322307-e67111335449',
    description:
      'Coaches are emphasizing longer rounds, smarter pacing, and recovery-based conditioning to help athletes stay dangerous late in fights.',
  },
  {
    title: 'The Return of the Out-Fighter Style',
    source: 'Striking Lab',
    date: '2 days ago',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865',
    description:
      'Range-control fighters are making a comeback by combining sharp jabs, teeps, lateral movement, and counter striking.',
  },
];

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>AI Kickboxing Coach</Text>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>Latest fight news, articles, and training trends.</Text>

      {articles.map((article, index) => (
        <Pressable key={index} style={styles.card}>
          <Image source={{ uri: article.image }} style={styles.image} />
          <Text style={styles.source}>{article.source} • {article.date}</Text>
          <Text style={styles.articleTitle}>{article.title}</Text>
          <Text style={styles.description}>{article.description}</Text>
          <Text style={styles.readMore}>Read article →</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#101010' },
  content: { padding: 20, paddingBottom: 40 },
  appName: { color: '#ff3b30', fontSize: 16, fontWeight: '700', marginTop: 30, marginBottom: 8 },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#aaa', fontSize: 16, marginBottom: 20 },
  card: { backgroundColor: '#1b1b1b', borderRadius: 18, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a2a' },
  image: { width: '100%', height: 180, borderRadius: 14, marginBottom: 12, backgroundColor: '#111' },
  source: { color: '#ff3b30', fontSize: 13, fontWeight: '800', marginBottom: 6 },
  articleTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  description: { color: '#aaa', fontSize: 15, lineHeight: 21, marginBottom: 10 },
  readMore: { color: '#ff3b30', fontSize: 15, fontWeight: '800' },
});
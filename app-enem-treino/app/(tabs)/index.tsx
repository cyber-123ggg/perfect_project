import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, Foco Total! 👋</Text>
        <Text style={styles.title}>O que vamos fazer hoje?</Text>
      </View>

      <View style={styles.menu}>
        {/* BOTÃO EXERCÍCIOS - ROXO VIBRANTE */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/exercicios')}
        >
          <View style={styles.iconCircle}>
            <Entypo name="flash" size={32} color="#f5f5f5" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Treino Férias</Text>
            <Text style={styles.cardSubtitle}>Foco na evolução e força</Text>
          </View>
          <Entypo name="chevron-right" size={24} color="#7B1FA2" />
        </TouchableOpacity>

        {/* BOTÃO ESTUDOS - ROXO ESCURO */}
        <TouchableOpacity 
          style={[styles.card, styles.cardEnem]} 
          onPress={() => router.push('/estudos')}
        >
          <View style={[styles.iconCircle, styles.iconEnem]}>
            <Entypo name="book" size={30} color="#f5f5f5" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Estudos ENEM</Text>
            <Text style={styles.cardSubtitle}>Conteúdos e revisões</Text>
          </View>
          <Entypo name="chevron-right" size={24} color="#311B92" />
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>"A constância vence o talento."</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 25, justifyContent: 'center' },
  header: { marginBottom: 40 },
  welcome: { fontSize: 16, color: '#BDBDBD', marginBottom: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f5f5f5', lineHeight: 34 },
  menu: { gap: 20 },
  card: { 
    backgroundColor: '#1E1E1E', 
    padding: 20, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#311B92'
  },
  cardEnem: { borderColor: '#7B1FA2' },
  iconCircle: { width: 60, height: 60, backgroundColor: '#311B92', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconEnem: { backgroundColor: '#7B1FA2' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5f5f5' },
  cardSubtitle: { fontSize: 13, color: '#BDBDBD', marginTop: 2 },
  footer: { textAlign: 'center', color: '#4A148C', marginTop: 50, fontSize: 14, fontStyle: 'italic' }
});
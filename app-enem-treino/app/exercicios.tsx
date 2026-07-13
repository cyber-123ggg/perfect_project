import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

export default function Exercicios() {
  const router = useRouter();

  const listaExercicios = [
    { id: '1', nome: 'Flexão de Braço', foco: 'Peito e Tríceps', meta: '3 séries', imagem: require('../assets/imagens_treino/imagem1.png') },
    { id: '2', nome: 'Abdominal Supra', foco: 'Core / Barriga', meta: '3 séries', imagem: require('../assets/imagens_treino/imagem2.png') },
    { id: '3', nome: 'Agachamento Livre', foco: 'Pernas e Glúteos', meta: '3 séries', imagem: require('../assets/imagens_treino/imagem3.png') },
    { id: '4', nome: 'Prancha Isométrica', foco: 'Resistência Core', meta: '3 séries', imagem: require('../assets/imagens_treino/imagem4.png') },
    { id: '5', nome: 'Polichinelo', foco: 'Cardio / Aquecimento', meta: '3 séries', imagem: require('../assets/imagens_treino/imagem5.jpg') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Arsenal de Treino</Text>
        <TouchableOpacity style={styles.perfil}>
          <Entypo name="user" size={24} color="#f5f5f5" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.playButton} 
        onPress={() => router.push('/treino_ativo')}
      >
        {/* Usando o ícone clássico de play da Entypo */}
        <Entypo name="controller-play" size={28} color="#f5f5f5" style={{marginRight: 10}} />
        <Text style={styles.playButtonText}>COMEÇAR TREINO</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Toca num exercício para ver evolução:</Text>

      <FlatList
        data={listaExercicios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push(`/detalhe_exercicio?nome=${item.nome}`)}
          >
            {/* Corrigido aqui para 'bar-graph' */}
            <Entypo name="bar-graph" size={22} color="#9C27B0" style={styles.iconGraph} />
            
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSubtitle}>{item.foco} • {item.meta}</Text>
            </View>
            <Image source={item.imagem} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#f5f5f5' },
  perfil: { width: 45, height: 45, backgroundColor: '#1E1E1E', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  playButton: { backgroundColor: '#311B92', padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 35, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3 },
  playButtonText: { color: '#f5f5f5', fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 14, fontWeight: '600', color: '#BDBDBD', marginBottom: 15 },
  card: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 12, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 3, borderLeftColor: '#7B1FA2' },
  iconGraph: { position: 'absolute', top: 12, right: 90, opacity: 0.7 },
  cardInfo: { flex: 1, paddingRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#f5f5f5' },
  cardSubtitle: { fontSize: 12, color: '#BDBDBD', fontWeight: '500' },
  image: { width: 60, height: 60, borderRadius: 10, resizeMode: 'cover', borderWidth: 1, borderColor: '#311B92' }
});
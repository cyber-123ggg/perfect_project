import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

export default function Estudos() {
  const router = useRouter();

  const materias = [
    { id: '1', nome: 'Matemática', icone: 'calculator' },
    { id: '2', nome: 'Linguagens', icone: 'language' },
    { id: '3', nome: 'Ciências Natureza', icone: 'leaf' },
    { id: '4', nome: 'Ciências Humanas', icone: 'globe' },
    { id: '5', nome: 'Redação', icone: 'edit' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Entypo name="chevron-left" size={28} color="#f5f5f5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cronograma ENEM</Text>
      </View>

      <Text style={styles.subtitle}>Selecione a matéria para estudar:</Text>

      <FlatList
        data={materias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({ pathname: '/conteudos', params: { materia: item.nome } })}
          >
            <View style={styles.iconArea}>
              <Entypo name={item.icone as any} size={24} color="#f5f5f5" />
            </View>
            <Text style={styles.nomeMateria}>{item.nome}</Text>
            <Entypo name="chevron-right" size={20} color="#7B1FA2" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#f5f5f5', marginLeft: 10 },
  subtitle: { fontSize: 14, color: '#BDBDBD', marginBottom: 20 },
  card: { backgroundColor: '#1E1E1E', padding: 18, borderRadius: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#7B1FA2' },
  iconArea: { width: 45, height: 45, backgroundColor: '#311B92', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  nomeMateria: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#f5f5f5' }
});
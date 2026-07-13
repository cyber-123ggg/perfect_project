import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';

interface RegistroTreino { data: string; total: number; }

export default function DetalheExercicio() {
  const { nome } = useLocalSearchParams();
  const router = useRouter();
  const [historico, setHistorico] = useState<RegistroTreino[]>([]);
  const [carregando, setCarregando] = useState(true);

  const chaveEx = `@evolucao_${nome}`;

  const carregarEvolucao = async () => {
    try {
      const dados = await AsyncStorage.getItem(chaveEx);
      if (dados) setHistorico(JSON.parse(dados));
      else setHistorico([]);
    } catch (e) { console.log(e); } finally { setCarregando(false); }
  };

  useEffect(() => { carregarEvolucao(); }, [nome]);

  const apagarRegistroIndividual = (indexParaRemover: number, dataRegistro: string, totalRegistro: number) => {
    Alert.alert(
      "Apagar Registro", `Deseja apagar o treino do dia ${dataRegistro}? (Recorde: ${totalRegistro})`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar", style: "destructive", onPress: async () => {
          const novaLista = historico.filter((_, index) => index !== indexParaRemover);
          await AsyncStorage.setItem(chaveEx, JSON.stringify(novaLista));
          setHistorico(novaLista);
          alert("Corrigido!");
        }}
      ]
    );
  };

  const maiorTotal = historico.length > 0 ? Math.max(...historico.map(item => item.total)) : 1;
  if (carregando) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Entypo name="chevron-left" size={28} color="#f5f5f5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Evolução Total</Text>
      </View>

      <Text style={styles.tituloSecundario}>Acompanhando:</Text>
      <Text style={styles.tituloPrincipal}>{nome}</Text>

      {historico.length === 0 ? (
        <View style={styles.centroVazio}>
          <Entypo name="area-graph" size={50} color="#7B1FA2" style={{marginBottom: 15}}/>
          <Text style={styles.textoVazio}>Nenhum registro ainda. 📋</Text>
          <Text style={styles.subTextoVazio}>Faça o treino e grave as repetições!</Text>
        </View>
      ) : (
        <View style={styles.graficoContainer}>
          <Text style={styles.tituloGrafico}>📈 Repetições Totais</Text>
          <Text style={styles.dicaGrafico}>💡 Toca numa barra para apagar registro errado.</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollGrafico}>
            {historico.map((item, index) => {
              const alturaBarra = (item.total / maiorTotal) * 120;
              return (
                <TouchableOpacity key={index} style={styles.colunaGrafico} onPress={() => apagarRegistroIndividual(index, item.data, item.total)}>
                  <Text style={styles.valorBarra}>{item.total}</Text>
                  <View style={[styles.barra, { height: Math.max(alturaBarra, 15) }]} />
                  <Text style={styles.dataBarra}>{item.data}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {historico.length > 0 && (
        <View style={styles.cardInfo}>
          <Entypo name="trophy" size={20} color="#FFD600" style={{marginRight: 10}}/>
          <Text style={styles.txtInfo}>Recorde atual: <Text style={{fontWeight: 'bold', color: '#B71C1C'}}>{maiorTotal}</Text> repetições!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 18, color: '#BDBDBD', fontWeight: '500', marginLeft: 10 },
  tituloSecundario: { fontSize: 16, color: '#999', marginBottom: 2 },
  tituloPrincipal: { fontSize: 24, fontWeight: 'bold', color: '#f5f5f5', marginBottom: 30 },
  centroVazio: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  textoVazio: { fontSize: 18, fontWeight: 'bold', color: '#f5f5f5', marginBottom: 10 },
  subTextoVazio: { fontSize: 13, color: '#BDBDBD', textAlign: 'center' },
  graficoContainer: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 15, borderLeftWidth: 3, borderLeftColor: '#7B1FA2' },
  tituloGrafico: { fontSize: 16, fontWeight: 'bold', color: '#f5f5f5', marginBottom: 5 },
  dicaGrafico: { fontSize: 11, color: '#BDBDBD', marginBottom: 20 },
  scrollGrafico: { alignItems: 'flex-end', paddingBottom: 10, gap: 20 },
  colunaGrafico: { alignItems: 'center', justifyContent: 'flex-end' },
  valorBarra: { fontSize: 12, fontWeight: 'bold', color: '#E1BEE7', marginBottom: 5 },
  barra: { width: 35, backgroundColor: '#E1BEE7', borderRadius: 6 },
  dataBarra: { fontSize: 10, color: '#BDBDBD', marginTop: 8, fontWeight: '500' },
  cardInfo: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  txtInfo: { fontSize: 14, color: '#f5f5f5' }
});
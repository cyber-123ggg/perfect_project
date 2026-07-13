import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';

const exerciciosTreino = [
  { id: '1', nome: 'Flexão de Braço', tipo: 'reps' },
  { id: '2', nome: 'Abdominal Supra', tipo: 'reps' },
  { id: '3', nome: 'Agachamento Livre', tipo: 'reps' },
  { id: '4', nome: 'Prancha Isométrica', tipo: 'tempo' },
  { id: '5', nome: 'Polichinelo', tipo: 'tempo' },
];

export default function TreinoAtivo() {
  const router = useRouter();
  
  const [dadosTreino, setDadosTreino] = useState<{ [key: string]: { s1: string, s2: string, s3: string } }>({
    '1': { s1: '', s2: '', s3: '' },
    '2': { s1: '', s2: '', s3: '' },
    '3': { s1: '', s2: '', s3: '' },
    '4': { s1: '', s2: '', s3: '' },
    '5': { s1: '', s2: '', s3: '' },
  });

  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [alvoCronometro, setAlvoCronometro] = useState<{ idEx: string, serie: 's1' | 's2' | 's3' } | null>(null);

  useEffect(() => {
    let intervalo: any;
    if (cronometroAtivo) {
      intervalo = setInterval(() => setTempoAtual(prev => prev + 1), 1000);
    }
    return () => clearInterval(intervalo);
  }, [cronometroAtivo]);

  const atualizarSerie = (idEx: string, serie: 's1' | 's2' | 's3', valor: string) => {
    setDadosTreino(prev => ({ ...prev, [idEx]: { ...prev[idEx], [serie]: valor } }));
  };

  const acionarTimer = (idEx: string, serie: 's1' | 's2' | 's3') => {
    if (cronometroAtivo && alvoCronometro?.idEx === idEx && alvoCronometro?.serie === serie) {
      atualizarSerie(idEx, serie, tempoAtual.toString());
      setCronometroAtivo(false);
      setAlvoCronometro(null);
    } else {
      setTempoAtual(0);
      setAlvoCronometro({ idEx, serie });
      setCronometroAtivo(true);
    }
  };

  const finalizarTreino = async () => {
    try {
      const hoje = new Date();
      const dataFormatada = `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth() + 1).toString().padStart(2, '0')}`;

      for (const ex of exerciciosTreino) {
        const s1 = parseInt(dadosTreino[ex.id].s1 || '0', 10);
        const s2 = parseInt(dadosTreino[ex.id].s2 || '0', 10);
        const s3 = parseInt(dadosTreino[ex.id].s3 || '0', 10);
        const totalTreino = s1 + s2 + s3;

        if (totalTreino > 0) {
          const chaveEx = `@evolucao_${ex.nome}`;
          const historicoAntigo = await AsyncStorage.getItem(chaveEx);
          let listaEvolucao = historicoAntigo ? JSON.parse(historicoAntigo) : [];
          listaEvolucao.push({ data: dataFormatada, total: totalTreino });
          await AsyncStorage.setItem(chaveEx, JSON.stringify(listaEvolucao));
        }
      }
      alert("Treino salvo! Foco total. 💪");
    } catch (e) { console.log(e); }
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Entypo name="chevron-left" size={28} color="#f5f5f5" />
        </TouchableOpacity>
        <Text style={styles.title}>Registrar Séries</Text>
      </View>
      
      <FlatList
        data={exerciciosTreino}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <View style={styles.seriesContainer}>
              {(['s1', 's2', 's3'] as const).map((numSerie, idx) => {
                const exibindoEsteTimer = cronometroAtivo && alvoCronometro?.idEx === item.id && alvoCronometro?.serie === numSerie;
                
                return (
                  <View key={numSerie} style={styles.campoInput}>
                    <Text style={styles.labelSerie}>{idx + 1}ª Série</Text>
                    
                    {item.tipo === 'tempo' ? (
                      <TouchableOpacity 
                        style={[styles.botaoTimer, exibindoEsteTimer && styles.botaoTimerRodando]}
                        onPress={() => acionarTimer(item.id, numSerie)}
                      >
                        <Text style={[styles.textoTimer, exibindoEsteTimer && styles.textoTimerRodando]}>
                          {exibindoEsteTimer ? `⏱️ ${tempoAtual}s` : (dadosTreino[item.id][numSerie] ? `${dadosTreino[item.id][numSerie]}s` : '▶️ Timer')}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#BDBDBD"
                        value={dadosTreino[item.id][numSerie]}
                        onChangeText={(txt) => atualizarSerie(item.id, numSerie, txt)}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botaoFinalizar} onPress={finalizarTreino}>
        <Entypo name="save" size={20} color="#f5f5f5" style={{marginRight: 8}}/>
        <Text style={styles.textoBotao}>FINALIZAR E GRAVAR</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#f5f5f5', marginLeft: 10 },
  card: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 3, borderLeftColor: '#311B92' },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#f5f5f5', marginBottom: 12 },
  seriesContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  campoInput: { flex: 1, alignItems: 'center' },
  labelSerie: { fontSize: 11, color: '#BDBDBD', marginBottom: 4, fontWeight: '500' },
  input: { width: '100%', height: 40, backgroundColor: '#121212', borderRadius: 8, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#f5f5f5', borderBottomWidth: 2, borderBottomColor: '#7B1FA2' },
  botaoTimer: { width: '100%', height: 40, backgroundColor: '#311B92', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#E1BEE7' },
  botaoTimerRodando: { backgroundColor: '#FF8A65', borderBottomColor: '#E64A19' }, // Laranja vibrante quando rodando
  textoTimer: { fontSize: 12, fontWeight: 'bold', color: '#f5f5f5' },
  textoTimerRodando: { color: '#f5f5f5' },
  botaoFinalizar: { backgroundColor: '#7B1FA2', padding: 18, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, elevation: 3 }, // Roxo médio
  textoBotao: { color: '#f5f5f5', fontSize: 17, fontWeight: 'bold' }
});
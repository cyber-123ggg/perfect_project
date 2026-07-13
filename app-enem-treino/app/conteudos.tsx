import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// MAPEAMENTO DE CONTEÚDOS REAIS DO ENEM
const DICIONARIO_CONTEUDOS: { [key: string]: string[] } = {
  'Matemática': [
    'Matemática Básica (Operações)', 'Razão, Proporção e Regra de 3', 'Porcentagem e Juros', 
    'Estatística (Média, Moda, Mediana)', 'Probabilidade', 'Geometria Plana (Áreas)', 
    'Geometria Espacial (Volumes)', 'Funções de 1º e 2º Grau', 'Análise Combinatória', 
    'Trigonometria', 'Progressões (PA e PG)', 'Logaritmos e Exponencial'
  ],
  'Linguagens': [
    'Interpretação de Texto', 'Gêneros Textuais', 'Variação Linguística', 
    'Modernismo no Brasil', 'Figuras de Linguagem', 'Literatura Contemporânea'
  ],
  'Ciências Natureza': [
    'Ecologia e Meio Ambiente', 'Genética e DNA', 'Mecânica (Física)', 
    'Eletricidade', 'Estequiometria (Química)', 'Termoquímica'
  ],
  'Ciências Humanas': [
    'Era Vargas e Ditadura Militar', 'Brasil Colônia', 'Geopolítica Mundial', 
    'Filosofia Moderna', 'Sociologia Contemporânea', 'Revolução Industrial'
  ],
  'Redação': [
    'Estrutura do Texto Dissertativo', 'Repertórios Coringa', 'Conectivos e Coesão', 
    'Proposta de Intervenção', 'Análise de Redações Nota 1000'
  ],
};

interface RegistroEstudo { data: string; minutos: number; }

export default function Conteudos() {
  const { materia } = useLocalSearchParams();
  const router = useRouter();
  const nomeMateria = String(materia);

  // Estados
  const [topicos, setTopicos] = useState<{titulo: string, feito: boolean}[]>([]);
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [historico, setHistorico] = useState<RegistroEstudo[]>([]);

  const chaveChecks = `@checks_${nomeMateria}`;
  const chaveTempo = `@tempo_estudo_${nomeMateria}`;

  // Carregar dados ao entrar
  useEffect(() => {
    carregarDados();
  }, [nomeMateria]);

  const carregarDados = async () => {
    try {
      // Carrega Checks
      const guardados = await AsyncStorage.getItem(chaveChecks);
      const listaBase = DICIONARIO_CONTEUDOS[nomeMateria] || [];
      if (guardados) {
        setTopicos(JSON.parse(guardados));
      } else {
        setTopicos(listaBase.map(t => ({ titulo: t, feito: false })));
      }

      // Carrega Gráfico
      const tempoGuardado = await AsyncStorage.getItem(chaveTempo);
      if (tempoGuardado) setHistorico(JSON.parse(tempoGuardado));
    } catch (e) { console.log(e); }
  };

  // Timer
  useEffect(() => {
    let intervalo: any;
    if (ativo) intervalo = setInterval(() => setSegundos(s => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, [ativo]);

  const finalizarSessao = async () => {
    if (segundos < 5) {
      Alert.alert("Tempo insuficiente", "Estude um pouco mais antes de gravar.");
      return;
    }
    setAtivo(false);
    const minutosEstudados = Math.round(segundos / 60) || 1;
    const hoje = new Date();
    const dataFormatada = `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth() + 1).toString().padStart(2, '0')}`;

    try {
      let novoHistorico = [...historico];
      const indexDia = novoHistorico.findIndex(h => h.data === dataFormatada);
      
      if (indexDia !== -1) novoHistorico[indexDia].minutos += minutosEstudados;
      else novoHistorico.push({ data: dataFormatada, minutos: minutosEstudados });

      await AsyncStorage.setItem(chaveTempo, JSON.stringify(novoHistorico));
      setHistorico(novoHistorico);
      setSegundos(0);
      Alert.alert("Sessão Gravada!", `Você adicionou ${minutosEstudados}min ao seu gráfico.`);
    } catch (e) { console.log(e); }
  };

  // FUNÇÃO DE APAGAR REGISTRO INDIVIDUAL DO GRÁFICO
  const apagarRegistroEstudo = (indexParaRemover: number, dataRegistro: string, minutos: number) => {
    Alert.alert(
      "Apagar Registro", 
      `Deseja excluir o tempo de estudo do dia ${dataRegistro}? (${minutos} minutos registrados)`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Apagar", 
          style: "destructive", 
          onPress: async () => {
            const novaLista = historico.filter((_, index) => index !== indexParaRemover);
            await AsyncStorage.setItem(chaveTempo, JSON.stringify(novaLista));
            setHistorico(novaLista);
          }
        }
      ]
    );
  };

  const toggleCheck = async (index: number) => {
    const novaLista = [...topicos];
    novaLista[index].feito = !novaLista[index].feito;
    setTopicos(novaLista);
    await AsyncStorage.setItem(chaveChecks, JSON.stringify(novaLista));
  };

  const formatarTempo = (s: number) => {
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return `${m.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  // Lógica de altura do Gráfico
  const maiorTempo = historico.length > 0 ? Math.max(...historico.map(h => h.minutos)) : 1;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-left" size={28} color="#f5f5f5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{nomeMateria}</Text>
        </View>

        {/* TIMER CARD */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Sessão de Estudo</Text>
          <Text style={styles.timerValue}>{formatarTempo(segundos)}</Text>
          <View style={styles.timerButtons}>
            <TouchableOpacity style={[styles.btnTimer, ativo ? styles.btnPause : styles.btnPlay]} onPress={() => setAtivo(!ativo)}>
              <Entypo name={ativo ? "controller-paus" : "controller-play"} size={22} color="#fff" />
              <Text style={styles.btnText}>{ativo ? "Pausar" : "Começar"}</Text>
            </TouchableOpacity>
            {segundos > 0 && (
              <TouchableOpacity style={styles.btnFinalizar} onPress={finalizarSessao}>
                <Entypo name="check" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* GRÁFICO DE EVOLUÇÃO (AGORA ENVOLVIDO EM TOUCHABLEOPACITY) */}
        {historico.length > 0 && (
          <View style={styles.graficoCard}>
            <Text style={styles.graficoTitle}>Evolução Semanal (Minutos)</Text>
            <Text style={styles.graficoDica}>💡 Toque na barra para apagar um registro errado.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollGrafico}>
              {historico.map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.colunaGrafico}
                  onPress={() => apagarRegistroEstudo(idx, item.data, item.minutos)} // <-- Aciona o Alerta para Excluir
                >
                  <Text style={styles.txtMin}>{item.minutos}m</Text>
                  <View style={[styles.barra, { height: Math.max((item.minutos / maiorTempo) * 80, 10) }]} />
                  <Text style={styles.txtData}>{item.data}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.sectionTitle}>Checklist de Conteúdos:</Text>
        {topicos.map((item, index) => (
          <View key={index} style={[styles.card, item.feito && styles.cardFeito]}>
            <Text style={[styles.cardText, item.feito && styles.textFeito]}>{item.titulo}</Text>
            <TouchableOpacity 
              style={[styles.btnOk, item.feito && styles.btnOkAtivo]} 
              onPress={() => toggleCheck(index)}
            >
              <Text style={styles.btnOkText}>{item.feito ? "OK!" : "OK?"}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#f5f5f5', marginLeft: 10 },
  timerCard: { backgroundColor: '#1E1E1E', padding: 25, borderRadius: 20, alignItems: 'center', marginBottom: 25, borderBottomWidth: 4, borderBottomColor: '#7B1FA2' },
  timerLabel: { color: '#BDBDBD', fontSize: 13, marginBottom: 5 },
  timerValue: { color: '#f5f5f5', fontSize: 50, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  timerButtons: { flexDirection: 'row', marginTop: 15, gap: 15 },
  btnTimer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  btnPlay: { backgroundColor: '#311B92' },
  btnPause: { backgroundColor: '#B71C1C' },
  btnFinalizar: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  graficoCard: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 15, marginBottom: 25 },
  graficoTitle: { color: '#BDBDBD', fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
  graficoDica: { color: '#777', fontSize: 11, marginBottom: 15 },
  scrollGrafico: { alignItems: 'flex-end', gap: 15 },
  colunaGrafico: { alignItems: 'center', justifyContent: 'flex-end' },
  txtMin: { color: '#E1BEE7', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  barra: { width: 30, backgroundColor: '#7B1FA2', borderRadius: 4 },
  txtData: { color: '#777', fontSize: 9, marginTop: 5 },
  sectionTitle: { color: '#f5f5f5', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardFeito: { opacity: 0.5 },
  cardText: { color: '#f5f5f5', fontSize: 15, flex: 1, paddingRight: 10 },
  textFeito: { textDecorationLine: 'line-through' },
  btnOk: { backgroundColor: '#311B92', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  btnOkAtivo: { backgroundColor: '#4CAF50' },
  btnOkText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
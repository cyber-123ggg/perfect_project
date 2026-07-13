import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cronometro() {
  const { titulo } = useLocalSearchParams();
  const router = useRouter();
  
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Garante que a chave sempre tenha um nome, mesmo que dê um bug de leitura
  const chaveStorage = `@tempo_${titulo || 'geral'}`;

  // Busca o tempo salvo assim que abre a tela
  useEffect(() => {
    const buscarTempoSalvo = async () => {
      try {
        const tempoSalvo = await AsyncStorage.getItem(chaveStorage);
        if (tempoSalvo !== null) {
          console.log(`Carregou ${tempoSalvo} segundos de ${titulo}`); // Aviso interno para você ver no PC
          setSegundos(parseInt(tempoSalvo, 10));
        }
      } catch (error) {
        console.log("Erro ao carregar:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    buscarTempoSalvo();
  }, [titulo]);

  // Motor do relógio - Agora salva A CADA SEGUNDO
  useEffect(() => {
    let intervalo: any;
    if (ativo) {
      intervalo = setInterval(() => {
        setSegundos((prev) => {
          const novoTempo = prev + 1;
          // Salva agressivamente toda vez que o relógio bate
          AsyncStorage.setItem(chaveStorage, novoTempo.toString());
          return novoTempo;
        });
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [ativo, chaveStorage]);

  const alternarPausa = async () => {
    if (ativo) {
      await AsyncStorage.setItem(chaveStorage, segundos.toString());
    }
    setAtivo(!ativo);
  };

  const finalizarEstudo = async () => {
    setAtivo(false);
    await AsyncStorage.setItem(chaveStorage, segundos.toString());
    alert(`Tempo guardado: ${formatarTempo()}!`);
    router.back();
  };

  const formatarTempo = () => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  if (carregando) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloSecundario}>Estudando agora:</Text>
      <Text style={styles.tituloPrincipal}>{titulo || 'Conteúdo'}</Text>

      <View style={styles.relogioContainer}>
        <Text style={styles.tempo}>{formatarTempo()}</Text>
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity 
          style={[styles.botao, ativo ? styles.botaoPausar : styles.botaoIniciar]} 
          onPress={alternarPausa}
        >
          <Text style={styles.textoBotao}>{ativo ? '⏸️ Pausar' : '▶️ Iniciar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, styles.botaoFinalizar]} onPress={finalizarEstudo}>
          <Text style={styles.textoBotao}>✅ Finalizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 20 },
  tituloSecundario: { fontSize: 18, color: '#777', marginBottom: 5 },
  tituloPrincipal: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 50 },
  relogioContainer: { backgroundColor: '#fff', padding: 40, borderRadius: 100, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, marginBottom: 50 },
  tempo: { fontSize: 48, fontWeight: 'bold', color: '#4CAF50' },
  botoesContainer: { flexDirection: 'row', gap: 20 },
  botao: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, elevation: 2 },
  botaoIniciar: { backgroundColor: '#2196F3' },
  botaoPausar: { backgroundColor: '#FF9800' },
  botaoFinalizar: { backgroundColor: '#4CAF50' },
  textoBotao: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
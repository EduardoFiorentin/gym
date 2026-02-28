import { Box, Button, Flex, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TreinosHistoryItem from "./TreinosHistoryItem"
import { useTreinamentoHistory } from "../../../hooks/useTreinamentoHistory"
import { useEffect } from "react"

const TreinoHistoryComponent = () => {
    
    const { treinamentoHistory, error, updateStartingFrom, isLoading, isInitializing } = useTreinamentoHistory();
    
    useEffect(() => {
        console.log("erro: ", error);
        console.log("data: ", treinamentoHistory);
    }, [error, treinamentoHistory]);

    return (
        <BaseContainer 
            height="auto"
            direction="column"
            verticalAlign="flex-start"
            justifyContent="flex-start"
        >
            <Flex
                borderBottom={"1px solid black"}
                width={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingBottom={"5px"}
            >
                <Text fontWeight={"bolder"}>Meu Histórico</Text>
                <Button
                    onClick={() => updateStartingFrom()}
                    variant={"plain"}
                    border={"1px solid black"}
                    disabled={isLoading || isInitializing} 
                >
                    {isLoading ? "Atualizando..." : "Reload"}
                </Button>
            </Flex>
            <Box w={"100%"}>
                {(isLoading || isInitializing) ? (
                    <Text>Carregando meu histórico...</Text>
                ) : error ? (
                    <Text>{error.message}</Text>
                ) : (
                    treinamentoHistory && treinamentoHistory.map(th => (
                        <TreinosHistoryItem 
                            key={th.id} 
                            onClickRedirect={() => {}} 
                            name={th.treinoName} 
                            date={th.startedAt}
                        />        
                    ))
                )}
            </Box>
        </BaseContainer>
    );
}

// const TreinoHistoryComponent = () => {
//     // 1. Extraindo as funcionalidades do seu hook
//     const { 
//         treinoHistory, 
//         isInitializing, 
//         updateStartingFrom, 
//         isLoading, 
//         error 
//     } = useTreinamentoHistory();

//     // 2. Estado para controlar o input de filtro de data
//     const [dataFiltro, setDataFiltro] = useState('');

//     // 3. Função para acionar o client/API
//     const handleBuscar = async () => {
//         if (!dataFiltro) return;
        
//         try {
//             // Converte a string do input (YYYY-MM-DD) para Date e envia para a mutation
//             const dataInicio = new Date(dataFiltro);
//             await updateStartingFrom(dataInicio);
//         } catch (e) {
//             console.error("Falha ao buscar meu histórico de treinamentos:", e);
//         }
//     };

//     // Função auxiliar para exibir as datas no padrão local (Brasil)
//     const formatarDataLocal = (data: Date) => {
//         return new Intl.DateTimeFormat('pt-BR', {
//             dateStyle: 'short',
//             timeStyle: 'short'
//         }).format(data);
//     };

//     // Tela de carregamento inicial
//     if (isInitializing) {
//         return <p>Carregando meus treinamentos...</p>;
//     }

//     return (
//         <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//             <h1>Meus Treinamentos</h1>

//             {/* Seção de Filtro */}
//             <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
//                 <label htmlFor="dataFiltro" style={{ marginRight: '10px' }}>
//                     Buscar a partir de: 
//                 </label>
//                 <input 
//                     type="date" 
//                     id="dataFiltro" 
//                     value={dataFiltro}
//                     onChange={(e) => setDataFiltro(e.target.value)}
//                     style={{ marginRight: '10px' }}
//                 />
//                 <button 
//                     onClick={handleBuscar} 
//                     disabled={isLoading || !dataFiltro}
//                 >
//                     {isLoading ? 'Buscando...' : 'Atualizar Histórico'}
//                 </button>
                
//                 {error && <p style={{ color: 'red', marginTop: '10px' }}>Ocorreu um erro ao tentar atualizar os dados.</p>}
//             </section>

//             {/* Listagem dos Dados */}
//             <section>
//                 <h2>Histórico</h2>
//                 {treinoHistory && treinoHistory.length > 0 ? (
//                     <ul style={{ listStyle: 'none', padding: 0 }}>
//                         {treinoHistory.map((treino, index) => (
//                             <li key={index} style={{ 
//                                 padding: '15px', 
//                                 border: '1px solid #eee', 
//                                 marginBottom: '10px',
//                                 borderRadius: '4px'
//                             }}>
//                                 <strong>Treino {index + 1}</strong>
//                                 <div style={{ marginTop: '8px' }}>
//                                     <span>Início: {formatarDataLocal(treino.startedAt)}</span>
//                                     <br />
//                                     <span>Fim: {formatarDataLocal(treino.finishedAt)}</span>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>Nenhum treinamento listado para este período.</p>
//                 )}
//             </section>
//         </main>
//     );
// };

export default TreinoHistoryComponent
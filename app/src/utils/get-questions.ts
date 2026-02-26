const questions = [
  {
    category: "Ticker",
    categories: [
      {
        name: "Eficiência e Rentabilidade",
        description:
          "Esta categoria mede se a empresa é uma máquina de gerar dinheiro ou apenas 'troca seis por meia dúzia'.",
        questions: [
          "Rentabilidade Real (ROE): O ROE é historicamente maior que 10% e superior à Selic atual?",
          "Retorno sobre Capital (ROIC): O ROIC é maior que 10% e consistentemente superior ao custo da dívida?",
          "Margem de Segurança (Líquida): A Margem Líquida é superior a 10% de forma constante (sem oscilações bruscas)?",
          "Eficiência Operacional (EBIT): A Margem EBIT é superior a 15% (indicando forte poder de preço e controle de custos)?",
          "Histórico de Crescimento: A Receita ou o Lucro Líquido cresceram, em média, mais de 5% ao ano nos últimos 5 anos?",
        ],
      },
      {
        name: "Segurança Financeira e Resiliência",
        description:
          "Esta categoria garante que a empresa não vá à falência na próxima crise.",
        questions: [
          "Endividamento Saudável: A relação Dívida Líquida/EBITDA é menor que 2 (a empresa quita a dívida em menos de 2 anos de geração de caixa)?",
          "Poder de Sobrevivência: A empresa tem mais de 30 anos de fundação (provou que sobrevive a diferentes ciclos econômicos)?",
          "Perenidade do Setor: O setor de atuação existe há mais de 100 anos (baixo risco de ser substituído por uma tecnologia disruptiva amanhã)?",
          "Combate à Obsolescência: A empresa investe ativamente em Pesquisa, Desenvolvimento e Inovação para não ficar para trás?",
        ],
      },
      {
        name: "Governança e Estrutura",
        description:
          "Esta categoria avalia quem manda e se os interesses estão alinhados com os seus.",
        questions: [
          "Dominância de Mercado: A empresa é a líder absoluta (1ª colocada) em seu setor de atuação nacional ou mundial?",
          "Independência de Gestão: A empresa é livre de controle estatal e não depende de um único cliente para mais de 20% da sua receita?",
          "Integridade Corporativa: A gestão possui ficha limpa, sem qualquer histórico ou envolvimento em casos de corrupção?",
          "Robustez de Mercado (Blue Chip): A empresa é considerada uma 'Blue Chip' (grande capitalização, alta liquidez e presença no índice IBOVESPA)?",
        ],
      },
      {
        name: "Política de Proventos",
        description: "Esta categoria foca em como você será remunerado.",
        questions: [
          "Cultura de Dividendos: Existe um histórico ininterrupto e sólido de pagamento de dividendos aos acionistas?",
          "Sustentabilidade do Payout: O Payout (porcentagem do lucro distribuído) está entre 30% e 70%, garantindo que sobra dinheiro para a empresa crescer?",
        ],
      },
    ],
  },
  {
    category: "Fii",
    categories: [
      {
        name: "Qualidade e Lastro",
        description:
          "Avalia o que sustenta o dinheiro: a qualidade física dos imóveis ou o risco de crédito das dívidas.",
        questions: [
          "Qualidade do Ativo/Crédito: No Tijolo, os imóveis são Classe A? No Papel/Infra, o rating das dívidas é majoritariamente Investment Grade (A ou superior)?",
          "Diversificação de Risco: O fundo possui mais de 10 ativos diferentes (prédios ou contratos de dívida)?",
          "Localização/Setor Estratégico: Os imóveis estão em regiões nobres ou as debêntures de infraestrutura são de setores vitais?",
          "Baixa Concentração: Nenhum inquilino ou devedor representa mais de 20% da receita total do fundo?",
        ],
      },
      {
        name: "Gestão e Histórico",
        description:
          "Analisa quem pilota o fundo, a transparência das informações e a facilidade de entrar ou sair do investimento.",
        questions: [
          "Experiência do Gestor: A gestora tem mais de 10 anos de mercado e um histórico sólido em ciclos de crise?",
          "Transparência e Relatórios: Os relatórios mensais são claros, detalhados e explicam exatamente onde o dinheiro está investido?",
          "Alinhamento de Interesses: A gestora possui participação no próprio fundo ou as taxas de performance são justas?",
          "Liquidez de Mercado: O volume médio de negociação diária é superior a R$ 1 milhão?",
        ],
      },
      {
        name: "Estrutura Financeira (O Sarrafo)",
        description:
          "Mede a proteção contra a inflação, o preço justo em relação ao valor patrimonial e a eficiência das taxas.",
        questions: [
          "Proteção contra Inflação: No Tijolo, os contratos são corrigidos por IPCA/IGP-M? No Papel/Infra, a maior parte da carteira é IPCA+ ou CDI+?",
          "Dividend Yield vs. Risco: O rendimento é coerente com o risco? (FI-Infra > Tesouro IPCA+; Papel > Tijolo)",
          "P/VPA (Preço justo): O fundo está sendo negociado próximo ou abaixo do Valor Patrimonial (P/VPA < 1,05)?",
          "Taxas de Administração: O custo total (Adm + Gestão) é menor que 1,2% ao ano?",
        ],
      },
      {
        name: "Resiliência (O Escudo)",
        description:
          "Foca na previsibilidade de longo prazo e na capacidade do fundo de resistir a calotes ou desocupação.",
        questions: [
          "Vacância/Inadimplência: A vacância (Tijolo) ou a inadimplência (Papel/Infra) é menor que 5% historicamente?",
          "Isenção e Tributação: O fundo cumpre os requisitos para manter a isenção de IR para pessoa física?",
          "Duração (Duration): O prazo médio dos contratos de aluguel ou das dívidas é superior a 5 anos?",
        ],
      },
    ],
  },
];

export function getQuestions(category: string) {
  return questions.find((q) => q.category === category);
}

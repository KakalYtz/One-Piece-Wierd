/* WEIRD RPG — V11 — versão pública local organizada e expansível
   Sem Supabase: tudo salvo no navegador via localStorage.
   O código foi organizado para que a camada online possa ser adicionada depois.
*/

const ATTRS=["Força","Destreza","Constituição","Inteligência","Presença","Vontade"];
const RULES={startingPoints:12,baseHP:12,basePE:8,attributeMax:10,levelMax:10};
const ATTR_INFO={
  "Força":"Potência física, dano corpo a corpo e feitos de força.","Destreza":"Velocidade, precisão, esquiva e coordenação.","Constituição":"Resistência, PV, fôlego e tolerância a dano.","Inteligência":"Conhecimento, estratégia e escolhas extras de perícia.","Presença":"Presença social, liderança, persuasão e performance.","Vontade":"Determinação, resistência mental, Haki e efeitos de medo/controle."
};

const RACES={
"Humano":{b:{},hp:0,desc:"Versátil e adaptável. Não possui uma especialização racial extrema, mas aprende com facilidade.",skills:[["Persuasão",2]],abilities:["Adaptabilidade","Potencial Humano","Especialização","Limite Humano"]},
"Homem-Peixe":{b:{Força:2,Constituição:1},hp:2,desc:"Povo anfíbio com grande força física e domínio natural da água.",skills:[["Natação",5],["Atletismo",2]],abilities:["Anfíbio","Força Aquática","Karatê Homem-Peixe","Manipulação da Água","Mestre dos Mares"]},
"Sereiano":{b:{Destreza:2,Constituição:2},hp:1,desc:"Seres marinhos extremamente velozes na água, com grande mobilidade aquática.",skills:[["Natação",5],["Performance",2]],abilities:["Corpo Aquático","Voz Encantadora","Mestre da Natação","Forma Aquática","Senhor dos Oceanos"]},
"Mink":{b:{Destreza:2,Vontade:1},hp:1,desc:"Guerreiros animais que dominam o Eletro e podem alcançar o Sulong.",skills:[["Reflexos",5],["Sobrevivência",2]],abilities:["Instinto Animal","Eletro","Eletro Aprimorado","Sulong","Sulong Perfeito"]},
"Gigante":{b:{Força:4,Constituição:3,Destreza:-2},hp:8,desc:"Corpos enormes e força colossal. Sua grandeza traz potência, mas reduz agilidade.",skills:[["Atletismo",5],["Resistência",3]],abilities:["Corpo Gigantesco","Pisada Gigante","Força Colossal","Resistência Gigante","Poder de um Gigante"]},
"Skypiean":{b:{Destreza:2,Vontade:1},hp:0,desc:"Povo alado do céu, acostumado a combate e movimentação aérea.",skills:[["Acrobacia",5],["Reflexos",2]],abilities:["Asas","Mobilidade Celestial","Combate Aéreo","Guerreiro do Céu","Mestre Celestial"]},
"Shandian":{b:{Força:2,Vontade:1},hp:2,desc:"Guerreiros resistentes com forte espírito de sobrevivência e tradição de combate.",skills:[["Sobrevivência",5],["Luta",2]],abilities:["Guerreiro Shandian","Sobrevivente","Guerreiro Tribal","Espírito Guerreiro","Vontade Shandian"]},
"Tontatta":{b:{Destreza:3,Vontade:1,Força:-2},hp:-2,desc:"Pequenos, rápidos e surpreendentemente fortes para seu tamanho.",skills:[["Furtividade",5],["Acrobacia",3]],abilities:["Pequeno","Supervelocidade","Força Surpreendente","Mestre da Furtividade","Pequeno Demônio"]},
"Longleg":{b:{Destreza:2,Força:1},hp:0,desc:"Pernas muito longas que favorecem chutes, alcance e mobilidade.",skills:[["Acrobacia",3],["Atletismo",2]],abilities:["Pernas Longas","Chute Extremo","Passo Gigante","Dança das Pernas","Rei dos Chutes"]},
"Longarm":{b:{Força:2,Destreza:1},hp:1,desc:"Braços longos e articulados, ótimos para ataques de alcance incomum.",skills:[["Briga",3],["Atletismo",2]],abilities:["Braços Longos","Golpe Estendido","Braços Duplamente Articulados","Rajada de Braços","Braços Supremos"]},
"Lunarian":{b:{Constituição:2,Vontade:2},hp:5,desc:"Raça rara ligada ao fogo e a uma resistência extraordinária.",skills:[["Resistência",5],["Sobrevivência",2]],abilities:["Chama Natural","Corpo Flamejante","Defesa das Chamas","Fogo Lunar","Sobrevivente Celestial"]},
"Buccaneer":{b:{Força:3,Constituição:2},hp:5,desc:"Corpos grandes e poderosos, conhecidos por resistência e força fora do comum.",skills:[["Atletismo",5],["Resistência",3]],abilities:["Corpo Poderoso","Força Anormal","Sangue Guerreiro","Corpo Indestrutível","Poder do Buccaneer"]},
"Three-Eye":{b:{Inteligência:2,Vontade:2},hp:0,desc:"Terceiro olho com potencial para ampliar percepção e conhecimento.",skills:[["História",5],["Percepção",3]],abilities:["Terceiro Olho","Mente Expandida","Voz de Todas as Coisas","Despertar do Terceiro Olho","Despertar Completo"]},
"Kuja":{b:{Destreza:2,Vontade:1},hp:1,desc:"Guerreiros e arqueiros treinados desde cedo, com forte ligação ao Haki.",skills:[["Pontaria",5],["Furtividade",2]],abilities:["Guerreiro Kuja","Haki Natural","Arqueira Kuja","Flecha de Haki","Guerreira Suprema"]},
"Muscloide":{b:{Força:3,Constituição:1},hp:3,desc:"A raça dos músculos extremos. Pode alterar tamanho e uso de áreas musculares para criar diferentes estilos.",skills:[["Atletismo",5],["Resistência",3]],abilities:["Controle Muscular","Contração Especializada","Explosão Muscular","Corpo Perfeito","Força Inexplicável"]},
"Dracônica":{b:{Força:2,Constituição:2},hp:4,desc:"Escamas, garras e resistência dracônica. Pode desenvolver manifestações elementais.",skills:[["Resistência",5],["Intimidação",2]],abilities:["Escamas","Garras","Sopro Dracônico","Forma Dracônica","Dragão Completo"]},
"Lycan":{b:{Destreza:2,Força:1,Vontade:1},hp:1,desc:"Humanoides lupinos capazes de aumentar seus sentidos e entrar em forma bestial.",skills:[["Sobrevivência",5],["Furtividade",2]],abilities:["Instinto Lupino","Garras","Forma Bestial","Caçada Perfeita","Lobo Alfa"]},
"Aviano":{b:{Destreza:3,Vontade:1},hp:0,desc:"Humanoides aviários especializados em voo, visão e ataques aéreos.",skills:[["Acrobacia",5],["Pontaria",2]],abilities:["Voo","Visão Aguçada","Mergulho Aéreo","Caçador do Céu","Mestre dos Ventos"]},
"Scorpion":{b:{Destreza:2,Constituição:1},hp:1,desc:"Corpo ágil com cauda e ferrão. Pode desenvolver venenos e ataques rápidos.",skills:[["Reflexos",5],["Furtividade",2]],abilities:["Cauda","Ferrão","Veneno","Ferrões Múltiplos","Escorpião Supremo"]},
"Tortuga":{b:{Constituição:3,Força:1},hp:5,desc:"Carapaça resistente e excelente defesa física.",skills:[["Resistência",5],["Natação",2]],abilities:["Carapaça","Defesa Fechada","Investida","Fortaleza Viva","Casco Supremo"]},
"Florianos":{b:{Inteligência:2,Constituição:1},hp:1,desc:"Seres de características vegetais capazes de desenvolver resistência e regeneração.",skills:[["Sobrevivência",5],["Medicina",2]],abilities:["Corpo Vegetal","Raízes","Regeneração","Floresta Viva","Rei da Floresta"]},
"Cristalinos":{b:{Constituição:3,Força:1},hp:5,desc:"Corpos cristalinos extremamente resistentes, com potencial para refletir energia.",skills:[["Resistência",5],["Defesa",2]],abilities:["Corpo Cristalino","Refração","Armadura de Cristal","Prisma Vivo","Cristal Supremo"]},
"Sombrianos":{b:{Destreza:2,Vontade:2},hp:0,desc:"Corpos ligados a sombras e movimentos furtivos.",skills:[["Furtividade",5],["Enganação",2]],abilities:["Corpo Sombrio","Passo Sombrio","Manto das Trevas","Domínio Sombrio","Soberano das Sombras"]},
"Voltanoss":{b:{Destreza:2,Vontade:2},hp:1,desc:"Seres que produzem e controlam eletricidade corporal.",skills:[["Reflexos",5],["Tecnologia",2]],abilities:["Carga Elétrica","Eletrochoque","Descarga","Campo Elétrico","Tempestade Viva"]},
"Glacianos":{b:{Constituição:2,Inteligência:1},hp:2,desc:"Criam e manipulam gelo em escala limitada, aumentando o domínio com o nível.",skills:[["Sobrevivência",5],["Tecnologia",2]],abilities:["Frio Natural","Gelo","Armadura de Gelo","Domínio Glacial","Zero Absoluto"]},
"Mentalistas":{b:{Vontade:3,Inteligência:1},hp:0,desc:"Especialistas em força mental, concentração e efeitos psíquicos.",skills:[["Intimidação",5],["História",2]],abilities:["Telepatia","Empurrão Mental","Barreira Mental","Domínio Psíquico","Mente Absoluta"]},
"Ossianos":{b:{Constituição:2,Força:1},hp:3,desc:"Estrutura óssea muito resistente, capaz de criar golpes e defesas incomuns.",skills:[["Resistência",5],["Briga",2]],abilities:["Ossos Densos","Lâmina Óssea","Armadura Óssea","Regeneração Óssea","Colosso Ósseo"]},
"Químicos":{b:{Inteligência:2,Destreza:1},hp:0,desc:"Manipulam substâncias corporais, toxinas e compostos preparados.",skills:[["Tecnologia",5],["Medicina",2]],abilities:["Toxinas","Antídoto","Mistura Instável","Nuvem Química","Mestre Químico"]},
"Abissais":{b:{Constituição:2,Vontade:2},hp:4,desc:"Seres adaptados a ambientes extremos e profundezas do oceano.",skills:[["Natação",5],["Sobrevivência",2]],abilities:["Pressão Abissal","Tentáculos","Visão Profunda","Abismo Vivo","Senhor das Profundezas"]},
"Pedranos":{b:{Constituição:4,Destreza:-1},hp:7,desc:"Corpos de pedra com defesa enorme e mobilidade menor.",skills:[["Resistência",5],["Atletismo",2]],abilities:["Pele de Pedra","Peso Colossal","Punho Rochoso","Montanha Viva","Titã de Pedra"]},
"Demoníacos":{b:{Força:2,Vontade:2},hp:3,desc:"Raça agressiva com grande força de vontade e potencial de transformação.",skills:[["Intimidação",5],["Luta",2]],abilities:["Fúria","Presença Demoníaca","Forma Demoníaca","Frenesi","Demônio Supremo"]},
"Aquanos":{b:{Destreza:2,Constituição:2},hp:2,desc:"Seres ligados à água, capazes de usar o ambiente para se movimentar e atacar.",skills:[["Natação",5],["Acrobacia",2]],abilities:["Corpo Aquático","Jato d'Água","Maré Viva","Domínio da Água","Rei Aquático"]},
"Mutantes":{b:{},hp:1,desc:"Uma raça adaptável. Escolha uma mutação para representar seu corpo único.",skills:[["Sobrevivência",3]],abilities:["Mutação","Mutação Aprimorada","Mutação Dupla","Mutação Superior","Evolução Mutante"]},
"Escamados":{b:{Constituição:2,Força:1},hp:3,desc:"Corpos escamados com boa resistência física.",skills:[["Resistência",5],["Atletismo",2]],abilities:["Escamas","Cauda","Defesa Escamada","Forma Escamada","Rei Escamado"]},
"Serpentinos":{b:{Destreza:2,Vontade:1},hp:1,desc:"Corpos flexíveis capazes de envolver, escapar e aplicar venenos.",skills:[["Acrobacia",5],["Furtividade",2]],abilities:["Flexibilidade","Constrição","Veneno","Corpo Serpente","Serpente Suprema"]}
};

const ROLES={
"Nenhum":{hp:0,pe:0,skills:[],items:[],desc:"Sem cargo definido."},
"Capitão":{hp:2,pe:2,skills:[["Liderança",5],["Intimidação",5]],items:["Den Den Mushi","Log Pose"],desc:"Lidera a tripulação e toma decisões importantes."},
"Espadachim":{hp:2,pe:0,skills:[["Espadas",5],["Defesa",5]],items:["Espada","Bainha reforçada"],desc:"Especialista em combate com espadas."},
"Navegador":{hp:0,pe:1,skills:[["Navegação",5],["Cartografia",5]],items:["Log Pose","Mapa do East Blue"],desc:"Guia o navio e interpreta rotas."},
"Cozinheiro":{hp:1,pe:1,skills:[["Cozinha",5],["Atletismo",5]],items:["Kit de cozinha","Faca de cozinha"],desc:"Prepara comida e luta usando técnicas de cozinha."},
"Arqueólogo":{hp:0,pe:1,skills:[["Arqueologia",5],["História",5]],items:["Livro antigo","Kit de pesquisa"],desc:"Pesquisa história, ruínas e mistérios."},
"Médico":{hp:0,pe:2,skills:[["Medicina",5],["Resistência",5]],items:["Kit médico","Bandagens"],desc:"Cuida de ferimentos e doenças."},
"Atirador":{hp:1,pe:0,skills:[["Pontaria",5],["Furtividade",5]],items:["Pistola","Munição x10"],desc:"Especialista em ataques à distância."},
"Carpinteiro":{hp:2,pe:0,skills:[["Mecânica",5],["Atletismo",5]],items:["Kit de carpinteiro","Ferramentas"],desc:"Conserta e constrói estruturas e navios."},
"Músico":{hp:0,pe:2,skills:[["Performance",5],["Persuasão",5]],items:["Instrumento musical","Den Den Mushi"],desc:"Usa música para animar, distrair e influenciar."},
"Timoneiro":{hp:1,pe:1,skills:[["Navegação",5],["Reflexos",5]],items:["Bússola","Kit náutico"],desc:"Controla o navio em situações perigosas."},
"Combatente":{hp:2,pe:0,skills:[["Luta",5],["Briga",5]],items:["Manoplas","Bandagens"],desc:"Focado em combate físico."},
"Espião":{hp:0,pe:1,skills:[["Furtividade",5],["Enganação",5]],items:["Kit de disfarce","Den Den Mushi"],desc:"Infiltra, coleta informações e manipula situações."}
};

const SKILLS={
"Combate":[["Luta","Força"],["Briga","Força"],["Espadas","Destreza"],["Armas","Destreza"],["Pontaria","Destreza"],["Artes Marciais","Força"],["Defesa","Constituição"]],
"Corpo":[["Atletismo","Força"],["Acrobacia","Destreza"],["Furtividade","Destreza"],["Reflexos","Destreza"],["Resistência","Constituição"],["Natação","Constituição"],["Sobrevivência","Vontade"]],
"Conhecimento":[["Navegação","Inteligência"],["Medicina","Inteligência"],["Tecnologia","Inteligência"],["História","Inteligência"],["Geografia","Inteligência"],["Cartografia","Inteligência"],["Mecânica","Inteligência"],["Cozinha","Inteligência"],["Arqueologia","Inteligência"],["Akuma no Mi","Inteligência"]],
"Social":[["Persuasão","Presença"],["Intimidação","Vontade"],["Liderança","Presença"],["Enganação","Presença"],["Performance","Presença"],["Diplomacia","Presença"],["Negociação","Presença"]],
"Especializadas":[["Percepção","Vontade"]]
};

const HAKI={
observacao:[
{id:"obs-base",name:"Observação Básica",desc:"Percebe presença, intenção e movimentos difíceis de notar.",cost:1,dice:"1d20 + Vontade"},
{id:"obs-sentidos",name:"Sentidos Ampliados",desc:"Aumenta a capacidade de ouvir, sentir presenças e notar detalhes em uma cena.",cost:1,dice:"1d20 + Vontade"},
{id:"obs-presenca",name:"Percepção de Presença",desc:"Identifica a direção e a intensidade aproximada de uma presença mesmo fora da visão direta.",cost:1,dice:"1d20 + Vontade"},
{id:"obs-gormum",name:"Haki Gormum",desc:"Permite tentar antecipar um golpe imediato e buscar uma esquiva extraordinária. O Mestre define quando pode ser usado.",cost:2,dice:"1d20 + Vontade"},
{id:"obs-intencao",name:"Leitura de Intenção",desc:"Lê sinais corporais e intenção hostil para prever ações muito prováveis de um alvo.",cost:2,dice:"1d20 + Vontade"},
{id:"obs-distante",name:"Visão Distante",desc:"Mantém percepção eficiente a uma distância maior, útil para vigiar e localizar alvos.",cost:2,dice:"1d20 + Vontade"},
{id:"obs-precognicao",name:"Precognição",desc:"Obtém uma pequena vantagem narrativa ao antecipar acontecimentos próximos. Não mostra o futuro inteiro.",cost:3,dice:"1d20 + Vontade"},
{id:"obs-preview",name:"Haki Preview",desc:"Tenta prever alguns segundos do futuro em situações específicas e perigosas.",cost:4,dice:"1d20 + Vontade"}
],
armamento:[
{id:"arm-base",name:"Armamento Básico",desc:"Reforça corpo ou arma. Pode atravessar certas defesas especiais conforme a regra da mesa.",cost:1,dice:"1d20 + Vontade"},
{id:"arm-forte",name:"Armamento Reforçado",desc:"Concentra mais Haki em ataques e defesa, aumentando a potência do uso de Armamento.",cost:2,dice:"1d20 + Vontade"}
],
rei:[{id:"rei",name:"Haki do Rei",desc:"Pressiona vontades mais fracas e pode causar desmaio em alvos vulneráveis. O Mestre define área, alcance e alvos afetados.",cost:4,dice:"1d20 + Vontade"}]
};

const LIB={
attacks:[
{name:"Soco",origin:"Básico",attribute:"Força",damage:"1d6",cost:0,range:"Corpo a corpo",desc:"Golpe físico básico."},{name:"Chute",origin:"Básico",attribute:"Força",damage:"1d6",cost:0,range:"Corpo a corpo",desc:"Ataque com as pernas."},{name:"Corte de Espada",origin:"Cargo",attribute:"Destreza",damage:"1d8",cost:0,range:"Corpo a corpo",desc:"Corte simples."},{name:"Tiro",origin:"Cargo",attribute:"Destreza",damage:"1d8",cost:0,range:"À distância",desc:"Disparo com arma."},{name:"Golpe Pesado",origin:"Básico",attribute:"Força",damage:"2d6",cost:2,range:"Corpo a corpo",desc:"Ataque forte."},{name:"Investida",origin:"Básico",attribute:"Força",damage:"1d10",cost:2,range:"Curto",desc:"Avança e ataca."},{name:"Rajada de Golpes",origin:"Cargo",attribute:"Força",damage:"3d4",cost:2,range:"Corpo a corpo",desc:"Sequência rápida de ataques."},{name:"Corte Giratório",origin:"Cargo",attribute:"Destreza",damage:"2d8",cost:3,range:"Curto",desc:"Corte em área curta."}],
abilities:[
{name:"Adaptabilidade",origin:"Raça",level:1,cost:0,desc:"Uma vantagem natural da raça escolhida."},{name:"Corpo Resistente",origin:"Geral",level:1,cost:0,desc:"Reduz uma pequena quantidade de dano físico uma vez por rodada."},{name:"Instinto de Batalha",origin:"Geral",level:1,cost:1,desc:"Gaste PE para receber +2 em um teste de combate."},{name:"Movimento Rápido",origin:"Geral",level:2,cost:1,desc:"Aumenta a mobilidade durante uma cena."},{name:"Vontade Inabalável",origin:"Geral",level:3,cost:2,desc:"Resiste a medo, controle ou pressão mental."}],
rituals:[{name:"Técnica Especial",origin:"Geral",level:1,cost:2,desc:"Uma técnica especial criada para o personagem."},{name:"Explosão de Energia",origin:"Geral",level:2,cost:3,desc:"Libera energia em uma área curta."}],
items:[
{name:"Espada",type:"Arma",desc:"Arma corpo a corpo. Pode ser equipada para combate."},{name:"Katana",type:"Arma",desc:"Espada leve e precisa."},{name:"Lança",type:"Arma",desc:"Arma de alcance corpo a corpo maior."},{name:"Pistola",type:"Arma",desc:"Arma de fogo simples."},{name:"Rifle",type:"Arma",desc:"Arma de fogo com maior alcance."},{name:"Arco",type:"Arma",desc:"Ataque à distância silencioso."},{name:"Adaga",type:"Arma",desc:"Arma leve para ataques rápidos."},{name:"Manoplas",type:"Arma",desc:"Equipamento para combate físico."},{name:"Bastão",type:"Arma",desc:"Arma simples e versátil."},{name:"Escudo",type:"Armadura",desc:"Pode conceder defesa conforme a regra da campanha."},{name:"Colete",type:"Armadura",desc:"Proteção leve."},{name:"Bandagens",type:"Consumível",desc:"Usadas para tratar ferimentos."},{name:"Poção de PV",type:"Consumível",desc:"Recupera 10 PV."},{name:"Poção de PE",type:"Consumível",desc:"Recupera 5 PE."},{name:"Comida",type:"Consumível",desc:"Alimento comum."},{name:"Den Den Mushi",type:"Comunicação",desc:"Comunicação à distância."},{name:"Log Pose",type:"Navegação",desc:"Ajuda a navegar pela Grand Line."},{name:"Eternal Pose",type:"Navegação",desc:"Aponta para uma ilha específica."},{name:"Mapa",type:"Navegação",desc:"Mapa de uma região."},{name:"Kit médico",type:"Ferramenta",desc:"Itens para primeiros socorros."},{name:"Kit de cozinha",type:"Ferramenta",desc:"Utensílios para cozinhar."},{name:"Ferramentas",type:"Ferramenta",desc:"Ferramentas gerais."},{name:"Kit de carpinteiro",type:"Ferramenta",desc:"Ferramentas de construção naval."},{name:"Livro antigo",type:"Conhecimento",desc:"Material de pesquisa histórica."},{name:"Kit de disfarce",type:"Especial",desc:"Acessórios para mudar aparência."},{name:"Munição x10",type:"Munição",desc:"Dez unidades de munição."}],
fruits:[
{name:"Gomu Gomu no Mi",type:"Paramecia",desc:"Corpo elástico e técnicas de borracha.",balance:"Boa no início; depende de criatividade e PE.",basic:["Pistola de Borracha","Chicote de Borracha","Gomu Bazooka","Gomu Rocket","Gomu Guard"],future:["Gear 2","Gear 3","Gear 4"]},
{name:"Mera Mera no Mi",type:"Logia",desc:"Criação e transformação em fogo.",balance:"Logia começa limitada: intangibilidade exige PE e não ignora Haki.",basic:["Punho de Fogo","Bala de Fogo","Parede de Fogo","Fogo Circular","Jato de Fogo"],future:["Grande Imperador do Fogo","Inferno de Fogo","Forma Flamejante"]},
{name:"Hie Hie no Mi",type:"Logia",desc:"Criação e transformação em gelo.",balance:"Intangibilidade e congelamento forte têm custo de PE e limites de alvo.",basic:["Lança de Gelo","Piso Congelado","Rajada de Gelo","Parede de Gelo","Toque Congelante"],future:["Congelamento em Área","Caminho de Gelo","Era Glacial"]},
{name:"Bara Bara no Mi",type:"Paramecia",desc:"Permite separar partes do corpo e controlar os segmentos.",balance:"Excelente para mobilidade, mas dano e alcance continuam limitados pelo nível.",basic:["Bara Chop","Bara Bullet","Bara Kick","Bara Escape","Bara Split"],future:["Separação Avançada","Tempestade de Partes","Domínio Bara"]},
{name:"Tori Tori no Mi — Modelo Fênix",type:"Zoan",desc:"Zoan mítica com forma híbrida e regeneração limitada.",balance:"Regeneração custa PE e não recupera tudo de uma vez.",basic:["Garra Fênix","Asa Flamejante","Chute Fênix","Voo Fênix","Chama Curativa"],future:["Forma Híbrida","Regeneração Superior","Forma Fênix"]},
{name:"Neko Neko no Mi — Modelo Leopardo",type:"Zoan",desc:"Aumenta força, velocidade e sentidos com forma animal e híbrida.",balance:"Excelente no corpo a corpo; não possui intangibilidade.",basic:["Garra","Mordida","Investida","Salto Predador","Rugido"],future:["Forma Híbrida","Predador Supremo","Forma Completa"]},
{name:"Ope Ope no Mi",type:"Paramecia",desc:"Cria uma área ROOM para técnicas espaciais.",balance:"ROOM e técnicas fortes consomem PE e possuem alcance definido.",basic:["ROOM","Tact","Shambles","Mes","Counter Shock"],future:["ROOM Ampliada","K-Room","Despertar"]}
],
roles:Object.keys(ROLES).filter(x=>x!=="Nenhum").map(name=>({name,type:"Cargo",desc:ROLES[name].desc,skills:ROLES[name].skills,items:ROLES[name].items}))
};

const THREATS=[
["Pirata Novato",12,2,"Luta básica"],["Bandido do Porto",14,3,"Emboscada"],["Marinheiro",16,3,"Arma e formação"],["Sargento da Marinha",24,5,"Comando"],["Caçador de Recompensa",20,5,"Perseguição"],["Agente do Governo",22,6,"Técnicas especiais"],["Mercenário",28,6,"Ataque pesado"],["Pirata Veterano",32,7,"Experiência de combate"],["Capanga Gigante",40,6,"Força bruta"],["Homem-Peixe Guerreiro",36,7,"Combate aquático"],["Mink Guerreiro",30,8,"Eletro"],["Assassino",26,9,"Ataque surpresa"],["Atirador Elite",24,8,"Longo alcance"],["Espadachim Elite",34,9,"Cortes rápidos"],["Capitão Pirata",50,10,"Liderança"],["Vice-Almirante",80,14,"Haki e combate"],["Agente CP",45,12,"Técnicas de movimento"],["Gigante Guerreiro",100,12,"Força colossal"],["Usuário de Akuma",55,12,"Poder da fruta"],["Mestre do Haki",70,15,"Haki avançado"],["Monstro Marinho",120,12,"Ataques brutais"],["Guardião da Ilha",90,14,"Defesa elevada"],["Chefe da Organização",110,16,"Vários recursos"],["Lenda do Mar",180,20,"Chefe de campanha"]
];


/* ============================================================
   WEIRD RPG — V11 FINAL
   ------------------------------------------------------------
   Este arquivo foi organizado por blocos para facilitar estudo.
   1. Dados do sistema
   2. Persistência e migração
   3. Criação / edição de ficha
   4. Bibliotecas e Homebrew
   5. Combate / dados / Haki / Aura / Akuma
   6. Ficha final
   7. Campanhas
   8. Inicialização
   ============================================================ */

const STORAGE = {
  agents: 'weirdAgentsV8',
  campaigns: 'weirdCampaignsV8',
  homebrew: 'weirdHomebrewV8',
  prefs: 'weirdPreferencesV8',
  user: 'weirdUser',
  rolls: 'weirdRollHistory',
  draft: 'weirdAgentDraftV8'
};

const LEGACY_KEYS = ['weirdAgentsV7','weirdAgentsV6','weirdAgentsV5','weirdAgentsV4','weirdAgentsV3'];
const COLOR_THEMES = {
  escuro: { label:'Escuro', icon:'🌑' },
  claro: { label:'Claro', icon:'☀️' },
  roxo: { label:'Roxo', icon:'🟣' },
  amarelo: { label:'Amarelo', icon:'🟡' },
  rosa: { label:'Rosa', icon:'🩷' },
  azul: { label:'Azul', icon:'🔵' },
  verde: { label:'Verde', icon:'🟢' },
  oceano: { label:'Oceano', icon:'🌊' }
};

const SKILL_HELP = {
  'Luta':'Usada para socos, agarrões e golpes físicos diretos.',
  'Briga':'Combate improvisado com objetos, cabeçadas, cotoveladas e golpes sujos.',
  'Espadas':'Ataques e manobras usando espadas, katanas e lâminas.',
  'Armas':'Uso eficiente de armas de combate que não sejam espadas.',
  'Pontaria':'Acertar alvos com tiros, arcos e outros ataques à distância.',
  'Artes Marciais':'Técnicas de combate treinadas que usam corpo e postura.',
  'Defesa':'Resistir, bloquear e reduzir a eficiência de ataques recebidos.',
  'Atletismo':'Força física aplicada a corrida, salto, escalada, empurrões e esforço.',
  'Acrobacia':'Movimentos rápidos, saltos, equilíbrio e manobras corporais.',
  'Furtividade':'Agir sem ser percebido, esconder-se e aproximar-se em silêncio.',
  'Reflexos':'Reagir rapidamente a perigos e tentar evitar um ataque.',
  'Resistência':'Suportar dor, cansaço, veneno, frio, calor e esforço prolongado.',
  'Natação':'Nadar, mergulhar e agir debaixo d’água.',
  'Sobrevivência':'Encontrar recursos, seguir rastros e sobreviver em ambientes hostis.',
  'Navegação':'Ler rotas, mares, correntes e orientar um navio.',
  'Medicina':'Tratar ferimentos, doenças e primeiros socorros.',
  'Tecnologia':'Entender máquinas, mecanismos, armas e dispositivos.',
  'História':'Recordar acontecimentos, povos, governos, guerras e lendas.',
  'Geografia':'Entender regiões, ilhas, terrenos, mapas e localização.',
  'Cartografia':'Criar e interpretar mapas detalhados.',
  'Mecânica':'Construir e reparar máquinas, navios e mecanismos.',
  'Cozinha':'Preparar refeições, ingredientes, rações e receitas especiais.',
  'Arqueologia':'Estudar ruínas, inscrições e vestígios de civilizações antigas.',
  'Akuma no Mi':'Identificar, analisar e explorar conhecimentos sobre frutas do diabo.',
  'Persuasão':'Convencer alguém por conversa, argumentos ou negociação social.',
  'Intimidação':'Pressionar alguém pelo medo, presença ou ameaça.',
  'Liderança':'Comandar pessoas, organizar grupos e tomar decisões sob pressão.',
  'Enganação':'Mentir, disfarçar intenções e criar falsas informações.',
  'Performance':'Atuar, cantar, tocar, distrair ou chamar atenção com talento.',
  'Diplomacia':'Resolver conflitos com calma e encontrar acordos.',
  'Negociação':'Discutir preços, contratos, favores e trocas vantajosas.',
  'Percepção':'Perceber sons, movimentos, detalhes e coisas escondidas.',
  'Determinação':'Manter-se de pé sob pressão. É uma perícia especial ligada à Vontade e custa 2 pontos de Inteligência para ser treinada.'
};

const DETERMINATION_POWERS = buildDeterminationPowers();

function buildDeterminationPowers(){
  const levels = {};
  for(let level=1; level<=10; level++){
    levels[level] = [
      {id:`det-${level}-a`,name:`Coração Inabalável ${level}`,cost:level===1?0:Math.min(5,level-1),check:'1d20 + Vontade',damage:'',desc:'Quando sofre medo, pressão, dor ou um efeito de controle, pode gastar PE para repetir ou melhorar o teste conforme o Mestre permitir.'},
      {id:`det-${level}-b`,name:`Resposta de Sobrevivente ${level}`,cost:level===1?0:Math.min(5,level),check:'1d20 + Vontade',damage:level>=5?'1d8':'1d6',desc:'Ao ficar com PV baixo ou ser colocado em situação extrema, recebe uma resposta de combate ou resistência. O efeito exato depende da situação.'},
      {id:`det-${level}-c`,name:`Vontade Ofensiva ${level}`,cost:level===1?0:Math.min(6,level),check:'1d20 + Vontade',damage:level>=7?'2d10':level>=4?'2d6':'1d8',desc:'Converte determinação em uma ação decisiva. Se a mesa permitir, soma o dano indicado ou recebe vantagem narrativa em um momento crítico.'}
    ];
  }
  return levels;
}

/* ------------------------- HELPERS ------------------------- */
function $(id){ return document.getElementById(id); }
function uid(){
  try{ if(window.crypto?.randomUUID) return window.crypto.randomUUID(); }catch{}
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function clone(value){
  try{return structuredClone(value);}catch{return JSON.parse(JSON.stringify(value));}
}
function loadJSON(key, fallback){
  try{
    const raw=localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch{return fallback;}
}
function saveJSON(key,value){
  try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{showToast('Não foi possível salvar. O navegador pode estar sem espaço.');return false;}
}
function escapeHTML(value=''){
  return String(value).replace(/[&<>'"]/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[char]));
}
function escapeAttr(value=''){return escapeHTML(value).replace(/`/g,'&#96;');}
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function text(v){return String(v??'');}
function num(v,fallback=0){const n=Number(v);return Number.isFinite(n)?n:fallback;}
function showToast(message){
  const el=$('toast'); if(!el)return;
  el.textContent=message;
  el.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>el.classList.remove('show'),3200);
}
function openModal(id){$(id)?.classList.remove('hidden');}
function closeModal(id){$(id)?.classList.add('hidden');}
function openDetailModal(){openModal('detailModal');}
function closeAllModals(){document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));}
function confirmAction(message){return window.confirm(message);}

/* ------------------------- MIGRAÇÃO ------------------------- */
function defaultAttributes(){return Object.fromEntries(ATTRS.map(a=>[a,0]));}
function defaultSkills(){
  const s={};
  allSkills().forEach(([name])=>s[name]={training:0,int:false});
  s['Determinação']={training:0,int:false};
  return s;
}
function safeIdFor(agent){return agent?.id || uid();}

function normalizeAgent(input){
  const a=clone(input||{});
  a.id=safeIdFor(a);
  a.theme=a.theme||'pirata';
  a.name=text(a.name); a.player=text(a.player); a.age=a.age??''; a.origin=text(a.origin);
  a.organization=text(a.organization); a.race=RACES[a.race]?a.race:'Humano';
  a.level=clamp(num(a.level,1),1,10); a.raceLevel=clamp(num(a.raceLevel,1),1,10);
  a.bounty=Math.max(0,num(a.bounty)); a.berries=Math.max(0,num(a.berries)); a.reputation=num(a.reputation);
  if(!a.attributes) a.attributes={};
  if(a.attributes.Carisma!==undefined && a.attributes.Presença===undefined){a.attributes.Presença=a.attributes.Carisma;delete a.attributes.Carisma;}
  ATTRS.forEach(attr=>a.attributes[attr]=clamp(num(a.attributes[attr]),-2,10));
  const oldSkills=a.skills||{}; a.skills=defaultSkills();
  Object.keys(a.skills).forEach(name=>{
    const old=oldSkills[name]||{};
    a.skills[name].training=[0,5,10,15].includes(num(old.training))?num(old.training):0;
    a.skills[name].int=Boolean(old.int);
  });
  a.roles=Array.isArray(a.roles)?[a.roles[0]||'Nenhum',a.roles[1]||'Nenhum']:['Nenhum','Nenhum'];
  a.roles=a.roles.map(x=>ROLES[x]?x:'Nenhum');
  a.items=Array.isArray(a.items)?a.items.map(normalizeItem):[];
  a.attacks=Array.isArray(a.attacks)?a.attacks.map(normalizePower):[];
  a.abilities=Array.isArray(a.abilities)?a.abilities.map(normalizePower):[];
  a.rituals=Array.isArray(a.rituals)?a.rituals.map(normalizePower):[];
  const rawObservation=[...(Array.isArray(a.observationChoices)?a.observationChoices:[])];
  if(typeof a.observation==='string' && a.observation && a.observation!=='Sem variação') rawObservation.push(a.observation);
  a.observationChoices=[...new Set(rawObservation.map(value=>{const byId=HAKI.observacao.find(x=>x.id===value);if(byId)return byId.id;const byName=HAKI.observacao.find(x=>x.name===value);return byName?.id||null;}).filter(Boolean))].slice(0,2);
  a.haki=Array.isArray(a.haki)?[...new Set(a.haki.map(value=>{if(['Observação','Armamento','Rei'].includes(value))return value;const hit=[...HAKI.observacao,...HAKI.armamento,...HAKI.rei].find(x=>x.id===value||x.name===value);if(hit?.id?.startsWith('obs-'))return'Observação';if(hit?.id?.startsWith('arm-'))return'Armamento';if(hit?.id==='rei')return'Rei';return null;}).filter(Boolean))]:[];
  if(a.observationChoices.length && !a.haki.includes('Observação'))a.haki.push('Observação');
  a.armament=a.armament||'';
  if(a.armament && !a.haki.includes('Armamento'))a.haki.push('Armamento');
  a.conqueror=Boolean(a.conqueror||a.haki.includes('Rei'));
  if(a.conqueror&&!a.haki.includes('Rei'))a.haki.push('Rei');
  a.aura=a.aura||'Nenhuma';
  a.auraActive=Boolean(a.auraActive&&a.aura!=='Nenhuma');
  a.auraSkipNext=Boolean(a.auraSkipNext);
  a.fruit=a.fruit?normalizeFruit(a.fruit):null;
  a.fruitLevel=clamp(num(a.fruitLevel,a.level||1),1,10);
  a.fruitChoices=Array.isArray(a.fruitChoices)?a.fruitChoices:[];
  a.fruitSelections=typeof a.fruitSelections==='object'&&a.fruitSelections?{...a.fruitSelections}:{};
  a.fruitPowerEdits=typeof a.fruitPowerEdits==='object'&&a.fruitPowerEdits?{...a.fruitPowerEdits}:{};
  a.raceAbilities=Array.isArray(a.raceAbilities)?a.raceAbilities.map(normalizePower):[];
  a.determinationChoices=typeof a.determinationChoices==='object'&&a.determinationChoices?{...a.determinationChoices}:{};
  a.personality=text(a.personality);a.honor=text(a.honor);a.dream=text(a.dream);a.history=text(a.history);a.avatar=text(a.avatar);
  a.createdAt=a.createdAt||Date.now(); a.updatedAt=a.updatedAt||Date.now();
  const derived=calc(a); a.hpCurrent=clamp(num(a.hpCurrent,derived.hpMax),0,derived.hpMax); a.peCurrent=clamp(num(a.peCurrent,derived.peMax),0,derived.peMax);
  a.talentUsed=Math.max(0,num(a.talentUsed));
  a.talentUsed=calculateIntUsed(a);
  refreshFruitCombat(a);
  return a;
}
function normalizeItem(item){
  const x=clone(item||{});
  const type=text(x.type)||'Especial';
  const n=(x.name||'').toLowerCase();
  let attackAttribute=text(x.attackAttribute);
  let damage=text(x.damage);
  let check=text(x.check);
  if(type==='Arma'&&!attackAttribute) attackAttribute=/pistola|rifle|arco|besta|canhão|fuzil|tiro|atir/.test(n)?'Destreza':'Força';
  if(type==='Arma'&&!damage){
    if(/marreta/.test(n))damage='2d6';
    else if(/machado/.test(n))damage='1d10';
    else if(/canhão/.test(n))damage='2d8';
    else if(/espada|katana|lança|martelo|bastão|foice|corrente|clava|rifle|arco|besta|pistola/.test(n))damage='1d8';
    else if(/adaga|faca|manopla/.test(n))damage='1d6';
    else damage='1d6';
  }
  if(type==='Arma'&&!check)check=`1d20 + ${attackAttribute||'Força'}`;
  return {
    id:x.id||uid(),name:text(x.name)||'Item',type,desc:text(x.desc),equipped:Boolean(x.equipped),
    origin:text(x.origin)||'Biblioteca',bonus:text(x.bonus||''),effect:text(x.effect||''),
    quantity:Math.max(0,Math.floor(num(x.quantity,1))),attackAttribute,check,damage,
    actionCost:Math.max(0,num(x.actionCost,0)),range:text(x.range)
  };
}
function normalizePower(power){
  const x=clone(power||{});
  return {
    id:x.id||uid(),name:text(x.name)||'Habilidade',origin:text(x.origin)||'Personalizado',
    level:clamp(num(x.level,1),1,10),cost:Math.max(0,num(x.cost)),attribute:x.attribute||'Sem teste',
    damage:text(x.damage),check:text(x.check),range:text(x.range),type:text(x.type)||'Habilidade',desc:text(x.desc),effect:text(x.effect),uses:text(x.uses),duration:text(x.duration),
    color:x.color||originColor(x.origin),source:text(x.source),sourceId:text(x.sourceId),
    successThreshold:x.successThreshold===''||x.successThreshold==null?null:clamp(num(x.successThreshold),1,100),
    successMode:text(x.successMode)||'maior-ou-igual',usesPerTurn:Math.max(0,num(x.usesPerTurn,0)),unlockLevel:clamp(num(x.unlockLevel,x.level||1),1,10)
  };
}
function normalizeFruit(fruit){
  const f=clone(fruit);
  f.name=text(f.name);f.type=text(f.type);f.desc=text(f.desc);f.balance=text(f.balance);
  f.starterPowers=(f.starterPowers||f.basic||[]).map((x,i)=>typeof x==='string'?makeFruitPower(x,f,i,1):normalizePower(x));
  f.levels=f.levels||{};
  return f;
}
function loadLegacyAgents(){
  let data=loadJSON(STORAGE.agents,null);
  if(Array.isArray(data))return data;
  for(const key of LEGACY_KEYS){data=loadJSON(key,null);if(Array.isArray(data))return data;}
  return [];
}
function ensureUniqueIds(list){
  const seen=new Set();
  return list.map(item=>{
    const x=clone(item);if(!x.id||seen.has(x.id))x.id=uid();seen.add(x.id);return x;
  });
}

/* ------------------------- REGRAS / CÁLCULOS ------------------------- */
function allSkills(){return Object.values(SKILLS).flat();}
function attrTotal(a,name){
  const racial=RACES[a.race]?.b?.[name]||0;
  const auraBonus=(a.auraActive&&['Força','Destreza','Constituição'].includes(name)) ? (a.aura==='Aura EX'?1:a.aura==='Aura GX'?2:0) : 0;
  return num(a.attributes?.[name])+racial+auraBonus;
}
function maxAttr(a){return clamp(5+(num(a.level,1)-1),5,10);}
function attributePool(a){return RULES.startingPoints+Math.max(0,num(a.level,1)-1);}
function attributePointsAvailable(a){return Math.max(0,attributePool(a)-Object.values(a.attributes||{}).reduce((s,v)=>s+Math.max(0,num(v)),0));}
function roleTraining(a){
  const m=new Map();
  (a.roles||[]).forEach(role=>{
    (ROLES[role]?.skills||[]).forEach(([skill,value])=>m.set(skill,Math.max(m.get(skill)||0,Math.min(3,num(value)))));
  });
  return m;
}
function raceTraining(a){
  const m=new Map();
  (RACES[a.race]?.skills||[]).forEach(([skill,value])=>m.set(skill,Math.max(m.get(skill)||0,Math.min(3,num(value)))));
  return m;
}
function trainingMax(a){
  const level=num(a.level,1);
  if(level<=2)return 5;
  if(level<=4)return 10;
  return 15;
}
function calculateIntUsed(a){
  return Object.entries(a.skills||{}).reduce((total,[name,data])=>{
    return total + (data?.int ? (name==='Determinação'?2:1) : 0);
  },0);
}
function intPool(a){return Math.max(0,attrTotal(a,'Inteligência'));}
function canTrainDetermination(a){return intPool(a)-calculateIntUsed(a)>=2 || Boolean(a.skills?.['Determinação']?.int);}
function skillTraining(a,name){
  const s=a.skills?.[name]||{};
  const manual=clamp(num(s.training),0,trainingMax(a));
  const automatic=Math.max(roleTraining(a).get(name)||0, raceTraining(a).get(name)||0);
  const intBonus=s.int?5:0;
  return manual+automatic+intBonus;
}
function skillTotal(a,name){
  const info=allSkills().find(x=>x[0]===name)||['Determinação','Vontade'];
  return attrTotal(a,info[1])+skillTraining(a,name);
}
function calc(a){
  const race=RACES[a.race]||RACES.Humano;
  const roles=(a.roles||[]).map(x=>ROLES[x]||ROLES.Nenhum);
  const level=clamp(num(a.level,1),1,10);
  const hpMax=RULES.baseHP+(attrTotal(a,'Constituição')*2)+(race.hp||0)+roles.reduce((s,r)=>s+num(r.hp),0)+((level-1)*2);
  const peMax=RULES.basePE+attrTotal(a,'Inteligência')+attrTotal(a,'Presença')+attrTotal(a,'Vontade')+roles.reduce((s,r)=>s+num(r.pe),0)+(level-1);
  return {
    hpMax:Math.max(1,hpMax), peMax:Math.max(0,peMax),
    defense:10+attrTotal(a,'Destreza'),
    initiative:attrTotal(a,'Destreza')+attrTotal(a,'Vontade'),
    movement:6+Math.max(0,attrTotal(a,'Destreza')),
    roles
  };
}
function unlockedRaceLevels(level){return [1,3,5,7,10].filter(x=>x<=num(level,1));}
function raceEvolutionData(name){
  const race=RACES[name]||RACES.Humano;
  const raw=race.abilities||[];
  return raw.slice(0,5).map((ability,index)=>makeRaceEvolution(name,ability,[1,3,5,7,10][index]));
}
function makeRaceEvolution(raceName,ability,level){
  const lower=ability.toLowerCase();
  let effect='Recebe o benefício descrito pelo Mestre para esta habilidade racial.';
  let check='Sem dado obrigatório';
  let damage='';
  if(/fogo|chama|eletro|elétr|descarga|raio|frio|gelo|água|jato|tempest|sopro|dragão/.test(lower)){
    check='1d20 + Vontade ou atributo relacionado';
    damage=level>=10?'3d10':level>=7?'2d8':level>=5?'2d6':level>=3?'1d8':'';
    effect='Poder elemental melhora com o nível; em um uso ofensivo pode aplicar o dano indicado e um efeito temático definido na ficha.';
  }else if(/defesa|carapaça|escama|armadura|resist|pedra|casco|corpo|ossos|indestrutível/.test(lower)){
    check='1d20 + Constituição quando a mesa pedir';
    effect=level===1?'Aumenta sua resistência natural.':`Gaste ${Math.min(6,Math.max(0,level-1))} PE para reduzir dano ou ignorar parte de um efeito físico por ${level>=7?2:1} rodada(s).`;
  }else if(/furt|sombra|sombr|invis|telepat|mente|olho|visão|instinto|caça|predador/.test(lower)){
    check='1d20 + Destreza ou Vontade';
    effect=`Melhora sua percepção ou mobilidade. ${level===1?'É principalmente passiva.':`Gaste ${Math.min(5,Math.max(1,level-1))} PE para obter +${level>=7?4:2} no teste relacionado por uma cena/rodada.`}`;
  }else{
    check='1d20 + atributo mais adequado';
    damage=level>=10?'3d10':level>=7?'2d8':level>=5?'2d6':level>=3?'1d8':'';
    effect=level===1?'Benefício racial inicial, sem custo de PE.':`Gaste ${Math.min(6,level)} PE para potencializar esta habilidade por ${level>=7?2:1} rodada(s). ${damage?`Se usada ofensivamente, o dano sugerido é ${damage}.`:''}`;
  }
  return {
    id:`race-${raceName}-${level}`,
    name:ability, race:raceName, level,
    cost: level===1?0:Math.min(6,Math.ceil(level/2)),
    check,damage,effect,
    desc:`Evolução Nvl ${level}: ${effect}`,
    origin:'Raça',color:'amarelo',type:'Habilidade racial'
  };
}
function originColor(origin){
  const o=String(origin||'').toLowerCase();
  if(o.includes('raça'))return'amarelo';
  if(o.includes('cargo'))return'azul';
  if(o.includes('fruta')||o.includes('akuma'))return'vermelho';
  if(o.includes('haki'))return'roxo';
  if(o.includes('aura'))return'verde';
  return'cinza';
}

/* ------------------------- HOME BREW ------------------------- */
function defaultHomebrew(){
  return {abilities:[],items:[],rituals:[],attacks:[],threats:[]};
}
let homebrew=defaultHomebrew();
function normalizeHomebrew(raw){
  const h={...defaultHomebrew(),...(raw||{})};
  ['abilities','items','rituals','attacks'].forEach(k=>h[k]=Array.isArray(h[k])?h[k].map(normalizePower):[]);
  h.items=(raw?.items||[]).map(normalizeItem);
  h.threats=(raw?.threats||[]).map(normalizeThreat);
  return h;
}
function saveHomebrew(){saveJSON(STORAGE.homebrew,homebrew);}

/* ------------------------- LIBRARY HELPERS ------------------------- */
function makeFruitPower(name,fruit,index,level,config=null){
  const lower=name.toLowerCase();let type=config?.type||'Ataque',check=config?.check||'1d20 + Força';let damage=config?.damage===undefined?'1d8':config.damage;let cost=config?.cost??(level<=1?0:Math.min(8,Math.ceil((level-1)/2)));let attribute=config?.attribute||(check.split(' + ')[1]||'Força');let desc=config?.desc||`Poder da ${fruit.name}.`;
  if(!config){if(/guard|escudo|parede|barreira|defesa|armadura/.test(lower)){type='Defesa';attribute='Constituição';check='1d20 + Constituição';damage='';desc='Cria uma proteção temática. Em sucesso, reduz ou bloqueia parte do dano ou efeito.';}else if(/cura|curativa|regenera/.test(lower)){type='Suporte';attribute='Vontade';check='1d20 + Vontade';damage='';desc='Usa a fruta para recuperar, estabilizar ou auxiliar um alvo.';}else if(/room|shamble|tact|mes|controle|separação|voo|rocket|salto/.test(lower)){type='Utilidade';attribute='Destreza';check='1d20 + Destreza';damage='';desc='Uso especial para mobilidade, controle, posicionamento ou manipulação.';}}
  const effect=config?.effect||'',uses=config?.uses||'',duration=config?.duration||'';return {id:`fruit-${fruit.name}-${level}-${index}-${name}`.replace(/[^a-zA-Z0-9_-]/g,'_'),name,origin:'Akuma no Mi',level,cost,attribute,check,damage,range:type==='Defesa'?'Pessoal':'Definido pela fruta',type,desc,effect,uses,duration,color:'vermelho',source:'fruit'};
}
const FRUIT_PROGRESSION={
"Gomu Gomu no Mi":[['Gomu Bazooka Reforçado','Defesa Elástica','Gomu Ricochete'],['Jet Pistola','Gomu Escudo','Gomu Estilingue'],['Gomu Metralhadora','Gomu Rede','Gomu Passo Elástico'],['Red Hawk Inicial','Gomu Cúpula','Gomu Arremesso'],['Gomu Elephant Gun','Gomu Muralha','Gomu Rocket Avançado'],['Black Mamba','Gomu Prisão','Gomu Mobilidade Total'],['King Kong Gun','Gomu Fortaleza','Gomu Salto Aéreo'],['Cobra Elástica','Gomu Domínio do Campo','Gomu Voo Improvisado'],['Impacto Gigante','Gomu Corpo Supremo','Gomu Golpe Final']],
"Mera Mera no Mi":[['Flecha de Fogo','Escudo de Fogo','Passo de Chamas'],['Lança Flamejante','Cortina de Fogo','Jato Incandescente'],['Pistola de Fogo','Muralha Flamejante','Impulso de Fogo'],['Asas de Chama','Prisão de Fogo','Rajada Solar'],['Dragão de Fogo','Cúpula de Chamas','Voo Flamejante'],['Granada de Fogo','Inferno Circular','Propulsão Flamejante'],['Grande Imperador do Fogo','Fortaleza Solar','Meteoro de Chamas'],['Mar de Fogo','Domínio Flamejante','Passagem Solar'],['Sol Incandescente','Fênix de Fogo','Cataclismo Flamejante']],
"Hie Hie no Mi":[['Agulhas de Gelo','Escudo de Gelo','Patins Congelantes'],['Lança Glacial','Parede de Gelo','Trilha de Gelo'],['Rajada Polar','Prisão Congelante','Passo Glacial'],['Espinhos de Gelo','Cúpula Glacial','Ponte Congelada'],['Lança Gigante de Gelo','Muralha Polar','Asa Congelada'],['Tempestade de Neve','Campo Congelante','Caminho Glacial'],['Era Glacial Parcial','Fortaleza de Gelo','Mar Congelado'],['Domínio Polar','Zero Local','Movimento Instantâneo no Gelo'],['Zero Absoluto','Prisão Glacial Suprema','Mundo de Gelo']],
"Bara Bara no Mi":[['Bara Cortante','Corpo Fragmentado','Bara Voo'],['Bara Barragem','Escudo de Partes','Bara Investida'],['Bara Lâminas','Divisão Evasiva','Bara Arremesso'],['Bara Canhão','Círculo Fragmentado','Bara Fuga Aérea'],['Bara Tempestade','Muralha de Partes','Bara Transporte'],['Bara Chuva de Lâminas','Separação Total','Bara Prisão'],['Tempestade Bara Suprema','Corpo Quase Intocável','Bara Domínio'],['Bara Labirinto','Separação de Precisão','Bara Campo'],['Domínio Bara Absoluto','Corpo Fragmentado Supremo','Bara Golpe Final']],
"Tori Tori no Mi — Modelo Fênix":[['Garra Azul','Asa Guardiã','Voo da Fênix'],['Chama Curativa Aprimorada','Escudo Azul','Rasante Fênix'],['Bico Flamejante','Regeneração Parcial','Mergulho da Fênix'],['Asas da Aurora','Círculo Curativo','Explosão de Plumas'],['Forma Híbrida','Barreira de Chamas Azuis','Investida Alada'],['Fênix Ascendente','Regeneração Superior','Tempestade de Asas'],['Chama Azul Suprema','Renascer Parcial','Voo Relâmpago'],['Domínio da Fênix','Cura em Área','Asas Gigantes'],['Forma Fênix Completa','Renascimento da Lenda','Chama Imortal']],
"Neko Neko no Mi — Modelo Leopardo":[['Garra Relâmpago','Postura Predadora','Salto do Leopardo'],['Mordida Brutal','Reflexo Animal','Investida Felina'],['Ataque das Dez Garras','Esquiva Predadora','Corrida de Caça'],['Rugido Intimidador','Pelagem Reforçada','Salto Duplo'],['Forma Híbrida','Defesa Felina','Caçada Acelerada'],['Rajada Predadora','Sentidos Supremos','Passo Silencioso'],['Predador Supremo','Instinto Absoluto','Investida Mortal'],['Domínio do Caçador','Corpo Felino Perfeito','Movimento Fantasma'],['Forma Completa Suprema','Rei dos Predadores','Golpe Final do Leopardo']],
"Ope Ope no Mi":[['ROOM: Corte','ROOM: Barreira','ROOM: Shambles Rápido'],['Tact Aprimorado','ROOM: Escudo','ROOM: Teleporte'],['Counter Shock','ROOM: Separação','ROOM: Troca de Lugar'],['Mes Preciso','ROOM: Muralha','ROOM: Resgate'],['Gamma Knife','ROOM: Cúpula','ROOM: Shambles em Cadeia'],['Radio Knife','ROOM: Prisão','ROOM: Teleporte Múltiplo'],['K-Room Inicial','ROOM: Fortaleza','ROOM: Manipulação de Campo'],['Anestesia Espacial','ROOM: Domínio Total','ROOM: Cirurgia Relâmpago'],['Despertar: K-Room Supremo','ROOM: Cirurgia Impossível','Despertar: Domínio Espacial']]
};
function fruitPowerFlavor(fruitName,name,type,level,damage){
  const n=name.toLowerCase();const base=String(fruitName||'');
  if(base.includes('Gomu')){if(type==='Ataque')return{effect:'O corpo se estende como uma mola e o golpe recebe alcance e impacto. Em sucesso, causa o dano informado.',uses:'1 alvo.',duration:'Instantâneo'};if(type==='Defesa')return{effect:'A elasticidade absorve parte do impacto. Em sucesso, reduza o dano pelo valor que o Mestre definir.',uses:'Reação contra 1 ataque.',duration:'Até o fim da rodada'};return{effect:'Use a elasticidade para alcançar, ricochetear ou mudar sua posição de forma incomum.',uses:'1 manobra.',duration:'Instantâneo'};}
  if(base.includes('Mera')){if(type==='Ataque')return{effect:'Concentra fogo no ponto escolhido. Em sucesso, causa dano e pode deixar o alvo queimando até o próximo turno, se o Mestre permitir.',uses:'1 alvo ou pequena área.',duration:'Instantâneo'};if(type==='Defesa')return{effect:'Forma uma barreira de fogo. Em sucesso, reduza o dano do ataque que atravessar a barreira.',uses:'Reação.',duration:'Até o próximo turno'};return{effect:'Usa chamas para impulsionar o corpo, atravessar um espaço ou criar pressão de área.',uses:'1 manobra.',duration:'Instantâneo'};}
  if(base.includes('Hie')){if(type==='Ataque')return{effect:'Congela o ponto atingido. Em sucesso, causa dano e pode reduzir o movimento do alvo até o próximo turno.',uses:'1 alvo.',duration:'Até o próximo turno'};if(type==='Defesa')return{effect:'Ergue gelo para absorver o impacto. Em sucesso, reduza o dano recebido.',uses:'Reação.',duration:'Até o próximo turno'};return{effect:'Cria gelo no chão ou em uma superfície para alterar o terreno e criar passagem.',uses:'1 área curta.',duration:'Até a cena mudar'};}
  if(base.includes('Bara')){if(type==='Ataque')return{effect:'Separe partes do corpo e ataque por ângulo inesperado; em sucesso pode contornar cobertura leve.',uses:'1 alvo.',duration:'Instantâneo'};if(type==='Defesa')return{effect:'Divida o corpo para escapar da linha de impacto. Em sucesso, reduza ou anule o dano físico conforme o Mestre.',uses:'Reação.',duration:'Instantâneo'};return{effect:'Separe uma parte do corpo para alcançar, explorar ou escapar de uma posição difícil.',uses:'1 manobra.',duration:'Instantâneo'};}
  if(base.includes('Tori Tori')){if(type==='Ataque')return{effect:'Use força e chamas azuis da Fênix para atingir o alvo e aplicar o dano informado.',uses:'1 alvo ou pequena área.',duration:'Instantâneo'};if(type==='Defesa')return{effect:'As chamas azuis protegem o corpo. Em sucesso, reduza dano e estabilize ferimentos leves.',uses:'Você ou 1 aliado próximo.',duration:'Até o próximo turno'};return{effect:'Use asas e fogo azul para voar, curar ou reposicionar-se conforme a situação.',uses:'1 alvo ou movimento.',duration:'Conforme a cena'};}
  if(base.includes('Neko Neko')){if(type==='Ataque')return{effect:'Avance como predador, usando garras e velocidade. Em sucesso, causa dano e pode deixar o alvo vulnerável ao próximo golpe.',uses:'1 alvo.',duration:'Instantâneo'};if(type==='Defesa')return{effect:'Reflexos animais reduzem o impacto. Em sucesso, reduza o dano ou mova-se 1 passo.',uses:'Reação.',duration:'Instantâneo'};return{effect:'Use sentidos e velocidade para rastrear, perseguir ou reposicionar-se rapidamente.',uses:'1 manobra.',duration:'Instantâneo'};}
  if(base.includes('Ope Ope')){if(type==='Ataque')return{effect:'Dentro da ROOM, faça uma cirurgia espacial precisa. Em sucesso, aplique o dano ou efeito indicado.',uses:'1 alvo dentro da ROOM.',duration:'Instantâneo'};if(type==='Defesa')return{effect:'Manipule a ROOM para desviar ou deslocar um ataque. Em sucesso, reduza o dano ou saia da linha de ataque.',uses:'Reação dentro da ROOM.',duration:'Até o próximo turno'};return{effect:'Manipule posições, objetos ou corpos dentro da ROOM para criar uma abertura, trocar lugares ou reposicionar alguém.',uses:'Alvos dentro da ROOM.',duration:'Instantâneo'};}
  return{effect:`Usa ${name} conforme a descrição temática da fruta.`,uses:'Definido pelo Mestre.',duration:'Conforme a cena'};
}

function fruitPowerOptions(fruit,level){
  if(!fruit)return[];const f=normalizeFruit(fruit);if(level===1)return f.starterPowers;
  const row=(FRUIT_PROGRESSION[f.name]||[])[clamp(level-2,0,8)]||[`${f.name} — Ataque Nvl ${level}`,`${f.name} — Defesa Nvl ${level}`,`${f.name} — Especial Nvl ${level}`];
  const stage=Math.max(1,level-1),damage=stage>=8?'3d10':stage>=6?'2d8':stage>=4?'2d6':stage>=2?'1d10':'1d8',cost=Math.min(8,Math.ceil(stage/2)),attackAttr=stage%2?'Destreza':'Força';
  const cfg=[{type:'Ataque',attribute:attackAttr,check:`1d20 + ${attackAttr}`,damage,cost,range:stage>=5?'Médio':'Curto',desc:`Use ${row[0]} como técnica ofensiva da ${f.name}. Faça o teste; se passar, role o dano.`},{type:'Defesa',attribute:'Constituição',check:'1d20 + Constituição',damage:'',cost,range:'Pessoal',desc:`Use ${row[1]} como reação defensiva. Faça o teste para ativar a proteção.`},{type:'Utilidade',attribute:stage%2?'Destreza':'Vontade',check:`1d20 + ${stage%2?'Destreza':'Vontade'}`,damage:stage>=7?'2d6':'',cost,range:stage>=6?'Médio':'Curto',desc:`Use ${row[2]} para mobilidade, controle, suporte ou posicionamento.`}];
  return row.map((name,i)=>makeFruitPower(name,f,i,level,{...cfg[i],...fruitPowerFlavor(f.name,name,cfg[i].type,level,cfg[i].damage)}));
}
function prepareFruits(){
  LIB.fruits=(LIB.fruits||[]).map(f=>normalizeFruit(f));
  LIB.fruits.forEach(f=>{
    f.starterPowers=f.starterPowers.slice(0,5).map((p,i)=>{
      const old=typeof p==='string'?makeFruitPower(p,f,i,1):normalizePower(p);old.source='fruit';old.sourceId=p.id||old.id;return old;
    });
  });
}
function prepareLibrary(){
  LIB.roles=Object.keys(ROLES).filter(x=>x!=='Nenhum').map(name=>({name,type:'Cargo',desc:ROLES[name].desc,skills:ROLES[name].skills,items:ROLES[name].items}));
  LIB.attacks=(LIB.attacks||[]).map(normalizePower);
  LIB.abilities=(LIB.abilities||[]).map(normalizePower);
  LIB.rituals=(LIB.rituals||[]).map(normalizePower);
  LIB.items=(LIB.items||[]).map(normalizeItem);
  prepareFruits();
}

// Expansão da biblioteca de itens — mais variedade para campanhas.
LIB.items.push(
  {name:'Bainha reforçada',type:'Especial',desc:'Bainha resistente para proteger uma espada e facilitar saque rápido.'},
  {name:'Mapa do East Blue',type:'Navegação',desc:'Mapa de rotas e ilhas do East Blue.'},
  {name:'Faca de cozinha',type:'Arma',desc:'Faca culinária que também pode ser usada como arma improvisada.'},
  {name:'Kit de pesquisa',type:'Conhecimento',desc:'Lupa, luvas, papéis e materiais para pesquisa histórica.'},
  {name:'Kit médico',type:'Ferramenta',desc:'Instrumentos básicos para primeiros socorros.'},
  {name:'Instrumento musical',type:'Especial',desc:'Instrumento usado para performance e música.'},
  {name:'Bússola',type:'Navegação',desc:'Instrumento simples para orientação fora de mares anômalos.'},
  {name:'Kit náutico',type:'Ferramenta',desc:'Ferramentas para pequenos reparos e manutenção durante viagens.'},
  {name:'Bastão de Combate',type:'Arma',desc:'Bastão resistente para golpes e defesa.',bonus:'+1 Defesa quando bloqueando.'},
  {name:'Martelo',type:'Arma',desc:'Martelo pesado usado em combate corpo a corpo.',bonus:'+1 Dano em golpes pesados.'},
  {name:'Machado',type:'Arma',desc:'Machado de combate de uma mão.'},
  {name:'Marreta',type:'Arma',desc:'Arma pesada de grande impacto.',bonus:'+2 Dano, -1 em testes de Reflexos durante ataques.'},
  {name:'Foice',type:'Arma',desc:'Lâmina curva para ataques de alcance curto.'},
  {name:'Corrente',type:'Arma',desc:'Arma flexível que pode tentar desarmar ou prender.'},
  {name:'Clava',type:'Arma',desc:'Arma simples e pesada.'},
  {name:'Besta',type:'Arma',desc:'Arma de disparo à distância.'},
  {name:'Canhão Portátil',type:'Arma',desc:'Pequeno canhão para uma ação ofensiva poderosa.',bonus:'+2 Dano; recarga entre usos.'},
  {name:'Capa Reforçada',type:'Armadura',desc:'Capa grossa que ajuda a bloquear impactos.',bonus:'+1 Defesa.'},
  {name:'Armadura de Couro',type:'Armadura',desc:'Proteção leve para viagens e combate.'},
  {name:'Armadura de Metal',type:'Armadura',desc:'Proteção pesada.',bonus:'+2 Defesa, -1 Movimento.'},
  {name:'Antídoto',type:'Consumível',desc:'Remove ou reduz um efeito de veneno conforme a decisão do Mestre.'},
  {name:'Comida Energética',type:'Consumível',desc:'Recupera 5 PV uma vez durante um descanso curto.'},
  {name:'Ração de Viagem',type:'Consumível',desc:'Alimento que dura vários dias.'},
  {name:'Explosivo Pequeno',type:'Consumível',desc:'Explosivo improvisado para abrir passagem ou causar dano.'},
  {name:'Corda 20m',type:'Ferramenta',desc:'Corda resistente para escalada, amarras e resgates.'},
  {name:'Gancho',type:'Ferramenta',desc:'Gancho para subir, puxar objetos ou prender cordas.'},
  {name:'Lanterna',type:'Ferramenta',desc:'Ilumina áreas escuras.'},
  {name:'Kit de Ferramentas',type:'Ferramenta',desc:'Conjunto completo para pequenos reparos.'},
  {name:'Martelo de Carpinteiro',type:'Ferramenta',desc:'Ferramenta de construção e reparo.'},
  {name:'Chave Inglesa',type:'Ferramenta',desc:'Boa para máquinas e mecanismos.'},
  {name:'Bússola Magnética',type:'Navegação',desc:'Aponta para o norte fora de interferências especiais.'},
  {name:'Diário de Bordo',type:'Navegação',desc:'Registro de rotas, clima e acontecimentos.'},
  {name:'Binóculo',type:'Navegação',desc:'Aumenta o alcance visual para vigias.'},
  {name:'Vivre Card',type:'Navegação',desc:'Objeto especial que pode apontar para uma pessoa, conforme a regra da campanha.'},
  {name:'Den Den Mushi Visual',type:'Comunicação',desc:'Permite comunicação visual a longa distância.'},
  {name:'Den Den Mushi de Emergência',type:'Comunicação',desc:'Usado para enviar um sinal de socorro.'},
  {name:'Mapa do Governo',type:'Conhecimento',desc:'Mapa com informações estratégicas sobre territórios conhecidos.'},
  {name:'Livro de História',type:'Conhecimento',desc:'Fonte para testes de História e pesquisa.'},
  {name:'Kit de Arqueologia',type:'Conhecimento',desc:'Ferramentas para analisar ruínas e inscrições.'},
  {name:'Cartuchos x10',type:'Munição',desc:'Dez unidades de munição compatível com armas de fogo.'},
  {name:'Flechas x10',type:'Munição',desc:'Dez flechas para arco ou besta.'},
  {name:'Balas Especiais x5',type:'Munição',desc:'Munição preparada para efeitos especiais.'},
  {name:'Máscara',type:'Especial',desc:'Ajuda a ocultar o rosto e mudar a aparência.'},
  {name:'Binóculo Tático',type:'Especial',desc:'Equipamento para observação cuidadosa à distância.'},
  {name:'Algemas',type:'Especial',desc:'Usadas para conter alvos incapacitados.'},
  {name:'Kit de Disfarce Avançado',type:'Especial',desc:'Materiais para criar disfarces convincentes.'}
);

prepareLibrary();

function mergedLibrary(type){
  if(type==='races')return Object.entries(RACES).map(([name,data])=>({name,type:'Raça',desc:data.desc,b:data.b,skills:data.skills,abilities:data.abilities,evolution:raceEvolutionData(name)}));
  if(type==='roles')return LIB.roles;
  if(type==='fruits')return LIB.fruits;
  if(type==='haki')return [...HAKI.observacao,...HAKI.armamento,...HAKI.rei];
  return [...(LIB[type]||[]),...(homebrew[type]||[])];
}

/* ------------------------- DADOS ------------------------- */
function roll(sides){return Math.floor(Math.random()*Math.max(1,num(sides,20)))+1;}
function parseDice(expression='1d20'){
  const m=String(expression).replace(/\s/g,'').match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if(!m)return null;
  return {count:clamp(num(m[1],1),1,100),sides:clamp(num(m[2],20),2,1000),mod:num(m[3],0)};
}
function rollExpression(expression='1d6'){
  const p=parseDice(expression);if(!p)return {rolls:[],total:0,expression};
  const rolls=Array.from({length:p.count},()=>roll(p.sides));
  return {rolls,total:rolls.reduce((a,b)=>a+b,0)+p.mod,expression};
}
function showRollResult(title,details,extra=''){
  const el=$('diceResult'); if(!el)return showToast(`${title}: ${details}`);
  $('diceResultTitle').textContent=title; $('diceResultMain').textContent=details; $('diceResultExtra').textContent=extra; el.classList.remove('hidden'); el.setAttribute('aria-live','polite'); clearTimeout(showRollResult.timer);
}
function saveGlobalRoll(textValue){
  const history=loadJSON(STORAGE.rolls,[]);history.unshift({text:textValue,time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})});saveJSON(STORAGE.rolls,history.slice(0,200));
}
function getCampaign(id){return campaigns.find(c=>c.id===id);}
function campaignLog(c,participant,textValue){
  c.rollHistory=Array.isArray(c.rollHistory)?c.rollHistory:[];
  c.rollHistory.unshift({id:uid(),participant,time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),text:textValue});
  c.rollHistory=c.rollHistory.slice(0,200);
}
function saveRollForContext(participant,textValue){
  saveGlobalRoll(textValue);
  if(activeCampaignIdForRoll){
    const c=getCampaign(activeCampaignIdForRoll);
    if(c){campaignLog(c,participant,textValue);saveCampaigns();}
  }
}

/* ------------------------- PERSISTÊNCIA GLOBAL ------------------------- */
let agents=ensureUniqueIds(loadLegacyAgents()).map(normalizeAgent);
let campaigns=[];
function normalizeThreat(threat){
  const t=clone(threat||{});
  t.id=t.id||uid();
  t.name=text(t.name)||'Ameaça';
  t.hpMax=Math.max(1,num(t.hpMax,t.hp||10));
  t.hpCurrent=clamp(num(t.hpCurrent,t.hpMax),0,t.hpMax);
  t.attack=num(t.attack);
  t.level=clamp(num(t.level,1),1,10);
  t.desc=text(t.desc);
  t.fruit=text(t.fruit);
  t.image=text(t.image);
  t.items=Array.isArray(t.items)?t.items.map(normalizeItem):[];
  if(!t.attributes)t.attributes={};
  if(t.attributes.Carisma!==undefined&&t.attributes.Presença===undefined)t.attributes.Presença=t.attributes.Carisma;
  t.attributes=Object.fromEntries(ATTRS.map(a=>[a,clamp(num(t.attributes[a]),-2,20)]));
  const abilitySource=Array.isArray(t.abilities)?t.abilities:[];
  const powerSource=Array.isArray(t.powers)?t.powers:[];
  const sourcePowers=abilitySource.length?abilitySource:powerSource;
  t.powers=sourcePowers.map(normalizePower);
  t.abilities=clone(t.powers);
  if(!t.abilities.length)t.abilities=[normalizePower({id:uid(),name:'Ataque básico',origin:'Ameaça',level:t.level,cost:0,attribute:'Força',damage:'1d6',check:'1d20 + Força',type:'Ataque',desc:'Ataque básico da ameaça.',color:'vermelho'})];
  t.initiative=t.initiative??null;
  return t;
}
function normalizeCampaign(c){
  const x=clone(c||{});
  x.id=x.id||uid();x.name=text(x.name)||'Campanha';x.code=x.code||Math.random().toString(36).slice(2,8).toUpperCase();
  x.members=Array.isArray(x.members)?x.members.map(m=>({id:m.id||uid(),agentId:m.agentId||m.agent?.id||uid(),agent:normalizeAgent(m.agent||{})})):[];
  x.members=ensureUniqueIds(x.members);
  x.threats=Array.isArray(x.threats)?x.threats.map(normalizeThreat):[];
  x.rollHistory=Array.isArray(x.rollHistory)?x.rollHistory:[];
  x.initiatives=x.initiatives&&typeof x.initiatives==='object'?x.initiatives:{};
  x.turnOrder=Array.isArray(x.turnOrder)?x.turnOrder:[];
  x.activeTurn=clamp(num(x.activeTurn,0),0,999);
  x.round=Math.max(1,num(x.round,1));
  return x;
}
function loadCampaigns(){
  let data=loadJSON(STORAGE.campaigns,null);
  if(!Array.isArray(data)){
    for(const key of ['weirdCampaignsV7','weirdCampaignsV6','weirdCampaignsV5','weirdCampaignsV4']){
      data=loadJSON(key,null);
      if(Array.isArray(data))break;
    }
  }
  return Array.isArray(data)?data.map(normalizeCampaign):[];
}
function saveAgents(){saveJSON(STORAGE.agents,agents);}
function saveCampaigns(){return saveJSON(STORAGE.campaigns,campaigns);}
function syncAgentToCampaigns(agent){
  let changed=false;
  campaigns.forEach(c=>c.members.forEach(m=>{
    if(m.agentId===agent.id){m.agent=clone(agent);changed=true;}
  }));
  if(changed)saveCampaigns();
}
campaigns=loadCampaigns();
homebrew=normalizeHomebrew(loadJSON(STORAGE.homebrew,loadJSON('weirdHomebrewV7',loadJSON('weirdHomebrewV6',defaultHomebrew()))));
let current=null;
let editingId=null;
let editorTab='identity';
let selectedTheme='pirata';
let detailContext=null;
let libraryType='attacks';
let libraryItemFilter='Todos';
let inventoryFilter='Todos';
let homebrewTab='abilities';
let sheetTab='overview';
let returnCampaignId=null;
let activeCampaignPageId=null;
let activeCampaignIdForRoll=null;
let campaignModalMode='';
let deferredInstallPrompt=null;
let detailPowerBuffer=null;
let threatEditBuffer=null;
let threatEditingCampaignId=null;
let threatEditingIndex=-1;

/* ------------------------- NAVEGAÇÃO / TEMA ------------------------- */
function applyColorTheme(theme){
  const t=COLOR_THEMES[theme]?theme:'escuro';
  document.body.dataset.color=t;
  const prefs=loadJSON(STORAGE.prefs,{});prefs.color=t;saveJSON(STORAGE.prefs,prefs);
  document.querySelectorAll('.theme-setting').forEach(el=>el.classList.toggle('selected',el.dataset.color===t));
}
function applyUserTheme(theme){document.body.dataset.theme=theme||'pirata';}
function openOptions(){
  const prefs=loadJSON(STORAGE.prefs,{});applyColorTheme(prefs.color||'escuro');renderThemeOptions();openModal('optionsModal');
}
function renderThemeOptions(){
  const box=$('themeOptions');if(!box)return;
  const currentTheme=document.body.dataset.color||'escuro';
  box.innerHTML=Object.entries(COLOR_THEMES).map(([id,data])=>`<button class="theme-setting ${id===currentTheme?'selected':''}" data-color="${id}" onclick="applyColorTheme('${id}');renderThemeOptions()"><span>${data.icon}</span><b>${data.label}</b></button>`).join('');
}
function go(page){
  const campaignAlreadyOpen = page==='campaigns' && activeCampaignPageId && $('campaigns')?.classList.contains('active');
  if(['home','agents','threats','homebrew'].includes(page)){
    activeCampaignIdForRoll=null; returnCampaignId=null; activeCampaignPageId=null;
  }
  if(page==='campaigns'&&activeCampaignPageId)activeCampaignIdForRoll=activeCampaignPageId;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const target=$(page); if(target)target.classList.add('active');
  document.querySelectorAll('.mobile-bottom-nav button').forEach(btn=>btn.classList.toggle('active',btn.dataset.page===page));
  if(!campaignAlreadyOpen)window.scrollTo({top:0,left:0,behavior:'auto'});
  if(page==='agents')renderAgents();
  if(page==='campaigns')renderCampaigns();
  if(page==='threats')renderThreats();
  if(page==='homebrew')renderHomebrew();
}
function chooseTheme(theme,element){
  selectedTheme=theme;applyUserTheme(theme);
  document.querySelectorAll('.theme-choice').forEach(el=>el.classList.remove('selected'));
  element?.classList.add('selected');
}

/* ------------------------- CRIAÇÃO / EDIÇÃO ------------------------- */
const EDIT_TABS=[
  ['identity','🧭 Identificação'],
  ['attributes','💪 Atributos'],
  ['skills','🎯 Perícias'],
  ['abilities','✨ Habilidades'],
  ['rituals','📜 Rituais'],
  ['haki','👁️ Haki'],
  ['aura','🟣 Aura'],
  ['fruit','🍈 Akuma no Mi'],
  ['combat','⚔️ Combate'],
  ['inventory','🎒 Inventário'],
  ['history','📖 História']
];
function blankAgent(){
  const attributes=defaultAttributes();const skills=defaultSkills();
  return normalizeAgent({
    id:uid(),theme:selectedTheme,name:'',player:'',age:'',origin:'',organization:'',race:'Humano',level:1,raceLevel:1,
    bounty:0,berries:0,reputation:0,roles:['Nenhum','Nenhum'],attributes,skills,hpCurrent:RULES.baseHP,peCurrent:RULES.basePE,
    haki:[],observationChoices:[],armament:'',conqueror:false,aura:'Nenhuma',auraActive:false,auraSkipNext:false,
    fruit:null,fruitLevel:1,fruitChoices:[],fruitSelections:{},fruitPowerEdits:{},attacks:[],abilities:[],raceAbilities:[],rituals:[],items:[],
    determinationChoices:{},personality:'',honor:'',dream:'',history:'',avatar:'',createdAt:Date.now(),updatedAt:Date.now()
  });
}
function saveCreationDraft(){ if(current) saveJSON(STORAGE.draft, clone(current)); else { try{localStorage.removeItem(STORAGE.draft);}catch{} } }
function clearCreationDraft(){ try{localStorage.removeItem(STORAGE.draft);}catch{} }

function startCreation(){
  clearCreationDraft();
  activeCampaignIdForRoll=null;returnCampaignId=null;
  current=null;editingId=null;selectedTheme='pirata';applyUserTheme('pirata');
  go('create');$('creationStart')?.classList.remove('hidden');$('editorRoot')?.classList.add('hidden');
  $('createTitle').textContent='Nova ficha';
}
function beginEditor(agent=null,options={}){
  current=agent?normalizeAgent(agent):blankAgent();
  editingId=agent?agent.id:null;
  selectedTheme=current.theme||'pirata';applyUserTheme(selectedTheme);
  $('creationStart')?.classList.add('hidden');$('editorRoot')?.classList.remove('hidden');
  $('createTitle').textContent=editingId?'Editar ficha':'Criar ficha';
  editorTab=options.tab||'identity';inventoryFilter='Todos';
  renderEditor();
}
function openEditorForSheet(agentId){
  const a=agents.find(x=>x.id===agentId);if(!a)return;
  closeAllModals();returnCampaignId=returnCampaignId||activeCampaignIdForRoll;activeCampaignIdForRoll=returnCampaignId||null;
  beginEditor(a);go('create');
}
function panel(number,title,description,body){
  return `<div class="panel"><div class="panel-title"><span>${number}</span><div><h2>${title}</h2><p>${description}</p></div></div>${body}</div>`;
}
function renderEditor(){
  if(!current)return;
  saveCreationDraft();
  const index=EDIT_TABS.findIndex(x=>x[0]===editorTab);
  const previous=EDIT_TABS[Math.max(0,index-1)]?.[0]||EDIT_TABS[0][0];
  const isLast=index===EDIT_TABS.length-1;
  $('editorRoot').innerHTML=`<div class="editor-shell theme-${current.theme||'pirata'}">
    <aside class="editor-nav">
      <button class="editor-avatar" onclick="current.avatar?openAvatarViewer():chooseAvatar()">${current.avatar?`<img src="${escapeAttr(current.avatar)}" alt="Avatar">`:'📷'}</button>
      <b>${escapeHTML(current.name||'Novo personagem')}</b>
      <small>${escapeHTML(current.race)} • Nível ${current.level}</small>
      <div class="editor-nav-title">ETAPAS</div>
      ${EDIT_TABS.map(([id,label])=>`<button class="editor-tab ${editorTab===id?'active':''}" onclick="setEditorTab('${id}')">${label}</button>`).join('')}
      <button class="save-side" onclick="saveCurrentAgent()">💾 ${editingId?'Salvar alterações':'Salvar ficha'}</button>
      ${editingId?'<button class="editing-badge" disabled>✎ MODO EDIÇÃO</button>':''}
    </aside>
    <div class="editor-main">
      ${renderTab(editorTab)}
      <div class="editor-footer">
        <button class="secondary" ${index===0?'disabled':''} onclick="setEditorTab('${previous}')">← Anterior</button>
        <span>Etapa ${index+1} de ${EDIT_TABS.length}</span>
        <button class="primary" onclick="${isLast?'finishCharacterCreation()':'nextEditorTab()'}">${isLast?'✅ Concluir ficha':'Próximo →'}</button>
      </div>
    </div>
  </div>`;
}
function setEditorTab(tab){readEditorFields();editorTab=tab;renderEditor();window.scrollTo({top:0,behavior:'smooth'});}
function nextEditorTab(){readEditorFields();const index=EDIT_TABS.findIndex(x=>x[0]===editorTab);if(index<EDIT_TABS.length-1){editorTab=EDIT_TABS[index+1][0];renderEditor();window.scrollTo({top:0,behavior:'smooth'});}}
function renderTab(tab){
  switch(tab){
    case'identity':return renderIdentity();case'attributes':return renderAttributes();case'skills':return renderSkills();case'abilities':return renderAbilities();
    case'rituals':return renderRituals();case'haki':return renderHaki();case'aura':return renderAura();case'fruit':return renderFruit();
    case'combat':return renderCombat();case'inventory':return renderInventory();case'history':return renderHistory();default:return'';
  }
}
function readEditorFields(){
  if(!current)return;
  const values={
    fName:'name',fPlayer:'player',fAge:'age',fOrigin:'origin',fOrg:'organization',fTheme:'theme',fLevel:'level',fRaceLevel:'raceLevel',fBounty:'bounty',fBerries:'berries',fRep:'reputation',
    dPersonality:'personality',dHonor:'honor',dDream:'dream',dHistory:'history'
  };
  Object.entries(values).forEach(([id,key])=>{const el=$(id);if(!el)return;let value=el.value;if(['level','raceLevel','bounty','berries','reputation'].includes(key))value=num(value);current[key]=value;});
  current.level=clamp(num(current.level,1),1,10);current.raceLevel=clamp(num(current.raceLevel,1),1,10);current.theme=current.theme||'pirata';applyUserTheme(current.theme);
  const before=calc(current);current.hpCurrent=clamp(num(current.hpCurrent,before.hpMax),0,before.hpMax);current.peCurrent=clamp(num(current.peCurrent,before.peMax),0,before.peMax);
  saveCreationDraft();
}
function renderIdentity(){
  const r=RACES[current.race]||RACES.Humano;
  return panel('01','Identificação','Nesta etapa você coloca os dados básicos. Cada campo explica o que deve ser preenchido.',`
    <div class="help-banner"><b>Como preencher:</b> use o nome do personagem, idade, origem e organização. Os exemplos não ficam salvos.</div>
    <div class="identity-banner"><div class="big-avatar" onclick="current.avatar?openAvatarViewer():chooseAvatar()">${current.avatar?`<img src="${escapeAttr(current.avatar)}" alt="Imagem do personagem">`:'📷'}</div><div><button class="secondary" onclick="chooseAvatar()">📷 Escolher imagem</button><p class="muted">JPG, PNG ou WEBP. A imagem fica guardada dentro desta ficha.</p></div></div>
    <div class="form-grid">
      <label>Nome do personagem <span class="field-help">Ex.: Roran D. Vale</span><input id="fName" value="${escapeAttr(current.name)}" placeholder="Ex.: Roran D. Vale"></label>
      <label>Jogador <span class="field-help">Seu nome ou apelido</span><input id="fPlayer" value="${escapeAttr(current.player)}" placeholder="Ex.: Kakal"></label>
      <label>Idade <span class="field-help">Idade do personagem</span><input id="fAge" type="number" min="0" value="${escapeAttr(current.age)}" placeholder="Ex.: 19"></label>
      <label>Origem <span class="field-help">Ilha, cidade ou região</span><input id="fOrigin" value="${escapeAttr(current.origin)}" placeholder="Ex.: East Blue"></label>
      <label>Organização <span class="field-help">Ex.: Piratas, Marinha, Governo</span><input id="fOrg" value="${escapeAttr(current.organization)}" placeholder="Ex.: Bando do Pé de Lama"></label>
      <label>Tema da ficha <span class="field-help">Apenas visual</span><select id="fTheme">${['pirata','marinha','revolucionario','governo'].map(x=>`<option value="${x}" ${current.theme===x?'selected':''}>${x[0].toUpperCase()+x.slice(1)}</option>`).join('')}</select></label>
      <label>Nível do personagem <span class="field-help">1 a 10. Aumenta PV, PE e libera progressão.</span><input id="fLevel" type="number" min="1" max="10" value="${current.level}"></label>
      <label>Nível da raça <span class="field-help">1, 3, 5, 7 e 10 liberam evoluções da raça.</span><input id="fRaceLevel" type="number" min="1" max="10" value="${current.raceLevel}"></label>
      <label>Recompensa <span class="field-help">Valor da recompensa do personagem.</span><input id="fBounty" type="number" min="0" value="${current.bounty}"></label>
      <label>Dinheiro / Berries <span class="field-help">Quanto o personagem possui.</span><input id="fBerries" type="number" min="0" value="${current.berries}"></label>
      <label>Reputação <span class="field-help">Use qualquer valor que faça sentido para a campanha.</span><input id="fRep" type="number" value="${current.reputation}"></label>
      <label>Cargo 1 <span class="field-help">Aplique um cargo principal.</span><button class="selector-input" onclick="openPicker('roles',0)">${escapeHTML(current.roles[0])}<span>⌄</span></button></label>
      <label>Cargo 2 <span class="field-help">Cargo secundário opcional.</span><button class="selector-input" onclick="openPicker('roles',1)">${escapeHTML(current.roles[1])}<span>⌄</span></button></label>
      <label>Raça <span class="field-help">A raça fornece bônus e uma árvore própria.</span><button class="selector-input" onclick="openPicker('races')">${escapeHTML(current.race)}<span>⌄</span></button></label>
    </div>
    <div class="info-grid">
      <div class="info-card"><b>💡 Reputação</b><p>${escapeHTML(reputationText(current.reputation))}</p></div>
      <div class="info-card"><b>🧬 ${escapeHTML(current.race)}</b><p>${escapeHTML(r.desc)}</p><div class="tags">${Object.entries(r.b).map(([a,v])=>`<span class="tag">${a} ${v>=0?'+':''}${v}</span>`).join('')||'<span class="tag">Sem bônus direto</span>'}</div></div>
    </div>
    <div class="selected-preview"><div><b>Raça escolhida:</b> ${escapeHTML(current.race)}</div><button class="secondary" onclick="openDetail('race','${escapeAttr(current.race)}')">ⓘ Ver habilidades e todas as evoluções</button></div>
  `);
}
function reputationText(value){const v=num(value);if(v<0)return'Você possui fama negativa e pode ser malvisto por autoridades ou outros grupos.';if(v<10)return'Pouco conhecido. A maioria das pessoas ainda não reconhece seu nome.';if(v<30)return'Conhecido. Algumas pessoas já sabem quem você é.';if(v<60)return'Respeitado ou temido. Seu nome começa a influenciar situações.';return'Lendário. Sua reputação abre portas, cria inimigos e pode virar parte da história.';}
function renderAttributes(){
  const points=Object.values(current.attributes).reduce((a,b)=>a+Math.max(0,num(b)),0);
  const pool=attributePool(current); const available=Math.max(0,pool-points);
  return panel('02','Atributos','Na criação existem 12 pontos. Cada nível que você sobe concede +1 ponto de atributo para colocar onde quiser.',`
    <div class="rule-strip">Pontos usados: <b>${points}/${pool}</b> • <b>${available} ponto(s) disponível(is)</b> • Máximo por atributo: <b>${maxAttr(current)}</b></div>
    <div class="attribute-grid">${ATTRS.map(attr=>{const base=num(current.attributes[attr]);return `<div class="attribute-card"><div class="attr-icon">${attr.charAt(0)}</div><div class="attr-text"><b>${attr}</b><small>${escapeHTML(ATTR_INFO[attr])}</small><span>Total com raça/Aura: ${attrTotal(current,attr)}</span></div><button onclick="changeAttribute('${attr}',-1)">−</button><strong>${base}</strong><button onclick="changeAttribute('${attr}',1)">+</button><button class="dice-mini" onclick="rollAttribute('${attr}')">🎲</button></div>`}).join('')}</div>
    <div class="info"><b>Como funciona:</b> o valor central é o que você distribuiu. Raça e Aura entram no Total. Clique no 🎲 para fazer 1d20 + o atributo.</div>`);
}
function skillHelpButton(name){return `<button class="skill-help" title="Saiba como funciona" onclick="openSkillHelp('${escapeAttr(name)}')">?</button>`;}
function renderSkills(){
  const rt=roleTraining(current),rc=raceTraining(current),used=calculateIntUsed(current),pool=intPool(current);
  const detTrained=Boolean(current.skills?.['Determinação']?.int);
  return panel('03','Perícias','Toda perícia possui explicação por mouse e por clique. Cargo e raça dão bônus automáticos; Inteligência compra especializações.',`
    <div class="rule-strip">🎓 Inteligência usada: <b>${used}/${pool}</b> pontos • Perícias normais usam 1 ponto de Inteligência por especialização • <b>Determinação usa 2</b>.</div>
    <div class="legend-row"><span class="legend-chip race">■ Raça</span><span class="legend-chip role">■ Cargo</span><span class="legend-chip fruit">■ Fruta</span><span class="legend-chip custom">■ Personalizada</span></div>
    <div class="skill-columns">${Object.entries(SKILLS).map(([group,list])=>`<div class="skill-group"><h3>${group}</h3>${list.map(([name,attr])=>skillRow(name,attr,rt,rc)).join('')}</div>`).join('')}</div>
    <div class="special-section"><div class="section-head compact-head"><div><span class="eyebrow">ESPECIAL</span><h3>Determinação</h3></div><span class="badge-blue">Custa 2 Inteligência</span></div><p>${escapeHTML(SKILL_HELP.Determinação)}</p>${detTrained?`<div class="determination-choice-grid">${Object.entries(DETERMINATION_POWERS).slice(0,Math.min(10,num(current.level,1))).map(([level,powers])=>renderDeterminationLevel(level,powers)).join('')}</div>`:'<div class="help-banner"><b>Bloqueada:</b> ative o botão <b>INT -2</b> em Determinação para começar a escolher os poderes.</div>'}</div>`);
}
function skillRow(name,attr,rt,rc){
  const s=current.skills[name]||{training:0,int:false};
  const role=rt.get(name)||0,race=rc.get(name)||0,total=skillTotal(current,name);const isDet=name==='Determinação';
  const max=trainingMax(current);let options='';
  [0,5,10,15].forEach(v=>{if(v<=max)options+=`<option value="${v}" ${num(s.training)===v?'selected':''}>Treino +${v}</option>`;});
  const classes=[role?'from-role':'',race?'from-race':'',isDet?'determination-row':''].filter(Boolean).join(' ');
  const intCost=isDet?2:1;
  const available=intPool(current)-calculateIntUsed(current)+(s.int?intCost:0);
  const intLabel=s.int?`✓ INT -${intCost}`:`＋ INT -${intCost}`;
  return `<div class="skill-row ${classes}" title="${escapeAttr(SKILL_HELP[name]||'Use um teste d20 somando o atributo indicado.')}" onclick="focusSkill('${escapeAttr(name)}')"><div class="skill-name"><b>${escapeHTML(name)}</b>${skillHelpButton(name)}<small>${attr} • Total +${total}${race?` • Raça +${race}`:''}${role?` • Cargo +${role}`:''}${s.int?` • INT +5`:''}</small></div><select onclick="event.stopPropagation()" onchange="setSkillTraining('${escapeAttr(name)}',this.value)">${options}</select><button class="int-btn ${s.int?'on':''}" onclick="event.stopPropagation();toggleIntSkill('${escapeAttr(name)}')" title="${available>=intCost||s.int?'Usar Inteligência para treinar':'Inteligência insuficiente'}">${intLabel}</button><button class="dice-mini" onclick="event.stopPropagation();rollSkill('${escapeAttr(name)}')">🎲</button></div>`;
}
function focusSkill(name){openSkillHelp(name);}
function renderDeterminationLevel(level,powers){
  const selected=current.determinationChoices?.[level]||[];
  return `<div class="determination-level"><div class="level-head"><b>Nível ${level}</b><small>Escolha até 2 de 3</small></div><div class="choice-grid">${powers.map(p=>{const chosen=selected.includes(p.id);return `<button class="power-choice ${chosen?'selected':''}" onclick="toggleDeterminationPower(${level},'${escapeAttr(p.id)}')"><b>${chosen?'✓ ':''}${escapeHTML(p.name)}</b><small>${escapeHTML(p.desc)}</small><span>${p.cost||0} PE • ${escapeHTML(p.damage||'sem dano')} • ${escapeHTML(p.check)}</span></button>`}).join('')}</div></div>`;
}
function roleAbilityData(roleName){
  const role=ROLES[roleName];if(!roleName||!role||roleName==='Nenhum')return [];
  const map={
    Capitão:[['Comando da Tripulação','Pode gastar 1 PE para conceder +2 em um teste de um aliado que consiga ouvir sua ordem.'],['Presença de Capitão','Uma vez por cena, role 1d20 + Presença para organizar o grupo sob pressão.']],
    Espadachim:[['Postura de Lâmina','Ao lutar com espada, pode gastar 1 PE para receber +2 no próximo ataque.'],['Corte Técnico','No acerto, pode trocar parte do dano por uma tentativa de desarme.']],
    Navegador:[['Leitura do Mar','Role 1d20 + Inteligência para prever mudanças perigosas de rota ou clima.'],['Rota Impossível','1 vez por cena, gaste 2 PE para reduzir uma penalidade de navegação ou encontrar uma rota alternativa.']],
    Cozinheiro:[['Prato Revigorante','Durante um descanso, uma refeição preparada recupera +5 PV de um aliado.'],['Chute de Cozinha','Ataque corpo a corpo usando Força, 1d8 de dano, custo 1 PE.']],
    Arqueólogo:[['Leitura Antiga','Role 1d20 + Inteligência para interpretar escrita, ruína ou documento desconhecido.'],['Memória Histórica','Gaste 1 PE para lembrar uma informação relevante que tenha ligação com o cenário.']],
    Médico:[['Primeiros Socorros','Gaste 1 PE para estabilizar um aliado e recuperar 1d6 PV fora de uma ação ofensiva.'],['Diagnóstico Rápido','Role 1d20 + Inteligência para identificar doença, veneno ou ferimento.']],
    Atirador:[['Mira Preparada','Se ficar um turno sem se mover muito, recebe +2 no próximo tiro.'],['Tiro Preciso','Gaste 1 PE para reduzir uma penalidade de alcance ou cobertura.']],
    Carpinteiro:[['Reparo Emergencial','Gaste 1 PE e role 1d20 + Inteligência para reparar uma estrutura rapidamente.'],['Engenharia Improvisada','Uma vez por cena, crie uma pequena solução mecânica com materiais disponíveis.']],
    Músico:[['Ritmo de Batalha','Gaste 1 PE para dar +2 no próximo teste de um aliado que escute sua música.'],['Performance Distrativa','Role 1d20 + Presença para distrair vários alvos quando a cena permitir.']],
    Timoneiro:[['Manobra Radical','Gaste 1 PE para dar +2 em um teste de movimento do navio.'],['Mãos no Leme','Quando conduzindo o navio, recebe +2 em Reflexos para reagir a perigos.']],
    Combatente:[['Combinação de Golpes','Gaste 2 PE para adicionar 1d6 de dano a um ataque corpo a corpo que acertou.'],['Postura de Combate','Uma vez por rodada, pode gastar 1 PE para receber +1 Defesa até seu próximo turno.']],
    Espião:[['Disfarce Perfeito','Gaste 1 PE e role 1d20 + Presença para sustentar uma identidade falsa.'],['Ataque Surpresa','Se estiver escondido, o primeiro ataque pode receber +2 no teste.']]
  };
  const base=(map[roleName]||[['Técnica do Cargo','Recebe uma vantagem temática do cargo em uma situação apropriada.'],['Especialização do Cargo','Gaste 1 PE para receber +2 em um teste ligado ao seu cargo.']]);
  const extras=[
    [`Aprimoramento de ${roleName}`,'Nível 5: sua especialização fica mais eficiente. Quando fizer um teste ligado ao cargo, pode gastar 2 PE para receber +3 no resultado.'],
    [`Domínio de ${roleName}`,'Nível 7: uma vez por cena, você pode repetir um teste diretamente ligado ao seu cargo e ficar com o melhor resultado.'],
    [`Lenda de ${roleName}`,'Nível 10: uma vez por combate ou cena importante, transforme uma ação ligada ao cargo em um feito excepcional; role 1d20 + atributo relacionado e o Mestre resolve o efeito.']
  ];
  const all=[
    {name:base[0][0],desc:base[0][1],unlockLevel:1},
    {name:base[1][0],desc:base[1][1],unlockLevel:3},
    {name:extras[0][0],desc:extras[0][1],unlockLevel:5},
    {name:extras[1][0],desc:extras[1][1],unlockLevel:7},
    {name:extras[2][0],desc:extras[2][1],unlockLevel:10}
  ];
  return all.map((x,i)=>normalizePower({id:`role-${roleName}-${i}`,name:x.name,origin:'Cargo',level:x.unlockLevel,cost:/gaste|Gaste|Custo/.test(x.desc)?1:0,attribute:'Presença',check:'1d20 + atributo relacionado',desc:x.desc,color:'azul',type:'Habilidade de Cargo',unlockLevel:x.unlockLevel}));
}

function renderAbilities(){
  const raceEligible=raceEvolutionData(current.race).filter(e=>e.level<=current.raceLevel);
  const raceAdded=new Set(current.raceAbilities.map(x=>x.sourceId||x.id));
  const selectedRoles=(current.roles||[]).filter(x=>x!=='Nenhum');
  const ownedRoleIds=new Set(current.abilities.filter(x=>x.origin==='Cargo').map(x=>x.sourceId||x.id));
  const rolePowers=selectedRoles.flatMap(role=>roleAbilityData(role).map(p=>({...p,sourceId:p.id}))).filter(p=>num(p.unlockLevel,1)<=num(current.level,1));
  return panel('04','Habilidades','As cores mostram a origem. Amarelo = Raça, azul = Cargo, vermelho = Akuma no Mi, roxo = Haki, verde = Aura e rosa = Homebrew.',`
    <div class="legend-row"><span class="legend-chip race">■ Raça</span><span class="legend-chip role">■ Cargo</span><span class="legend-chip fruit">■ Akuma no Mi</span><span class="legend-chip custom">■ Homebrew</span></div>
    <div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">RAÇA • NÍVEL ${current.raceLevel}</span><h3>Evoluções liberadas</h3></div></div>${raceEligible.length?raceEligible.map(e=>`<div class="power-card color-${e.color}"><div><b>${escapeHTML(e.name)}</b><small>Nvl ${e.level} • ${e.cost} PE • ${escapeHTML(e.check)}</small><p>${escapeHTML(e.effect)}</p>${e.damage?`<span class="tag">Dano sugerido: ${e.damage}</span>`:''}</div><button class="secondary" onclick="${raceAdded.has(e.id)?`showToast('Esta evolução já está na ficha.')`:`addRaceAbility('${escapeAttr(e.id)}')`}">${raceAdded.has(e.id)?'✓ Na ficha':'＋ Adicionar'}</button></div>`).join(''):'<div class="empty-small">Nenhuma evolução liberada ainda.</div>'}</div>
    ${rolePowers.length?`<div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">CARGO</span><h3>Técnicas liberadas pelo nível</h3><p class="muted">Níveis 1, 3, 5, 7 e 10 liberam novas opções. Você escolhe quais entram na ficha.</p></div></div>${rolePowers.map(p=>{const added=ownedRoleIds.has(p.id);return `<div class="power-card color-azul"><div><b>${escapeHTML(p.name)}</b><small>Nvl ${p.unlockLevel||p.level||1} • ${escapeHTML(p.check)} • ${p.cost||0} PE</small><p>${escapeHTML(p.desc)}</p></div><button class="secondary" onclick="${added?`showToast('Esta técnica já está na ficha.')`:`addRoleAbility('${escapeAttr(p.id)}')`}">${added?'✓ Na ficha':'＋ Adicionar'}</button></div>`}).join('')}</div>`:''}
    <div class="toolbar"><button class="primary" onclick="openLibrary('abilities')">＋ Adicionar habilidade</button><button class="secondary" onclick="openEditModal('abilities',-1,'Criar habilidade')">✎ Criar minha habilidade</button></div>
    <div class="subsection"><h3>Habilidades da ficha</h3>${current.raceAbilities.concat(current.abilities).length?current.raceAbilities.concat(current.abilities).map(x=>powerEditable(x,x.origin==='Raça'?'raceAbilities':'abilities',x.origin==='Raça'?current.raceAbilities.indexOf(x):current.abilities.indexOf(x))).join(''):'<div class="empty-small">Você ainda não adicionou habilidades.</div>'}</div>`);
}
function addRoleAbility(id){
  const all=(current.roles||[]).flatMap(role=>roleAbilityData(role));const p=all.find(x=>x.id===id);if(!p)return;
  if(current.abilities.some(x=>(x.sourceId||x.id)===id)){showToast('Essa técnica já está na ficha.');return;}
  current.abilities.push({...clone(p),id:uid(),sourceId:id,origin:'Cargo',color:'azul'});renderEditor();showToast(`${p.name} adicionada à ficha.`);
}
function renderRituals(){
  return panel('05','Rituais','Rituais ficam separados para você criar técnicas especiais e reutilizá-las em outras fichas pelo Homebrew.',`<div class="toolbar"><button class="primary" onclick="openLibrary('rituals')">＋ Adicionar existente</button><button class="secondary" onclick="openEditModal('rituals',-1,'Criar ritual')">✎ Criar ritual</button></div>${current.rituals.length?current.rituals.map((x,i)=>powerEditable(x,'rituals',i)).join(''):'<div class="empty-small">Nenhum ritual na ficha.</div>'}`);
}
function renderHaki(){
  const obsSelected=current.observationChoices||[];
  return panel('06','Haki','Aqui os três tipos podem coexistir. A regra de limite de 2 vale para <b>variações diferentes de Haki da Observação</b>, não para Observação + Armamento + Rei.',`
    <div class="haki-rule-banner"><b>Limite:</b> até 2 variações de Observação diferentes. Armamento e Haki do Rei são controlados separadamente.</div>
    <div class="haki-select-grid">
      <label class="haki-select ${current.haki.includes('Observação')?'selected':''}"><input type="checkbox" ${current.haki.includes('Observação')?'checked':''} onchange="toggleHakiType('Observação',this.checked)"><b>👁️ Observação</b><small>Você pode marcar até 2 variações abaixo.</small></label>
      <label class="haki-select ${current.haki.includes('Armamento')?'selected':''}"><input type="checkbox" ${current.haki.includes('Armamento')?'checked':''} onchange="toggleHakiType('Armamento',this.checked)"><b>🛡️ Armamento</b><small>Escolha um nível de domínio.</small></label>
      <label class="haki-select ${current.haki.includes('Rei')?'selected':''}"><input type="checkbox" ${current.haki.includes('Rei')?'checked':''} onchange="toggleHakiType('Rei',this.checked)"><b>👑 Haki do Rei</b><small>Tipo único.</small></label>
    </div>
    ${current.haki.includes('Observação')?`<div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">OBSERVAÇÃO</span><h3>Escolha no máximo 2</h3></div><span class="badge-yellow">${obsSelected.length}/2</span></div><div class="choice-grid">${HAKI.observacao.map(o=>{const selected=obsSelected.includes(o.id);return `<button class="choice-card ${selected?'selected':''}" onclick="toggleObservation('${o.id}')"><b>${selected?'✓ ':''}${escapeHTML(o.name)}</b><small>${escapeHTML(o.desc)}</small><span>${o.cost} PE • ${o.dice}</span></button>`}).join('')}</div></div>`:''}
    ${current.haki.includes('Armamento')?`<div class="subsection"><h3>Armamento</h3>${HAKI.armamento.map(o=>`<div class="power-card color-roxo"><div><b>${escapeHTML(o.name)}</b><small>${o.cost} PE • ${o.dice}</small><p>${escapeHTML(o.desc)}</p></div><button class="dice-btn" onclick="rollHaki('${o.id}')">🎲 Usar</button></div>`).join('')}</div>`:''}
    ${current.haki.includes('Rei')?`<div class="subsection rei-box"><h3>👑 Haki do Rei</h3><p>${escapeHTML(HAKI.rei[0].desc)}</p><span>${HAKI.rei[0].cost} PE • ${HAKI.rei[0].dice}</span><button class="dice-btn" onclick="rollHaki('rei')">🎲 Usar</button></div>`:''}`);
}
function renderAura(){
  return panel('07','Aura','Aura é separada do Haki. Quando ativada em combate de campanha, o início do seu turno faz um teste automático de manutenção.',`
    <div class="aura-grid">${[['Nenhuma','Sem Aura',0],['Aura Básica','Aura azul',0],['Aura EX','+1 Força, Destreza e Constituição',1],['Aura GX','+2 Força, Destreza e Constituição',2]].map(([id,desc,bonus])=>`<button class="aura-card ${current.aura===id?'selected':''}" onclick="selectAura('${id}')"><span class="aura-orb aura-${id.replace(/\s/g,'-').toLowerCase()}"></span><b>${id}</b><small>${desc}</small>${current.aura===id?'<strong>✓ SELECIONADA</strong>':''}</button>`).join('')}</div>
    <div class="aura-status ${current.auraActive?'active':''}"><div><b>${current.auraActive?'🟢 Aura ativa':'⚪ Aura desativada'}</b><p>${current.auraSkipNext?'O próximo turno não terá teste de manutenção.':'No início de cada turno com Aura ativa, role 1d20.'}</p></div><button class="primary ${current.auraActive?'editing-blue':''}" onclick="toggleAuraActive()">${current.auraActive?'Desativar':'Ativar Aura'}</button></div>
    <div class="info"><b>Manutenção por turno:</b> no começo de cada turno do personagem com Aura ativa, role 1d20. <b>1</b> desativa a Aura naquele turno e não gasta PE. <b>2–19</b> gasta 1 PE. <b>20</b> não gasta PE e o próximo turno pula o teste. Sem PE suficiente, a Aura é desativada.</div>`);
}
function renderFruit(){
  const f=current.fruit;
  if(!f)return panel('08','Akuma no Mi','Escolha uma fruta. No nível 1 você pode escolher 2 dos 5 poderes iniciais; cada nível seguinte oferece 3 poderes e você escolhe 1.',`<div class="empty fruit-empty"><b>🍈</b><h3>Nenhuma Akuma no Mi</h3><p>Escolha a fruta aqui. Depois esta etapa ficará cheia de poderes detalhados.</p><button class="primary" onclick="openLibrary('fruits')">🍈 Escolher fruta</button></div>`);
  const fruitLevel=clamp(num(current.fruitLevel,current.level),1,10);current.fruitLevel=fruitLevel;
  const selectedStart=new Set(current.fruitChoices||[]);
  return panel('08','Akuma no Mi','Escolha poderes por nível. Em vez de obrigar tudo a ser ataque, a fruta pode oferecer defesa, mobilidade, suporte ou utilidade.',`
    <div class="fruit-top"><div class="fruit-big"><span>🍈</span><div><b>${escapeHTML(f.name)}</b><small>${escapeHTML(f.type)}</small></div></div><div class="toolbar"><button class="primary" onclick="openLibrary('fruits')">🍈 Trocar fruta</button><button class="secondary" onclick="clearFruit()">× Remover</button></div></div>
    <div class="fruit-info"><span class="type-badge ${escapeAttr(f.type.toLowerCase())}">${escapeHTML(f.type)}</span><p>${escapeHTML(f.desc)}</p><p><b>Equilíbrio:</b> ${escapeHTML(f.balance||'Use PE e limites de nível.')}</p></div>
    <label class="level-slider-label">Nível atual da fruta <input type="number" min="1" max="10" value="${fruitLevel}" onchange="setFruitLevel(this.value)"></label>
    <div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">NÍVEL 1</span><h3>Escolha 2 de 5 poderes iniciais</h3></div><span class="badge-red">${selectedStart.size}/2</span></div><div class="fruit-basic-grid">${f.starterPowers.map((p,i)=>fruitPowerCard(p,`toggleFruitStarter(${i})`,selectedStart.has(p.name))).join('')}</div></div>
    ${Array.from({length:Math.max(0,fruitLevel-1)},(_,i)=>i+2).map(level=>renderFruitLevel(level)).join('')}`);
}
function fruitPowerCard(power,onClick,selected=false){const shown=selected?getFruitOverride(current,power):power;const data=JSON.stringify(shown).replaceAll('"','&quot;');return `<div class="fruit-power-card ${selected?'selected':''}"><button class="power-main" onclick="${onClick}"><b>${selected?'✓ ':''}${escapeHTML(shown.name)}</b><small>${escapeHTML(shown.type)} • ${shown.cost||0} PE • ${escapeHTML(shown.check||'Sem teste')}</small><p>${escapeHTML(shown.desc||'')}</p><div class="fruit-card-tags"><span class="tag">${shown.damage?`💥 ${escapeHTML(shown.damage)}`:'🛡️ sem dano direto'}</span><span class="tag">ⓘ veja como funciona</span></div></button><div class="fruit-card-actions"><button class="info-btn" onclick="openPowerDetail(${data})">ⓘ Entender</button>${selected?`<button class="secondary" onclick="editFruitPowerById('${escapeAttr(power.id)}')">✎ Editar</button>`:''}</div></div>`;}
function editFruitPowerById(id){refreshFruitCombat(current);const idx=current.attacks.findIndex(p=>p.id===id||p.sourceId===id);if(idx>=0)openEditModal('attacks',idx,'Editar poder da Akuma no Mi');}
function renderFruitLevel(level){const options=fruitPowerOptions(current.fruit,level),chosen=current.fruitSelections?.[level]||'';return `<div class="subsection fruit-level-block"><div class="section-head compact-head"><div><span class="eyebrow">NÍVEL ${level}</span><h3>Escolha 1 de 3</h3><p class="muted">Os três poderes têm funções diferentes. Clique em Entender para ver teste, custo, dano e como usar.</p></div><span class="badge-purple">${chosen?'✓ escolhido':'não escolhido'}</span></div><div class="fruit-level-grid">${options.map((p,i)=>{const selected=chosen===p.id,shown=selected?getFruitOverride(current,p):p,data=JSON.stringify(shown).replaceAll('"','&quot;');return `<div class="fruit-level-card ${selected?'selected':''}"><div class="fruit-level-main"><button class="power-main" onclick="selectFruitLevelPower(${level},${i})"><b>${selected?'✓ ':''}${escapeHTML(shown.name)}</b><small>${escapeHTML(shown.type)} • ${shown.cost||0} PE • ${escapeHTML(shown.check||'Sem teste')}</small><span>${shown.damage?`💥 Dano ${escapeHTML(shown.damage)}`:'🛡️ Sem dano direto'} • ${escapeHTML(shown.range||'Alcance definido')}</span><p><b>Como funciona:</b> ${escapeHTML(shown.desc||'')}</p></button></div><div class="fruit-level-actions"><button class="info-btn" onclick="openPowerDetail(${data})">ⓘ Entender</button>${selected?`<button class="secondary" onclick="editFruitPowerById('${escapeAttr(p.id)}')">✎ Editar</button>`:''}</div></div>`}).join('')}</div></div>`;}
function renderCombat(){
  const combat=getCombatPowers(current);
  const weapons=current.items.filter(x=>x.type==='Arma'&&x.equipped);
  return panel('09','Combate rápido','Tudo que pode ser usado e rolado fica aqui: ataques, poderes de fruta, habilidades, rituais e armas equipadas. Não precisa voltar ao Inventário para equipar uma arma; o interruptor fica lá.',`
    <div class="combat-summary"><div><b>⚔️ ${combat.length}</b><small>ações rápidas</small></div><div><b>🗡️ ${weapons.length}</b><small>armas ativas</small></div><div><b>❤️ ${current.hpCurrent}/${calc(current).hpMax}</b><small>PV</small></div><div><b>🔥 ${current.peCurrent}/${calc(current).peMax}</b><small>PE</small></div></div>
    <div class="combat-help"><b>Como usar:</b> aperte <b>🎲 Usar</b> para fazer o teste, gastar PE e rolar o dano automaticamente. O botão ⓘ mostra a regra completa.</div>
    <div class="toolbar"><button class="primary" onclick="openLibrary('attacks')">＋ Adicionar ataque</button><button class="secondary" onclick="openEditModal('attacks',-1,'Criar ação de combate')">✎ Criar ação</button></div>
    ${combat.length?`<div class="combat-list quick-grid">${combat.map((p,i)=>attackCard(p,i,p.source==='fruit')).join('')}</div>`:'<div class="empty-small">Nenhuma ação rápida ainda. Escolha uma fruta, adicione uma habilidade/ataque ou equipe uma arma no Inventário.</div>'}`);
}
function getHakiCombatPowers(a){const list=[];(a.observationChoices||[]).forEach(id=>{const p=HAKI.observacao.find(x=>x.id===id);if(p)list.push(normalizePower({id:`haki-${id}`,name:p.name,origin:'Haki',level:1,cost:p.cost,attribute:'Vontade',check:p.dice,damage:'',range:'Definido pelo Mestre',type:'Haki da Observação',desc:p.desc,color:'roxo',source:'haki',sourceId:id}));});if(a.haki?.includes('Armamento'))HAKI.armamento.forEach(p=>list.push(normalizePower({id:`haki-${p.id}`,name:p.name,origin:'Haki',level:1,cost:p.cost,attribute:'Vontade',check:p.dice,damage:'',range:'Definido pelo Mestre',type:'Haki do Armamento',desc:p.desc,color:'roxo',source:'haki',sourceId:p.id})));if(a.haki?.includes('Rei')){const p=HAKI.rei[0];list.push(normalizePower({id:'haki-rei',name:p.name,origin:'Haki',level:1,cost:p.cost,attribute:'Vontade',check:p.dice,damage:'',range:'Definido pelo Mestre',type:'Haki do Rei',desc:p.desc,color:'roxo',source:'haki',sourceId:p.id}));}return list;}
function getCombatPowers(a){if(a?.fruit)refreshFruitCombat(a);const powers=[];const seen=new Set();(a.attacks||[]).forEach(p=>{if(!seen.has(p.id)){seen.add(p.id);powers.push(p);}});(a.abilities||[]).forEach(p=>{if(!seen.has(p.id)){seen.add(p.id);powers.push(p);}});(a.rituals||[]).forEach(p=>{if(!seen.has(p.id)){seen.add(p.id);powers.push({...p,type:p.type||'Ritual'});}});(a.items||[]).filter(x=>x.type==='Arma'&&x.equipped).forEach(x=>{const p=weaponToCombatPower(x);if(!seen.has(p.id)){seen.add(p.id);powers.push(p);}});getHakiCombatPowers(a).forEach(p=>{if(!seen.has(p.id)){seen.add(p.id);powers.push(p);}});return powers;}
function weaponToCombatPower(item){
  return normalizePower({id:`weapon-${item.id}`,name:`${item.name}`,origin:'Arma equipada',level:1,cost:num(item.actionCost),attribute:item.attackAttribute||'Força',check:item.check||`1d20 + ${item.attackAttribute||'Força'}`,damage:item.damage||'1d6',range:item.range||'Definido pela arma',type:'Ataque',desc:item.desc||`Ataque usando ${item.name}. ${item.effect||''}`,color:'cinza',source:'weapon',sourceId:item.id});
}
function attackCard(a,i,fruit=false){const key=a.id||`attack-${i}`;const originBadge=a.source==='fruit'?'🍈 FRUTA':a.source==='weapon'?'⚔️ ARMA':a.source==='haki'?'🟣 HAKI':(a.origin||'PODER');const canEdit=a.source!=='weapon'&&a.source!=='haki';return `<div class="power-card combat-quick-card color-${a.color||originColor(a.origin)} ${fruit?'fruit-auto':''}"><div class="combat-power-main"><div class="combat-badges"><span class="power-origin">${escapeHTML(originBadge)}</span>${a.damage?'<span class="damage-chip">💥 Dano</span>':''}${a.cost?`<span class="cost-chip">🔥 ${a.cost} PE</span>`:''}</div><b>${escapeHTML(a.name)}</b><small>${escapeHTML(a.type||'Ação')} • ${escapeHTML(a.check||'Sem teste')}${a.damage?` • ${escapeHTML(a.damage)}`:''}${a.range?` • ${escapeHTML(a.range)}`:''}</small><p>${escapeHTML(a.desc||'')}</p></div><div class="combat-quick-actions"><button class="info-btn big-action" onclick="openPowerDetailById('${escapeAttr(key)}')" title="Ver como funciona">ⓘ Entender</button><button class="dice-btn big-action" onclick="rollOwnedCombat('${escapeAttr(key)}')" title="Usar e rolar">🎲 Usar</button>${canEdit?`<button class="secondary" onclick="editCombatPower('${escapeAttr(key)}')">✎ Editar</button>`:''}${canEdit&&a.source!=='fruit'?`<button class="delete" onclick="removeCombatPower('${escapeAttr(key)}')">×</button>`:''}</div></div>`;}
function findCombatPowerById(id){return getCombatPowers(current).find(p=>p.id===id);}
function editCombatPower(id){const index=current.attacks.findIndex(p=>p.id===id);if(index>=0)openEditModal('attacks',index,'Editar ataque');}
function removeCombatPower(id){const index=current.attacks.findIndex(p=>p.id===id);if(index>=0&&confirmAction('Remover este ataque da ficha?')){current.attacks.splice(index,1);renderEditor();}}
function renderInventory(){
  const cats=['Todos','Arma','Armadura','Consumível','Ferramenta','Navegação','Comunicação','Conhecimento','Munição','Especial'];
  return panel('10','Inventário','Pesquise por nome, filtre por categoria, equipe armas e edite/remova qualquer item.',`<div class="toolbar inventory-toolbar"><button class="primary" onclick="openLibrary('items')">＋ Adicionar item existente</button><button class="secondary" onclick="openEditModal('items',-1,'Criar item')">✎ Criar item</button><input id="invSearch" class="search compact-search" value="${escapeAttr(getInventoryQuery())}" placeholder="🔎 Pesquisar inventário" oninput="renderInventoryRowsInPlace()"></div><div class="category-pills">${cats.map(c=>`<button class="${inventoryFilter===c?'selected':''}" onclick="setInventoryFilter('${c}')">${c}</button>`).join('')}</div><div id="inventoryRows">${renderInventoryRows()}</div>`);
}
function getInventoryQuery(){return $('invSearch')?.value||'';}
function setInventoryFilter(filter){inventoryFilter=filter;renderEditor();}
function setItemQuantity(index,value){
  if(!current?.items?.[index])return;
  current.items[index].quantity=Math.max(0,Math.floor(num(value,0)));
  persistCurrent();renderEditor();
}
function changeItemQuantity(index,delta){
  if(!current?.items?.[index])return;
  const next=Math.max(0,Math.floor(num(current.items[index].quantity,1)+delta));
  setItemQuantity(index,next);
}
function consumeItem(index,amount=1){
  if(!current?.items?.[index])return;
  const item=current.items[index];item.quantity=Math.max(0,Math.floor(num(item.quantity,1)-amount));
  persistCurrent();renderSheet();showToast(`${item.name}: ${item.quantity} restante(s).`);
}
function renderInventoryRowsInPlace(){
  const target=$('inventoryRows');if(target)target.innerHTML=renderInventoryRows();
}
function toggleItemEquip(index,on){
  if(!current?.items?.[index])return;
  const item=current.items[index];
  if(item.type!=='Arma'){showToast('Somente armas podem ser equipadas no combate.');return;}
  item.equipped=Boolean(on);
  refreshFruitCombat(current);
  renderEditor();
}

function renderInventoryRows(){
  const query=getInventoryQuery().toLowerCase();
  const list=current.items.filter(x=>(inventoryFilter==='Todos'||x.type===inventoryFilter)&&`${x.name} ${x.desc} ${x.type}`.toLowerCase().includes(query));
  if(!list.length)return '<div class="empty-small">Nenhum item encontrado.</div>';
  return list.map(item=>{
    const i=current.items.indexOf(item);
    const icon=item.type==='Arma'?'⚔️':item.type==='Armadura'?'🛡️':item.type==='Consumível'?'🧪':item.type==='Navegação'?'🧭':item.type==='Munição'?'🎯':'📦';
    return `<div class="inventory-row ${item.equipped?'equipped':''}">
      <div class="item-icon">${icon}</div>
      <div class="item-info"><b>${escapeHTML(item.name)}</b><small>${escapeHTML(item.type)} • ${escapeHTML(item.origin||'Biblioteca')}</small><p>${escapeHTML(item.desc||'')}</p>${item.bonus?`<span class="tag">${escapeHTML(item.bonus)}</span>`:''}${item.effect?`<span class="tag">${escapeHTML(item.effect)}</span>`:''}</div>
      <div class="item-quantity"><button title="Diminuir 1" onclick="changeItemQuantity(${i},-1)">−</button><input type="number" min="0" value="${num(item.quantity,1)}" onchange="setItemQuantity(${i},this.value)"><button title="Aumentar 1" onclick="changeItemQuantity(${i},1)">＋</button><small>qtd.</small></div>
      ${item.type==='Arma'?`<label class="switch equip-switch" title="Ativar esta arma no combate"><input type="checkbox" ${item.equipped?'checked':''} onchange="toggleItemEquip(${i},this.checked)"><span></span></label>`:'<span class="not-equip">—</span>'}
      <button class="secondary inventory-edit-btn" onclick="openEditModal('items',${i},'Editar item')">✎ Editar</button>
      <button class="secondary inventory-remove-btn" onclick="removeOwnedItem(${i})">🗑 Tirar</button>
    </div>`;
  }).join('');
}
function renderHistory(){return panel('11','História','A última etapa serve para o texto da história. O botão Concluir salva tudo e abre a ficha imediatamente.',`<div class="help-banner"><b>Dica:</b> pode escrever à vontade. O texto permanece salvo quando você passa de etapa porque cada avanço salva os campos antes de mudar.</div><div class="form-grid"><label class="wide">Personalidade <span class="field-help">Ex.: impulsivo, engraçado, sério...</span><textarea id="dPersonality" placeholder="Ex.: Brincalhão, mas não abandona os amigos.">${escapeHTML(current.personality)}</textarea></label><label class="wide">Código de honra <span class="field-help">O que o personagem nunca faria?</span><textarea id="dHonor" placeholder="Ex.: Nunca abandona um companheiro.">${escapeHTML(current.honor)}</textarea></label><label class="wide">Sonho <span class="field-help">Objetivo que move a aventura.</span><textarea id="dDream" placeholder="Ex.: Encontrar a ilha perdida.">${escapeHTML(current.dream)}</textarea></label><label class="wide">História <span class="field-help">Origem, passado e acontecimentos importantes.</span><textarea id="dHistory" placeholder="Conte a história do personagem...">${escapeHTML(current.history)}</textarea></label></div>`);}

function changeAttribute(name,delta){
  readEditorFields();
  const values=Object.values(current.attributes).reduce((a,b)=>a+Math.max(0,num(b)),0);
  const value=num(current.attributes[name]);
  const max=maxAttr(current);
  const pool=attributePool(current);
  if(delta>0){
    if(values>=pool){showToast(`Você não possui pontos de atributo disponíveis. Nível ${current.level} = ${pool} pontos totais.`);return;}
    if(value>=max){showToast(`O máximo de ${name} neste nível é ${max}.`);return;}
  }
  if(delta<0&&value<=0){showToast('Esse atributo já está em 0.');return;}
  current.attributes[name]=value+delta;
  renderEditor();
}
function setSkillTraining(name,value){readEditorFields();const max=trainingMax(current),v=clamp(num(value),0,max);current.skills[name].training=v;renderEditor();}
function toggleIntSkill(name){
  readEditorFields();const s=current.skills[name];if(!s)return;const cost=name==='Determinação'?2:1;const used=calculateIntUsed(current);
  if(!s.int&&used+cost>intPool(current)){showToast(`Você precisa de ${cost} ponto(s) de Inteligência livre(s).`);return;}
  s.int=!s.int;current.talentUsed=calculateIntUsed(current);renderEditor();
}
function addRaceAbility(id){
  const evo=raceEvolutionData(current.race).find(x=>x.id===id);if(!evo)return;
  if(current.raceAbilities.some(x=>(x.sourceId||x.id)===id)){showToast('Essa evolução já foi adicionada.');return;}
  current.raceAbilities.push({...clone(evo),id:uid(),sourceId:id});renderEditor();showToast(`${evo.name} foi adicionada à ficha.`);
}
function powerEditable(power,type,index){
  return `<div class="power-card row-card clickable-power color-${power.color||originColor(power.origin)}" onclick="openPowerDetail(${JSON.stringify(power).replaceAll('"','&quot;')})"><div><span class="power-origin">${escapeHTML(power.origin||'Personalizado')}</span><b>${escapeHTML(power.name)}</b><small>Nvl ${power.level||1} • ${power.cost||0} PE${power.damage?` • ${escapeHTML(power.damage)}`:''}${power.check?` • ${escapeHTML(power.check)}`:''}</small><p>${escapeHTML(power.desc||'')}</p></div><div class="row-actions" onclick="event.stopPropagation()"><button class="info-btn" onclick="openPowerDetail(${JSON.stringify(power).replaceAll('"','&quot;')})">ⓘ</button><button class="dice-btn" onclick="usePowerByObject(${JSON.stringify(power).replaceAll('"','&quot;')})">🎲 Usar</button><button onclick="openEditModal('${type}',${index},'Editar ${type==='rituals'?'ritual':'habilidade'}')">✎</button><button class="delete" onclick="removeOwned('${type}',${index})">×</button></div></div>`;
}
function removeOwned(type,index){if(index<0)return;if(!confirmAction('Remover este conteúdo da ficha?'))return;current[type].splice(index,1);renderEditor();}
function removeOwnedItem(index){if(!confirmAction('Remover este item?'))return;current.items.splice(index,1);renderEditor();}

/* ------------------------- IMAGENS / COMPRESSÃO ------------------------- */
function compressImageFile(file,maxSide=900,quality=.80){return new Promise((resolve,reject)=>{if(!file)return reject(new Error('arquivo'));const reader=new FileReader();reader.onerror=()=>reject(new Error('leitura'));reader.onload=()=>{const img=new Image();img.onload=()=>{const scale=Math.min(1,maxSide/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');if(!ctx)return resolve(reader.result);ctx.drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(blob=>{if(!blob)return resolve(reader.result);const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>resolve(reader.result);r.readAsDataURL(blob);},'image/jpeg',quality);};img.onerror=()=>resolve(reader.result);img.src=reader.result;};reader.readAsDataURL(file);});}

/* ------------------------- FOTO ------------------------- */
function chooseAvatar(){const input=$('avatarFile');if(input){input.value='';input.click();}}
function openAvatarViewer(){if(!current?.avatar){chooseAvatar();return;}$('avatarViewerImage').src=current.avatar;openModal('avatarViewerModal');}
function handleAvatar(event){
  const file=event.target.files?.[0];if(!file||!current)return;
  if(!/^image\/(png|jpe?g|webp)$/i.test(file.type)){showToast('Use PNG, JPG ou WEBP.');event.target.value='';return;}
  if(file.size>4*1024*1024){showToast('Imagem grande demais. Limite de 4 MB.');event.target.value='';return;}
  compressImageFile(file,900,.80).then(data=>{current.avatar=data;const idx=agents.findIndex(a=>a.id===current.id);if(idx>=0){agents[idx].avatar=current.avatar;agents[idx].updatedAt=Date.now();agents[idx]=normalizeAgent(agents[idx]);saveAgents();syncAgentToCampaigns(agents[idx]);}saveCreationDraft();renderEditor();if($('sheet')?.classList.contains('active'))renderSheet();renderAgents();showToast('Imagem atualizada e otimizada.');}).catch(()=>showToast('Não foi possível processar a imagem.'));event.target.value='';
}

/* ------------------------- SALVAR / NÍVEL ------------------------- */
function recalculateResourcesAfterProgress(before,after){
  const oldCalc=calc({...before,level:before.level});const newCalc=calc(after);
  if(newCalc.hpMax>oldCalc.hpMax)after.hpCurrent=clamp(num(after.hpCurrent)+newCalc.hpMax-oldCalc.hpMax,0,newCalc.hpMax);
  if(newCalc.peMax>oldCalc.peMax)after.peCurrent=clamp(num(after.peCurrent)+newCalc.peMax-oldCalc.peMax,0,newCalc.peMax);
  after.hpCurrent=clamp(num(after.hpCurrent,newCalc.hpMax),0,newCalc.hpMax);after.peCurrent=clamp(num(after.peCurrent,newCalc.peMax),0,newCalc.peMax);
}
function changeLevel(delta){
  readEditorFields();
  const before=clone(current);
  const oldLevel=num(current.level,1);
  const nextLevel=clamp(oldLevel+delta,1,10);
  if(nextLevel===oldLevel)return;
  const usedAttributes=Object.values(current.attributes||{}).reduce((sum,v)=>sum+Math.max(0,num(v)),0);
  if(nextLevel<oldLevel && usedAttributes>attributePool({...current,level:nextLevel})){showToast(`Não é possível baixar para o nível ${nextLevel}: distribua primeiro os pontos excedentes de atributo.`);return;}
  current.level=nextLevel;
  current.raceLevel=Math.max(num(current.raceLevel,1),current.level);
  if(current.fruit)current.fruitLevel=Math.max(num(current.fruitLevel,1),current.level);
  recalculateResourcesAfterProgress(before,current);
  renderEditor();
  if(nextLevel>oldLevel){
    const gained=nextLevel-oldLevel;
    showToast(`⭐ Nível ${nextLevel}! +${gained} ponto(s) de atributo. Veja Habilidades para conferir novos poderes de Cargo.`);
  }else{
    showToast(`Nível alterado para ${nextLevel}.`);
  }
}
function changeRaceLevel(delta){readEditorFields();current.raceLevel=clamp(num(current.raceLevel)+delta,1,10);renderEditor();showToast(`Nível da raça: ${current.raceLevel}.`);}
function setLevelFromInput(value){
  readEditorFields();
  const before=clone(current);
  const oldLevel=num(before.level,1);
  current.level=clamp(num(value,1),1,10);
  current.raceLevel=Math.max(num(current.raceLevel,1),current.level);
  if(current.fruit)current.fruitLevel=Math.max(num(current.fruitLevel,1),current.level);
  recalculateResourcesAfterProgress(before,current);
  renderEditor();
  if(current.level>oldLevel)showToast(`⭐ Nível ${current.level}! Você ganhou ${current.level-oldLevel} ponto(s) de atributo.`);
}
function finishCharacterCreation(){
  readEditorFields();
  if(!current.name.trim()){setEditorTab('identity');showToast('Coloque o nome do personagem antes de concluir.');return;}
  if(current.fruit && current.fruitChoices.length!==2){setEditorTab('fruit');showToast('Escolha exatamente 2 poderes iniciais da Akuma no Mi.');return;}
  current.updatedAt=Date.now();
  const index=agents.findIndex(x=>x.id===current.id);
  if(index>=0)agents[index]=normalizeAgent(current);else agents.push(normalizeAgent(current));
  agents=ensureUniqueIds(agents).map(normalizeAgent);saveAgents();clearCreationDraft();
  const saved=agents.find(x=>x.id===current.id)||agents[agents.length-1];current=clone(saved);syncAgentToCampaigns(current);
  activeCampaignIdForRoll=returnCampaignId||null;sheetTab='overview';go('sheet');renderSheet();showToast('✅ Ficha concluída e salva.');
}
function saveCurrentAgent(){
  readEditorFields();
  if(!current.name.trim()){setEditorTab('identity');showToast('Coloque o nome do personagem.');return false;}
  if(current.fruit && current.fruitChoices.length!==2){showToast('A fruta precisa de exatamente 2 poderes iniciais.');setEditorTab('fruit');return false;}
  current.updatedAt=Date.now();current=normalizeAgent(current);const index=agents.findIndex(x=>x.id===current.id);if(index>=0)agents[index]=clone(current);else agents.push(clone(current));agents=ensureUniqueIds(agents).map(normalizeAgent);saveAgents();clearCreationDraft();syncAgentToCampaigns(current);showToast('💾 Alterações salvas.');return true;
}

/* ------------------------- RAÇA / CARGO / FRUTA ------------------------- */
function openPicker(type,index=null){detailContext={picker:true,index};openLibrary(type);}
function chooseRace(name){
  readEditorFields();if(!RACES[name])return;current.race=name;current.raceAbilities=(current.raceAbilities||[]).filter(x=>x.race===name);const c=calc(current);current.hpCurrent=clamp(num(current.hpCurrent,c.hpMax),0,c.hpMax);closeModal('libraryModal');detailContext=null;renderEditor();showToast(`${name} escolhida. As perícias da raça aparecem verdes, mas não consomem treino manual.`);
}
function chooseRole(name,index=0){
  readEditorFields();if(!ROLES[name])return;current.roles[index]=name;
  const role=ROLES[name];(role.items||[]).forEach(itemName=>{const base=LIB.items.find(x=>x.name===itemName);if(base&&!current.items.some(x=>x.name===base.name&&x.origin==='Cargo'))current.items.push({...clone(base),id:uid(),equipped:false,origin:'Cargo'});});
  closeModal('libraryModal');detailContext=null;renderEditor();showToast(`${name} escolhido. O bônus do cargo e seus itens foram preparados.`);
}
function chooseFruit(index){
  readEditorFields();const f=clone(LIB.fruits[index]);if(!f)return;
  current.fruit=f;current.fruitLevel=clamp(num(current.level,1),1,10);current.fruitChoices=[];current.fruitSelections={};
  current.attacks=current.attacks.filter(x=>x.source!=='fruit');
  closeModal('libraryModal');detailContext=null;renderEditor();showToast(`${f.name} escolhida. Agora selecione 2 poderes iniciais.`);
}
function toggleFruitStarter(index){
  if(!current.fruit)return;const p=current.fruit.starterPowers[index];if(!p)return;const chosen=current.fruitChoices||[];
  if(chosen.includes(p.name))current.fruitChoices=chosen.filter(x=>x!==p.name);else if(chosen.length<2)current.fruitChoices.push(p.name);else{showToast('Escolha somente 2 poderes iniciais.');return;}
  refreshFruitCombat(current);renderEditor();
}
function setFruitLevel(value){readEditorFields();current.fruitLevel=clamp(num(value,1),1,10);renderEditor();}
function selectFruitLevelPower(level,index){
  if(!current.fruit)return;const options=fruitPowerOptions(current.fruit,level),power=options[index];if(!power)return;
  current.fruitSelections[level]=power.id;current.fruitLevel=Math.max(current.fruitLevel,level);refreshFruitCombat(current);renderEditor();showToast(`${power.name} escolhida no nível ${level}.`);
}
function getFruitOverride(agent,power){const key=power?.sourceId||power?.id;const saved=key?agent?.fruitPowerEdits?.[key]:null;return saved?normalizePower({...power,...clone(saved),id:power.id,source:'fruit',sourceId:key,origin:'Akuma no Mi',color:'vermelho'}):clone(power);}
function refreshFruitCombat(agent){if(!agent?.fruit)return;agent.attacks=Array.isArray(agent.attacks)?agent.attacks:[];agent.fruitPowerEdits=agent.fruitPowerEdits||{};agent.attacks=agent.attacks.filter(x=>x.source!=='fruit');(agent.fruitChoices||[]).forEach(name=>{const power=agent.fruit.starterPowers.find(p=>p.name===name);if(power){const final=getFruitOverride(agent,power);agent.attacks.push({...final,id:power.id,source:'fruit',sourceId:power.id,color:'vermelho'});}});Object.entries(agent.fruitSelections||{}).forEach(([level,powerId])=>{const power=fruitPowerOptions(agent.fruit,num(level)).find(p=>p.id===powerId);if(power){const final=getFruitOverride(agent,power);agent.attacks.push({...final,id:power.id,source:'fruit',sourceId:power.id,color:'vermelho'});}});}
function clearFruit(){readEditorFields();current.fruit=null;current.fruitChoices=[];current.fruitSelections={};current.attacks=current.attacks.filter(x=>x.source!=='fruit');renderEditor();}

/* ------------------------- BIBLIOTECA / DETALHES ------------------------- */
function openLibrary(type){
  libraryType=type;libraryItemFilter='Todos';detailContext=detailContext||{};const titles={races:'Escolher raça',roles:'Escolher cargo',fruits:'Escolher Akuma no Mi',haki:'Haki',attacks:'Adicionar ataque',abilities:'Adicionar habilidade',rituals:'Adicionar ritual',items:'Adicionar item'};$('libraryTitle').textContent=titles[type]||'Biblioteca';$('librarySearch').value='';renderLibrary();openModal('libraryModal');
}
function setLibraryItemFilter(filter){libraryItemFilter=filter;renderLibrary();}
function renderLibrary(){
  const list=mergedLibrary(libraryType);const query=($('librarySearch')?.value||'').toLowerCase();
  let filtered=list.filter(x=>`${x.name||''} ${x.desc||''} ${x.origin||''}`.toLowerCase().includes(query));
  if(libraryType==='items'&&libraryItemFilter!=='Todos')filtered=filtered.filter(x=>x.type===libraryItemFilter);
  const box=$('libraryList');if(!box)return;
  const categoryBar=libraryType==='items'?`<div class="help-banner"><b>Filtro de itens:</b> Todos mostra a biblioteca inteira. Depois você pode escolher Arma, Armadura, Consumível, Ferramenta e as demais categorias.</div><div class="category-pills library-categories">${['Todos','Arma','Armadura','Consumível','Ferramenta','Navegação','Comunicação','Conhecimento','Munição','Especial'].map(c=>`<button class="${libraryItemFilter===c?'selected':''}" onclick="setLibraryItemFilter('${c}')">${c}</button>`).join('')}</div>`:'';
  if(!filtered.length){box.innerHTML=categoryBar+'<div class="empty-small">Nada encontrado nesta categoria.</div>';return;}
  box.innerHTML=categoryBar+filtered.map(x=>{
    const realType=libraryType==='races'?'race':libraryType==='roles'?'role':libraryType;
    const index=list.indexOf(x);const isHomebrew=!['races','roles','fruits','haki'].includes(libraryType)&&homebrew[libraryType]?.some(y=>y.id===x.id);
    let action='';
    if(libraryType==='races')action=`<button class="primary" onclick="chooseRace('${escapeAttr(x.name)}')">Escolher</button>`;
    else if(libraryType==='roles')action=`<button class="primary" onclick="chooseRole('${escapeAttr(x.name)}',${detailContext?.index??0})">Escolher</button>`;
    else if(libraryType==='fruits')action=`<button class="primary" onclick="chooseFruit(${index})">Escolher</button>`;
    else if(libraryType==='haki')action='<button class="secondary" onclick="openDetail(\'haki\',\''+escapeAttr(x.name)+'\')">Ver</button>';
    else action=`<button class="primary" onclick="addLibraryEntryById('${escapeAttr(x.id)}','${libraryType}')">Adicionar</button>`;
    return `<div class="library-card"><div><span class="library-kind ${isHomebrew?'homebrew':''}">${isHomebrew?'HOMEBREW':'BIBLIOTECA'}</span><b>${escapeHTML(x.name)}</b><small>${escapeHTML(x.type||x.origin||'')} • ${escapeHTML(x.desc||'')}</small>${x.b?`<div class="tags">${Object.entries(x.b).map(([a,v])=>`<span class="tag">${a} ${v>=0?'+':''}${v}</span>`).join('')}</div>`:''}</div><button class="info-btn" onclick="openDetail('${realType}','${escapeAttr(x.name)}')">ⓘ</button>${action}</div>`;
  }).join('');
}
function addLibraryEntryById(id,type){
  const list=mergedLibrary(type);const x=list.find(y=>y.id===id);if(!x||!current)return;
  const copy=clone(x);copy.id=uid();copy.origin=copy.origin||'Biblioteca';
  if(type==='items')current.items.push({...normalizeItem(copy),equipped:false});
  else if(type==='abilities')current.abilities.push(normalizePower(copy));
  else if(type==='rituals')current.rituals.push(normalizePower(copy));
  else if(type==='attacks')current.attacks.push(normalizePower(copy));
  closeModal('libraryModal');detailContext=null;renderEditor();showToast(`${x.name} adicionado à ficha.`);
}
function openPowerDetail(power){
  detailPowerBuffer=normalizePower(power);renderPowerDetail(detailPowerBuffer);openDetailModal();
}
function openPowerDetailById(id){const p=findCombatPowerById(id);if(p)openPowerDetail(p);}
function renderPowerDetail(p){
  const ownedIndex=current?.attacks?.findIndex(x=>x.id===p.id||x.sourceId===p.sourceId);
  const canEdit=ownedIndex!=null&&ownedIndex>=0&&p.source!=='weapon'&&p.source!=='haki';
  const threshold=p.successThreshold!=null?`<div class="rule-callout"><b>🎯 Limiar d100:</b> ${p.successMode==='menor-que'?'sucesso se o resultado for menor que':'sucesso se o resultado for maior ou igual a'} <b>${p.successThreshold}</b>.</div>`:'';
  const steps=p.check?`<p><b>1.</b> Faça o teste <b>${escapeHTML(p.check)}</b>. Se for um d100 com limiar, compare o resultado ao número indicado.</p>`:'<p><b>1.</b> Não há teste obrigatório para ativar este poder.</p>';
  const damage=p.damage?`<p><b>2.</b> Se o poder acertar, role <b>${escapeHTML(p.damage)}</b> para descobrir o dano.</p>`:'<p><b>2.</b> Este poder não causa dano direto.</p>';
  const cost=p.cost?`<p><b>3.</b> Gaste <b>${p.cost} PE</b> no momento em que usar o poder.</p>`:'<p><b>3.</b> Este poder não gasta PE.</p>';
  const effect=p.effect||p.desc||'Resolva o efeito conforme a descrição.';
  $('detailBody').innerHTML=`<span class="eyebrow">${escapeHTML(p.origin||'PODER')}</span><h2>${escapeHTML(p.name)}</h2><div class="detail-power-meta"><span>Tipo: ${escapeHTML(p.type||'Habilidade')}</span><span>Nível: ${p.level||1}</span><span>🔥 ${p.cost||0} PE</span><span>🎲 ${escapeHTML(p.check||'Sem teste')}</span>${p.damage?`<span>💥 ${escapeHTML(p.damage)}</span>`:'<span>🛡️ Sem dano direto</span>'}${p.range?`<span>📏 ${escapeHTML(p.range)}</span>`:''}${p.duration?`<span>⏱️ ${escapeHTML(p.duration)}</span>`:''}</div><div class="detail-description"><b>O que faz</b><p>${escapeHTML(p.desc||'Sem descrição.')}</p></div>${threshold}<div class="detail-rules"><b>📖 Como usar — passo a passo</b>${steps}${damage}${cost}<p><b>🎯 Efeito:</b> ${escapeHTML(effect)}</p>${p.uses?`<p><b>👥 Alvos/uso:</b> ${escapeHTML(p.uses)}</p>`:''}${p.duration?`<p><b>⏱️ Duração:</b> ${escapeHTML(p.duration)}</p>`:''}</div><div class="detail-help"><b>💡 Em uma frase</b><p>${escapeHTML(effect)}</p></div><div class="row-actions detail-actions"><button class="primary big-action-btn" onclick="useDetailPower()">🎲 Usar agora</button>${canEdit?`<button class="secondary" onclick="openEditModal('attacks',${ownedIndex},'Editar poder')">✎ Editar poder</button>`:''}<button class="secondary" onclick="closeModal('detailModal')">Fechar</button></div>`;
}
function useDetailPower(){if(detailPowerBuffer)rollPowerObject(detailPowerBuffer);}
function usePowerByObject(power){detailPowerBuffer=normalizePower(power);useDetailPower();}
function openDetail(type,name){
  let data=null;
  if(type==='race')data=Object.entries(RACES).map(([n,x])=>({name:n,...x,evolution:raceEvolutionData(n)})).find(x=>x.name===name);
  else if(type==='role')data=ROLES[name]?{name,type:'Cargo',...ROLES[name]}:null;
  else if(type==='fruits')data=LIB.fruits.find(x=>x.name===name);
  else if(type==='attacks'||type==='abilities'||type==='rituals'||type==='items')data=mergedLibrary(type).find(x=>x.name===name);
  else if(type==='haki')data=[...HAKI.observacao,...HAKI.armamento,...HAKI.rei].find(x=>x.name===name);
  if(!data)return;
  if(type==='race')renderRaceDetail(data);else if(type==='role')renderRoleDetail(data);else if(type==='fruits')renderFruitDetail(data);else if(type==='haki')renderHakiDetail(data);else renderPowerDetail(data);
  openDetailModal();
}
function renderRaceDetail(data){
  const evol=data.evolution||[];const activeIds=new Set((current?.raceAbilities||[]).map(x=>x.sourceId||x.id));
  $('detailBody').innerHTML=`<span class="eyebrow">RAÇA</span><h2>🧬 ${escapeHTML(data.name)}</h2><p class="detail-description">${escapeHTML(data.desc)}</p>${data.b?`<div class="tags">${Object.entries(data.b).map(([a,v])=>`<span class="tag">${a} ${v>=0?'+':''}${v}</span>`).join('')}</div>`:''}<h3>Evoluções 1 → 10</h3><p class="muted">Cada raça possui cinco marcos. A habilidade só entra na ficha quando o jogador escolhe adicioná-la e quando o nível da raça permite.</p><div class="evolution-list">${evol.map(e=>{const unlocked=current?.race===data.name&&e.level<=current.raceLevel;const added=activeIds.has(e.id);return `<article class="evolution-row ${unlocked?'unlocked':'locked'}"><div class="evo-level">Nvl ${e.level}</div><div class="evo-content"><b>${escapeHTML(e.name)}</b><small>${escapeHTML(e.effect)}</small><div class="evo-meta"><span>💧 ${e.cost||0} PE</span><span>🎲 ${escapeHTML(e.check)}</span>${e.damage?`<span>⚔️ ${escapeHTML(e.damage)}</span>`:'<span>🛡️ sem dano direto</span>'}</div><p><b>Como funciona:</b> ${escapeHTML(e.desc)}</p></div>${unlocked&&current?`<button class="secondary" onclick="${added?`showToast('Esta evolução já está na ficha.')`:`addRaceAbility('${escapeAttr(e.id)}');closeModal('detailModal')`}">${added?'✓ Na ficha':'＋ Adicionar'}</button>`:'<span class="locked-label">🔒 Nível ${e.level}</span>'}</article>`}).join('')}</div><button class="primary full" onclick="closeModal('detailModal')">Fechar</button>`;
}
function renderRoleDetail(data){const powers=roleAbilityData(data.name);$('detailBody').innerHTML=`<span class="eyebrow">CARGO</span><h2>⚓ ${escapeHTML(data.name)}</h2><p class="detail-description">${escapeHTML(data.desc)}</p><h3>Perícias automáticas</h3><div class="tags">${(data.skills||[]).map(x=>`<span class="tag">${escapeHTML(x[0])} +${Math.min(3,num(x[1]))}</span>`).join('')||'<span class="tag">Nenhuma</span>'}</div><h3>Técnicas do cargo</h3><div class="evolution-list">${powers.map(p=>`<div class="power-card color-azul"><div><b>${escapeHTML(p.name)}</b><small>${p.cost||0} PE • ${escapeHTML(p.check||'')}</small><p>${escapeHTML(p.desc||'')}</p></div></div>`).join('')}</div><h3>Itens oferecidos</h3><div class="tags">${(data.items||[]).map(x=>`<span class="tag">${escapeHTML(x)}</span>`).join('')||'<span class="tag">Nenhum</span>'}</div><button class="primary full" onclick="closeModal('detailModal')">Fechar</button>`;}
function renderFruitDetail(data){const powers=[...(data.starterPowers||[])];$('detailBody').innerHTML=`<span class="eyebrow">AKUMA NO MI • ${escapeHTML(data.type)}</span><h2>🍈 ${escapeHTML(data.name)}</h2><p class="detail-description">${escapeHTML(data.desc)}</p><div class="detail-rules"><b>Equilíbrio</b><p>${escapeHTML(data.balance||'Use custo de PE e limites de nível.')}</p></div><h3>5 poderes iniciais</h3><div class="choice-grid">${powers.map(p=>`<button class="power-choice" onclick="openPowerDetail(${JSON.stringify(p).replaceAll('"','&quot;')})"><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.type)} • ${p.cost||0} PE</small><span>${escapeHTML(p.check||'')} ${p.damage?`• ${escapeHTML(p.damage)}`:''}</span></button>`).join('')}</div><button class="primary full" onclick="closeModal('detailModal')">Fechar</button>`;}
function renderHakiDetail(data){$('detailBody').innerHTML=`<span class="eyebrow">HAKI</span><h2>👁️ ${escapeHTML(data.name)}</h2><p class="detail-description">${escapeHTML(data.desc)}</p><div class="detail-power-meta"><span>${data.cost} PE</span><span>${escapeHTML(data.dice)}</span></div><button class="primary full" onclick="closeModal('detailModal')">Fechar</button>`;}

/* ------------------------- ATAQUES / EDIÇÃO DE CONTEÚDO ------------------------- */
function openEditModal(type,index,title){
  const list=current?.[type]||[];const old=index>=0?(list[index]||{}):{};$('editModalTitle').textContent=title||'Editar';
  const isItem=type==='items', isAttack=type==='attacks';
  $('editModalBody').innerHTML=`<div class="form-grid">
    <label>Nome <span class="field-help">Ex.: Corte do Mar</span><input id="mName" value="${escapeAttr(old.name||'')}" placeholder="Ex.: Técnica especial"></label>
    ${isAttack?`<label>Tipo<select id="mType">${['Ataque','Defesa','Utilidade','Suporte'].map(v=>`<option ${v===(old.type||'Ataque')?'selected':''}>${v}</option>`).join('')}</select></label><label>Atributo<select id="mAttribute">${[...ATTRS,'Sem teste'].map(x=>`<option ${x===(old.attribute||'Força')?'selected':''}>${x}</option>`).join('')}</select></label><label>Teste <span class="field-help">Ex.: 1d20 + Força ou 1d100</span><input id="mCheck" value="${escapeAttr(old.check||'') }" placeholder="1d20 + Força"></label><label>Dano <span class="field-help">Ex.: 1d6, 2d8 ou vazio.</span><input id="mDamage" value="${escapeAttr(old.damage||'')}" placeholder="1d6"></label><label>Custo de PE<input id="mCost" type="number" min="0" value="${num(old.cost)}"></label><label>Alcance<input id="mRange" value="${escapeAttr(old.range||'Corpo a corpo')}" placeholder="Corpo a corpo"></label><label>Limiar d100 <span class="field-help">Ex.: 80 = sucesso com 80–100.</span><input id="mThreshold" type="number" min="1" max="100" value="${old.successThreshold??''}"></label><label class="wide">Efeito <span class="field-help">Explique o que acontece.</span><textarea id="mEffect">${escapeHTML(old.effect||'')}</textarea>`:''}
    ${isItem?`<label>Categoria<select id="mType">${['Arma','Armadura','Consumível','Ferramenta','Navegação','Comunicação','Conhecimento','Munição','Especial'].map(x=>`<option ${x===(old.type||'Especial')?'selected':''}>${x}</option>`).join('')}</select></label><label>Bônus <span class="field-help">Ex.: +2 Defesa</span><input id="mBonus" value="${escapeAttr(old.bonus||'')}" placeholder="Ex.: +2 Defesa"></label><label>Efeito<input id="mEffect" value="${escapeAttr(old.effect||'')}" placeholder="Ex.: Recupera 10 PV"></label>`:''}
    ${!isItem&&!isAttack?`<label>Nível<input id="mLevel" type="number" min="1" max="10" value="${clamp(num(old.level,1),1,10)}"></label><label>Custo de PE<input id="mCost" type="number" min="0" value="${num(old.cost)}"></label><label>Cor da habilidade<select id="mColor">${[['amarelo','Amarelo — Raça'],['azul','Azul — Cargo'],['verde','Verde — Especial'],['vermelho','Vermelho — Fruta'],['roxo','Roxo — Haki'],['rosa','Rosa — Homebrew'],['cinza','Cinza — Geral']].map(x=>`<option value="${x[0]}" ${(old.color||originColor(old.origin))===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></label>`:''}
    <label class="wide">Descrição <span class="field-help">Explique custo, efeito, teste, alcance e limitações.</span><textarea id="mDesc" placeholder="Como funciona? O que custa? O que acontece?">${escapeHTML(old.desc||'')}</textarea></label>
  </div><button class="primary full" onclick="saveModalEntry('${type}',${index})">💾 Salvar</button>`;
  openModal('editModal');
}
function saveModalEntry(type,index){
  const list=current[type]||[];const old=index>=0?list[index]:{};const name=$('mName').value.trim();if(!name){showToast('Digite um nome.');return;}
  let obj={id:old.id||uid(),name,desc:$('mDesc')?.value.trim()||'',origin:old.origin||'Personalizado'};
  if(type==='attacks'){
    obj={...obj,type:$('mType').value,attribute:$('mAttribute').value,check:$('mCheck').value.trim()||`1d20 + ${$('mAttribute').value}`,damage:$('mDamage').value.trim(),cost:Math.max(0,num($('mCost').value)),range:$('mRange').value.trim()||'Corpo a corpo',effect:$('mEffect')?.value.trim()||'',successThreshold:$('mThreshold')?.value===''||$('mThreshold')?.value==null?null:clamp(num($('mThreshold').value),1,100),origin:old.source==='fruit'?'Akuma no Mi':'Personalizado',color:old.source==='fruit'?'vermelho':(old.color||'cinza'),source:old.source,sourceId:old.sourceId};
  }else if(type==='items'){
    obj=normalizeItem({...old,...obj,type:$('mType').value,bonus:$('mBonus').value.trim(),effect:$('mEffect').value.trim(),origin:old.origin||'Personalizado'});
  }else{
    obj=normalizePower({...old,...obj,level:clamp(num($('mLevel').value,1),1,10),cost:Math.max(0,num($('mCost').value)),color:$('mColor').value,origin:old.origin||'Personalizado'});
  }
  if(index<0)current[type].push(obj);else current[type][index]=obj;
  if(type==='attacks'&&old.source==='fruit'){current.fruitPowerEdits=current.fruitPowerEdits||{};current.fruitPowerEdits[old.sourceId||old.id]=clone(obj);refreshFruitCombat(current);}
  closeModal('editModal');renderEditor();
}

/* ------------------------- HAKI / AURA ------------------------- */
function toggleHakiType(type,on){
  if(on){if(!current.haki.includes(type))current.haki.push(type);}else{current.haki=current.haki.filter(x=>x!==type);if(type==='Observação')current.observationChoices=[];if(type==='Rei')current.conqueror=false;}
  renderEditor();
}
function toggleObservation(id){
  const selected=current.observationChoices||[];
  if(selected.includes(id))current.observationChoices=selected.filter(x=>x!==id);
  else if(selected.length<2)current.observationChoices=[...selected,id];
  else{showToast('O limite é 2 variações de Observação.');return;}
  if(current.observationChoices.length&&!current.haki.includes('Observação'))current.haki.push('Observação');
  if(!current.observationChoices.length)current.haki=current.haki.filter(x=>x!=='Observação');
  renderEditor();
}
function toggleHaki(type,on){toggleHakiType(type,on);}
function rollHaki(id){
  let power=null;if(id==='rei')power=HAKI.rei[0];else power=[...HAKI.observacao,...HAKI.armamento].find(x=>x.id===id);if(!power)return;
  if(current.peCurrent<power.cost){showToast('PE insuficiente para usar este Haki.');return;}
  current.peCurrent-=power.cost;const r=roll(20),total=r+attrTotal(current,'Vontade');const textValue=`${current.name||'Ficha'} • ${power.name}: d20 ${r} + Vontade ${attrTotal(current,'Vontade')} = ${total}`;saveRollForContext(current.name||'Ficha',textValue);persistCurrent();showRollResult(power.name,`${total}` ,`${r} no d20 + Vontade ${attrTotal(current,'Vontade')} • ${power.cost} PE`);renderEditor();
}
function selectAura(id){current.aura=id;if(id==='Nenhuma')current.auraActive=false;renderEditor();}
function toggleAuraActive(){if(current.aura==='Nenhuma'){showToast('Escolha Aura Básica, EX ou GX primeiro.');return;}current.auraActive=!current.auraActive;renderEditor();}
function auraTurnCheck(agent,participantName,campaign){
  if(!agent.auraActive||agent.aura==='Nenhuma')return null;
  if(agent.auraSkipNext){agent.auraSkipNext=false;return {roll:null,text:'Aura: teste pulado pelo resultado 20 do turno anterior.'};}
  const r=roll(20);
  if(r===1){agent.auraActive=false;return {roll:r,text:'Aura: 1 no teste — desativada neste turno.'};}
  if(r===20){agent.auraSkipNext=true;return {roll:r,text:'Aura: 20 — nenhum PE gasto e o próximo turno pula o teste.'};}
  if(agent.peCurrent<=0){agent.auraActive=false;return {roll:r,text:'Aura: sem PE para manter — desativada.'};}
  agent.peCurrent-=1;return {roll:r,text:'Aura: teste de manutenção '+r+' — 1 PE gasto.'};
}

/* ------------------------- DETERMINAÇÃO ------------------------- */
function toggleDeterminationPower(level,id){
  if(!current.determinationChoices[level])current.determinationChoices[level]=[];const selected=current.determinationChoices[level];
  if(selected.includes(id))current.determinationChoices[level]=selected.filter(x=>x!==id);else if(selected.length<2)current.determinationChoices[level]=[...selected,id];else{showToast('Escolha somente 2 poderes neste nível.');return;}renderEditor();
}

/* ------------------------- COMBATE / ROLAGENS ------------------------- */
function rollAttribute(attr){
  if(!current)return;const r=roll(20),mod=attrTotal(current,attr),total=r+mod;const textValue=`${current.name||'Ficha'} • ${attr}: d20 ${r} + ${mod} = ${total}`;saveRollForContext(current.name||'Ficha',textValue);showRollResult(attr,String(total),`${r} no d20 + ${mod}`);
}
function rollSkill(name){
  if(!current)return;const info=allSkills().find(x=>x[0]===name)||['Determinação','Vontade'];const mod=skillTotal(current,name),r=roll(20),total=r+mod;const textValue=`${current.name||'Ficha'} • ${name}: d20 ${r} + ${mod} = ${total}`;saveRollForContext(current.name||'Ficha',textValue);showRollResult(name,String(total),`${r} no d20 + ${mod}`);
}
function rollOwnedCombat(id){
  const p=findCombatPowerById(id);if(!p)return;rollPowerObject(p);
}
function rollPowerObject(raw){
  if(!current)return;
  const p=normalizePower(raw);const cost=num(p.cost);
  if(current.peCurrent<cost){showToast('🔥 PE insuficiente para usar esta ação.');return;}
  current.peCurrent-=cost;
  let test=null,success=true,detail=[];
  if(p.check){
    const match=p.check.match(/(\d*d\d+(?:[+-]\d+)?)/i);
    const expr=match?.[1]||'1d20';
    const d=rollExpression(expr);test=d.total;
    const attr=(p.attribute&&ATTRS.includes(p.attribute))?p.attribute:(p.check.match(/\+\s*(Força|Destreza|Constituição|Inteligência|Presença|Vontade)/)?.[1]||null);
    const mod=attr?attrTotal(current,attr):0;
    if(attr)test+=mod;
    detail.push(`Teste ${expr}${attr?` + ${mod}`:''} = ${test}`);
    if(p.successThreshold!=null){success=p.successMode==='menor-que'?test<p.successThreshold:test>=p.successThreshold;detail.push(success?`✅ sucesso (${p.successThreshold})`:`❌ falhou (${p.successThreshold})`);}
  }
  let damageText='';
  if(success&&p.damage){const d=rollExpression(p.damage);damageText=`Dano ${d.total} (${d.rolls.join(', ')})`;}
  if(!success&&p.damage)damageText='Dano 0 — falhou';
  const message=[p.name,test!==null?`teste ${test}`:'',damageText].filter(Boolean).join(' • ');
  saveRollForContext(current.name||'Ficha',`${current.name||'Ficha'} • ${message}`);persistCurrent();
  showRollResult(p.name,test!==null?String(test):damageText||'Usado',`${cost?`-${cost} PE • `:''}${damageText||detail.join(' • ')||'efeito ativado'}`);
  if($('detailModal')&&!$('detailModal').classList.contains('hidden'))renderPowerDetail(p);
  if($('editorRoot')&&!$('editorRoot').classList.contains('hidden'))renderEditor();
  if($('sheet')?.classList.contains('active'))renderSheet();
}
function persistCurrent(){
  if(!current)return;current.updatedAt=Date.now();const index=agents.findIndex(x=>x.id===current.id);if(index>=0){agents[index]=normalizeAgent(current);saveAgents();syncAgentToCampaigns(current);}else{agents.push(normalizeAgent(current));saveAgents();}
}
function customRollFromModal(expression){const result=rollExpression(expression);showRollResult(expression,String(result.total),result.rolls.join(' + '));saveRollForContext(current?.name||'Rolagem',`${current?.name||'Rolagem'} • ${expression} = ${result.total}`);}

/* ------------------------- FICHA FINAL ------------------------- */
function renderAgents(){
  const box=$('agentList');if(!box)return;
  if(!agents.length){box.innerHTML='<div class="empty"><b>🏴‍☠️</b><h3>Nenhuma ficha</h3><p>Crie seu primeiro personagem e ele aparecerá aqui.</p><button class="primary" onclick="startCreation()">＋ Criar ficha</button></div>';return;}
  box.innerHTML=agents.map(agent=>{const c=calc(agent);return `<article class="agent-card theme-${agent.theme||'pirata'}"><div class="agent-card-top"><div class="agent-avatar">${agent.avatar?`<img src="${escapeAttr(agent.avatar)}" alt="Avatar">`:'☠️'}</div><div><span class="eyebrow">WEIRD RPG</span><h3>${escapeHTML(agent.name||'Sem nome')}</h3><p>${escapeHTML(agent.race)} • ${escapeHTML((agent.roles||[]).filter(x=>x!=='Nenhum').join(' / ')||'Sem cargo')}</p></div></div><div class="agent-stats"><div><b>Nvl ${agent.level}</b><small>Personagem</small></div><div><b>${agent.hpCurrent}/${c.hpMax}</b><small>PV</small></div><div><b>${agent.peCurrent}/${c.peMax}</b><small>PE</small></div><div><b>${Number(agent.bounty||0).toLocaleString('pt-BR')}</b><small>Recompensa</small></div></div><div class="agent-actions"><button class="primary" onclick="openSheetById('${escapeAttr(agent.id)}')">📜 Abrir ficha</button><button class="secondary" onclick="editAgent('${escapeAttr(agent.id)}')">✎ Editar</button><button class="secondary" onclick="openCampaignSelector('agent','${escapeAttr(agent.id)}')">⚓ Campanha</button><button class="secondary" onclick="exportAgent('${escapeAttr(agent.id)}')">⬇</button><button class="delete" onclick="deleteAgent('${escapeAttr(agent.id)}')">×</button></div></article>`;}).join('');
}
function openSheetById(id){
  const agent=agents.find(x=>x.id===id);if(!agent){showToast('Ficha não encontrada.');return;}
  current=clone(normalizeAgent(agent));returnCampaignId=null;activeCampaignIdForRoll=null;sheetTab='overview';go('sheet');renderSheet();
}
function editAgent(id){
  const agent=agents.find(x=>x.id===id);if(!agent)return;
  if(!activeCampaignIdForRoll)returnCampaignId=null;
  beginEditor(agent,{tab:'identity'});
  go('create');
}
function deleteAgent(id){const agent=agents.find(x=>x.id===id);if(!agent)return;if(!confirmAction(`Excluir a ficha de ${agent.name||'este personagem'}?`))return;agents=agents.filter(x=>x.id!==id);saveAgents();campaigns.forEach(c=>c.members=c.members.filter(m=>m.agentId!==id));saveCampaigns();go('agents');showToast('Ficha excluída.');}
function setSheetTab(tab){sheetTab=tab;renderSheet();}
function campaignBackButton(){return returnCampaignId?`<button class="secondary" onclick="returnToCampaign()">← Voltar para campanha</button>`:'';}
function renderSheet(){
  if(!current)return;current=normalizeAgent(current);const c=calc(current);const roleNames=current.roles.filter(x=>x!=='Nenhum').join(' / ')||'Sem cargo';
  $('sheetRoot').innerHTML=`<div class="sheet-view theme-${current.theme||'pirata'}"><div class="sheet-hero"><button class="sheet-avatar" onclick="current.avatar?openAvatarViewer():chooseAvatar()">${current.avatar?`<img src="${escapeAttr(current.avatar)}" alt="Avatar">`:'☠️'}</button><div class="sheet-main"><span class="eyebrow">☠️ WEIRD RPG • ONE PIECE</span><h1>${escapeHTML(current.name||'Sem nome')}</h1><p>${escapeHTML(current.race)} • ${escapeHTML(roleNames)} • Nível ${current.level}/10 • Raça ${current.raceLevel}/10</p><div class="sheet-tags"><span>💰 ${Number(current.berries||0).toLocaleString('pt-BR')}</span><span>🏴‍☠️ Recompensa ${Number(current.bounty||0).toLocaleString('pt-BR')}</span><span>⭐ Reputação ${current.reputation||0}</span></div></div><div class="sheet-actions"><button id="sheetEditButton" class="primary editing-trigger" onclick="editAgent('${escapeAttr(current.id)}')">✎ Editar tudo</button><button class="secondary" onclick="chooseAvatar()">📷 Trocar foto</button><button class="secondary" onclick="exportAgent('${escapeAttr(current.id)}')">⬇ Baixar ficha</button>${campaignBackButton()}<button class="secondary" onclick="go('agents')">← Fichas</button></div></div>
    <div class="sheet-resources"><div class="resource-big hp"><small>❤️ PV</small><b>${current.hpCurrent}/${c.hpMax}</b><div><button onclick="sheetResource('hp',-5)">−5</button><button onclick="sheetResource('hp',-1)">−1</button><button onclick="sheetResource('hp',1)">+1</button><button onclick="sheetResource('hp',5)">+5</button></div></div><div class="resource-big pe"><small>🔥 PE</small><b>${current.peCurrent}/${c.peMax}</b><div><button onclick="sheetResource('pe',-5)">−5</button><button onclick="sheetResource('pe',-1)">−1</button><button onclick="sheetResource('pe',1)">+1</button><button onclick="sheetResource('pe',5)">+5</button></div></div><div><b>${c.defense}</b><small>DEFESA</small></div><div><b>${c.initiative}</b><small>INICIATIVA</small></div><div><b>${c.movement}</b><small>MOVIMENTO</small></div><div class="level-control"><b>${current.level}/10</b><small>NÍVEL</small><div><button onclick="changeSheetLevel(-1)">−</button><button onclick="changeSheetLevel(1)">＋</button></div></div></div>
    <div class="sheet-nav">${[['overview','Visão geral'],['skills','Perícias'],['combat','Combate'],['powers','Poderes'],['inventory','Inventário'],['story','História']].map(x=>`<button class="${sheetTab===x[0]?'active':''}" onclick="setSheetTab('${x[0]}')">${x[1]}</button>`).join('')}</div>
    <div class="sheet-body">${renderSheetTab(sheetTab,c)}</div></div>`;
}
function renderSheetTab(tab,c){
  switch(tab){
    case'overview':return `<section class="sheet-section"><div class="section-head"><div><span class="eyebrow">ATRIBUTOS</span><h2>Visão geral</h2></div>${sheetEditButton('Editar ficha','overview')}<button class="secondary" onclick="openSheetQuickEdit('attributes')">💪 Atributos</button></div><div class="attr-display">${ATTRS.map(a=>`<button onclick="rollAttribute('${a}')"><b>${attrTotal(current,a)}</b><small>${a}</small><span>🎲</span></button>`).join('')}</div><div class="sheet-two"><div class="lore-card"><b>Nome</b><p>${escapeHTML(current.name||'Sem nome')}</p><b>Idade</b><p>${escapeHTML(current.age||'Não definida')}</p><b>Origem</b><p>${escapeHTML(current.origin||'Não definida')}</p><b>Organização</b><p>${escapeHTML(current.organization||'Nenhuma')}</p><b>Reputação</b><p>${escapeHTML(reputationText(current.reputation))}</p></div><div class="lore-card"><b>Raça</b><p>${escapeHTML(RACES[current.race]?.desc||'')}</p><button class="secondary" onclick="openDetail('race','${escapeAttr(current.race)}')">🧬 Ver evolução da raça</button><div class="inline-quick-actions"><button class="secondary" onclick="openSheetQuickEdit('attributes')">✎ Editar atributos</button><button class="secondary" onclick="openSheetQuickEdit('powers')">✨ Editar poderes</button></div></div></div></section>`;
    case'skills':return renderSheetSkills();
    case'combat':return renderSheetCombat();
    case'powers':return renderSheetPowers();
    case'inventory':return renderSheetInventory();
    case'story':return renderSheetStory();
    default:return'';
  }
}
function sheetEditButton(label,section){return `<button class="secondary sheet-edit-btn" onclick="openSheetQuickEdit('${section}')">✎ ${label}</button>`;}
function renderSheetSkills(){
  const rt=roleTraining(current),rc=raceTraining(current);
  return `<section class="sheet-section"><div class="section-head"><div><span class="eyebrow">PERÍCIAS</span><h2>Perícias</h2></div><div class="section-actions"><span class="green-legend">🟢 bônus automático</span>${sheetEditButton('Editar treino','skills')}</div></div><div class="sheet-skills">${Object.entries(SKILLS).map(([group,list])=>`<div class="sheet-skill-group"><h4>${group}</h4>${list.map(([name,attr])=>`<div class="sheet-skill ${rt.get(name)||rc.get(name)?'green':''}"><span><b>${escapeHTML(name)}</b>${skillHelpButton(name)}<small>${attr} • +${skillTotal(current,name)}</small></span><strong>+${skillTotal(current,name)}</strong><button class="dice-btn" onclick="rollSkill('${escapeAttr(name)}')">🎲</button></div>`).join('')}</div>`).join('')}</div><div class="special-section"><h3>Determinação</h3><p>${escapeHTML(SKILL_HELP.Determinação)}</p><div class="tags">${Object.entries(current.determinationChoices||{}).flatMap(([level,ids])=>ids.map(id=>`<span class="tag">Nvl ${level} • ${escapeHTML(id)}</span>`)).join('')||'<span class="tag">Nenhum poder escolhido ainda.</span>'}</div></div></section>`;
}
function renderSheetCombat(){
  const powers=getCombatPowers(current);
  return `<section class="sheet-section"><div class="section-head"><div><span class="eyebrow">COMBATE</span><h2>Ações rápidas</h2></div><div class="section-actions"><span class="muted">Armas equipadas + poderes automáticos</span>${sheetEditButton('Adicionar ação','combat')}</div></div><div class="quick-grid">${powers.length?powers.map((p,i)=>attackCard(p,i,p.source==='fruit')).join(''):'<div class="empty-small">Nenhuma ação de combate.</div>'}</div></section>`;
}
function renderSheetPowers(){const race=current.raceAbilities||[],custom=current.abilities||[],all=[...race,...custom],availableRace=raceEvolutionData(current.race).filter(e=>e.level<=current.raceLevel&&!race.some(x=>(x.sourceId||x.id)===e.id)),selectedHaki=getHakiCombatPowers(current);return `<section class="sheet-section"><div class="section-head"><div><span class="eyebrow">PODERES</span><h2>Haki, Aura e Akuma no Mi</h2></div>${sheetEditButton('Editar poderes','powers')}</div><div class="powers-dashboard"><div class="lore-card haki-sheet-card"><span class="eyebrow">HAKI</span><h3>Haki pronto para usar</h3><p class="muted">Os Haki escolhidos ficam aqui e também aparecem automaticamente no Combate.</p><div class="haki-sheet-actions">${selectedHaki.length?selectedHaki.map(p=>`<div class="haki-use-row"><div><b>${escapeHTML(p.name)}</b><small>${p.cost||0} PE • ${escapeHTML(p.check)}</small><p>${escapeHTML(p.desc)}</p></div><button class="dice-btn big-action" onclick="rollHaki('${escapeAttr(p.sourceId)}')">🎲 Usar</button></div>`).join(''):'<span class="tag">Nenhum Haki escolhido.</span>'}</div></div><div class="lore-card aura-direct-card"><span class="eyebrow">AURA</span><h3>${escapeHTML(current.aura)}</h3><p>${current.auraActive?'🟢 Aura ativa':'⚪ Aura inativa'}${current.auraSkipNext?' • próximo teste ignorado':''}</p><button class="primary" onclick="toggleAuraFromSheet()">${current.auraActive?'⏹ Desativar aura':'🟢 Ativar aura'}</button><small>Quando estiver ativa, o próximo turno faz a regra de manutenção automaticamente.</small></div></div><div class="fruit-sheet-card"><span class="eyebrow">AKUMA NO MI</span><h2>${current.fruit?escapeHTML(current.fruit.name):'Sem fruta'}</h2>${current.fruit?`<p>${escapeHTML(current.fruit.desc)}</p><span class="tag">Fruta Nvl ${current.fruitLevel}/10 • ${current.fruitChoices.length}/2 iniciais • ${Object.keys(current.fruitSelections||{}).length} evoluções escolhidas</span>`:'<p class="muted">Nenhuma Akuma no Mi escolhida.</p>'}</div><div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">HABILIDADES DA FICHA</span><h3>Escolhidas</h3></div>${sheetEditButton('Adicionar habilidade','powers')}</div>${all.length?all.map(powerStaticForSheet).join(''):'<span class="muted">Nenhuma habilidade adicionada.</span>'}${availableRace.length?`<div class="help-banner"><b>Novas evoluções disponíveis:</b> ${availableRace.map(e=>escapeHTML(e.name)).join(', ')}. Entre na edição de Poderes para escolher uma delas.</div>`:''}</div></section>`;}
function toggleAuraFromSheet(){
  if(!current?.aura||current.aura==='Nenhuma'){showToast('Primeiro escolha uma Aura.');return;}
  current.auraActive=!current.auraActive;persistCurrent();renderSheet();showToast(current.auraActive?'🟢 Aura ativada.':'⚪ Aura desativada.');
}
function powerStaticForSheet(p){return `<div class="power-card color-${p.color||originColor(p.origin)} clickable-power" onclick="openPowerDetail(${JSON.stringify(p).replaceAll('"','&quot;')})"><span class="power-origin">${escapeHTML(p.origin||'')}</span><b>${escapeHTML(p.name)}</b><small>${p.cost||0} PE${p.damage?` • ${escapeHTML(p.damage)}`:''}${p.check?` • ${escapeHTML(p.check)}`:''}</small><p>${escapeHTML(p.desc||'')}</p><div class="row-actions" onclick="event.stopPropagation()"><button class="info-btn" onclick="openPowerDetail(${JSON.stringify(p).replaceAll('"','&quot;')})">ⓘ</button><button class="dice-btn" onclick="usePowerByObject(${JSON.stringify(p).replaceAll('"','&quot;')})">🎲 Usar</button></div></div>`;}
function renderSheetInventory(){
  return `<section class="sheet-section"><div class="section-head"><div><span class="eyebrow">EQUIPAMENTO</span><h2>Inventário</h2></div><span class="muted">Use os controles sem abrir o editor completo.</span></div>${current.items.length?current.items.map((item,i)=>`<div class="inventory-row ${item.equipped?'equipped':''}"><div class="item-icon">${item.type==='Arma'?'⚔️':item.type==='Armadura'?'🛡️':item.type==='Consumível'?'🧪':item.type==='Munição'?'🎯':'📦'}</div><div class="item-info"><b>${escapeHTML(item.name)}</b><small>${escapeHTML(item.type)} • ${escapeHTML(item.origin)}</small><p>${escapeHTML(item.desc)}</p>${item.bonus?`<span class="tag">${escapeHTML(item.bonus)}</span>`:''}</div><div class="item-quantity"><button onclick="sheetItemQuantity(${i},-1)">−</button><input type="number" min="0" value="${num(item.quantity,1)}" onchange="sheetItemQuantitySet(${i},this.value)"><button onclick="sheetItemQuantity(${i},1)">＋</button></div>${item.type==='Arma'?`<label class="switch" title="Ativar no combate"><input type="checkbox" ${item.equipped?'checked':''} onchange="sheetEquipItem(${i},this.checked)"><span></span></label>`:''}<button class="secondary" onclick="openEditModal('items',${i},'Editar item')">✎</button><button class="secondary" onclick="removeOwnedItem(${i})">🗑 Tirar</button></div>`).join(''):'<div class="empty-small">Inventário vazio.</div>'}<div class="toolbar"><button class="primary" onclick="openLibrary('items')">＋ Adicionar item</button></div></section>`;
}
function sheetItemQuantity(index,delta){changeItemQuantity(index,delta);renderSheet();}
function sheetItemQuantitySet(index,value){setItemQuantity(index,value);renderSheet();}
function sheetEquipItem(index,on){toggleItemEquip(index,on);renderSheet();}
function renderSheetStory(){return `<section class="sheet-section"><div class="section-head"><div><span class="eyebrow">HISTÓRIA</span><h2>História de ${escapeHTML(current.name||'este personagem')}</h2></div>${sheetEditButton('Editar história','story')}</div><div class="story-grid"><div><b>Personalidade</b><p>${escapeHTML(current.personality||'Não definida')}</p></div><div><b>Código de honra</b><p>${escapeHTML(current.honor||'Não definido')}</p></div><div><b>Sonho</b><p>${escapeHTML(current.dream||'Não definido')}</p></div><div class="wide"><b>História</b><p>${escapeHTML(current.history||'Não definida')}</p></div></div></section>`;}
function openSheetQuickEdit(section){
  const titleMap={overview:'Editar ficha básica',attributes:'Editar atributos',skills:'Editar perícias',powers:'Editar poderes',inventory:'Gerenciar inventário',combat:'Gerenciar combate',story:'Editar história'};
  $('editModalTitle').textContent=titleMap[section]||'Editar';
  if(section==='overview'){
    $('editModalBody').innerHTML=`<div class="form-grid"><label>Nome <span class="field-help">Ex.: Roran D. Vale</span><input id="qeName" value="${escapeAttr(current.name)}"></label><label>Jogador<input id="qePlayer" value="${escapeAttr(current.player)}"></label><label>Idade<input id="qeAge" type="number" value="${escapeAttr(current.age)}"></label><label>Origem<input id="qeOrigin" value="${escapeAttr(current.origin)}"></label><label>Organização<input id="qeOrg" value="${escapeAttr(current.organization)}"></label><label>Nível <span class="field-help">1 a 10</span><input id="qeLevel" type="number" min="1" max="10" value="${current.level}"></label><label>Nível da raça<input id="qeRaceLevel" type="number" min="1" max="10" value="${current.raceLevel}"></label><label>Recompensa<input id="qeBounty" type="number" min="0" value="${current.bounty}"></label><label>Berries<input id="qeBerries" type="number" min="0" value="${current.berries}"></label><label>Reputação<input id="qeRep" type="number" value="${current.reputation}"></label></div><button class="primary full" onclick="saveSheetQuickEdit('overview')">💾 Salvar alterações</button>`;
  }else if(section==='attributes'){
    const pool=attributePool(current);
    $('editModalBody').innerHTML=`<p>Na criação o personagem recebe 12 pontos. Cada nível concede +1. O bônus de raça e Aura não consome pontos de atributo.</p><div class="rule-strip">Pontos usados: <b>${Object.values(current.attributes).reduce((s,v)=>s+Math.max(0,num(v)),0)}/${pool}</b> • Você pode editar os valores diretamente.</div><div class="quick-attribute-grid">${ATTRS.map((a,i)=>`<label>${a}<input id="qa${i}" type="number" min="0" max="${maxAttr(current)}" value="${num(current.attributes[a])}"></label>`).join('')}</div><button class="primary full" onclick="saveSheetQuickEdit('attributes')">💾 Salvar atributos</button>`;
  }else if(section==='skills'){
    $('editModalBody').innerHTML=`<p>Treino manual máximo: +5 nos níveis 1–2, +10 nos níveis 3–4 e +15 no nível 5+. Os bônus de raça e cargo continuam automáticos.</p><div class="quick-skills-grid">${Object.values(SKILLS).flat().map(([name])=>{const id='qs'+allSkills().findIndex(x=>x[0]===name);const st=current.skills[name]||{training:0};return `<label>${escapeHTML(name)}<select id="${id}">${[0,5,10,15].filter(v=>v<=trainingMax(current)).map(v=>`<option value="${v}" ${num(st.training)===v?'selected':''}>+${v}</option>`).join('')}</select></label>`}).join('')}</div><button class="primary full" onclick="saveSheetQuickEdit('skills')">💾 Salvar treino</button>`;
  }else if(section==='powers'){
    $('editModalBody').innerHTML=`<div class="sheet-quick-power-editor"><div class="quick-power-box"><h3>Haki</h3><label><input type="checkbox" id="qqObs" ${current.haki.includes('Observação')?'checked':''}> Observação</label><label><input type="checkbox" id="qqArm" ${current.haki.includes('Armamento')?'checked':''}> Armamento</label><label><input type="checkbox" id="qqKing" ${current.haki.includes('Rei')?'checked':''}> Haki do Rei</label><p>As duas variações de Observação continuam sendo escolhidas na etapa Haki.</p></div><div class="quick-power-box"><h3>Aura</h3><select id="qqAura">${['Nenhuma','Aura Básica','Aura EX','Aura GX'].map(v=>`<option ${v===current.aura?'selected':''}>${v}</option>`).join('')}</select><label><input type="checkbox" id="qqAuraActive" ${current.auraActive?'checked':''}> Aura ativa</label></div><div class="quick-power-box"><h3>Foto</h3><button class="secondary" onclick="closeModal('editModal');chooseAvatar()">📷 Trocar foto</button></div></div><button class="primary full" onclick="saveSheetQuickEdit('powers')">💾 Salvar poderes</button>`;
  }else if(section==='inventory'){
    $('editModalBody').innerHTML=`<p>Você já pode editar quantidade, ativar armas e tirar itens diretamente na ficha.</p><button class="primary full" onclick="closeModal('editModal');renderSheet()">✅ Fechar</button>`;
  }else if(section==='combat'){
    $('editModalBody').innerHTML=`<p>Armas equipadas aparecem automaticamente. Para criar uma nova ação, use o botão abaixo.</p><div class="row-actions"><button class="primary" onclick="closeModal('editModal');openEditModal('attacks',-1,'Criar ação de combate')">＋ Criar ação</button><button class="secondary" onclick="closeModal('editModal');openLibrary('attacks')">＋ Adicionar existente</button></div>`;
  }else if(section==='story'){
    $('editModalBody').innerHTML=`<div class="form-grid"><label class="wide">Personalidade<textarea id="qPersonality">${escapeHTML(current.personality)}</textarea></label><label class="wide">Código de honra<textarea id="qHonor">${escapeHTML(current.honor)}</textarea></label><label class="wide">Sonho<textarea id="qDream">${escapeHTML(current.dream)}</textarea></label><label class="wide">História<textarea id="qHistory">${escapeHTML(current.history)}</textarea></label></div><button class="primary full" onclick="saveSheetQuickEdit('story')">💾 Salvar história</button>`;
  }
  openModal('editModal');
}
function saveSheetQuickEdit(section){
  if(section==='overview'){
    current.name=$('qeName').value.trim();current.player=$('qePlayer').value.trim();current.age=$('qeAge').value;current.origin=$('qeOrigin').value.trim();current.organization=$('qeOrg').value.trim();const before=clone(current);const oldLevel=num(before.level,1);current.level=clamp(num($('qeLevel').value,1),1,10);current.raceLevel=clamp(num($('qeRaceLevel').value,1),1,10);current.raceLevel=Math.max(current.raceLevel,current.level);if(current.fruit)current.fruitLevel=Math.max(num(current.fruitLevel,1),current.level);current.bounty=Math.max(0,num($('qeBounty').value));current.berries=Math.max(0,num($('qeBerries').value));current.reputation=num($('qeRep').value);recalculateResourcesAfterProgress(before,current);
  }else if(section==='attributes'){
    const next={...current.attributes};
    ATTRS.forEach((a,i)=>next[a]=clamp(num($('qa'+i).value),0,maxAttr(current)));
    const used=Object.values(next).reduce((s,v)=>s+Math.max(0,num(v)),0);
    if(used>attributePool(current)){showToast(`Você passou do limite de ${attributePool(current)} pontos de atributo.`);return;}
    current.attributes=next;
  }
  else if(section==='skills')Object.values(SKILLS).flat().forEach(([name],i)=>{const el=$('qs'+allSkills().findIndex(x=>x[0]===name));if(el&&current.skills[name])current.skills[name].training=clamp(num(el.value),0,trainingMax(current));});
  else if(section==='powers'){const h=[];if($('qqObs').checked)h.push('Observação');if($('qqArm').checked)h.push('Armamento');if($('qqKing').checked)h.push('Rei');current.haki=h;current.aura=$('qqAura').value;current.auraActive=$('qqAuraActive').checked&&current.aura!=='Nenhuma';}
  else if(section==='story'){current.personality=$('qPersonality').value;current.honor=$('qHonor').value;current.dream=$('qDream').value;current.history=$('qHistory').value;}
  current=normalizeAgent(current);persistCurrent();closeModal('editModal');renderSheet();showToast('✅ Alteração salva.');
}
function sheetResource(type,delta){
  if(!current)return;const c=calc(current);const max=type==='hp'?c.hpMax:c.peMax;current[type+'Current']=clamp(num(current[type+'Current'])+delta,0,max);persistCurrent();renderSheet();
}
function changeSheetLevel(delta){const before=clone(current);const oldLevel=num(current.level,1);const nextLevel=clamp(oldLevel+delta,1,10);if(nextLevel===oldLevel)return;const usedAttributes=Object.values(current.attributes||{}).reduce((sum,v)=>sum+Math.max(0,num(v)),0);if(nextLevel<oldLevel&&usedAttributes>attributePool({...current,level:nextLevel})){showToast(`Não é possível baixar para o nível ${nextLevel}: há pontos de atributo demais para esse nível.`);return;}current.level=nextLevel;current.raceLevel=Math.max(num(current.raceLevel,1),current.level);if(current.fruit)current.fruitLevel=Math.max(num(current.fruitLevel,1),current.level);recalculateResourcesAfterProgress(before,current);current.updatedAt=Date.now();persistCurrent();renderSheet();showToast(current.level>oldLevel?`⭐ Nível ${current.level}! +${current.level-oldLevel} ponto(s) de atributo disponíveis.`:`Nível alterado para ${current.level}.`);}
function returnToCampaign(){if(returnCampaignId){const id=returnCampaignId;returnCampaignId=null;activeCampaignIdForRoll=id;go('campaigns');openCampaign(id);}}

/* ------------------------- IMPORTAR / EXPORTAR ------------------------- */
function exportAgent(id){
  const a=agents.find(x=>x.id===id);
  if(!a){showToast('Ficha não encontrada para exportar.');return;}
  const normalized=normalizeAgent(a);
  const payload={format:'WEIRD-RPG',type:'agent',version:16,exportedAt:new Date().toISOString(),agent:normalized};
  const json='\ufeff'+JSON.stringify(payload,null,2);
  const blob=new Blob([json],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download=`weird-rpg-${(normalized.name||'ficha').replace(/[^a-z0-9áéíóúãõç_-]/gi,'_')}.json`;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  showToast('✅ Ficha exportada. Envie este arquivo .json para o Mestre/jogador.');
}
function importAgent(){
  const input=$('importFile');
  if(!input){showToast('Campo de importação não encontrado.');return;}
  input.value='';
  showToast('📥 Escolha o arquivo .json da ficha.');
  setTimeout(()=>input.click(),50);
}
async function handleImport(event){
  const file=event.target.files?.[0];
  if(!file)return;
  try{
    let raw=await file.text();
    raw=String(raw||'').replace(/^\uFEFF/,'').trim();
    if(!raw)throw new Error('empty');
    let parsed=JSON.parse(raw);
    // Alguns sistemas guardam o JSON como uma string dentro do arquivo.
    if(typeof parsed==='string'){
      parsed=JSON.parse(parsed.replace(/^\uFEFF/,'').trim());
    }
    let candidates=[];
    if(Array.isArray(parsed))candidates=parsed;
    else if(Array.isArray(parsed.agents))candidates=parsed.agents;
    else if(parsed.agent&&typeof parsed.agent==='object')candidates=[parsed.agent];
    else if(parsed.character&&typeof parsed.character==='object')candidates=[parsed.character];
    else if(parsed.data?.agent&&typeof parsed.data.agent==='object')candidates=[parsed.data.agent];
    else if(Array.isArray(parsed.data?.agents))candidates=parsed.data.agents;
    else if(parsed.payload?.agent&&typeof parsed.payload.agent==='object')candidates=[parsed.payload.agent];
    else candidates=[parsed];

    const valid=candidates.filter(x=>x&&typeof x==='object');
    if(!valid.length)throw new Error('no-agents');

    const imported=[];
    for(const candidate of valid){
      if(!candidate.name && !candidate.race && !candidate.attributes && !candidate.skills)continue;
      const freshId=uid();
      const normalized=normalizeAgent({...candidate,id:freshId,updatedAt:Date.now()});
      imported.push(normalized);
    }
    if(!imported.length)throw new Error('invalid-agent');

    // Importação sempre recebe um novo ID para evitar conflito com outra ficha existente.
    agents=ensureUniqueIds([...agents,...imported]).map(normalizeAgent);
    saveAgents();
    current=null;
    returnCampaignId=null;
    activeCampaignIdForRoll=null;
    renderAgents();
    go('agents');
    showToast(`✅ ${imported.length} ficha(s) importada(s). Elas já estão em Agentes.`);
  }catch(err){
    console.error('WEIRD RPG — erro ao importar:',err);
    showToast('❌ Não consegui ler essa ficha. Use o .json baixado pelo botão “Baixar ficha”.');
  }finally{
    event.target.value='';
  }
}

/* ------------------------- CAMPANHAS ------------------------- */
/*
 * Atualiza somente o conteúdo da campanha atual sem mandar o jogador
 * para o topo da página. Isso evita o "pulo" de tela ao clicar em PV,
 * iniciativa, ataques, remover, editar etc.
 */

function refreshCampaignView(cid, options={}){
  const c=getCampaign(cid); if(!c)return;
  if(activeCampaignPageId!==cid){openCampaign(cid);return;}
  const root=$('campaignPageRoot'); const board=root?.querySelector('[data-campaign-board]');
  if(!board){renderCampaigns();return;}
  const scrollY=window.scrollY||document.documentElement.scrollTop||0;
  const scrollX=window.scrollX||document.documentElement.scrollLeft||0;
  const active=document.activeElement; const activeId=active?.id||'';
  const selectionStart=typeof active?.selectionStart==='number'?active.selectionStart:null;
  const selectionEnd=typeof active?.selectionEnd==='number'?active.selectionEnd:null;
  board.querySelector('[data-campaign-round]')?.replaceChildren(document.createTextNode(`MESA LOCAL • RODADA ${c.round}`));
  const title=board.querySelector('[data-campaign-title]'); if(title)title.textContent=c.name;
  const code=board.querySelector('[data-campaign-code]'); if(code)code.textContent=c.code;
  const entities=getCampaignEntities(c); const next=entities.find(e=>isCurrentTurn(c,e.key));
  const nextBox=board.querySelector('[data-campaign-turn]'); if(nextBox)nextBox.innerHTML=`<span class="campaign-v16-turn-label">VEZ ATUAL</span><b>${escapeHTML(next?.name||'Defina a iniciativa')}</b><small>${next?`${next.type==='agent'?'Agente':'Ameaça'} • Iniciativa ${c.initiatives[next.key]??'—'}`:'Role a iniciativa de todos para começar.'}</small>`;
  const order=board.querySelector('[data-campaign-order]'); if(order)order.innerHTML=`<div class="campaign-v16-order-title"><span class="eyebrow">ORDEM DE INICIATIVA</span><small>${entities.length} participante(s)</small></div>${entities.length?entities.map((e,i)=>`<div class="campaign-v16-init-chip ${isCurrentTurn(c,e.key)?'active':''}"><b>${i+1}</b><span>${escapeHTML(e.name)}</span><small>${c.initiatives[e.key]??'—'}</small></div>`).join(''):'<span class="muted">Adicione personagens e ameaças para montar a ordem.</span>'}`;
  const members=board.querySelector('[data-campaign-members]'); if(members)members.innerHTML=c.members.length?c.members.map((m,i)=>campaignMemberCard(c,m,i)).join(''):'<div class="empty-small">Nenhum personagem na mesa.</div>';
  const threats=board.querySelector('[data-campaign-threats]'); if(threats)threats.innerHTML=c.threats.length?c.threats.map((t,i)=>campaignThreatCard(c,t,i)).join(''):'<div class="empty-small">Nenhuma ameaça na mesa.</div>';
  const history=board.querySelector('[data-campaign-history]'); if(history)history.innerHTML=c.rollHistory.slice(0,80).length?c.rollHistory.slice(0,80).map(x=>`<div class="campaign-v16-history-row"><span>${escapeHTML(x.time)}</span><b>${escapeHTML(x.participant)}</b><p>${escapeHTML(x.text)}</p></div>`).join(''):'<div class="empty-small">Nenhuma rolagem feita nesta campanha.</div>';
  const restore=()=>{if(activeCampaignPageId!==cid)return;window.scrollTo({left:scrollX,top:scrollY,behavior:'auto'});if(activeId){const el=$(activeId);if(el&&document.activeElement!==el){try{el.focus({preventScroll:true})}catch(_){el.focus()} if(selectionStart!==null&&'selectionStart' in el){try{el.setSelectionRange(selectionStart,selectionEnd)}catch(_){}}}}};
  restore(); requestAnimationFrame(restore); setTimeout(restore,0); if(options.toast)showToast(options.toast);
}
function createCampaignFromModal(){
  const name=$('campaignNameInput')?.value.trim();if(!name){showToast('Digite o nome da campanha.');return;}
  const c={id:uid(),name,code:Math.random().toString(36).slice(2,8).toUpperCase(),members:[],threats:[],rollHistory:[],initiatives:{},turnOrder:[],activeTurn:0,round:1,createdAt:Date.now()};campaigns.push(c);saveCampaigns();closeModal('campaignCreateModal');if($('campaignNameInput'))$('campaignNameInput').value='';renderCampaigns();openCampaign(c.id);showToast(`Campanha "${name}" criada.`);
}
function openCreateCampaign(){openModal('campaignCreateModal');setTimeout(()=>$('campaignNameInput')?.focus(),50);}

function renderCampaigns(){
  const listBox=$('campaignList');
  const pageBox=$('campaignPageRoot');
  const listHead=document.querySelector('#campaigns > .page-head');
  if(!listBox||!pageBox)return;

  if(activeCampaignPageId){
    const c=getCampaign(activeCampaignPageId);
    if(c){
      listBox.classList.add('hidden');
      pageBox.classList.remove('hidden');
      if(listHead)listHead.classList.add('hidden');
      if(!pageBox.querySelector(`[data-campaign-board="${CSS.escape(c.id)}"]`)){
        pageBox.innerHTML=renderCampaignBoard(c);
      }
      return;
    }
    activeCampaignPageId=null;
  }

  listBox.classList.remove('hidden');
  pageBox.classList.add('hidden');
  pageBox.innerHTML='';
  if(listHead)listHead.classList.remove('hidden');

  if(!campaigns.length){
    listBox.innerHTML='<div class="empty"><b>⚓</b><h3>Nenhuma campanha</h3><p>Crie a primeira mesa local.</p><button class="primary" onclick="openCreateCampaign()">＋ Criar campanha</button></div>';
    return;
  }

  listBox.innerHTML=campaigns.map(c=>`
    <article class="campaign-card campaign-list-card">
      <span class="eyebrow">CAMPANHA</span>
      <h3>${escapeHTML(c.name)}</h3>
      <p>Código <b>${escapeHTML(c.code)}</b></p>
      <div class="campaign-mini-stats">
        <span>👤 ${c.members.length}</span>
        <span>👹 ${c.threats.length}</span>
        <span>🎲 ${c.rollHistory.length}</span>
      </div>
      <div class="campaign-list-actions">
        <button type="button" class="primary" onclick="openCampaign('${escapeAttr(c.id)}')">⚓ Abrir campanha</button>
        <button type="button" class="secondary" onclick="openCampaignAddSelector('agent','${escapeAttr(c.id)}')">＋ Agente</button>
        <button type="button" class="secondary" onclick="openCampaignAddSelector('threat','${escapeAttr(c.id)}')">＋ Ameaça</button>
        <button type="button" class="delete" onclick="deleteCampaign('${escapeAttr(c.id)}')" title="Excluir campanha">×</button>
      </div>
    </article>`).join('');
}

function openCampaign(id){
  const c=getCampaign(id); if(!c)return;
  activeCampaignPageId=id; activeCampaignIdForRoll=id; returnCampaignId=null; closeAllModals();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); $('campaigns')?.classList.add('active');
  document.querySelectorAll('.mobile-bottom-nav button').forEach(btn=>btn.classList.toggle('active',btn.dataset.page==='campaigns'));
  renderCampaigns(); window.scrollTo({top:0,left:0,behavior:'auto'});
}
function closeCampaignPage(){activeCampaignPageId=null;activeCampaignIdForRoll=null;returnCampaignId=null;renderCampaigns();window.scrollTo({top:0,left:0,behavior:'auto'});}

function renderCampaignBoard(c){
  const entities=getCampaignEntities(c);const next=entities.find(e=>isCurrentTurn(c,e.key));
  return `<div class="campaign-v16-shell" data-campaign-board="${escapeAttr(c.id)}">
    <div class="campaign-v16-sticky"><div class="campaign-v16-sticky-inner"><div class="campaign-v16-title"><span class="eyebrow" data-campaign-round>MESA LOCAL • RODADA ${c.round}</span><h2 data-campaign-title>${escapeHTML(c.name)}</h2><p>Código da mesa: <b data-campaign-code>${escapeHTML(c.code)}</b></p></div><div class="campaign-v16-actions"><button type="button" class="secondary" onclick="openCampaignAddSelector('agent','${escapeAttr(c.id)}')">＋ Agente</button><button type="button" class="secondary" onclick="openCampaignAddSelector('threat','${escapeAttr(c.id)}')">＋ Ameaça</button><button type="button" class="secondary" onclick="closeCampaignPage()">← Campanhas</button></div></div></div>
    <div class="campaign-v16-body">
      <div class="campaign-v16-session"><div><span class="eyebrow">MESA LOCAL</span><h3>Painel do Mestre</h3><p>Controle turnos, PV, PE, Aura, ataques, habilidades, ameaças e histórico sem sair desta página.</p></div><div class="campaign-v16-code">🎟️ ${escapeHTML(c.code)}</div></div>
      <section class="campaign-v16-turn-panel"><div class="campaign-v16-turn-box" data-campaign-turn><span class="campaign-v16-turn-label">VEZ ATUAL</span><b>${escapeHTML(next?.name||'Defina a iniciativa')}</b><small>${next?`${next.type==='agent'?'Agente':'Ameaça'} • Iniciativa ${c.initiatives[next.key]??'—'}`:'Role a iniciativa de todos para começar.'}</small></div><div class="campaign-v16-main-actions"><button type="button" class="primary big" onclick="rollAllInitiatives('${escapeAttr(c.id)}')">🎲 Rolar iniciativas</button><button type="button" class="secondary big" onclick="passCampaignTurn('${escapeAttr(c.id)}')">▶ Passar turno</button><button type="button" class="secondary" onclick="resetCampaignTurn('${escapeAttr(c.id)}')">↻ Reiniciar</button></div></section>
      <section class="campaign-v16-order" data-campaign-order><div class="campaign-v16-order-title"><span class="eyebrow">ORDEM DE INICIATIVA</span><small>${entities.length} participante(s)</small></div>${entities.length?entities.map((e,i)=>`<div class="campaign-v16-init-chip ${isCurrentTurn(c,e.key)?'active':''}"><b>${i+1}</b><span>${escapeHTML(e.name)}</span><small>${c.initiatives[e.key]??'—'}</small></div>`).join(''):'<span class="muted">Adicione personagens e ameaças para montar a ordem.</span>'}</section>
      <section class="campaign-v16-section"><div class="campaign-v16-section-head"><div><span class="eyebrow">JOGADORES</span><h3>👥 Participantes</h3><p>Todos os controles ficam organizados no próprio cartão.</p></div><button type="button" class="secondary" onclick="openCampaignAddSelector('agent','${escapeAttr(c.id)}')">＋ Adicionar agente</button></div><div class="campaign-v16-grid" data-campaign-members>${c.members.length?c.members.map((m,i)=>campaignMemberCard(c,m,i)).join(''):'<div class="empty-small">Nenhum personagem na mesa.</div>'}</div></section>
      <section class="campaign-v16-section"><div class="campaign-v16-section-head"><div><span class="eyebrow">MESTRE</span><h3>👹 Ameaças</h3><p>Ataques e habilidades da ameaça ficam disponíveis como ações rápidas.</p></div><button type="button" class="secondary" onclick="openCampaignAddSelector('threat','${escapeAttr(c.id)}')">＋ Adicionar ameaça</button></div><div class="campaign-v16-grid" data-campaign-threats>${c.threats.length?c.threats.map((t,i)=>campaignThreatCard(c,t,i)).join(''):'<div class="empty-small">Nenhuma ameaça na mesa.</div>'}</div></section>
      <section class="campaign-v16-history"><div class="campaign-v16-history-head"><div><span class="eyebrow">DADOS DA CAMPANHA</span><h3>🎲 Histórico da mesa</h3><p>Somente rolagens desta campanha aparecem aqui.</p></div><button type="button" class="delete" onclick="clearCampaignHistory('${escapeAttr(c.id)}')">🗑 Apagar histórico</button></div><div data-campaign-history>${c.rollHistory.slice(0,80).length?c.rollHistory.slice(0,80).map(x=>`<div class="campaign-v16-history-row"><span>${escapeHTML(x.time)}</span><b>${escapeHTML(x.participant)}</b><p>${escapeHTML(x.text)}</p></div>`).join(''):'<div class="empty-small">Nenhuma rolagem feita nesta campanha.</div>'}</div></section>
    </div></div>`;
}
function campaignMemberCard(c,m,index){
  const a=normalizeAgent(m.agent),cc=calc(a),key='m:'+m.id,initiative=c.initiatives[key];
  const hpPct=cc.hpMax?clamp(a.hpCurrent/cc.hpMax*100,0,100):0,pePct=cc.peMax?clamp(a.peCurrent/cc.peMax*100,0,100):0;
  const actions=getCombatPowers(a); const quick=actions.length?actions.map(p=>`<button type="button" class="campaign-v16-power color-${escapeAttr(p.color||originColor(p.origin))}" onclick="campaignRollAgentPower('${escapeAttr(c.id)}',${index},'${escapeAttr(p.id)}')" title="Usar ${escapeAttr(p.name||'ação')}"><span>${p.source==='fruit'?'🍈':p.source==='weapon'?'⚔️':p.source==='haki'?'🟣':p.source==='race'?'🟡':'✦'}</span><b>${escapeHTML(p.name)}</b><small>${p.cost?`${p.cost} PE`:'Sem PE'}</small></button>`).join(''):'<span class="campaign-v16-empty-action">Nenhuma ação rápida disponível.</span>';
  const avatar=a.avatar?`<img src="${escapeAttr(a.avatar)}" alt="Avatar de ${escapeAttr(a.name)}" onclick="openThreatImageViewer('${escapeAttr(a.avatar)}')" onerror="this.style.display='none';this.parentElement.classList.add('image-failed')">`:'👤';
  return `<article class="campaign-v16-card ${isCurrentTurn(c,key)?'current-turn':''}">
    <div class="campaign-v16-card-head"><div class="campaign-v16-avatar">${avatar}</div><div class="campaign-v16-card-identity"><div class="campaign-v16-name-row"><h4>${escapeHTML(a.name||'Sem nome')}</h4><span class="campaign-v16-badge agent">AGENTE</span>${a.auraActive?'<span class="campaign-v16-status">🟢 AURA ATIVA</span>':''}</div><p>${escapeHTML(a.race||'Humano')} • Nível ${a.level} • Iniciativa ${initiative??'—'}</p><div class="campaign-v16-pills"><span>🛡️ DEF <b>${cc.defense}</b></span><span>🏃 MOV <b>${cc.movement}</b></span><span>💪 FOR <b>${attrTotal(a,'Força')}</b></span><span>🎯 DES <b>${attrTotal(a,'Destreza')}</b></span><span>🧠 INT <b>${attrTotal(a,'Inteligência')}</b></span><span>🧿 VON <b>${attrTotal(a,'Vontade')}</b></span></div></div></div>
    <div class="campaign-v16-resources"><div class="campaign-v16-resource hp"><div><span>❤️ PV</span><b>${a.hpCurrent}/${cc.hpMax}</b></div><div class="campaign-v16-track"><i style="width:${hpPct}%"></i></div></div><div class="campaign-v16-resource pe"><div><span>🔥 PE</span><b>${a.peCurrent}/${cc.peMax}</b></div><div class="campaign-v16-track"><i style="width:${pePct}%"></i></div></div></div>
    <div class="campaign-v16-controls"><div class="campaign-v16-resource-controls"><div class="campaign-v16-control-group"><strong>❤️ PV</strong><button type="button" class="mini-btn danger" onclick="campaignResource('${escapeAttr(c.id)}',${index},'hp',-1)" title="Perder 1 PV">−1</button><button type="button" class="mini-btn" onclick="campaignResource('${escapeAttr(c.id)}',${index},'hp',1)" title="Recuperar 1 PV">+1</button></div><div class="campaign-v16-control-group"><strong>🔥 PE</strong><button type="button" class="mini-btn danger" onclick="campaignResource('${escapeAttr(c.id)}',${index},'pe',-1)" title="Gastar 1 PE">−1</button><button type="button" class="mini-btn" onclick="campaignResource('${escapeAttr(c.id)}',${index},'pe',1)" title="Recuperar 1 PE">+1</button></div></div><div class="campaign-v16-button-row"><button type="button" class="secondary" onclick="toggleCampaignAura('${escapeAttr(c.id)}',${index})">${a.auraActive?'⏹ Desativar Aura':'🟢 Ativar Aura'}</button><button type="button" class="secondary" onclick="campaignRollInitiative('${escapeAttr(c.id)}','${escapeAttr(key)}')">🎲 Iniciativa</button><button type="button" class="secondary" onclick="openCampaignAgentSheet('${escapeAttr(c.id)}',${index})">📜 Ficha</button><button type="button" class="secondary" onclick="editCampaignAgent('${escapeAttr(c.id)}',${index})">✎ Editar</button><button type="button" class="secondary campaign-v16-danger" onclick="removeCampaignMember('${escapeAttr(c.id)}',${index})">🗑 Remover</button></div></div>
    <div class="campaign-v16-actions-area"><div class="campaign-v16-actions-title"><b>⚔️ Ações rápidas</b><small>Armas, Akuma no Mi, Haki, rituais e habilidades.</small></div><div class="campaign-v16-power-grid">${quick}</div></div>
  </article>`;
}
function campaignThreatCard(c,t,index){
  const key='t:'+t.id,initiative=c.initiatives[key],hpPct=t.hpMax?clamp(t.hpCurrent/t.hpMax*100,0,100):0;
  const actions=(t.abilities||[]).map((p,pi)=>`<button type="button" class="campaign-v16-power color-${escapeAttr(p.color||'vermelho')}" onclick="campaignRollThreat('${escapeAttr(c.id)}',${index},${pi})" title="Rolar ${escapeAttr(p.name||'ação')}"><span>🎲</span><b>${escapeHTML(p.name||'Ação')}</b><small>${p.cost?`${p.cost} PE`:'Sem PE'}</small></button>`).join('')||'<span class="campaign-v16-empty-action">Nenhuma ação cadastrada.</span>';
  const image=t.image?`<img src="${escapeAttr(t.image)}" alt="Imagem de ${escapeAttr(t.name)}" onclick="openThreatImageViewer('${escapeAttr(t.image)}')" onerror="this.style.display='none';this.parentElement.classList.add('image-failed')">`:'👹';
  return `<article class="campaign-v16-card threat ${isCurrentTurn(c,key)?'current-turn':''}"><div class="campaign-v16-card-head"><div class="campaign-v16-avatar threat">${image}</div><div class="campaign-v16-card-identity"><div class="campaign-v16-name-row"><h4>${escapeHTML(t.name||'Ameaça')}</h4><span class="campaign-v16-badge threat">AMEAÇA</span></div><p>Nível ${t.level} • ATK +${t.attack} • Iniciativa ${initiative??'—'}</p><div class="campaign-v16-pills"><span>❤️ PV <b>${t.hpCurrent}/${t.hpMax}</b></span><span>⚔️ AÇÕES <b>${t.abilities?.length||0}</b></span>${t.fruit?`<span>🍈 ${escapeHTML(t.fruit)}</span>`:''}</div></div></div><div class="campaign-v16-threat-resource"><div><span>❤️ PV</span><b>${t.hpCurrent}/${t.hpMax}</b></div><div class="campaign-v16-track red"><i style="width:${hpPct}%"></i></div></div><div class="campaign-v16-controls"><div class="campaign-v16-resource-controls"><div class="campaign-v16-control-group"><strong>❤️ PV</strong><button type="button" class="mini-btn danger" onclick="threatResource('${escapeAttr(c.id)}',${index},-1)" title="Perder 1 PV">−1</button><button type="button" class="mini-btn" onclick="threatResource('${escapeAttr(c.id)}',${index},1)" title="Recuperar 1 PV">+1</button></div></div><div class="campaign-v16-button-row"><button type="button" class="secondary" onclick="campaignRollInitiative('${escapeAttr(c.id)}','${escapeAttr(key)}')">🎲 Iniciativa</button><button type="button" class="secondary" onclick="openThreatFromCampaign('${escapeAttr(c.id)}',${index})">📜 Ficha</button><button type="button" class="secondary" onclick="editThreat('${escapeAttr(c.id)}',${index})">✎ Editar</button><button type="button" class="secondary campaign-v16-danger" onclick="removeCampaignThreat('${escapeAttr(c.id)}',${index})">🗑 Remover</button></div></div><div class="campaign-v16-actions-area"><div class="campaign-v16-actions-title"><b>⚔️ Ataques e habilidades</b><small>As cores seguem a ficha da ameaça.</small></div><div class="campaign-v16-power-grid">${actions}</div></div></article>`;
}
function campaignRollAgentPower(cid,index,powerId){
  const c=getCampaign(cid),m=c?.members[index];if(!m)return;
  const a=normalizeAgent(m.agent);const p=getCombatPowers(a).find(x=>x.id===powerId);if(!p){showToast('Ação não encontrada.');return;}
  const cost=num(p.cost);if(a.peCurrent<cost){showToast('🔥 PE insuficiente para usar esta ação.');return;}
  a.peCurrent-=cost;let test=null,success=true,detail=[];
  if(p.check){const match=String(p.check).match(/(\d*d\d+(?:[+-]\d+)?)/i);const expr=match?.[1]||'1d20';const d=rollExpression(expr);test=d.total;const attr=(p.attribute&&ATTRS.includes(p.attribute))?p.attribute:(String(p.check).match(/\+\s*(Força|Destreza|Constituição|Inteligência|Presença|Vontade)/)?.[1]||null);const mod=attr?attrTotal(a,attr):0;if(attr)test+=mod;detail.push(`Teste ${expr}${attr?` + ${mod}`:''} = ${test}`);if(p.successThreshold!=null){success=p.successMode==='menor-que'?test<p.successThreshold:test>=p.successThreshold;detail.push(success?'✅ sucesso':'❌ falhou');}}
  let damageText='';let damage=0;if(success&&p.damage){const d=rollExpression(p.damage);damage=d.total;damageText=`Dano ${damage} (${d.rolls.join(', ')})`;}else if(!success&&p.damage)damageText='Dano 0 — falhou';
  m.agent=normalizeAgent(a);campaignLog(c,a.name||'Agente',`${a.name||'Agente'} • ${p.name}: ${[test!==null?`teste ${test}`:'',damageText||'efeito executado'].filter(Boolean).join(' • ')}`);saveCampaigns();refreshCampaignView(cid);showRollResult(`👤 ${a.name||'Agente'} • ${p.name}`,test!==null?String(test):damageText||'Usado',`${cost?`-${cost} PE • `:''}${damageText||detail.join(' • ')||p.desc||'efeito ativado'}`);
}
function toggleCampaignAura(cid,index){
  const c=getCampaign(cid),m=c?.members[index];if(!m)return;const a=normalizeAgent(m.agent);if(!a.aura||a.aura==='Nenhuma'){showToast('Este personagem ainda não escolheu uma Aura.');return;}a.auraActive=!a.auraActive;a.auraSkipNext=false;m.agent=normalizeAgent(a);campaignLog(c,a.name||'Agente',`${a.name||'Agente'} • Aura ${a.auraActive?'ativada':'desativada'}.`);saveCampaigns();refreshCampaignView(cid);showToast(a.auraActive?'🟢 Aura ativada. Os bônus de atributo estão ativos.':'⚪ Aura desativada. Os bônus de atributo foram removidos.');
}

function removeCampaignMember(cid,index){const c=getCampaign(cid);if(!c?.members[index])return;if(!confirmAction(`Remover ${c.members[index].agent.name||'este agente'} da campanha?`))return;c.members.splice(index,1);c.initiatives={};c.turnOrder=[];c.activeTurn=0;saveCampaigns();refreshCampaignView(cid);}
function removeCampaignThreat(cid,index){const c=getCampaign(cid);if(!c?.threats[index])return;if(!confirmAction(`Remover ${c.threats[index].name} da campanha?`))return;c.threats.splice(index,1);c.initiatives={};c.turnOrder=[];c.activeTurn=0;saveCampaigns();refreshCampaignView(cid);}
function openThreatFromCampaign(cid,index){editThreat(cid,index);}

function openCampaignAgentSheet(cid,index){
  const c=getCampaign(cid);
  const m=c?.members[index];
  if(!m)return;
  const a=normalizeAgent(m.agent);
  activeCampaignIdForRoll=cid;
  const cc=calc(a);
  const avatar=a.avatar?`<img class="campaign-modal-avatar" src="${escapeAttr(a.avatar)}" alt="Avatar" onclick="openThreatImageViewer('${escapeAttr(a.avatar)}')">`:'👤';
  const powers=getCombatPowers(a);
  $('detailBody').innerHTML=`
    <div class="campaign-modal-sheet">
      <div class="campaign-modal-hero">
        <div>${avatar}</div>
        <div>
          <span class="eyebrow">FICHA NA CAMPANHA</span>
          <h2>${escapeHTML(a.name||'Sem nome')}</h2>
          <p>${escapeHTML(a.race||'Humano')} • Nível ${a.level} • ${escapeHTML((a.roles||[]).join(' / ')||'Sem cargo')}</p>
        </div>
      </div>
      <div class="campaign-modal-resource-grid">
        <div><span>❤️ PV</span><b>${a.hpCurrent}/${cc.hpMax}</b></div>
        <div><span>🔥 PE</span><b>${a.peCurrent}/${cc.peMax}</b></div>
        <div><span>🛡️ DEF</span><b>${cc.defense}</b></div>
        <div><span>🏃 MOV</span><b>${cc.movement}</b></div>
      </div>
      <h3>Atributos</h3>
      <div class="campaign-modal-attrs">${ATTRS.map(x=>`<span><b>${escapeHTML(x)}</b>${attrTotal(a,x)}</span>`).join('')}</div>
      <h3>Perícias</h3>
      <div class="campaign-modal-skills">${allSkills().map(x=>`<span>${escapeHTML(x[0])} <b>${skillTotal(a,x[0])}</b></span>`).join('')}</div>
      <h3>Ações rápidas</h3>
      <div class="campaign-modal-powers">${powers.length?powers.map(p=>`<button type="button" class="campaign-power-btn color-${escapeAttr(p.color||originColor(p.origin))}" onclick="campaignRollAgentPower('${escapeAttr(cid)}',${index},'${escapeAttr(p.id)}');closeModal('detailModal')"><span>${p.source==='fruit'?'🍈':p.source==='weapon'?'⚔️':p.source==='haki'?'🟣':'✦'}</span><b>${escapeHTML(p.name)}</b></button>`).join(''):'<span class="muted">Nenhuma ação disponível.</span>'}</div>
      <div class="row-actions detail-actions">
        <button type="button" class="primary" onclick="toggleCampaignAura('${escapeAttr(cid)}',${index});closeModal('detailModal')">${a.auraActive?'⏹ Desativar Aura':'🟢 Ativar Aura'}</button>
        <button type="button" class="secondary" onclick="closeModal('detailModal')">Fechar</button>
      </div>
    </div>`;
  openDetailModal();
}
function openCampaignAddSelector(kind,cid){
  campaignModalMode=kind;detailContext={campaignId:cid};$('campaignSelectorTitle').textContent=kind==='agent'?'Adicionar agente à campanha':'Adicionar ameaça à campanha';
  renderDirectCampaignPicker(kind,cid);openModal('campaignSelectorModal');
}
function openCampaignSelector(kind,id){
  campaignModalMode=kind;detailContext={entityId:id};$('campaignSelectorTitle').textContent='Escolha a campanha';
  renderCampaignSelector();openModal('campaignSelectorModal');
}
function renderCampaignSelector(){
  const box=$('campaignSelectorList');if(!box)return;if(!campaigns.length){box.innerHTML='<div class="empty-small">Crie uma campanha primeiro.</div>';return;}
  box.innerHTML=campaigns.map(c=>`<button class="campaign-select-card" onclick="campaignSelectorChoose('${escapeAttr(c.id)}')"><span>⚓</span><div><b>${escapeHTML(c.name)}</b><small>${c.members.length} agentes • ${c.threats.length} ameaças</small></div><strong>→</strong></button>`).join('');
}
function renderDirectCampaignPicker(kind,cid){
  const box=$('campaignSelectorList');if(!box)return;const c=getCampaign(cid);if(!c)return;
  if(kind==='agent'){
    const available=agents.filter(a=>!c.members.some(m=>m.agentId===a.id));
    box.innerHTML=available.length?available.map(a=>`<button class="campaign-select-card" onclick="directAddToCampaign('agent','${escapeAttr(cid)}','${escapeAttr(a.id)}')"><span>👤</span><div><b>${escapeHTML(a.name||'Sem nome')}</b><small>${escapeHTML(a.race)} • Nvl ${a.level}</small></div><strong>＋</strong></button>`).join(''):'<div class="empty-small">Todos os seus agentes já estão nesta campanha.</div>';
  }else{
    const available=allThreatEntries();box.innerHTML=available.map(e=>`<button class="campaign-select-card" onclick="directAddToCampaign('threat','${escapeAttr(cid)}','${escapeAttr(e.id)}')"><span>👹</span><div><b>${escapeHTML(e.name)}</b><small>${escapeHTML(e.data.desc)}</small></div><strong>＋</strong></button>`).join('');
  }
}
function directAddToCampaign(kind,cid,entityId){
  const c=getCampaign(cid);if(!c)return;
  if(kind==='agent'){const agent=agents.find(a=>a.id===entityId);if(!agent)return;if(c.members.some(m=>m.agentId===agent.id)){showToast('Esse agente já está na campanha.');return;}c.members.push({id:uid(),agentId:agent.id,agent:clone(agent)});showToast(`${agent.name} adicionado à ${c.name}.`);}
  else{const entry=allThreatEntries().find(e=>e.id===entityId);if(!entry)return;c.threats.push(makeCampaignThreat(entry.data));showToast(`${entry.name} adicionada à ${c.name}.`);}
  saveCampaigns();closeModal('campaignSelectorModal');refreshCampaignView(cid);
}
function campaignSelectorChoose(cid){
  const c=getCampaign(cid);if(!c)return;
  if(campaignModalMode==='agent'){
    const agentId=detailContext?.entityId;if(!agentId){showToast('Agente não selecionado.');return;}const agent=agents.find(x=>x.id===agentId);if(!agent)return;if(c.members.some(m=>m.agentId===agent.id)){showToast('Esse agente já está na campanha.');return;}c.members.push({id:uid(),agentId:agent.id,agent:clone(agent)});saveCampaigns();showToast(`${agent.name} adicionado à ${c.name}.`);
  }else{
    const threatId=detailContext?.entityId;const entry=threatId?allThreatEntries().find(x=>x.id===threatId):null;if(!entry){showToast('Ameaça não selecionada.');return;}c.threats.push(makeCampaignThreat(entry.data));saveCampaigns();showToast(`${entry.name} adicionada à ${c.name}.`);
  }
  closeModal('campaignSelectorModal');refreshCampaignView(cid);
}
function makeCampaignThreat(threat){const t=normalizeThreat(threat);t.id=uid();t.hpCurrent=t.hpMax;t.initiative=null;t.image=String(threat?.image||t.image||'');t.abilities=(t.abilities||[]).map(normalizePower);return t;}
function openCampaignAddSelectorAfter(kind,cid){openCampaignAddSelector(kind,cid);}
function allThreatEntries(){
  const built=THREATS.map((t,i)=>{const data=makeCampaignThreat({name:t[0],hpMax:t[1],attack:t[2],desc:t[3],level:1});data.id=`builtin-${i}-${t[0]}`;return {id:data.id,name:data.name,data};});
  const custom=(homebrew.threats||[]).map(t=>({id:t.id,name:t.name,data:t}));return [...built,...custom];
}
function makeThreatFromBuiltin(tuple){return makeCampaignThreat({name:tuple[0],hpMax:tuple[1],attack:tuple[2],desc:tuple[3],level:1});}
function campaignResource(cid,index,type,delta){const c=getCampaign(cid);const m=c?.members[index];if(!m)return;const a=normalizeAgent(m.agent);const cc=calc(a);const max=type==='hp'?cc.hpMax:cc.peMax;a[type+'Current']=clamp(num(a[type+'Current'])+delta,0,max);m.agent=a;saveCampaigns();refreshCampaignView(cid);}
function campaignRollInitiative(cid,key){const c=getCampaign(cid);if(!c)return;const e=getCampaignEntities(c).find(x=>x.key===key);if(!e)return;const attr=e.type==='agent'?calc(e.agent).initiative:num(e.threat.attack);const r=roll(20),total=r+attr;c.initiatives[key]=total;rebuildTurnOrder(c);campaignLog(c,e.name,`Iniciativa: d20 ${r} + ${attr} = ${total}`);saveCampaigns();refreshCampaignView(cid);showRollResult('Iniciativa',String(total),`${r} no d20 + ${attr}`);}
function rollAllInitiatives(cid){const c=getCampaign(cid);if(!c)return;const entities=getCampaignEntities(c);entities.forEach(e=>{const base=e.type==='agent'?calc(e.agent).initiative:num(e.threat.attack);const r=roll(20);const total=r+base;c.initiatives[e.key]=total;campaignLog(c,e.name,`Iniciativa: d20 ${r} + ${base} = ${total}`);});rebuildTurnOrder(c);c.round=1;c.activeTurn=0;campaignLog(c,'Mesa',`Ordem definida para ${entities.length} participante(s).`);saveCampaigns();refreshCampaignView(cid);showToast('Iniciativa de todos foi definida.');}
function getCampaignEntities(c){return [...c.members.map(m=>({key:`m:${m.id}`,type:'agent',name:m.agent.name||'Agente',agent:normalizeAgent(m.agent),member:m})),...c.threats.map(t=>({key:`t:${t.id}`,type:'threat',name:t.name,threat:t}))].sort((a,b)=>{const ai=c.initiatives[a.key];const bi=c.initiatives[b.key];if(ai==null&&bi==null)return 0;if(ai==null)return 1;if(bi==null)return-1;return bi-ai;});}
function rebuildTurnOrder(c){c.turnOrder=getCampaignEntities(c).map(e=>e.key);c.activeTurn=clamp(c.activeTurn,0,Math.max(0,c.turnOrder.length-1));}
function isCurrentTurn(c,key){return c.turnOrder[c.activeTurn]===key;}
function passCampaignTurn(cid){
  const c=getCampaign(cid);if(!c)return;if(!c.turnOrder.length){showToast('Role a iniciativa primeiro.');return;}
  c.activeTurn=(c.activeTurn+1)%c.turnOrder.length;if(c.activeTurn===0)c.round+=1;
  const key=c.turnOrder[c.activeTurn];const member=c.members.find(m=>`m:${m.id}`===key);let textValue=`Passou para ${getCampaignEntities(c).find(e=>e.key===key)?.name||key}.`;
  if(member){const result=auraTurnCheck(member.agent,member.agent.name,c);if(result)textValue+=' '+result.text;}
  campaignLog(c,'Mesa',textValue);saveCampaigns();refreshCampaignView(cid);showToast(textValue);
}
function resetCampaignTurn(cid){const c=getCampaign(cid);if(!c)return;c.initiatives={};c.turnOrder=[];c.activeTurn=0;c.round=1;saveCampaigns();refreshCampaignView(cid);}
function threatResource(cid,index,delta){const c=getCampaign(cid);const t=c?.threats[index];if(!t)return;t.hpCurrent=clamp(t.hpCurrent+delta,0,t.hpMax);saveCampaigns();refreshCampaignView(cid);}
function campaignRollThreat(cid,index,powerIndex=0){
  const c=getCampaign(cid);const t=c?.threats[index];if(!t)return;const p=(t.abilities||[])[powerIndex];if(!p)return;
  const r=rollThreatPower(p,t);const textValue=`${t.name} • ${p.name}: ${r.summary}`;campaignLog(c,t.name,textValue);saveCampaigns();refreshCampaignView(cid);showThreatRollResult(t.name,p,r);
}
function rollThreatPower(p,t){
  const cost=num(p.cost);let detail=[];let test=null;let success=true;
  if(p.check){const match=p.check.match(/(\d*d\d+(?:[+-]\d+)?)/i);const expr=match?.[1]||'1d20';const d=rollExpression(expr);test=d.total;const attr=(p.attribute&&ATTRS.includes(p.attribute))?p.attribute:(p.check.match(/\+\s*(Força|Destreza|Constituição|Inteligência|Presença|Vontade)/)?.[1]||null);const mod=attr?num(t.attributes?.[attr]):0;if(attr)test+=mod;detail.push(`Teste ${expr}${attr?` + ${mod}`:''} = ${test}`);if(p.successThreshold!=null){success=p.successMode==='menor-que'?test<p.successThreshold:test>=p.successThreshold;detail.push(success?'✅ sucesso':'❌ falhou');}}
  let damage=0,damageText='';if(success&&p.damage){const d=rollExpression(p.damage);damage=d.total;damageText=`Dano ${damage} (${d.rolls.join(', ')})`;}else if(p.damage)damageText='Dano 0 — falhou';
  return {test,damage,success,summary:[detail.join(' • '),damageText].filter(Boolean).join(' • '),detail};
}
function showThreatRollResult(name,p,r){showRollResult(`👹 ${name}`,r.test!==null?String(r.test):r.damage?String(r.damage):'Usado',`${p.name} • ${r.detail.join(' • ')||'ação executada'}${p.damage?` • ${r.damage} dano`:''}`);}
function editCampaignAgent(cid,index){
  const c=getCampaign(cid),m=c?.members[index]; if(!m)return; const a=normalizeAgent(m.agent);
  detailContext={campaignEditAgent:true,campaignId:cid,index};
  $('detailBody').innerHTML=`<span class="eyebrow">EDITAR AGENTE NA MESA</span><h2>✎ ${escapeHTML(a.name||'Sem nome')}</h2><p class="muted">Faça alterações rápidas sem abandonar a campanha.</p><div class="form-grid campaign-v16-edit-grid"><label>Nome<input id="caName" value="${escapeAttr(a.name)}" placeholder="Ex.: Monkey D. Luffy"></label><label>Nível<input id="caLevel" type="number" min="1" max="10" value="${a.level}"></label><label>PV atual<input id="caHP" type="number" min="0" value="${a.hpCurrent}"></label><label>PE atual<input id="caPE" type="number" min="0" value="${a.peCurrent}"></label></div><div class="row-actions detail-actions"><button type="button" class="primary" onclick="saveCampaignAgentQuickEdit()">💾 Salvar</button><button type="button" class="secondary" onclick="openCampaignAgentFullEditor()">🛠 Editor completo</button><button type="button" class="secondary" onclick="closeModal('detailModal')">Cancelar</button></div>`;
  openDetailModal();
}
function saveCampaignAgentQuickEdit(){
  const ctx=detailContext; if(!ctx?.campaignEditAgent)return; const c=getCampaign(ctx.campaignId),m=c?.members[ctx.index]; if(!m)return;
  const before=normalizeAgent(m.agent); const a=normalizeAgent({...before,name:$('caName').value.trim()||before.name,level:clamp(num($('caLevel').value,before.level),1,10),hpCurrent:Math.max(0,num($('caHP').value,before.hpCurrent)),peCurrent:Math.max(0,num($('caPE').value,before.peCurrent))});
  recalculateResourcesAfterProgress(before,a); m.agent=a; syncAgentChanges(a); saveCampaigns(); closeModal('detailModal'); refreshCampaignView(ctx.campaignId); showToast('✅ Agente atualizado na campanha.');
}
function openCampaignAgentFullEditor(){
  const ctx=detailContext; if(!ctx?.campaignEditAgent)return; const c=getCampaign(ctx.campaignId),m=c?.members[ctx.index]; if(!m)return;
  current=clone(normalizeAgent(m.agent)); editingId=current.id; returnCampaignId=ctx.campaignId; activeCampaignIdForRoll=ctx.campaignId; closeModal('detailModal'); beginEditor(current); go('create');
}
function chooseThreatImage(){const input=$('threatImageFile');if(input){input.value='';input.click();}}
function openThreatImageViewer(image){if(!image)return;$('avatarViewerImage').src=image;openModal('avatarViewerModal');}
function handleThreatImage(event){
  const file=event.target.files?.[0];
  if(!file||!threatEditBuffer)return;
  if(!/^image\/(png|jpe?g|webp)$/i.test(file.type)){showToast('Use PNG, JPG ou WEBP para a ameaça.');event.target.value='';return;}
  if(file.size>4*1024*1024){showToast('Imagem da ameaça acima de 4 MB.');event.target.value='';return;}
  compressImageFile(file,900,.80).then(data=>{threatEditBuffer.image=data;$('editThreatBody').innerHTML=renderThreatEditorBody(threatEditBuffer);showToast('👹 Imagem otimizada. Salve a ameaça para permanecer na campanha.');}).catch(()=>showToast('Não foi possível processar a imagem.'));event.target.value='';
}

function editThreat(cid,index){
  const c=getCampaign(cid),t=c?.threats[index];if(!t)return;
  threatEditingCampaignId=cid;threatEditingIndex=index;threatEditBuffer=normalizeThreat(t);
  $('editThreatTitle').textContent=`Editar ameaça: ${threatEditBuffer.name}`;
  $('editThreatBody').innerHTML=renderThreatEditorBody(threatEditBuffer);
  openModal('threatEditModal');
}
function renderThreatEditorBody(t){
  const attrs=ATTRS.map((a,i)=>`<label>${a}<input id="tea${i}" type="number" value="${num(t.attributes?.[a])}"></label>`).join('');
  const imageBlock=`<div class="threat-image-editor"><div class="threat-image-preview">${t.image?`<img src="${escapeAttr(t.image)}" alt="Imagem da ameaça" onclick="openThreatImageViewer('${escapeAttr(t.image)}')">`:'👹'}</div><div><b>Imagem da ameaça</b><p class="muted">Opcional. Clique na imagem para ampliar.</p><button class="secondary" onclick="chooseThreatImage()">📷 ${t.image?'Trocar imagem':'Adicionar imagem'}</button>${t.image?`<button class="secondary" onclick="threatEditBuffer.image='';$('editThreatBody').innerHTML=renderThreatEditorBody(threatEditBuffer)">🗑 Remover</button>`:''}</div></div>`;
  const powers=(t.abilities||[]).map((p,i)=>`<div class="threat-power-editor color-${p.color||'vermelho'}"><div class="threat-power-head"><b>Ação ${i+1}</b><button class="delete" onclick="removeThreatPowerDraft(${i})">×</button></div><div class="form-grid"><label>Nome<input data-tp="name" data-index="${i}" value="${escapeAttr(p.name)}"></label><label>Tipo<select data-tp="type" data-index="${i}">${['Ataque','Habilidade','Defesa','Utilidade','Suporte','Ritual'].map(v=>`<option ${v===p.type?'selected':''}>${v}</option>`).join('')}</select></label><label>Custo PE<input data-tp="cost" data-index="${i}" type="number" value="${p.cost||0}"></label><label>Atributo<select data-tp="attribute" data-index="${i}">${[...ATTRS,'Sem teste'].map(v=>`<option ${v===p.attribute?'selected':''}>${v}</option>`).join('')}</select></label><label>Teste<input data-tp="check" data-index="${i}" value="${escapeAttr(p.check||'1d20')}"></label><label>Dano<input data-tp="damage" data-index="${i}" value="${escapeAttr(p.damage||'')}"></label><label>Limiar d100 <span class="field-help">Ex.: 80 significa sucesso em 80–100</span><input data-tp="threshold" data-index="${i}" type="number" min="1" max="100" value="${p.successThreshold??''}"></label><label>Alcance<input data-tp="range" data-index="${i}" value="${escapeAttr(p.range||'')}"></label><label>Cor<select data-tp="color" data-index="${i}">${['amarelo','azul','verde','vermelho','roxo','rosa','cinza'].map(v=>`<option ${v===(p.color||'vermelho')?'selected':''}>${v}</option>`).join('')}</select></label><label class="wide">Descrição<textarea data-tp="desc" data-index="${i}">${escapeHTML(p.desc||'')}</textarea></label></div></div>`).join('');
  return `${imageBlock}<div class="form-grid threat-base-editor"><label>Nome<input id="teName" value="${escapeAttr(t.name)}"></label><label>PV máximo<input id="teHP" type="number" value="${t.hpMax}"></label><label>PV atual<input id="teCur" type="number" value="${t.hpCurrent}"></label><label>Ataque base<input id="teAtk" type="number" value="${t.attack}"></label><label>Nível<input id="teLvl" type="number" min="1" max="10" value="${t.level}"></label><label>Fruta / poder principal<input id="teFruit" value="${escapeAttr(t.fruit||'')}" placeholder="Ex.: Mera Mera no Mi"></label><label class="wide">Itens / equipamentos<input id="teItems" value="${escapeAttr((t.items||[]).map(x=>x.name||'').join(', '))}" placeholder="Ex.: espada, pistola, 7 balas"><span class="field-help">Separe por vírgulas. Use o editor de ações abaixo para transformar isso em ataques.</span></label><label class="wide">Descrição<textarea id="teDesc">${escapeHTML(t.desc||'')}</textarea></label></div><div class="quick-attribute-grid threat-attributes">${attrs}</div><div class="threat-powers-header"><div><h3>Ataques e habilidades</h3><p class="muted">Você pode criar quantas ações quiser. Cada uma pode ter teste, dano, custo de PE, limiar de d100 e cor.</p></div><button class="secondary" onclick="addThreatPowerDraft()">＋ Adicionar ação</button></div><div id="threatPowerDrafts">${powers}</div><div class="threat-edit-savebar"><div><b>Alterações desta ameaça</b><small>Salve para manter tudo, inclusive imagem e ações.</small></div><button class="primary" onclick="saveThreatEdit('${escapeAttr(threatEditingCampaignId)}',${threatEditingIndex})">💾 Salvar ameaça</button><button class="secondary" onclick="closeModal('threatEditModal')">Cancelar</button></div>`;
}
function readThreatPowerDrafts(){
  if(!threatEditBuffer)return [];
  const root=$('editThreatBody');
  const list=clone(threatEditBuffer.abilities||[]);
  if(root){
    root.querySelectorAll('[data-tp]').forEach(el=>{
      const i=num(el.dataset.index,-1);
      if(i<0||!list[i])return;
      const k=el.dataset.tp;
      if(k==='threshold')list[i].successThreshold=el.value===''?null:clamp(num(el.value),1,100);
      else if(k==='cost')list[i].cost=Math.max(0,num(el.value));
      else if(k==='level')list[i].level=clamp(num(el.value,1),1,10);
      else list[i][k]=el.value;
    });
  }
  threatEditBuffer.abilities=list.map(normalizePower);
  return clone(threatEditBuffer.abilities);
}
function addThreatPowerDraft(){
  if(!threatEditBuffer)return;
  readThreatPowerDrafts();
  const next=threatEditBuffer.abilities.length+1;
  threatEditBuffer.abilities.push(normalizePower({
    id:uid(),name:`Nova ação ${next}`,origin:'Ameaça',level:threatEditBuffer.level,cost:0,
    attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',
    desc:'Descreva exatamente como esta ação funciona.',color:'vermelho'
  }));
  $('editThreatBody').innerHTML=renderThreatEditorBody(threatEditBuffer);
  showToast('⚔️ Nova ação criada. Configure e clique em Salvar ameaça.');
}
function removeThreatPowerDraft(index){
  if(!threatEditBuffer)return;
  readThreatPowerDrafts();
  if(threatEditBuffer.abilities.length<=1){showToast('A ameaça precisa ter pelo menos uma ação.');return;}
  threatEditBuffer.abilities.splice(index,1);
  $('editThreatBody').innerHTML=renderThreatEditorBody(threatEditBuffer);
}
function saveThreatEdit(cid,index){
  const c=getCampaign(cid),t=c?.threats[index];if(!t)return;
  const powers=readThreatPowerDrafts();
  const rawItems=String($('teItems')?.value||'').split(',').map(v=>v.trim()).filter(Boolean);
  t.name=$('teName').value.trim()||'Ameaça';
  t.hpMax=Math.max(1,num($('teHP').value));
  t.hpCurrent=clamp(num($('teCur').value),0,t.hpMax);
  t.attack=num($('teAtk').value);
  t.level=clamp(num($('teLvl').value,1),1,10);
  t.fruit=$('teFruit').value.trim();
  t.image=String(threatEditBuffer?.image ?? t.image ?? '');
  t.items=rawItems.map(name=>normalizeItem({id:uid(),name,type:'Especial',origin:'Ameaça'}));
  t.desc=$('teDesc').value.trim();
  t.attributes=Object.fromEntries(ATTRS.map((a,i)=>[a,clamp(num($('tea'+i)?.value),-2,20)]));
  t.abilities=powers.length?powers:[normalizePower({name:'Ataque básico',origin:'Ameaça',level:t.level,check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:'Ataque básico da ameaça.',color:'vermelho'})];
  t.powers=t.abilities;
  t=normalizeThreat(t);
  c.threats[index]=t;
  saveCampaigns();closeModal('threatEditModal');refreshCampaignView(cid);showToast('👹 Ameaça atualizada.');
}
function clearCampaignHistory(cid){const c=getCampaign(cid);if(!c)return;if(!confirmAction('Apagar todo o histórico de dados desta campanha?'))return;c.rollHistory=[];saveCampaigns();refreshCampaignView(cid);}
function deleteCampaign(id){const c=getCampaign(id);if(!c)return;if(!confirmAction(`Excluir a campanha "${c.name}"?`))return;campaigns=campaigns.filter(x=>x.id!==id);if(activeCampaignPageId===id)activeCampaignPageId=null;if(activeCampaignIdForRoll===id)activeCampaignIdForRoll=null;saveCampaigns();renderCampaigns();showToast('Campanha excluída.');}
function previewThreatById(id){const entry=allThreatEntries().find(x=>x.id===id);if(!entry)return;const t=entry.data;const actions=(t.abilities||[]).map(p=>`<div class="power-card color-${p.color||'vermelho'}"><div><b>${escapeHTML(p.name)}</b><small>${p.cost||0} PE • ${escapeHTML(p.check||'Sem teste')}${p.damage?` • 💥 ${escapeHTML(p.damage)}`:''}</small><p>${escapeHTML(p.desc||'')}</p></div></div>`).join('');$('detailBody').innerHTML=`<span class="eyebrow">FICHA DE AMEAÇA</span><h2>${t.image?'🖼️':'👹'} ${escapeHTML(t.name)}</h2>${t.image?`<img class="threat-detail-image" src="${escapeAttr(t.image)}" alt="Imagem de ${escapeAttr(t.name)}" onclick="openThreatImageViewer('${escapeAttr(t.image)}')">`:''}<div class="threat-sheet"><div class="threat-stat-big"><b>${t.hpMax}</b><small>PV</small></div><div class="threat-stat-big"><b>+${t.attack}</b><small>ATAQUE</small></div><div class="threat-stat-big"><b>${t.level}</b><small>NÍVEL</small></div></div><p>${escapeHTML(t.desc)}</p>${t.fruit?`<div class="info"><b>🍈 Fruta / poder principal:</b> ${escapeHTML(t.fruit)}</div>`:''}<h3>Ataques e habilidades</h3>${actions||'<div class="empty-small">Nenhuma ação cadastrada.</div>'}<div class="row-actions"><button class="primary" onclick="openCampaignSelector('threat','${escapeAttr(entry.id)}');closeModal('detailModal')">＋ Adicionar a uma campanha</button><button class="secondary" onclick="closeModal('detailModal')">Fechar</button></div>`;openDetailModal();}

/* ------------------------- HOMEBREW ------------------------- */
function renderHomebrew(){
  const box=$('homebrewRoot');if(!box)return;
  const tabs=[['abilities','✨ Habilidades'],['items','🎒 Itens'],['rituals','📜 Rituais'],['attacks','⚔️ Ataques'],['threats','👹 Ameaças']];
  box.innerHTML=`<div class="homebrew-shell"><div class="homebrew-nav">${tabs.map(x=>`<button class="${homebrewTab===x[0]?'active':''}" onclick="homebrewTab='${x[0]}';renderHomebrew()">${x[1]}</button>`).join('')}</div><div class="homebrew-content"><div class="page-head"><div><span class="eyebrow">CRIAÇÃO</span><h2>Homebrew</h2><p class="muted">Tudo que você criar aqui fica salvo neste navegador e passa a aparecer nas bibliotecas.</p></div><button class="primary" onclick="openHomebrewCreate('${homebrewTab}')">＋ Criar ${homebrewLabel(homebrewTab)}</button></div><div class="homebrew-grid">${(homebrew[homebrewTab]||[]).length?(homebrew[homebrewTab]||[]).map((x,i)=>homebrewCard(x,homebrewTab,i)).join(''):'<div class="empty"><b>🧪</b><h3>Nada criado ainda</h3><p>Crie o primeiro conteúdo nesta categoria.</p></div>'}</div></div></div>`;
}
function homebrewCard(x,type,index){return `<article class="homebrew-card color-${x.color||originColor(x.origin)}"><span class="library-kind homebrew">HOMEBREW</span><h3>${escapeHTML(x.name)}</h3><p>${escapeHTML(x.desc||'')}</p>${type==='items'?`<small>${escapeHTML(x.type)}</small>`:`<small>Nvl ${x.level||1} • ${x.cost||0} PE</small>`}<div class="agent-actions"><button class="secondary" onclick="openHomebrewEdit('${type}',${index})">✎ Editar</button><button class="delete" onclick="deleteHomebrew('${type}',${index})">×</button></div></article>`;}
function openHomebrewCreate(type){
  detailContext={homebrew:true,type,index:-1,threatDraft:[],threatData:{}};
  $('homebrewEditTitle').textContent=`Criar ${homebrewLabel(type)}`;
  renderHomebrewEditBody(type,{});
  openModal('homebrewEditModal');
}
function openHomebrewEdit(type,index){
  const x=homebrew[type][index];
  detailContext={homebrew:true,type,index,threatDraft:type==='threats'?clone((x.abilities||[]).map(normalizePower)):[],threatData:clone(x)};
  $('homebrewEditTitle').textContent=`Editar ${homebrewLabel(type)}`;
  renderHomebrewEditBody(type,x);
  openModal('homebrewEditModal');
}
function homebrewLabel(type){return ({abilities:'habilidade',items:'item',rituals:'ritual',attacks:'ataque',threats:'ameaça'})[type]||'conteúdo';}
function homebrewThreatPowersDraft(){
  const currentDraft=detailContext?.threatDraft;
  return Array.isArray(currentDraft)?currentDraft:[];
}
function readHomebrewThreatPowersDraft(){
  const list=clone(homebrewThreatPowersDraft());
  const root=$('homebrewEditBody');
  if(!root)return list.map(normalizePower);
  root.querySelectorAll('[data-hbtp]').forEach(el=>{
    const i=num(el.dataset.index,-1);
    if(i<0||!list[i])return;
    const k=el.dataset.hbtp;
    if(k==='threshold')list[i].successThreshold=el.value===''?null:clamp(num(el.value),1,100);
    else if(k==='cost')list[i].cost=Math.max(0,num(el.value));
    else list[i][k]=el.value;
  });
  return list.map(normalizePower);
}
function addHomebrewThreatPowerDraft(){
  detailContext.threatDraft=readHomebrewThreatPowersDraft();
  const n=detailContext.threatDraft.length+1;
  detailContext.threatDraft.push(normalizePower({id:uid(),name:`Nova ação ${n}`,origin:'Ameaça • Homebrew',level:num($('hbLevel')?.value,1),cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:'Descreva exatamente como esta ação funciona.',color:'rosa'}));
  renderHomebrewEditBody('threats',{...detailContext.threatData,abilities:detailContext.threatDraft});
  showToast('⚔️ Nova ação criada. Configure e salve a ameaça.');
}
function removeHomebrewThreatPowerDraft(index){
  detailContext.threatDraft=readHomebrewThreatPowersDraft();
  if(detailContext.threatDraft.length<=1){showToast('A ameaça precisa ter pelo menos uma ação.');return;}
  detailContext.threatDraft.splice(index,1);
  renderHomebrewEditBody('threats',{...detailContext.threatData,abilities:detailContext.threatDraft});
}
function renderHomebrewEditBody(type,x){
  if(type==='threats'){
    const powers=Array.isArray(detailContext?.threatDraft)?detailContext.threatDraft:(x.abilities||[]).map(normalizePower);
    detailContext.threatDraft=clone(powers);
    detailContext.threatData=clone(x||{});
    const actions=powers.map((p,i)=>`<div class="threat-power-editor color-${p.color||'rosa'}"><div class="threat-power-head"><b>Ação ${i+1}</b><button class="delete" onclick="removeHomebrewThreatPowerDraft(${i})">×</button></div><div class="form-grid"><label>Nome<input data-hbtp="name" data-index="${i}" value="${escapeAttr(p.name)}"></label><label>Tipo<select data-hbtp="type" data-index="${i}">${['Ataque','Habilidade','Defesa','Utilidade','Suporte','Ritual'].map(v=>`<option ${v===p.type?'selected':''}>${v}</option>`).join('')}</select></label><label>Custo PE<input data-hbtp="cost" data-index="${i}" type="number" min="0" value="${p.cost||0}"></label><label>Atributo<select data-hbtp="attribute" data-index="${i}">${[...ATTRS,'Sem teste'].map(v=>`<option ${v===p.attribute?'selected':''}>${v}</option>`).join('')}</select></label><label>Teste<input data-hbtp="check" data-index="${i}" value="${escapeAttr(p.check||'')}" placeholder="1d20 + Força"></label><label>Dano<input data-hbtp="damage" data-index="${i}" value="${escapeAttr(p.damage||'')}" placeholder="1d8"></label><label>Limiar d100<input data-hbtp="threshold" data-index="${i}" type="number" min="1" max="100" value="${p.successThreshold??''}"></label><label>Alcance<input data-hbtp="range" data-index="${i}" value="${escapeAttr(p.range||'')}"></label><label>Cor<select data-hbtp="color" data-index="${i}">${['amarelo','azul','verde','vermelho','roxo','rosa','cinza'].map(v=>`<option ${v===(p.color||'rosa')?'selected':''}>${v}</option>`).join('')}</select></label><label class="wide">Descrição<textarea data-hbtp="desc" data-index="${i}">${escapeHTML(p.desc||'')}</textarea></label></div></div>`).join('');
    $('homebrewEditBody').innerHTML=`<div class="form-grid"><label>Nome<input id="hbName" value="${escapeAttr(x.name||'')}" placeholder="Ex.: Dragão de Ferro"></label><label>PV máximo<input id="hbHP" type="number" value="${x.hpMax||20}"></label><label>Ataque base<input id="hbAtk" type="number" value="${x.attack||5}"></label><label>Nível<input id="hbLevel" type="number" min="1" max="10" value="${x.level||1}"></label><label class="wide">Fruta / poder principal<input id="hbFruit" value="${escapeAttr(x.fruit||'')}" placeholder="Ex.: Mera Mera no Mi"></label><label class="wide">Descrição<textarea id="hbDesc">${escapeHTML(x.desc||'')}</textarea></label></div><div class="threat-powers-header"><div><h3>Ataques e habilidades da ameaça</h3><p class="muted">Crie quantas ações precisar. Elas serão salvas junto da ameaça e aparecerão quando ela for adicionada a uma campanha.</p></div><button class="secondary" onclick="addHomebrewThreatPowerDraft()">＋ Adicionar ação</button></div><div id="homebrewThreatPowers">${actions}</div><button class="primary full" onclick="saveHomebrewEntry('threats',${detailContext.index})">💾 Salvar ameaça</button>`;
    return;
  }
  $('homebrewEditBody').innerHTML=`<div class="form-grid"><label>Nome<input id="hbName" value="${escapeAttr(x.name||'')}" placeholder="Ex.: Escudo de Fogo"></label>${type==='items'?`<label>Categoria<select id="hbType">${['Arma','Armadura','Consumível','Ferramenta','Navegação','Comunicação','Conhecimento','Munição','Especial'].map(v=>`<option ${v===(x.type||'Especial')?'selected':''}>${v}</option>`).join('')}</select></label>`:`<label>Nível<input id="hbLevel" type="number" min="1" max="10" value="${x.level||1}"></label><label>Custo de PE<input id="hbCost" type="number" min="0" value="${x.cost||0}"></label><label>Cor<select id="hbColor">${[['amarelo','Amarelo — Raça'],['azul','Azul — Cargo'],['verde','Verde — Especial'],['vermelho','Vermelho — Fruta'],['roxo','Roxo — Haki'],['rosa','Rosa — Homebrew'],['cinza','Cinza — Geral']].map(v=>`<option value="${v[0]}" ${(x.color||'rosa')===v[0]?'selected':''}>${v[1]}</option>`).join('')}</select></label>`}${type==='attacks'?`<label>Atributo<select id="hbAttribute">${[...ATTRS,'Sem teste'].map(v=>`<option ${v===(x.attribute||'Força')?'selected':''}>${v}</option>`).join('')}</select></label><label>Teste<input id="hbCheck" value="${escapeAttr(x.check||'') }" placeholder="1d20 + Força"></label><label>Dano<input id="hbDamage" value="${escapeAttr(x.damage||'')}" placeholder="1d8"></label>`:''}${type==='items'?`<label>Bônus<input id="hbBonus" value="${escapeAttr(x.bonus||'')}" placeholder="Ex.: +2 Defesa"></label><label>Efeito<input id="hbEffect" value="${escapeAttr(x.effect||'')}"></label>`:''}<label class="wide">Descrição<textarea id="hbDesc" placeholder="Explique completamente o conteúdo.">${escapeHTML(x.desc||'')}</textarea></label></div><button class="primary full" onclick="saveHomebrewEntry('${type}',${detailContext.index})">💾 Salvar</button>`;
}
function saveHomebrewEntry(type,index){
  const name=$('hbName').value.trim();
  if(!name){showToast('Digite um nome.');return;}
  let item={id:index>=0?homebrew[type][index].id:uid(),name,desc:$('hbDesc')?.value.trim()||'',origin:'Homebrew'};
  if(type==='threats'){
    const powers=readHomebrewThreatPowersDraft();
    item=normalizeThreat({...item, name, desc:item.desc, hpMax:Math.max(1,num($('hbHP').value,20)), hpCurrent:Math.max(1,num($('hbHP').value,20)), attack:num($('hbAtk').value,5), level:clamp(num($('hbLevel').value,1),1,10), fruit:$('hbFruit')?.value.trim()||'', abilities:powers, powers:powers});
  }else if(type==='items')item=normalizeItem({...item,type:$('hbType').value,bonus:$('hbBonus').value.trim(),effect:$('hbEffect').value.trim(),origin:'Homebrew'});
  else if(type==='attacks')item=normalizePower({...item,level:clamp(num($('hbLevel').value,1),1,10),cost:num($('hbCost').value),color:$('hbColor').value,attribute:$('hbAttribute').value,check:$('hbCheck').value.trim()||`1d20 + ${$('hbAttribute').value}`,damage:$('hbDamage').value.trim(),type:'Ataque'});
  else item=normalizePower({...item,level:clamp(num($('hbLevel').value,1),1,10),cost:num($('hbCost').value),color:$('hbColor').value});
  if(index<0)homebrew[type].push(item);else homebrew[type][index]=item;
  homebrew=normalizeHomebrew(homebrew);
  saveHomebrew();
  closeModal('homebrewEditModal');
  renderHomebrew();
  showToast(`${name} salvo no Homebrew.`);
}
function deleteHomebrew(type,index){if(!confirmAction('Apagar este conteúdo Homebrew?'))return;homebrew[type].splice(index,1);saveHomebrew();renderHomebrew();}

/* ------------------------- MODAIS AUXILIARES ------------------------- */
function localLogin(){const user=$('username')?.value.trim();if(!user){showToast('Digite um nome.');return;}localStorage.setItem(STORAGE.user,user);$('accountButton').textContent=user;closeModal('loginModal');showToast(`Bem-vindo, ${user}!`);}
function openSkillHelp(name){const description=SKILL_HELP[name]||'Use 1d20 + o atributo indicado.';$('detailBody').innerHTML=`<span class="eyebrow">COMO FUNCIONA</span><h2>🎯 ${escapeHTML(name)}</h2><p class="detail-description">${escapeHTML(description)}</p><div class="detail-rules"><b>Teste padrão</b><p>Role 1d20 e some o atributo mostrado na ficha. Se a perícia tiver treino ou bônus de raça/cargo, some esses valores também. O Mestre compara com a dificuldade da cena.</p></div><button class="primary full" onclick="closeModal('detailModal')">Fechar</button>`;openDetailModal();}
function openCustomDice(){openModal('diceModal');setTimeout(()=>$('customDiceInput')?.focus(),50);}
function performCustomDice(){const value=$('customDiceInput').value.trim();const result=rollExpression(value);if(!parseDice(value)){showToast('Use formatos como 1d20, 2d6+3 ou 3d8-1.');return;}showRollResult(value,String(result.total),`Dados: ${result.rolls.join(', ')}`);saveRollForContext(current?.name||'Rolagem',`${current?.name||'Rolagem'} • ${value} = ${result.total}`);closeModal('diceModal');}
function dismissDiceResult(){$('diceResult')?.classList.add('hidden');}
function openThreatHomebrewFromPage(){homebrewTab='threats';go('homebrew');}

/* ------------------------- INICIALIZAÇÃO ------------------------- */
async function setupPWA(){
  if('serviceWorker' in navigator){
    try{
      const registrations=await navigator.serviceWorker.getRegistrations();
      for(const reg of registrations){try{await reg.update()}catch(_){}}
      const reg=await navigator.serviceWorker.register('./sw.js?v=25');
      try{await reg.update()}catch(_){}
      if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
      if(!sessionStorage.getItem('weirdRpgSwV16')){
        navigator.serviceWorker.addEventListener('controllerchange',()=>{sessionStorage.setItem('weirdRpgSwV16','1');if(!window.__weirdRpgReloading){window.__weirdRpgReloading=true;location.reload();}},{once:true});
      }
    }catch(_){}
  }
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;showInstallButton(true);});
  window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;showInstallButton(true);showToast('📱 WEIRD RPG instalado no aparelho!');});
}
function showInstallButton(show){const b=$('installButton');if(!b)return;b.classList.remove('hidden');b.title=deferredInstallPrompt?'Instalar WEIRD RPG no celular':'Ver como instalar WEIRD RPG no celular';}
async function installPWA(){
  if(!deferredInstallPrompt){openModal('installHelpModal');return;}
  deferredInstallPrompt.prompt();const result=await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;showInstallButton(false);if(result.outcome==='accepted')showToast('📱 Instalação iniciada.');
}
function initialize(){
  const prefs=loadJSON(STORAGE.prefs,{});applyColorTheme(prefs.color||'escuro');
  const user=localStorage.getItem(STORAGE.user);if(user&&$('accountButton'))$('accountButton').textContent=user;
  agents=ensureUniqueIds(agents.map(normalizeAgent));saveAgents();homebrew=normalizeHomebrew(homebrew);saveHomebrew();campaigns=campaigns.map(normalizeCampaign);saveCampaigns();
  $('avatarFile')?.addEventListener('change',handleAvatar);
  $('importFile')?.addEventListener('change',handleImport);
  $('threatImageFile')?.addEventListener('change',handleThreatImage);
  $('librarySearch')?.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal('libraryModal');});
  document.addEventListener('click',e=>{if(e.target.classList.contains('modal'))e.target.classList.add('hidden');});
  setupPWA();renderAgents();renderThreats();renderCampaigns();renderHomebrew();showInstallButton(true);
}

window.addEventListener('DOMContentLoaded',initialize);
/* ============================================================
   WEIRD RPG V17 — CORREÇÕES E EXPANSÕES
   Este bloco fica no final do script.js para sobrescrever funções
   antigas sem apagar a estrutura principal do projeto.
   ============================================================ */

/* ---------- HOME BREW: FRUTAS ---------- */
const V17_LEGACY_NORMALIZE_HOME_BREW = typeof normalizeHomebrew === 'function' ? normalizeHomebrew : null;
const V17_LEGACY_RENDER_HOME_BREW = typeof renderHomebrew === 'function' ? renderHomebrew : null;
const V17_LEGACY_SAVE_HOME_BREW_ENTRY = typeof saveHomebrewEntry === 'function' ? saveHomebrewEntry : null;
const V17_LEGACY_RENDER_LIBRARY = typeof renderLibrary === 'function' ? renderLibrary : null;
const V17_LEGACY_OPEN_DETAIL = typeof openDetail === 'function' ? openDetail : null;
const V17_LEGACY_FRUIT_POWER_OPTIONS = typeof fruitPowerOptions === 'function' ? fruitPowerOptions : null;
const V17_LEGACY_RENDER_FRUIT_LEVEL = typeof renderFruitLevel === 'function' ? renderFruitLevel : null;
const V17_LEGACY_CALC = typeof calc === 'function' ? calc : null;

function defaultHomebrew(){
  return {abilities:[],items:[],rituals:[],attacks:[],rituals:[],threats:[],fruits:[]};
}

function normalizeCustomFruit(raw={}){
  const f=normalizeFruit(raw);
  f.id=f.id||uid();
  f.name=text(f.name)||'Akuma no Mi Homebrew';
  f.type=text(f.type)||'Paramecia';
  f.desc=text(f.desc);
  f.balance=text(f.balance)||'Use custos de PE, limites de nível e consequências definidos pelo Mestre.';
  f.starterPowers=Array.isArray(f.starterPowers)?f.starterPowers.slice(0,5).map((p,i)=>normalizePower({...p,id:p?.id||uid(),source:'fruit',sourceId:p?.sourceId||p?.id||`starter-${i}`,origin:'Akuma no Mi',color:'vermelho',level:1,type:p?.type||'Ataque'})):[];
  f.levels={};
  const rawLevels=raw?.levels&&typeof raw.levels==='object'?raw.levels:{};
  for(let level=2;level<=10;level++){
    const arr=Array.isArray(rawLevels[level])?rawLevels[level]:(Array.isArray(f.levels?.[level])?f.levels[level]:[]);
    if(arr.length) f.levels[level]=arr.slice(0,3).map((p,i)=>normalizePower({...p,id:p?.id||uid(),source:'fruit',sourceId:p?.sourceId||p?.id||`level-${level}-${i}`,origin:'Akuma no Mi',color:'vermelho',level,type:p?.type||'Habilidade'}));
  }
  f.specialUnlocks=Array.isArray(raw?.specialUnlocks)?raw.specialUnlocks.map(x=>String(x).trim()).filter(Boolean):String(raw?.specialUnlocks||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  return f;
}

function normalizeHomebrew(raw){
  const h={...defaultHomebrew(),...(raw||{})};
  h.abilities=Array.isArray(raw?.abilities)?raw.abilities.map(normalizePower):[];
  h.items=Array.isArray(raw?.items)?raw.items.map(normalizeItem):[];
  h.rituals=Array.isArray(raw?.rituals)?raw.rituals.map(normalizePower):[];
  h.attacks=Array.isArray(raw?.attacks)?raw.attacks.map(normalizePower):[];
  h.threats=Array.isArray(raw?.threats)?raw.threats.map(normalizeThreat):[];
  h.fruits=Array.isArray(raw?.fruits)?raw.fruits.map(normalizeCustomFruit):[];
  return h;
}

function fruitLibraryKey(fruit,index){return fruit.id||`builtin-fruit-${String(fruit.name||index).replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase()}`;}
function allFruitEntries(){
  const built=(LIB.fruits||[]).map((f,i)=>({id:fruitLibraryKey(f,i),data:normalizeFruit(f),homebrew:false}));
  const custom=(homebrew.fruits||[]).map(f=>({id:f.id,data:normalizeCustomFruit(f),homebrew:true}));
  return [...built,...custom];
}
function mergedLibrary(type){
  if(type==='races')return Object.entries(RACES).map(([name,data])=>({name,type:'Raça',desc:data.desc,b:data.b,skills:data.skills,abilities:data.abilities,evolution:raceEvolutionData(name)}));
  if(type==='roles')return LIB.roles;
  if(type==='fruits')return allFruitEntries().map(x=>({...x.data,id:x.id,__homebrew:x.homebrew}));
  if(type==='haki')return [...HAKI.observacao,...HAKI.armamento,...HAKI.rei];
  return [...(LIB[type]||[]),...(homebrew[type]||[])];
}

function chooseFruitById(id){
  readEditorFields();
  const entry=allFruitEntries().find(x=>x.id===id || fruitLibraryKey(x.data,0)===id);
  if(!entry){showToast('Akuma no Mi não encontrada.');return;}
  const f=normalizeCustomFruit(entry.data);
  current.fruit=f;
  current.fruitLevel=clamp(num(current.level,1),1,10);
  current.fruitChoices=[];
  current.fruitSelections={};
  current.fruitPowerEdits={};
  current.attacks=(current.attacks||[]).filter(x=>x.source!=='fruit');
  closeModal('libraryModal');detailContext=null;renderEditor();showToast(`${f.name} escolhida. Escolha 2 poderes iniciais.`);
}
function chooseFruit(index){
  const list=allFruitEntries();
  if(list[index])chooseFruitById(list[index].id);else showToast('Akuma no Mi não encontrada.');
}

function openDetail(type,name){
  let data=null;
  if(type==='race')data=Object.entries(RACES).map(([n,x])=>({name:n,...x,evolution:raceEvolutionData(n)})).find(x=>x.name===name);
  else if(type==='role')data=ROLES[name]?{name,type:'Cargo',...ROLES[name]}:null;
  else if(type==='fruits')data=allFruitEntries().map(x=>x.data).find(x=>x.name===name);
  else if(type==='attacks'||type==='abilities'||type==='rituals'||type==='items')data=mergedLibrary(type).find(x=>x.name===name);
  else if(type==='haki')data=[...HAKI.observacao,...HAKI.armamento,...HAKI.rei].find(x=>x.name===name);
  if(!data)return;
  if(type==='race')renderRaceDetail(data);else if(type==='role')renderRoleDetail(data);else if(type==='fruits')renderFruitDetail(data);else if(type==='haki')renderHakiDetail(data);else renderPowerDetail(data);
  openDetailModal();
}

function renderFruitDetail(data){
  const f=normalizeCustomFruit(data);
  const starters=f.starterPowers||[];
  const levels=Object.entries(f.levels||{}).sort((a,b)=>Number(a[0])-Number(b[0]));
  $('detailBody').innerHTML=`
    <span class="eyebrow">AKUMA NO MI • ${escapeHTML(f.type)}</span>
    <h2>🍈 ${escapeHTML(f.name)}</h2>
    <div class="detail-description"><b>Descrição</b><p>${escapeHTML(f.desc||'Sem descrição.')}</p></div>
    <div class="detail-rules"><b>⚖️ Equilíbrio</b><p>${escapeHTML(f.balance||'Use custos e limites da campanha.')}</p></div>
    <h3>🌱 Poderes iniciais — escolha 2 de 5</h3>
    <div class="fruit-detail-grid">${starters.map(p=>`<div class="fruit-detail-power"><b>${escapeHTML(p.name)}</b><span>${escapeHTML(p.type)} • ${p.cost||0} PE • ${escapeHTML(p.check||'Sem teste')}</span>${p.damage?`<span>💥 ${escapeHTML(p.damage)}</span>`:''}<p>${escapeHTML(p.desc||'')}</p><button class="info-btn" onclick="openPowerDetail(${JSON.stringify(p).replaceAll('"','&quot;')})">ⓘ Como funciona</button></div>`).join('')}</div>
    ${levels.length?`<h3>📈 Poderes por nível</h3><div class="fruit-detail-levels">${levels.map(([level,arr])=>`<details><summary>Nível ${level} — ${arr.length} poder(es) cadastrados</summary><div class="fruit-detail-grid">${arr.map(p=>`<div class="fruit-detail-power"><b>${escapeHTML(p.name)}</b><span>${escapeHTML(p.type)} • ${p.cost||0} PE • ${escapeHTML(p.check||'Sem teste')}</span>${p.damage?`<span>💥 ${escapeHTML(p.damage)}</span>`:''}<p>${escapeHTML(p.desc||'')}</p><button class="info-btn" onclick="openPowerDetail(${JSON.stringify(p).replaceAll('"','&quot;')})">ⓘ Como funciona</button></div>`).join('')}</div></details>`).join('')}</div>`:'<div class="empty-small">Esta fruta ainda não tem poderes de evolução cadastrados.</div>'}
    ${f.specialUnlocks?.length?`<h3>✨ Desbloqueios especiais</h3><div class="special-unlock-list">${f.specialUnlocks.map(x=>`<div class="special-unlock-item">${escapeHTML(x)}</div>`).join('')}</div>`:''}
    <button class="primary full" onclick="closeModal('detailModal')">Fechar</button>`;
}

const V17_OLD_FRUIT_POWER_OPTIONS = V17_LEGACY_FRUIT_POWER_OPTIONS;
function fruitPowerOptions(fruit,level){
  const f=normalizeCustomFruit(fruit);
  const l=clamp(num(level,1),1,10);
  if(l===1)return f.starterPowers||[];
  const custom=f.levels?.[l]||f.levels?.[String(l)];
  if(Array.isArray(custom)&&custom.length) return custom.slice(0,3).map(p=>normalizePower({...p,level:l,source:'fruit',origin:'Akuma no Mi',color:'vermelho'}));
  if(V17_OLD_FRUIT_POWER_OPTIONS)return V17_OLD_FRUIT_POWER_OPTIONS(f,l);
  return [];
}

function renderFruitLevel(level){
  const options=fruitPowerOptions(current.fruit,level),chosen=current.fruitSelections?.[level]||'';
  return `<div class="subsection fruit-level-block"><details class="fruit-level-details"><summary><span><b>Nível ${level}</b> • ${chosen?'✅ escolhido':'Escolha 1 de 3'}</span><small>⌄ Abrir poderes</small></summary><div class="fruit-level-inner"><p class="muted">Escolha apenas 1 poder neste nível. Clique em “Entender” para ver a regra completa.</p><div class="fruit-level-grid">${options.map((p,i)=>{const selected=chosen===p.id,shown=selected?getFruitOverride(current,p):p,data=JSON.stringify(shown).replaceAll('"','&quot;');return `<div class="fruit-level-card ${selected?'selected':''}"><div class="fruit-level-main"><button class="power-main" onclick="selectFruitLevelPower(${level},${i})"><b>${selected?'✓ ':''}${escapeHTML(shown.name)}</b><small>${escapeHTML(shown.type)} • ${shown.cost||0} PE • ${escapeHTML(shown.check||'Sem teste')}</small><span>${shown.damage?`💥 Dano ${escapeHTML(shown.damage)}`:'🛡️ Sem dano direto'} • ${escapeHTML(shown.range||'Alcance definido')}</span><p><b>Como funciona:</b> ${escapeHTML(shown.desc||'')}</p></button></div><div class="fruit-level-actions"><button type="button" class="info-btn" onclick="openPowerDetail(${data})">ⓘ Entender</button>${selected?`<button type="button" class="secondary" onclick="editFruitPowerById('${escapeAttr(p.id)}')">✎ Editar</button>`:''}</div></div>`}).join('')}</div></div></details></div>`;
}

function renderFruit(){
  const f=current.fruit;
  if(!f)return panel('08','Akuma no Mi','No nível 1 você escolhe 2 dos 5 poderes iniciais. Depois, a cada nível, existem 3 opções e você escolhe 1.',`<div class="empty fruit-empty"><b>🍈</b><h3>Nenhuma Akuma no Mi</h3><p>Escolha uma fruta para começar. Frutas Homebrew criadas pelo Mestre também aparecem aqui.</p><button class="primary" onclick="openLibrary('fruits')">🍈 Escolher fruta</button></div>`);
  const fruitLevel=clamp(num(current.fruitLevel,current.level),1,10);current.fruitLevel=fruitLevel;
  const selectedStart=new Set(current.fruitChoices||[]);
  return panel('08','Akuma no Mi','Cada nível deixa você escolher um novo poder. A setinha abre ou fecha as opções para deixar a ficha limpa.',`
    <div class="fruit-top"><div class="fruit-big"><span>🍈</span><div><b>${escapeHTML(f.name)}</b><small>${escapeHTML(f.type)}</small></div></div><div class="toolbar"><button class="primary" onclick="openLibrary('fruits')">🍈 Trocar fruta</button><button class="secondary" onclick="clearFruit()">× Remover</button></div></div>
    <div class="fruit-info"><span class="type-badge ${escapeAttr(f.type.toLowerCase())}">${escapeHTML(f.type)}</span><p>${escapeHTML(f.desc)}</p><p><b>Equilíbrio:</b> ${escapeHTML(f.balance||'Use PE e limites de nível.')}</p></div>
    <label class="level-slider-label">Nível atual da fruta <input type="number" min="1" max="10" value="${fruitLevel}" onchange="setFruitLevel(this.value)"></label>
    <div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">NÍVEL 1</span><h3>Escolha 2 de 5 poderes iniciais</h3></div><span class="badge-red">${selectedStart.size}/2</span></div><div class="fruit-basic-grid">${f.starterPowers.map((p,i)=>fruitPowerCard(p,`toggleFruitStarter(${i})`,selectedStart.has(p.name))).join('')}</div></div>
    <div class="subsection fruit-progression"><div class="section-head compact-head"><div><span class="eyebrow">EVOLUÇÃO</span><h3>Poderes por nível</h3><p class="muted">Apenas níveis alcançados. Um clique escolhe o poder; o botão “ⓘ Entender” explica a regra.</p></div></div>${Array.from({length:Math.max(0,fruitLevel-1)},(_,i)=>renderFruitLevel(i+2)).join('')||'<div class="empty-small">Suba o nível da fruta para liberar novas escolhas.</div>'}</div>
    ${f.specialUnlocks?.length?`<div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">DESBLOQUEIOS ESPECIAIS</span><h3>Além do nível</h3></div></div><div class="special-unlock-list">${f.specialUnlocks.map(x=>`<div class="special-unlock-item">✨ ${escapeHTML(x)}</div>`).join('')}</div></div>`:''}`);
}

/* ---------- HOME BREW UI / FRUTAS ---------- */
function homebrewLabel(type){return ({abilities:'habilidade',items:'item',rituals:'ritual',attacks:'ataque',threats:'ameaça',fruits:'Akuma no Mi'})[type]||'conteúdo';}
function renderHomebrew(){
  const box=$('homebrewRoot');if(!box)return;
  const tabs=[['abilities','✨ Habilidades'],['items','🎒 Itens'],['rituals','📜 Rituais'],['attacks','⚔️ Ataques'],['threats','👹 Ameaças'],['fruits','🍈 Akuma no Mi']];
  const data=homebrew[homebrewTab]||[];
  box.innerHTML=`<div class="homebrew-shell"><div class="homebrew-nav">${tabs.map(x=>`<button class="${homebrewTab===x[0]?'active':''}" onclick="homebrewTab='${x[0]}';renderHomebrew()">${x[1]}</button>`).join('')}</div><div class="homebrew-content"><div class="page-head"><div><span class="eyebrow">CRIAÇÃO</span><h2>Homebrew</h2><p class="muted">Tudo o que você criar fica salvo neste navegador e pode aparecer nas bibliotecas de fichas e campanhas.</p></div><button class="primary" onclick="openHomebrewCreate('${homebrewTab}')">＋ Criar ${homebrewLabel(homebrewTab)}</button></div>${homebrewTab==='fruits'?`<div class="help-banner"><b>🍈 Frutas Homebrew:</b> crie até 5 poderes iniciais, 3 opções por nível, desbloqueios especiais e regras próprias.</div>`:''}<div class="homebrew-grid">${data.length?data.map((x,i)=>homebrewCard(x,homebrewTab,i)).join(''):'<div class="empty"><b>🧪</b><h3>Nada criado ainda</h3><p>Crie o primeiro conteúdo nesta categoria.</p></div>'}</div></div></div>`;
}
function homebrewCard(x,type,index){
  if(type==='fruits')return `<article class="homebrew-card color-vermelho"><span class="library-kind homebrew">AKUMA HOMEBREW</span><h3>🍈 ${escapeHTML(x.name)}</h3><p>${escapeHTML(x.desc||'')}</p><div class="homebrew-fruit-meta"><span>${escapeHTML(x.type||'Paramecia')}</span><span>🌱 ${(x.starterPowers||[]).length}/5 iniciais</span><span>📈 ${Object.keys(x.levels||{}).length} níveis</span></div><div class="agent-actions"><button class="secondary" onclick="openHomebrewEdit('fruits',${index})">✎ Editar fruta</button><button class="delete" onclick="deleteHomebrew('fruits',${index})">×</button></div></article>`;
  return `<article class="homebrew-card color-${x.color||originColor(x.origin)}"><span class="library-kind homebrew">HOMEBREW</span><h3>${escapeHTML(x.name)}</h3><p>${escapeHTML(x.desc||'')}</p>${type==='items'?`<small>${escapeHTML(x.type)}</small>`:`<small>Nvl ${x.level||1} • ${x.cost||0} PE</small>`}<div class="agent-actions"><button class="secondary" onclick="openHomebrewEdit('${type}',${index})">✎ Editar</button><button class="delete" onclick="deleteHomebrew('${type}',${index})">×</button></div></article>`;
}

let v17FruitBuffer=null;
function starterPowerTemplate(fruit,i){return normalizePower({id:uid(),name:`Poder inicial ${i+1}`,origin:'Akuma no Mi • Homebrew',level:1,cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d8',type:'Ataque',desc:`Explique exatamente como o poder ${i+1} funciona.`,effect:'',range:'Definido pela fruta',duration:'Instantâneo',color:'vermelho',source:'fruit'});}
function fruitLevelTemplate(fruit,level,i){return normalizePower({id:uid(),name:`Poder Nível ${level}-${i+1}`,origin:'Akuma no Mi • Homebrew',level,cost:level>2?1:0,attribute:'Força',check:'1d20 + Força',damage:'1d8',type:'Habilidade',desc:`Explique o poder desbloqueado no nível ${level}.`,effect:'',range:'Definido pela fruta',duration:'Conforme a cena',color:'vermelho',source:'fruit'});}
function fruitPowerEditorHTML(p,scope,index){return `<article class="fruit-homebrew-power color-vermelho"><div class="fruit-homebrew-head"><div><span class="eyebrow">${scope}</span><b>${escapeHTML(p.name)}</b></div><button type="button" class="delete" onclick="removeFruitHomebrewPower('${escapeAttr(scope)}',${index})">×</button></div><div class="form-grid"><label>Nome<input data-fhp="name" data-scope="${escapeAttr(scope)}" data-index="${index}" value="${escapeAttr(p.name)}" placeholder="Ex.: Escudo de Chamas"></label><label>Tipo<select data-fhp="type" data-scope="${escapeAttr(scope)}" data-index="${index}">${['Ataque','Defesa','Utilidade','Suporte','Habilidade'].map(v=>`<option ${v===p.type?'selected':''}>${v}</option>`).join('')}</select></label><label>Custo PE<input type="number" min="0" data-fhp="cost" data-scope="${escapeAttr(scope)}" data-index="${index}" value="${p.cost||0}"></label><label>Atributo<select data-fhp="attribute" data-scope="${escapeAttr(scope)}" data-index="${index}">${[...ATTRS,'Sem teste'].map(v=>`<option ${v===p.attribute?'selected':''}>${v}</option>`).join('')}</select></label><label>Teste<input data-fhp="check" data-scope="${escapeAttr(scope)}" data-index="${index}" value="${escapeAttr(p.check||'')}" placeholder="1d20 + Força ou 1d100"></label><label>Dano<input data-fhp="damage" data-scope="${escapeAttr(scope)}" data-index="${index}" value="${escapeAttr(p.damage||'')}" placeholder="Ex.: 2d8"></label><label>Limiar d100<input type="number" min="1" max="100" data-fhp="successThreshold" data-scope="${escapeAttr(scope)}" data-index="${index}" value="${p.successThreshold??''}" placeholder="80"></label><label>Alcance<input data-fhp="range" data-scope="${escapeAttr(scope)}" data-index="${index}" value="${escapeAttr(p.range||'')}" placeholder="Curto / Médio / Longo"></label><label class="wide">Descrição / como funciona<textarea data-fhp="desc" data-scope="${escapeAttr(scope)}" data-index="${index}" placeholder="Explique passo a passo.">${escapeHTML(p.desc||'')}</textarea></label><label class="wide">Efeito especial<textarea data-fhp="effect" data-scope="${escapeAttr(scope)}" data-index="${index}" placeholder="Ex.: reduz dano, empurra, queima, cura...">${escapeHTML(p.effect||'')}</textarea></label><label>Duração<input data-fhp="duration" data-scope="${escapeAttr(scope)}" data-index="${index}" value="${escapeAttr(p.duration||'')}" placeholder="Instantâneo / 2 turnos"></label></div></article>`;}
function readFruitHomebrewBuffer(){
  if(!v17FruitBuffer)return null;
  const root=$('homebrewEditBody');
  root?.querySelectorAll('[data-fhp]').forEach(el=>{
    const scope=el.dataset.scope||'starter';const i=num(el.dataset.index,-1);const list=scope==='starter'?v17FruitBuffer.starterPowers:(v17FruitBuffer.levels?.[scope]||[]);if(i<0||!list[i])return;const k=el.dataset.fhp;let val=el.value;if(k==='cost')val=Math.max(0,num(val));if(k==='successThreshold')val=val===''?null:clamp(num(val),1,100);list[i][k]=val;
  });
  return normalizeCustomFruit(v17FruitBuffer);
}
function renderFruitHomebrewEditor(){
  const f=normalizeCustomFruit(v17FruitBuffer||{});v17FruitBuffer=clone(f);
  const starters=(f.starterPowers||[]).map((p,i)=>fruitPowerEditorHTML(p,'starter',i)).join('');
  const levels=Array.from({length:9},(_,n)=>{
    const level=n+2;const list=Array.isArray(f.levels?.[level])?f.levels[level]:[];return `<details class="fruit-homebrew-level" ${list.length?'open':''}><summary><span>📈 Nível ${level}</span><small>${list.length}/3 poderes • clique para editar</small></summary><div class="fruit-homebrew-level-body"><div class="fruit-level-draft-grid">${list.map((p,i)=>fruitPowerEditorHTML(p, String(level), i)).join('')}</div><button type="button" class="secondary" onclick="addFruitHomebrewLevelPower(${level})">＋ Adicionar poder neste nível</button></div></details>`;
  }).join('');
  $('homebrewEditBody').innerHTML=`<div class="form-grid"><label>Nome da fruta<input id="fhName" value="${escapeAttr(f.name||'')}" placeholder="Ex.: Hito Hito no Mi — Modelo Herói"></label><label>Tipo<select id="fhType">${['Paramecia','Zoan','Zoan Mítica','Logia'].map(v=>`<option ${v===f.type?'selected':''}>${v}</option>`).join('')}</select></label><label class="wide">Descrição<textarea id="fhDesc" placeholder="Explique o conceito e os limites da fruta.">${escapeHTML(f.desc||'')}</textarea></label><label class="wide">Equilíbrio / limitações<textarea id="fhBalance" placeholder="Ex.: intangibilidade custa 2 PE; congelamento máximo em 1 alvo.">${escapeHTML(f.balance||'')}</textarea></label></div><div class="fruit-hb-section"><div class="fruit-hb-section-head"><div><span class="eyebrow">NÍVEL 1</span><h3>5 poderes iniciais</h3><p class="muted">O jogador escolhe 2. Pode ser ataque, defesa, suporte ou utilidade.</p></div></div>${starters}${(f.starterPowers||[]).length<5?'<button class="secondary" onclick="addFruitHomebrewStarter()">＋ Adicionar poder inicial</button>':''}</div><div class="fruit-hb-section"><div class="fruit-hb-section-head"><div><span class="eyebrow">NÍVEIS 2 → 10</span><h3>3 opções por nível</h3><p class="muted">O personagem escolhe 1 dos 3 quando alcançar o nível.</p></div></div>${levels}</div><div class="fruit-hb-section"><div class="fruit-hb-section-head"><div><span class="eyebrow">DESBLOQUEIOS ESPECIAIS</span><h3>Além do nível</h3><p class="muted">Um por linha. Ex.: “Despertar: completar a missão X”.</p></div></div><textarea id="fhSpecial" class="special-unlock-textarea" placeholder="Despertar: ...\nItem especial: ...\nTreino com um mestre: ...">${escapeHTML((f.specialUnlocks||[]).join('\n'))}</textarea></div><div class="threat-edit-savebar homebrew-savebar"><div><b>Akuma no Mi Homebrew</b><small>Salve para aparecer na biblioteca e nas fichas futuras.</small></div><button class="secondary" onclick="closeModal('homebrewEditModal')">Cancelar</button><button class="primary" onclick="saveHomebrewEntry('fruits',${detailContext.index})">💾 Salvar fruta</button></div>`;
}
function openHomebrewCreate(type){
  detailContext={homebrew:true,type,index:-1};
  if(type==='fruits'){
    v17FruitBuffer=normalizeCustomFruit({id:uid(),name:'Nova Akuma no Mi',type:'Paramecia',desc:'Descreva a fruta.',balance:'Defina os limites.',starterPowers:Array.from({length:5},(_,i)=>starterPowerTemplate(null,i)),levels:{},specialUnlocks:[]});
    $('homebrewEditTitle').textContent='Criar Akuma no Mi';renderFruitHomebrewEditor();openModal('homebrewEditModal');return;
  }
  if(V17_LEGACY_RENDER_HOME_BREW) V17_LEGACY_RENDER_HOME_BREW.call(null);
  $('homebrewEditTitle').textContent=`Criar ${homebrewLabel(type)}`;
  renderHomebrewEditBody(type,{});openModal('homebrewEditModal');
}
function openHomebrewEdit(type,index){
  if(type==='fruits'){
    const f=homebrew.fruits?.[index];if(!f)return;detailContext={homebrew:true,type,index};v17FruitBuffer=normalizeCustomFruit(f);$('homebrewEditTitle').textContent=`Editar Akuma no Mi: ${v17FruitBuffer.name}`;renderFruitHomebrewEditor();openModal('homebrewEditModal');return;
  }
  const x=homebrew[type][index];detailContext={homebrew:true,type,index,threatDraft:type==='threats'?clone((x.abilities||[]).map(normalizePower)):[],threatData:clone(x)};$('homebrewEditTitle').textContent=`Editar ${homebrewLabel(type)}`;renderHomebrewEditBody(type,x);openModal('homebrewEditModal');
}
function addFruitHomebrewStarter(){
  readFruitHomebrewBuffer();if(v17FruitBuffer.starterPowers.length>=5){showToast('A fruta já possui 5 poderes iniciais.');return;}v17FruitBuffer.starterPowers.push(starterPowerTemplate(v17FruitBuffer,v17FruitBuffer.starterPowers.length));renderFruitHomebrewEditor();}
function addFruitHomebrewLevelPower(level){
  readFruitHomebrewBuffer();v17FruitBuffer.levels[level]=v17FruitBuffer.levels[level]||[];if(v17FruitBuffer.levels[level].length>=3){showToast('Cada nível pode ter no máximo 3 opções.');return;}v17FruitBuffer.levels[level].push(fruitLevelTemplate(v17FruitBuffer,level,v17FruitBuffer.levels[level].length));renderFruitHomebrewEditor();}
function removeFruitHomebrewPower(scope,index){
  readFruitHomebrewBuffer();const list=scope==='starter'?v17FruitBuffer.starterPowers:(v17FruitBuffer.levels?.[scope]||[]);if(!list[index])return;if(scope==='starter'&&list.length<=1){showToast('Mantenha pelo menos 1 poder inicial.');return;}list.splice(index,1);if(scope!=='starter'&&!list.length)delete v17FruitBuffer.levels[scope];renderFruitHomebrewEditor();}
function saveHomebrewEntry(type,index){
  if(type==='fruits'){
    readFruitHomebrewBuffer();
    const f=normalizeCustomFruit({...v17FruitBuffer,name:$('fhName').value.trim(),type:$('fhType').value,desc:$('fhDesc').value.trim(),balance:$('fhBalance').value.trim(),specialUnlocks:$('fhSpecial').value.split(/\n+/).map(x=>x.trim()).filter(Boolean)});
    if(!f.name){showToast('Digite o nome da fruta.');return;}
    f.id=index>=0?homebrew.fruits[index].id:(f.id||uid());if(index<0)homebrew.fruits.push(f);else homebrew.fruits[index]=f;homebrew=normalizeHomebrew(homebrew);saveHomebrew();closeModal('homebrewEditModal');renderHomebrew();showToast(`🍈 ${f.name} salvo no Homebrew e disponível na biblioteca.`);return;
  }
  if(V17_LEGACY_SAVE_HOME_BREW_ENTRY)return V17_LEGACY_SAVE_HOME_BREW_ENTRY(type,index);
}
function deleteHomebrew(type,index){
  if(!homebrew[type]?.[index])return;if(!confirmAction('Apagar este conteúdo Homebrew?'))return;homebrew[type].splice(index,1);saveHomebrew();renderHomebrew();showToast('Conteúdo Homebrew apagado.');
}

/* ---------- BIBLIOTECA DE FRUTAS ---------- */
function renderLibrary(){
  if(libraryType!=='fruits'){if(V17_LEGACY_RENDER_LIBRARY)return V17_LEGACY_RENDER_LIBRARY();return;}
  const list=allFruitEntries();const query=($('librarySearch')?.value||'').toLowerCase();const filtered=list.filter(x=>`${x.data.name} ${x.data.desc} ${x.data.type}`.toLowerCase().includes(query));const box=$('libraryList');if(!box)return;
  if(!filtered.length){box.innerHTML='<div class="empty-small">Nenhuma fruta encontrada.</div>';return;}
  box.innerHTML=filtered.map(x=>`<div class="library-card fruit-library-card"><div><span class="library-kind ${x.homebrew?'homebrew':''}">${x.homebrew?'HOMEBREW':'BIBLIOTECA'}</span><b>🍈 ${escapeHTML(x.data.name)}</b><small>${escapeHTML(x.data.type)} • ${escapeHTML(x.data.desc||'')}</small><div class="tags"><span class="tag">🌱 ${(x.data.starterPowers||[]).length} iniciais</span><span class="tag">📈 ${Object.keys(x.data.levels||{}).length} níveis</span></div></div><button type="button" class="info-btn" onclick="openDetail('fruits','${escapeAttr(x.data.name)}')">ⓘ</button><button type="button" class="primary" onclick="chooseFruitById('${escapeAttr(x.id)}')">Escolher</button></div>`).join('');
}

/* ---------- CAMPANHA: DADOS, INFORMAÇÕES, FICHA COMPLETA ---------- */
function campaignPowerInfo(cid,type,index,powerIndex){
  const c=getCampaign(cid);if(!c)return;let p=null;let owner='';
  if(type==='agent'){const m=c.members[index];if(!m)return;const a=normalizeAgent(m.agent);p=getCombatPowers(a).find(x=>x.id===powerIndex);owner=a.name;}
  else{const t=c.threats[index];if(!t)return;p=t.abilities?.[powerIndex];owner=t.name;}
  if(!p){showToast('Ação não encontrada.');return;}
  const np=normalizePower(p);$('detailBody').innerHTML=`<span class="eyebrow">AÇÃO DA CAMPANHA</span><h2>${escapeHTML(np.name)}</h2><div class="campaign-power-detail-owner"><span>${type==='agent'?'👤':'👹'}</span><b>${escapeHTML(owner)}</b><small>${escapeHTML(np.origin||np.type||'Ação')}</small></div><div class="detail-power-meta"><span>Tipo: ${escapeHTML(np.type||'Ação')}</span><span>🔥 ${np.cost||0} PE</span><span>🎲 ${escapeHTML(np.check||'Sem teste')}</span>${np.damage?`<span>💥 ${escapeHTML(np.damage)}</span>`:'<span>🛡️ Sem dano direto</span>'}${np.range?`<span>📏 ${escapeHTML(np.range)}</span>`:''}</div><div class="detail-description"><b>Como funciona</b><p>${escapeHTML(np.desc||'Sem descrição.')}</p></div>${np.effect?`<div class="detail-rules"><b>✨ Efeito</b><p>${escapeHTML(np.effect)}</p></div>`:''}${np.successThreshold!=null?`<div class="rule-callout"><b>🎯 d100:</b> sucesso ${np.successMode==='menor-que'?'abaixo de':'a partir de'} ${np.successThreshold}.</div>`:''}<div class="row-actions detail-actions"><button class="primary big-action-btn" onclick="${type==='agent'?`campaignRollAgentPower('${escapeAttr(cid)}',${index},'${escapeAttr(np.id)}')`:`campaignRollThreat('${escapeAttr(cid)}',${index},${powerIndex})`};closeModal('detailModal')">🎲 Usar agora</button><button class="secondary" onclick="closeModal('detailModal')">Fechar</button></div>`;openDetailModal();}

function campaignMemberFullSheet(cid,index){
  const c=getCampaign(cid),m=c?.members[index];if(!m)return;const a=normalizeAgent(m.agent),cc=calc(a),avatar=a.avatar?`<img class="campaign-full-avatar" src="${escapeAttr(a.avatar)}" alt="Avatar" onclick="openThreatImageViewer('${escapeAttr(a.avatar)}')">`:'👤';const powers=getCombatPowers(a);const inv=a.items||[];const attrs=ATTRS.map(x=>`<span>${escapeHTML(x)} <b>${attrTotal(a,x)}</b></span>`).join('');const skills=allSkills().map(x=>`<span>${escapeHTML(x[0])}<b>${skillTotal(a,x[0])}</b></span>`).join('');$('detailBody').innerHTML=`<div class="campaign-full-sheet"><div class="campaign-full-hero">${avatar}<div><span class="eyebrow">FICHA COMPLETA</span><h2>${escapeHTML(a.name)}</h2><p>${escapeHTML(a.race)} • Nível ${a.level} • ${escapeHTML((a.roles||[]).filter(x=>x!=='Nenhum').join(' / ')||'Sem cargo')}</p></div></div><div class="campaign-full-resources"><div><small>PV</small><b>${a.hpCurrent}/${cc.hpMax}</b></div><div><small>PE</small><b>${a.peCurrent}/${cc.peMax}</b></div><div><small>DEF</small><b>${cc.defense}</b></div><div><small>INICIATIVA</small><b>${cc.initiative}</b></div></div><h3>Atributos</h3><div class="campaign-full-grid">${attrs}</div><h3>Perícias</h3><div class="campaign-full-grid">${skills}</div><h3>Poderes e ações</h3><div class="campaign-full-power-list">${powers.length?powers.map(p=>`<button class="campaign-full-power color-${escapeAttr(p.color||originColor(p.origin))}" onclick="campaignPowerInfo('${escapeAttr(cid)}','agent',${index},'${escapeAttr(p.id)}')"><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.origin||'Poder')} • ${p.cost||0} PE</small></button>`).join(''):'<span class="muted">Nenhuma ação.</span>'}</div><h3>Inventário</h3><div class="campaign-full-inventory">${inv.length?inv.map(x=>`<div><b>${escapeHTML(x.name)}</b><span>${x.quantity}x${x.equipped?' • equipada':''}</span></div>`).join(''):'<span class="muted">Inventário vazio.</span>'}</div><h3>História</h3><div class="campaign-full-story"><section><b>Personalidade</b><p>${escapeHTML(a.personality||'—')}</p></section><section><b>Código de honra</b><p>${escapeHTML(a.honor||'—')}</p></section><section><b>Sonho</b><p>${escapeHTML(a.dream||'—')}</p></section><section class="wide"><b>História</b><p>${escapeHTML(a.history||'—')}</p></section></div><div class="row-actions detail-actions"><button class="primary" onclick="closeModal('detailModal');editCampaignAgent('${escapeAttr(cid)}',${index})">✎ Editar</button><button class="secondary" onclick="closeModal('detailModal')">Fechar</button></div></div>`;openDetailModal();}
function openCampaignAgentFullSheet(cid,index){campaignMemberFullSheet(cid,index);}

/* ---------- CAMPANHA: CARDS MAIS CLAROS ---------- */
function campaignMemberCard(c,m,index){
  const a=normalizeAgent(m.agent),cc=calc(a),key=`m:${m.id}`,initiative=c.initiatives[key],hpPct=cc.hpMax?clamp(a.hpCurrent/cc.hpMax*100,0,100):0,pePct=cc.peMax?clamp(a.peCurrent/cc.peMax*100,0,100):0;const actions=getCombatPowers(a);
  const quick=actions.length?actions.map(p=>`<div class="campaign-v17-power-row color-${escapeAttr(p.color||originColor(p.origin))}"><button type="button" class="campaign-v17-power-use" onclick="campaignRollAgentPower('${escapeAttr(c.id)}',${index},'${escapeAttr(p.id)}')"><span>${p.source==='fruit'?'🍈':p.source==='weapon'?'⚔️':p.source==='haki'?'🟣':p.source==='race'?'🟡':p.source==='ritual'?'📜':'✦'}</span><b>${escapeHTML(p.name)}</b><small>${p.cost?`${p.cost} PE`:'Sem PE'}</small></button><button type="button" class="campaign-v17-power-info" onclick="campaignPowerInfo('${escapeAttr(c.id)}','agent',${index},'${escapeAttr(p.id)}')" title="Ver como funciona">ⓘ</button></div>`).join(''):'<span class="campaign-v17-empty-action">Nenhuma ação rápida disponível.</span>';
  const avatar=a.avatar?`<img src="${escapeAttr(a.avatar)}" alt="Avatar" onclick="openThreatImageViewer('${escapeAttr(a.avatar)}')" onerror="this.style.display='none';this.parentElement.classList.add('image-failed')">`:'👤';
  return `<article class="campaign-v17-card ${isCurrentTurn(c,key)?'current-turn':''}"><div class="campaign-v17-head"><div class="campaign-v17-avatar">${avatar}</div><div class="campaign-v17-identity"><div class="campaign-v17-title-row"><h4>${escapeHTML(a.name||'Sem nome')}</h4><span class="campaign-v17-badge agent">AGENTE</span>${a.auraActive?'<span class="campaign-v17-status">🟢 AURA</span>':''}</div><p>${escapeHTML(a.race||'Humano')} • Nível ${a.level} • Iniciativa ${initiative??'—'}</p><div class="campaign-v17-pills"><span>🛡️ DEF <b>${cc.defense}</b></span><span>🏃 MOV <b>${cc.movement}</b></span><span>💪 FOR <b>${attrTotal(a,'Força')}</b></span><span>🎯 DES <b>${attrTotal(a,'Destreza')}</b></span><span>🧠 INT <b>${attrTotal(a,'Inteligência')}</b></span><span>🧿 VON <b>${attrTotal(a,'Vontade')}</b></span></div></div></div><div class="campaign-v17-resources"><div class="campaign-v17-resource hp"><div><span>❤️ PV</span><b>${a.hpCurrent}/${cc.hpMax}</b></div><div class="campaign-v17-track"><i style="width:${hpPct}%"></i></div></div><div class="campaign-v17-resource pe"><div><span>🔥 PE</span><b>${a.peCurrent}/${cc.peMax}</b></div><div class="campaign-v17-track blue"><i style="width:${pePct}%"></i></div></div></div><div class="campaign-v17-controls"><div class="campaign-v17-resource-controls"><div class="campaign-v17-control"><strong>PV</strong><button class="mini-btn danger" onclick="campaignResource('${escapeAttr(c.id)}',${index},'hp',-1)">−1</button><button class="mini-btn" onclick="campaignResource('${escapeAttr(c.id)}',${index},'hp',1)">+1</button></div><div class="campaign-v17-control"><strong>PE</strong><button class="mini-btn danger" onclick="campaignResource('${escapeAttr(c.id)}',${index},'pe',-1)">−1</button><button class="mini-btn" onclick="campaignResource('${escapeAttr(c.id)}',${index},'pe',1)">+1</button></div></div><div class="campaign-v17-actions"><button type="button" class="secondary" onclick="toggleCampaignAura('${escapeAttr(c.id)}',${index})">${a.auraActive?'⏹ Desativar Aura':'🟢 Ativar Aura'}</button><button type="button" class="secondary" onclick="campaignRollInitiative('${escapeAttr(c.id)}','${escapeAttr(key)}')">🎲 Iniciativa</button><button type="button" class="secondary" onclick="openCampaignAgentSheet('${escapeAttr(c.id)}',${index})">📋 Resumo</button><button type="button" class="primary" onclick="openCampaignAgentFullSheet('${escapeAttr(c.id)}',${index})">🧾 Ficha completa</button><button type="button" class="secondary" onclick="editCampaignAgent('${escapeAttr(c.id)}',${index})">✎ Editar</button><button type="button" class="secondary campaign-v17-danger" onclick="removeCampaignMember('${escapeAttr(c.id)}',${index})">🗑 Remover</button></div></div><div class="campaign-v17-action-area"><div class="campaign-v17-action-title"><b>⚔️ Ações rápidas</b><small>Clique em 🎲 para usar ou em ⓘ para entender.</small></div><div class="campaign-v17-power-list">${quick}</div></div></article>`;
}
function campaignThreatCard(c,t,index){
  const key=`t:${t.id}`,initiative=c.initiatives[key],hpPct=t.hpMax?clamp(t.hpCurrent/t.hpMax*100,0,100):0;const actions=(t.abilities||[]).map((p,pi)=>`<div class="campaign-v17-power-row color-${escapeAttr(p.color||'vermelho')}"><button type="button" class="campaign-v17-power-use" onclick="campaignRollThreat('${escapeAttr(c.id)}',${index},${pi})"><span>🎲</span><b>${escapeHTML(p.name||'Ação')}</b><small>${p.cost?`${p.cost} PE`:'Sem PE'}</small></button><button type="button" class="campaign-v17-power-info" onclick="campaignPowerInfo('${escapeAttr(c.id)}','threat',${index},${pi})" title="Ver como funciona">ⓘ</button></div>`).join('')||'<span class="campaign-v17-empty-action">Nenhuma ação cadastrada.</span>';const image=t.image?`<img src="${escapeAttr(t.image)}" alt="Imagem de ${escapeAttr(t.name)}" onclick="openThreatImageViewer('${escapeAttr(t.image)}')" onerror="this.style.display='none';this.parentElement.classList.add('image-failed')">`:'👹';return `<article class="campaign-v17-card threat ${isCurrentTurn(c,key)?'current-turn':''}><div class="campaign-v17-head"><div class="campaign-v17-avatar threat">${image}</div><div class="campaign-v17-identity"><div class="campaign-v17-title-row"><h4>${escapeHTML(t.name)}</h4><span class="campaign-v17-badge threat">AMEAÇA</span></div><p>Nível ${t.level} • ATK +${t.attack} • Iniciativa ${initiative??'—'}</p><div class="campaign-v17-pills"><span>❤️ PV <b>${t.hpCurrent}/${t.hpMax}</b></span><span>⚔️ AÇÕES <b>${t.abilities?.length||0}</b></span>${t.fruit?`<span>🍈 ${escapeHTML(t.fruit)}</span>`:''}</div></div></div><div class="campaign-v17-resources single"><div class="campaign-v17-resource hp"><div><span>❤️ PV</span><b>${t.hpCurrent}/${t.hpMax}</b></div><div class="campaign-v17-track red"><i style="width:${hpPct}%"></i></div></div></div><div class="campaign-v17-controls"><div class="campaign-v17-resource-controls"><div class="campaign-v17-control"><strong>PV</strong><button class="mini-btn danger" onclick="threatResource('${escapeAttr(c.id)}',${index},-1)">−1</button><button class="mini-btn" onclick="threatResource('${escapeAttr(c.id)}',${index},1)">+1</button></div></div><div class="campaign-v17-actions"><button type="button" class="secondary" onclick="campaignRollInitiative('${escapeAttr(c.id)}','${escapeAttr(key)}')">🎲 Iniciativa</button><button type="button" class="secondary" onclick="openThreatFromCampaign('${escapeAttr(c.id)}',${index})">📋 Resumo</button><button type="button" class="primary" onclick="openThreatFullCampaignSheet('${escapeAttr(c.id)}',${index})">🧾 Ficha completa</button><button type="button" class="secondary" onclick="editThreat('${escapeAttr(c.id)}',${index})">✎ Editar</button><button type="button" class="secondary campaign-v17-danger" onclick="removeCampaignThreat('${escapeAttr(c.id)}',${index})">🗑 Remover</button></div></div><div class="campaign-v17-action-area"><div class="campaign-v17-action-title"><b>⚔️ Ataques e habilidades</b><small>Clique em 🎲 para usar ou ⓘ para entender.</small></div><div class="campaign-v17-power-list">${actions}</div></div></article>`;}
function openThreatFullCampaignSheet(cid,index){
  const c=getCampaign(cid),t=c?.threats[index];if(!t)return;const actions=t.abilities||[];const image=t.image?`<img class="campaign-full-avatar" src="${escapeAttr(t.image)}" alt="Ameaça" onclick="openThreatImageViewer('${escapeAttr(t.image)}')">`:'👹';$('detailBody').innerHTML=`<div class="campaign-full-sheet"><div class="campaign-full-hero">${image}<div><span class="eyebrow">FICHA COMPLETA DA AMEAÇA</span><h2>${escapeHTML(t.name)}</h2><p>Nível ${t.level} • ATK +${t.attack}</p></div></div><div class="campaign-full-resources"><div><small>PV</small><b>${t.hpCurrent}/${t.hpMax}</b></div><div><small>NÍVEL</small><b>${t.level}</b></div><div><small>AÇÕES</small><b>${actions.length}</b></div></div><p>${escapeHTML(t.desc||'')}</p>${t.fruit?`<div class="info"><b>🍈 Fruta:</b> ${escapeHTML(t.fruit)}</div>`:''}<h3>Ataques e habilidades</h3><div class="campaign-full-power-list">${actions.map((p,i)=>`<button class="campaign-full-power color-${escapeAttr(p.color||'vermelho')}" onclick="campaignPowerInfo('${escapeAttr(cid)}','threat',${index},${i})"><b>${escapeHTML(p.name)}</b><small>${p.cost||0} PE • ${escapeHTML(p.check||'Sem teste')}</small></button>`).join('')}</div><div class="row-actions detail-actions"><button class="primary" onclick="closeModal('detailModal');editThreat('${escapeAttr(cid)}',${index})">✎ Editar ameaça</button><button class="secondary" onclick="closeModal('detailModal')">Fechar</button></div></div>`;openDetailModal();}

/* ---------- CAMPANHA: SALVAR E ATUALIZAR SEM REENTRAR ---------- */
function syncAgentChanges(agent){
  if(!agent?.id)return;const idx=agents.findIndex(a=>a.id===agent.id);if(idx>=0){agents[idx]=normalizeAgent(agent);agents[idx].updatedAt=Date.now();saveAgents();syncAgentToCampaigns(agents[idx]);}}
function saveCampaignAgentQuickEdit(){
  const ctx=detailContext;if(!ctx?.campaignEditAgent)return;const c=getCampaign(ctx.campaignId),m=c?.members[ctx.index];if(!m)return;const before=normalizeAgent(m.agent);const a=normalizeAgent({...before,name:$('caName')?.value.trim()||before.name,level:clamp(num($('caLevel')?.value,before.level),1,10),hpCurrent:Math.max(0,num($('caHP')?.value,before.hpCurrent)),peCurrent:Math.max(0,num($('caPE')?.value,before.peCurrent))});recalculateResourcesAfterProgress(before,a);m.agent=a;syncAgentChanges(a);saveCampaigns();closeModal('detailModal');refreshCampaignView(ctx.campaignId,{toast:'✅ Alteração salva e mostrada na mesa.'});}

/* ---------- RESULTADO DE DADOS: ARRASTAR ---------- */
function setupDiceDrag(){
  const box=$('diceResult');if(!box||box.dataset.dragReady)return;box.dataset.dragReady='1';let dragging=false,startX=0,startY=0,startLeft=0,startTop=0;
  const move=(e)=>{if(!dragging)return;const pt=e.touches?e.touches[0]:e;let x=startLeft+(pt.clientX-startX),y=startTop+(pt.clientY-startY);const maxX=window.innerWidth-box.offsetWidth-8,maxY=window.innerHeight-box.offsetHeight-8;x=clamp(x,8,Math.max(8,maxX));y=clamp(y,8,Math.max(8,maxY));box.style.left=`${x}px`;box.style.top=`${y}px`;box.style.right='auto';box.style.bottom='auto';};
  const up=()=>{if(!dragging)return;dragging=false;box.classList.remove('dragging');};
  const down=(e)=>{const pt=e.touches?e.touches[0]:e;dragging=true;startX=pt.clientX;startY=pt.clientY;const rect=box.getBoundingClientRect();startLeft=rect.left;startTop=rect.top;box.classList.add('dragging');if(e.cancelable)e.preventDefault();};
  box.addEventListener('pointerdown',down);window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',up);box.addEventListener('touchstart',down,{passive:false});window.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',up);
}

/* ---------- AMEAÇAS VISÍVEIS ---------- */
function renderThreats(){
  const box=$('threatList');if(!box)return;const q=($('threatSearch')?.value||'').trim().toLowerCase();const entries=allThreatEntries().filter(e=>`${e.name} ${e.data.desc||''} ${e.data.fruit||''}`.toLowerCase().includes(q));
  if(!entries.length){box.innerHTML=`<div class="empty"><b>👹</b><h3>Nenhuma ameaça encontrada</h3><p>Crie uma ameaça no Homebrew para ela aparecer aqui.</p><button class="primary" onclick="openThreatHomebrewFromPage()">＋ Criar ameaça</button></div>`;return;}
  box.innerHTML=entries.map(e=>{const t=normalizeThreat(e.data);const actions=(t.abilities||[]).slice(0,3).map(p=>`<span class="tag">⚔️ ${escapeHTML(p.name)}</span>`).join('');return `<article class="threat-card-v17 ${e.homebrew?'homebrew-threat':''}">${t.image?`<img class="threat-list-image" src="${escapeAttr(t.image)}" alt="${escapeAttr(t.name)}" onclick="openThreatImageViewer('${escapeAttr(t.image)}')">`:'<div class="threat-list-image placeholder">👹</div>'}<div class="threat-list-body"><span class="library-kind ${e.homebrew?'homebrew':''}">${e.homebrew?'HOMEBREW':'BIBLIOTECA'}</span><h3>${escapeHTML(t.name)}</h3><p>${escapeHTML(t.desc||'')}</p><div class="tags"><span class="tag">❤️ ${t.hpMax} PV</span><span class="tag">⚔️ +${t.attack} ATK</span><span class="tag">Nvl ${t.level}</span></div><div class="tags threat-action-tags">${actions||'<span class="tag">Sem ações</span>'}</div><div class="agent-actions"><button class="primary" onclick="previewThreatById('${escapeAttr(e.id)}')">📜 Ver ficha</button><button class="secondary" onclick="openCampaignSelector('threat','${escapeAttr(e.id)}')">⚓ Campanha</button>${e.homebrew?`<button class="secondary" onclick="openHomebrewEdit('threats',${homebrew.threats.findIndex(x=>x.id===e.id)})">✎ Editar</button>`:''}</div></div></article>`;}).join('');
}

/* ---------- EDITOR DE AMEAÇAS: SALVAR / SAIR / UNDO / REDO ---------- */
let v17ThreatUndo=[],v17ThreatRedo=[];
function threatEditorSnapshot(){return clone(threatEditBuffer||{});}
function v17ThreatSame(a,b){try{return JSON.stringify(a)===JSON.stringify(b);}catch{return false;}}
function v17ThreatPushUndo(force=false){if(!threatEditBuffer)return;const snap=readThreatEditorAll(true);if(!snap)return;const last=v17ThreatUndo[v17ThreatUndo.length-1];if(!force&&last&&v17ThreatSame(last,snap))return;v17ThreatUndo.push(clone(snap));if(v17ThreatUndo.length>80)v17ThreatUndo.shift();v17ThreatRedo=[];}
function readThreatEditorAll(noRender=false){
  if(!threatEditBuffer)return null;const t=clone(threatEditBuffer);const root=$('editThreatBody');if(!root)return t;
  const get=id=>$(id)?.value;
  t.name=text(get('teName')||t.name).trim();t.hpMax=Math.max(1,num(get('teHP'),t.hpMax));t.hpCurrent=clamp(num(get('teCur'),t.hpCurrent),0,t.hpMax);t.attack=num(get('teAtk'),t.attack);t.level=clamp(num(get('teLvl'),t.level||1),1,10);t.fruit=text(get('teFruit'));t.desc=text(get('teDesc'));t.attributes=Object.fromEntries(ATTRS.map((a,i)=>[a,clamp(num($('tea'+i)?.value),-2,20)]));t.items=String(get('teItems')||'').split(',').map(x=>x.trim()).filter(Boolean).map(name=>normalizeItem({id:uid(),name,type:'Especial',origin:'Ameaça'}));const list=clone(t.abilities||[]);root.querySelectorAll('[data-tp]').forEach(el=>{const i=num(el.dataset.index,-1);if(i<0||!list[i])return;const k=el.dataset.tp;if(k==='threshold')list[i].successThreshold=el.value===''?null:clamp(num(el.value),1,100);else if(k==='cost')list[i].cost=Math.max(0,num(el.value));else if(k==='level')list[i].level=clamp(num(el.value,1),1,10);else list[i][k]=el.value;});t.abilities=list.map(normalizePower);t.powers=clone(t.abilities);return t;
}
function renderThreatEditorBody(t){
  threatEditBuffer=normalizeThreat(t);const attrs=ATTRS.map((a,i)=>`<label>${escapeHTML(a)}<input id="tea${i}" type="number" value="${num(threatEditBuffer.attributes?.[a])}"></label>`).join('');const imageBlock=`<div class="threat-image-editor-v17"><div class="threat-image-preview-v17">${threatEditBuffer.image?`<img src="${escapeAttr(threatEditBuffer.image)}" alt="Imagem da ameaça" onclick="openThreatImageViewer('${escapeAttr(threatEditBuffer.image)}')">`:'👹'}</div><div><b>Imagem da ameaça</b><p class="muted">A imagem fica salva junto da ameaça da campanha.</p><button class="secondary" onclick="chooseThreatImage()">📷 ${threatEditBuffer.image?'Trocar imagem':'Adicionar imagem'}</button>${threatEditBuffer.image?`<button class="secondary" onclick="v17ThreatPushUndo(true);threatEditBuffer.image='';renderThreatEditorBody(threatEditBuffer)">🗑 Remover imagem</button>`:''}</div></div>`;const powers=(threatEditBuffer.abilities||[]).map((p,i)=>`<div class="threat-power-editor-v17 color-${escapeAttr(p.color||'vermelho')}"><div class="threat-power-head"><div><span class="eyebrow">AÇÃO ${i+1}</span><b>${escapeHTML(p.name)}</b></div><button class="delete" onclick="removeThreatPowerDraft(${i})">×</button></div><div class="form-grid"><label>Nome<input data-tp="name" data-index="${i}" value="${escapeAttr(p.name)}"></label><label>Tipo<select data-tp="type" data-index="${i}">${['Ataque','Habilidade','Defesa','Utilidade','Suporte','Ritual'].map(v=>`<option ${v===p.type?'selected':''}>${v}</option>`).join('')}</select></label><label>Custo PE<input data-tp="cost" data-index="${i}" type="number" min="0" value="${p.cost||0}"></label><label>Atributo<select data-tp="attribute" data-index="${i}">${[...ATTRS,'Sem teste'].map(v=>`<option ${v===p.attribute?'selected':''}>${v}</option>`).join('')}</select></label><label>Teste<input data-tp="check" data-index="${i}" value="${escapeAttr(p.check||'')}" placeholder="1d20 + Força ou 1d100"></label><label>Dano<input data-tp="damage" data-index="${i}" value="${escapeAttr(p.damage||'')}" placeholder="1d8"></label><label>Limiar d100<input data-tp="threshold" data-index="${i}" type="number" min="1" max="100" value="${p.successThreshold??''}" placeholder="80"></label><label>Alcance<input data-tp="range" data-index="${i}" value="${escapeAttr(p.range||'')}"></label><label>Cor<select data-tp="color" data-index="${i}">${['amarelo','azul','verde','vermelho','roxo','rosa','cinza'].map(v=>`<option ${v===(p.color||'vermelho')?'selected':''}>${v}</option>`).join('')}</select></label><label class="wide">Descrição / como funciona<textarea data-tp="desc" data-index="${i}" placeholder="Explique exatamente o efeito.">${escapeHTML(p.desc||'')}</textarea></label><label class="wide">Efeito especial<textarea data-tp="effect" data-index="${i}" placeholder="Ex.: empurra, queima, cura, reduz dano...">${escapeHTML(p.effect||'')}</textarea></label></div></div>`).join('');return `${imageBlock}<div class="form-grid threat-base-editor-v17"><label>Nome<input id="teName" value="${escapeAttr(threatEditBuffer.name)}" placeholder="Ex.: Capitão da Maré"></label><label>PV máximo<input id="teHP" type="number" value="${threatEditBuffer.hpMax}"></label><label>PV atual<input id="teCur" type="number" value="${threatEditBuffer.hpCurrent}"></label><label>Ataque base<input id="teAtk" type="number" value="${threatEditBuffer.attack}"></label><label>Nível<input id="teLvl" type="number" min="1" max="10" value="${threatEditBuffer.level}"></label><label>Fruta / poder<input id="teFruit" value="${escapeAttr(threatEditBuffer.fruit||'')}" placeholder="Ex.: Mera Mera no Mi"></label><label class="wide">Itens / equipamentos<input id="teItems" value="${escapeAttr((threatEditBuffer.items||[]).map(x=>x.name).join(', '))}" placeholder="Ex.: espada, pistola, munição"></label><label class="wide">Descrição<textarea id="teDesc" placeholder="Explique a ameaça.">${escapeHTML(threatEditBuffer.desc||'')}</textarea></label></div><div class="quick-attribute-grid threat-attributes-v17">${attrs}</div><div class="threat-powers-header threat-powers-header-v17"><div><h3>⚔️ Ataques e habilidades</h3><p class="muted">Cada ação tem seu teste, dano, PE, d100, cor e explicação.</p></div><button class="secondary" onclick="addThreatPowerDraft()">＋ Adicionar ação</button></div><div id="threatPowerDrafts" class="threat-powers-stack-v17">${powers}</div><div class="threat-edit-savebar threat-edit-savebar-v17"><div><b>Editor protegido</b><small>Clique fora da janela não fecha nem apaga seu progresso.</small></div><div class="threat-editor-history"><button class="secondary" onclick="threatUndo()">↶ Desfazer</button><button class="secondary" onclick="threatRedo()">↷ Refazer</button></div><div class="threat-editor-save-actions"><button class="secondary" onclick="saveThreatEdit('${escapeAttr(threatEditingCampaignId)}',${threatEditingIndex},false)">💾 Salvar as alterações</button><button class="primary" onclick="saveThreatEdit('${escapeAttr(threatEditingCampaignId)}',${threatEditingIndex},true)">✅ Salvar e sair</button></div></div>`;
}
function editThreat(cid,index){
  const c=getCampaign(cid),t=c?.threats[index];if(!t)return;threatEditingCampaignId=cid;threatEditingIndex=index;threatEditBuffer=normalizeThreat(t);v17ThreatUndo=[clone(threatEditBuffer)];v17ThreatRedo=[];$('editThreatTitle').textContent=`Editar ameaça: ${threatEditBuffer.name}`;$('editThreatBody').innerHTML=renderThreatEditorBody(threatEditBuffer);openModal('threatEditModal');
}
function addThreatPowerDraft(){if(!threatEditBuffer)return;v17ThreatPushUndo(true);readThreatEditorAll();const next=threatEditBuffer.abilities.length+1;threatEditBuffer.abilities.push(normalizePower({id:uid(),name:`Nova ação ${next}`,origin:'Ameaça',level:threatEditBuffer.level,cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:'Explique exatamente como esta ação funciona.',effect:'',color:'vermelho'}));renderThreatEditorBody(threatEditBuffer);}
function removeThreatPowerDraft(index){if(!threatEditBuffer)return;v17ThreatPushUndo(true);readThreatEditorAll();if(threatEditBuffer.abilities.length<=1){showToast('Mantenha pelo menos uma ação.');return;}threatEditBuffer.abilities.splice(index,1);renderThreatEditorBody(threatEditBuffer);}
function threatUndo(){if(!threatEditBuffer||v17ThreatUndo.length<=1){showToast('Nada para desfazer.');return;}const currentState=readThreatEditorAll();v17ThreatRedo.push(clone(currentState));v17ThreatUndo.pop();threatEditBuffer=clone(v17ThreatUndo[v17ThreatUndo.length-1]);renderThreatEditorBody(threatEditBuffer);showToast('↶ Alteração desfeita.');}
function threatRedo(){if(!threatEditBuffer||!v17ThreatRedo.length){showToast('Nada para refazer.');return;}const currentState=readThreatEditorAll();v17ThreatUndo.push(clone(currentState));threatEditBuffer=clone(v17ThreatRedo.pop());renderThreatEditorBody(threatEditBuffer);showToast('↷ Alteração refeita.');}
function saveThreatEdit(cid,index,closeAfter=true){
  const c=getCampaign(cid),old=c?.threats[index];if(!c||!old)return false;const t=readThreatEditorAll();if(!t)return false;t.image=String(threatEditBuffer?.image??old.image??'');t=normalizeThreat(t);c.threats[index]=t;saveCampaigns();renderThreats();if(activeCampaignPageId===cid)refreshCampaignView(cid);showToast('✅ Alterações da ameaça salvas.');if(closeAfter){closeModal('threatEditModal');threatEditBuffer=null;v17ThreatUndo=[];v17ThreatRedo=[];showToast('✅ Ameaça salva e editor fechado.');}return true;
}
function handleThreatImage(event){const file=event.target.files?.[0];if(!file||!threatEditBuffer)return;if(!/^image\/(png|jpe?g|webp)$/i.test(file.type)){showToast('Use PNG, JPG ou WEBP.');event.target.value='';return;}if(file.size>4*1024*1024){showToast('Imagem acima de 4 MB.');event.target.value='';return;}v17ThreatPushUndo(true);compressImageFile(file,900,.80).then(data=>{threatEditBuffer=readThreatEditorAll()||threatEditBuffer;threatEditBuffer.image=data;renderThreatEditorBody(threatEditBuffer);showToast('🖼️ Imagem adicionada. Não esqueça de salvar.');}).catch(()=>showToast('Não foi possível processar a imagem.'));event.target.value='';}

/* ---------- AURA: NÃO ALTERA PV MÁXIMO ---------- */
function calc(a){
  const race=RACES[a.race]||RACES.Humano;const roles=(a.roles||[]).map(x=>ROLES[x]||ROLES.Nenhum);const level=clamp(num(a.level,1),1,10);const racialCon=num(race.b?.Constituição);const baseCon=num(a.attributes?.Constituição)+racialCon;const baseStr=num(a.attributes?.Força)+num(race.b?.Força);const baseDex=num(a.attributes?.Destreza)+num(race.b?.Destreza);const auraDex=a.auraActive&&['Aura EX','Aura GX'].includes(a.aura)?(a.aura==='Aura GX'?2:1):0;const auraStr=a.auraActive&&['Aura EX','Aura GX'].includes(a.aura)?(a.aura==='Aura GX'?2:1):0;const auraCon=a.auraActive&&['Aura EX','Aura GX'].includes(a.aura)?(a.aura==='Aura GX'?2:1):0;const hpMax=RULES.baseHP+(baseCon*2)+(race.hp||0)+roles.reduce((s,r)=>s+num(r.hp),0)+((level-1)*2);const peMax=RULES.basePE+attrTotal(a,'Inteligência')+attrTotal(a,'Presença')+attrTotal(a,'Vontade')+roles.reduce((s,r)=>s+num(r.pe),0)+(level-1);const defense=10+baseDex+auraDex;const initiative=baseDex+auraDex+attrTotal(a,'Vontade');const movement=6+Math.max(0,baseDex+auraDex);return {hpMax:Math.max(1,hpMax),peMax:Math.max(0,peMax),defense,initiative,movement,roles,aura:{forca:auraStr,destreza:auraDex,constituicao:auraCon}};
}
function toggleCampaignAura(cid,index){const c=getCampaign(cid),m=c?.members[index];if(!m)return;const a=normalizeAgent(m.agent);if(!a.aura||a.aura==='Nenhuma'){showToast('Este personagem ainda não escolheu uma Aura.');return;}a.auraActive=!a.auraActive;a.auraSkipNext=false;const cc=calc(a);a.hpCurrent=clamp(a.hpCurrent,0,cc.hpMax);m.agent=normalizeAgent(a);saveCampaigns();refreshCampaignView(cid);showToast(a.auraActive?'🟢 Aura ativada. Defesa/iniciativa/movimento podem aumentar; PV máximo não muda.':'⚪ Aura desativada. Bônus temporários removidos.');}

/* ---------- IMPEDIR FECHAMENTO INVOLUNTÁRIO DOS EDITORES ---------- */
function initialize(){
  const prefs=loadJSON(STORAGE.prefs,{});applyColorTheme(prefs.color||'escuro');const user=localStorage.getItem(STORAGE.user);if(user&&$('accountButton'))$('accountButton').textContent=user;
  agents=ensureUniqueIds(agents.map(normalizeAgent));saveAgents();homebrew=normalizeHomebrew(homebrew);saveHomebrew();campaigns=campaigns.map(normalizeCampaign);saveCampaigns();
  $('avatarFile')?.addEventListener('change',handleAvatar);$('importFile')?.addEventListener('change',handleImport);$('threatImageFile')?.addEventListener('change',handleThreatImage);$('librarySearch')?.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal('libraryModal');});
  document.addEventListener('click',e=>{if(!e.target.classList.contains('modal'))return;const protectedModals=['threatEditModal','homebrewEditModal','editModal'];if(protectedModals.includes(e.target.id))return;closeModal(e.target.id);});
  setupPWA();renderAgents();renderThreats();renderCampaigns();renderHomebrew();showInstallButton(true);setupDiceDrag();
  const threatModal=$('threatEditModal');if(threatModal&&!threatModal.dataset.historyListeners){threatModal.dataset.historyListeners='1';threatModal.addEventListener('focusin',()=>{if(threatEditBuffer)v17ThreatPushUndo();});}
}

/* ---------- HOME BREW FRUIT: refresh library/ficha ---------- */
function setHomebrewTabAndRefresh(tab){homebrewTab=tab;renderHomebrew();}

/* ---------- V17: versão do PWA ---------- */
async function setupPWA(){
  if('serviceWorker' in navigator){try{const regs=await navigator.serviceWorker.getRegistrations();for(const reg of regs){try{await reg.update()}catch(_){}}const reg=await navigator.serviceWorker.register('./sw.js?v=25');try{await reg.update()}catch(_){}}catch(_){}}
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;showInstallButton(true);});window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;showInstallButton(true);showToast('📱 WEIRD RPG instalado no aparelho!');});
}

/* Ao selecionar fruta, a biblioteca usa IDs e também mostra Homebrew. */
if(typeof homebrew==='object') homebrew=normalizeHomebrew(homebrew);


/* ============================================================
   WEIRD RPG V17 — SEGUNDO BLOCO / AJUSTES FINAIS
   ============================================================ */

/* Corrige a edição de ameaça sem fechar ao clicar fora e sem perder dados. */
function saveThreatEdit(cid,index,closeAfter=true){
  const c=getCampaign(cid),old=c?.threats[index];
  if(!c||!old)return false;
  const draft=readThreatEditorAll();
  if(!draft)return false;
  draft.image=String(threatEditBuffer?.image??old.image??'');
  const t=normalizeThreat(draft);
  c.threats[index]=t;
  saveCampaigns();
  renderThreats();
  if(activeCampaignPageId===cid)refreshCampaignView(cid);
  if(closeAfter){
    closeModal('threatEditModal');
    threatEditBuffer=null;v17ThreatUndo=[];v17ThreatRedo=[];
    showToast('✅ Ameaça salva e editor fechado.');
  }else{
    threatEditBuffer=clone(t);
    v17ThreatUndo=[clone(t)];v17ThreatRedo=[];
    renderThreatEditorBody(threatEditBuffer);
    showToast('💾 Alterações salvas. O editor continua aberto.');
  }
  return true;
}

function removeItemById(id){
  const index=current?.items?.findIndex(x=>x.id===id);
  if(index==null||index<0)return;
  if(!confirmAction(`Tirar ${current.items[index].name||'este item'} do inventário?`))return;
  current.items.splice(index,1);
  persistCurrent();renderEditor();renderSheet();showToast('🗑 Item removido do inventário.');
}
function renderInventoryRows(){
  const query=getInventoryQuery().toLowerCase();
  const list=current.items.filter(x=>(inventoryFilter==='Todos'||x.type===inventoryFilter)&&`${x.name} ${x.desc} ${x.type}`.toLowerCase().includes(query));
  if(!list.length)return '<div class="empty-small">Nenhum item encontrado.</div>';
  return list.map(item=>{
    const i=current.items.findIndex(x=>x.id===item.id);
    const icon=item.type==='Arma'?'⚔️':item.type==='Armadura'?'🛡️':item.type==='Consumível'?'🧪':item.type==='Navegação'?'🧭':item.type==='Munição'?'🎯':'📦';
    return `<div class="inventory-row ${item.equipped?'equipped':''}"><div class="item-icon">${icon}</div><div class="item-info"><b>${escapeHTML(item.name)}</b><small>${escapeHTML(item.type)} • ${escapeHTML(item.origin||'Biblioteca')}</small><p>${escapeHTML(item.desc||'')}</p>${item.bonus?`<span class="tag">${escapeHTML(item.bonus)}</span>`:''}${item.effect?`<span class="tag">${escapeHTML(item.effect)}</span>`:''}</div><div class="item-quantity"><button title="Diminuir 1" onclick="changeItemQuantity(${i},-1)">−</button><input type="number" min="0" value="${num(item.quantity,1)}" onchange="setItemQuantity(${i},this.value)"><button title="Aumentar 1" onclick="changeItemQuantity(${i},1)">＋</button><small>qtd.</small></div>${item.type==='Arma'?`<label class="switch equip-switch" title="Ativar esta arma no combate"><input type="checkbox" ${item.equipped?'checked':''} onchange="toggleItemEquip(${i},this.checked)"><span></span></label>`:'<span class="not-equip">—</span>'}<button type="button" class="secondary inventory-edit-btn" onclick="openEditModal('items',${i},'Editar item')">✎ Editar</button><button type="button" class="secondary inventory-remove-btn" onclick="removeItemById('${escapeAttr(item.id)}')">🗑 Tirar</button></div>`;
  }).join('');
}

/* Mostra fruta dentro de PODERES, com seções recolhíveis. */
function renderSheetPowers(){
  const race=current.raceAbilities||[],custom=current.abilities||[],selectedHaki=getHakiCombatPowers(current);const chosenFruit=[];
  if(current.fruit){
    (current.fruitChoices||[]).forEach(name=>{const p=(current.fruit.starterPowers||[]).find(x=>x.name===name);if(p)chosenFruit.push(getFruitOverride(current,p));});
    Object.entries(current.fruitSelections||{}).sort((a,b)=>Number(a[0])-Number(b[0])).forEach(([level,id])=>{const p=fruitPowerOptions(current.fruit,Number(level)).find(x=>x.id===id);if(p)chosenFruit.push(getFruitOverride(current,p));});
  }
  const powerButton=(p)=>`<div class="sheet-power-row color-${escapeAttr(p.color||originColor(p.origin))}"><div><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.origin||'Poder')} • ${p.cost||0} PE • ${escapeHTML(p.check||'Sem teste')}${p.damage?` • ${escapeHTML(p.damage)}`:''}</small><p>${escapeHTML(p.desc||p.effect||'')}</p></div><div class="row-actions"><button class="info-btn" onclick="openPowerDetail(${JSON.stringify(p).replaceAll('"','&quot;')})">ⓘ Entender</button><button class="dice-btn" onclick="usePowerByObject(${JSON.stringify(p).replaceAll('"','&quot;')})">🎲 Usar</button></div></div>`;
  return `<section class="sheet-section"><div class="section-head"><div><span class="eyebrow">PODERES</span><h2>Haki, Aura e Akuma no Mi</h2></div>${sheetEditButton('Editar poderes','powers')}</div><div class="powers-dashboard"><div class="lore-card haki-sheet-card"><span class="eyebrow">HAKI</span><h3>Haki pronto para usar</h3><div class="haki-sheet-actions">${selectedHaki.length?selectedHaki.map(powerButton).join(''):'<span class="tag">Nenhum Haki escolhido.</span>'}</div></div><div class="lore-card aura-direct-card"><span class="eyebrow">AURA</span><h3>${escapeHTML(current.aura)}</h3><p>${current.auraActive?'🟢 Aura ativa':'⚪ Aura inativa'}${current.auraSkipNext?' • próximo teste ignorado':''}</p><button class="primary" onclick="toggleAuraFromSheet()">${current.auraActive?'⏹ Desativar aura':'🟢 Ativar aura'}</button><small>Aura não aumenta PV máximo. EX/GX alteram atributos e, por consequência, defesa, iniciativa e movimento.</small></div></div>${current.fruit?`<div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">🍈 AKUMA NO MI</span><h3>${escapeHTML(current.fruit.name)}</h3><p class="muted">Poderes escolhidos aparecem aqui. A setinha abre ou fecha os detalhes.</p></div></div><details class="fruit-powers-sheet-details" open><summary>🍈 Poderes escolhidos • ${chosenFruit.length}</summary><div class="sheet-power-stack">${chosenFruit.length?chosenFruit.map(powerButton).join(''):'<span class="muted">Nenhum poder de fruta escolhido ainda.</span>'}</div></details></div>`:''}<div class="subsection"><div class="section-head compact-head"><div><span class="eyebrow">HABILIDADES DA FICHA</span><h3>Raça e outras habilidades</h3></div>${sheetEditButton('Adicionar habilidade','powers')}</div>${race.concat(custom).length?race.concat(custom).map((p,i)=>powerButton(p)).join(''):'<span class="muted">Nenhuma habilidade adicionada.</span>'}</div></section>`;
}

/* ---------- CAMPANHA V17: BOARD ESTÁVEL ---------- */
function renderCampaignBoard(c){
  const entities=getCampaignEntities(c);const next=entities.find(e=>isCurrentTurn(c,e.key));
  return `<div class="campaign-v17-shell" data-campaign-board="${escapeAttr(c.id)}"><div class="campaign-v17-sticky"><div class="campaign-v17-sticky-inner"><div><span class="eyebrow" data-campaign-round>MESA LOCAL • RODADA ${c.round}</span><h2 data-campaign-title>${escapeHTML(c.name)}</h2><p>Código: <b data-campaign-code>${escapeHTML(c.code)}</b></p></div><div class="campaign-v17-sticky-actions"><button type="button" class="secondary" onclick="openCampaignAddSelector('agent','${escapeAttr(c.id)}')">＋ Agente</button><button type="button" class="secondary" onclick="openCampaignAddSelector('threat','${escapeAttr(c.id)}')">＋ Ameaça</button><button type="button" class="secondary" onclick="closeCampaignPage()">← Campanhas</button></div></div></div><div class="campaign-v17-content"><div class="campaign-v17-session"><div><span class="eyebrow">MESA LOCAL</span><h3>Painel do Mestre</h3><p>Controle iniciativa, turno, PV, PE, Aura, ações rápidas e histórico sem abandonar a mesa.</p></div><div class="campaign-v17-code">🎟️ ${escapeHTML(c.code)}</div></div><section class="campaign-v17-turn"><div class="campaign-v17-turn-box" data-campaign-turn><span>VEZ ATUAL</span><b>${escapeHTML(next?.name||'Defina a iniciativa')}</b><small>${next?`${next.type==='agent'?'Agente':'Ameaça'} • Iniciativa ${c.initiatives[next.key]??'—'}`:'Role a iniciativa para começar.'}</small></div><div class="campaign-v17-turn-actions"><button type="button" class="primary big" onclick="rollAllInitiatives('${escapeAttr(c.id)}')">🎲 Rolar iniciativas</button><button type="button" class="secondary big" onclick="passCampaignTurn('${escapeAttr(c.id)}')">▶ Passar turno</button><button type="button" class="secondary" onclick="resetCampaignTurn('${escapeAttr(c.id)}')">↻ Reiniciar</button></div></section><section class="campaign-v17-order" data-campaign-order><div><span class="eyebrow">ORDEM</span><small>${entities.length} participante(s)</small></div>${entities.length?entities.map((e,i)=>`<div class="campaign-v17-init-chip ${isCurrentTurn(c,e.key)?'active':''}"><b>${i+1}</b><span>${escapeHTML(e.name)}</span><small>${c.initiatives[e.key]??'—'}</small></div>`).join(''):'<span class="muted">Nenhum participante ainda.</span>'}</section><section class="campaign-v17-section"><div class="campaign-v17-section-head"><div><span class="eyebrow">JOGADORES</span><h3>👥 Participantes</h3><p>Resumo, ficha completa, edição, recursos e ações rápidas.</p></div><button type="button" class="secondary" onclick="openCampaignAddSelector('agent','${escapeAttr(c.id)}')">＋ Adicionar agente</button></div><div class="campaign-v17-grid" data-campaign-members>${c.members.length?c.members.map((m,i)=>campaignMemberCard(c,m,i)).join(''):'<div class="empty-small">Nenhum personagem na mesa.</div>'}</div></section><section class="campaign-v17-section"><div class="campaign-v17-section-head"><div><span class="eyebrow">AMEAÇAS</span><h3>👹 Ameaças</h3><p>Use ações rápidas ou abra a ficha completa para o Mestre.</p></div><button type="button" class="secondary" onclick="openCampaignAddSelector('threat','${escapeAttr(c.id)}')">＋ Adicionar ameaça</button></div><div class="campaign-v17-grid" data-campaign-threats>${c.threats.length?c.threats.map((t,i)=>campaignThreatCard(c,t,i)).join(''):'<div class="empty-small">Nenhuma ameaça na mesa.</div>'}</div></section><section class="campaign-v17-history"><div class="campaign-v17-history-head"><div><span class="eyebrow">HISTÓRICO</span><h3>🎲 Rolagens desta mesa</h3><p>Somente dados rolados enquanto esta campanha estava aberta aparecem aqui.</p></div><button type="button" class="delete" onclick="clearCampaignHistory('${escapeAttr(c.id)}')">🗑 Apagar histórico</button></div><div data-campaign-history>${c.rollHistory.slice(0,80).length?c.rollHistory.slice(0,80).map(x=>`<div class="campaign-v17-history-row"><span>${escapeHTML(x.time)}</span><b>${escapeHTML(x.participant)}</b><p>${escapeHTML(x.text)}</p></div>`).join(''):'<div class="empty-small">Nenhuma rolagem.</div>'}</div></section></div></div>`;
}
function refreshCampaignView(cid,options={}){
  const c=getCampaign(cid);if(!c)return;if(activeCampaignPageId!==cid){openCampaign(cid);return;}const root=$('campaignPageRoot');const board=root?.querySelector('[data-campaign-board]');if(!board){renderCampaigns();return;}const scrollY=window.scrollY,scrollX=window.scrollX;const active=document.activeElement;const activeId=active?.id||'';const focusedValue=active&&('value' in active)?active.value:null;const round=board.querySelector('[data-campaign-round]');if(round)round.textContent=`MESA LOCAL • RODADA ${c.round}`;const title=board.querySelector('[data-campaign-title]');if(title)title.textContent=c.name;const code=board.querySelector('[data-campaign-code]');if(code)code.textContent=c.code;const entities=getCampaignEntities(c),next=entities.find(e=>isCurrentTurn(c,e.key));const turn=board.querySelector('[data-campaign-turn]');if(turn)turn.innerHTML=`<span>VEZ ATUAL</span><b>${escapeHTML(next?.name||'Defina a iniciativa')}</b><small>${next?`${next.type==='agent'?'Agente':'Ameaça'} • Iniciativa ${c.initiatives[next.key]??'—'}`:'Role a iniciativa para começar.'}</small>`;const order=board.querySelector('[data-campaign-order]');if(order)order.innerHTML=`<div><span class="eyebrow">ORDEM</span><small>${entities.length} participante(s)</small></div>${entities.length?entities.map((e,i)=>`<div class="campaign-v17-init-chip ${isCurrentTurn(c,e.key)?'active':''}"><b>${i+1}</b><span>${escapeHTML(e.name)}</span><small>${c.initiatives[e.key]??'—'}</small></div>`).join(''):'<span class="muted">Nenhum participante ainda.</span>'}`;const members=board.querySelector('[data-campaign-members]');if(members)members.innerHTML=c.members.length?c.members.map((m,i)=>campaignMemberCard(c,m,i)).join(''):'<div class="empty-small">Nenhum personagem na mesa.</div>';const threats=board.querySelector('[data-campaign-threats]');if(threats)threats.innerHTML=c.threats.length?c.threats.map((t,i)=>campaignThreatCard(c,t,i)).join(''):'<div class="empty-small">Nenhuma ameaça na mesa.</div>';const history=board.querySelector('[data-campaign-history]');if(history)history.innerHTML=c.rollHistory.slice(0,80).length?c.rollHistory.slice(0,80).map(x=>`<div class="campaign-v17-history-row"><span>${escapeHTML(x.time)}</span><b>${escapeHTML(x.participant)}</b><p>${escapeHTML(x.text)}</p></div>`).join(''):'<div class="empty-small">Nenhuma rolagem.</div>';
  requestAnimationFrame(()=>{window.scrollTo({left:scrollX,top:scrollY,behavior:'auto'});if(activeId){const el=$(activeId);if(el&&document.activeElement!==el){try{el.focus({preventScroll:true})}catch{}}if(el&&focusedValue!==null&&'value' in el)el.value=focusedValue;}});if(options.toast)showToast(options.toast);
}

/* ---------- MAIS DETALHES NAS AMEAÇAS ---------- */
function campaignThreatCard(c,t,index){
  const key=`t:${t.id}`,initiative=c.initiatives[key],hpPct=t.hpMax?clamp(t.hpCurrent/t.hpMax*100,0,100):0;const actions=(t.abilities||[]).map((p,pi)=>`<div class="campaign-v17-power-row color-${escapeAttr(p.color||'vermelho')}"><button type="button" class="campaign-v17-power-use" onclick="campaignRollThreat('${escapeAttr(c.id)}',${index},${pi})"><span>🎲</span><b>${escapeHTML(p.name||'Ação')}</b><small>${p.cost?`${p.cost} PE`:'Sem PE'}</small></button><button type="button" class="campaign-v17-power-info" onclick="campaignPowerInfo('${escapeAttr(c.id)}','threat',${index},${pi})">ⓘ</button></div>`).join('')||'<span class="campaign-v17-empty-action">Nenhuma ação cadastrada.</span>';const image=t.image?`<img src="${escapeAttr(t.image)}" alt="${escapeAttr(t.name)}" onclick="openThreatImageViewer('${escapeAttr(t.image)}')" onerror="this.style.display='none';this.parentElement.classList.add('image-failed')">`:'👹';return `<article class="campaign-v17-card threat ${isCurrentTurn(c,key)?'current-turn':''}"><div class="campaign-v17-head"><div class="campaign-v17-avatar threat">${image}</div><div class="campaign-v17-identity"><div class="campaign-v17-title-row"><h4>${escapeHTML(t.name)}</h4><span class="campaign-v17-badge threat">AMEAÇA</span></div><p>Nível ${t.level} • ATK +${t.attack} • Iniciativa ${initiative??'—'}</p><div class="campaign-v17-pills"><span>❤️ PV <b>${t.hpCurrent}/${t.hpMax}</b></span><span>⚔️ AÇÕES <b>${t.abilities?.length||0}</b></span>${t.fruit?`<span>🍈 ${escapeHTML(t.fruit)}</span>`:''}</div></div></div><div class="campaign-v17-resources single"><div class="campaign-v17-resource hp"><div><span>❤️ PV</span><b>${t.hpCurrent}/${t.hpMax}</b></div><div class="campaign-v17-track red"><i style="width:${hpPct}%"></i></div></div></div><div class="campaign-v17-controls"><div class="campaign-v17-resource-controls"><div class="campaign-v17-control"><strong>PV</strong><button class="mini-btn danger" onclick="threatResource('${escapeAttr(c.id)}',${index},-1)">−1</button><button class="mini-btn" onclick="threatResource('${escapeAttr(c.id)}',${index},1)">+1</button></div></div><div class="campaign-v17-actions"><button type="button" class="secondary" onclick="campaignRollInitiative('${escapeAttr(c.id)}','${escapeAttr(key)}')">🎲 Iniciativa</button><button type="button" class="secondary" onclick="openThreatFromCampaign('${escapeAttr(c.id)}',${index})">📋 Resumo</button><button type="button" class="primary" onclick="openThreatFullCampaignSheet('${escapeAttr(c.id)}',${index})">🧾 Ficha completa</button><button type="button" class="secondary" onclick="editThreat('${escapeAttr(c.id)}',${index})">✎ Editar</button><button type="button" class="secondary campaign-v17-danger" onclick="removeCampaignThreat('${escapeAttr(c.id)}',${index})">🗑 Remover</button></div></div><div class="campaign-v17-action-area"><div class="campaign-v17-action-title"><b>⚔️ Ataques e habilidades</b><small>🎲 usa • ⓘ explica.</small></div><div class="campaign-v17-power-list">${actions}</div></div></article>`;
}

/* ---------- SAVE / EDITOR DE CAMPANHA: 2 BOTÕES ---------- */
function editCampaignAgent(cid,index){
  const c=getCampaign(cid),m=c?.members[index];if(!m)return;const a=normalizeAgent(m.agent);detailContext={campaignEditAgent:true,campaignId:cid,index};$('detailBody').innerHTML=`<span class="eyebrow">EDITAR AGENTE NA MESA</span><h2>✎ ${escapeHTML(a.name||'Sem nome')}</h2><p class="muted">As mudanças são salvas no agente e imediatamente sincronizadas com esta campanha.</p><div class="form-grid campaign-v17-edit-form"><label>Nome<input id="caName" value="${escapeAttr(a.name)}"></label><label>Nível<input id="caLevel" type="number" min="1" max="10" value="${a.level}"></label><label>PV atual<input id="caHP" type="number" min="0" value="${a.hpCurrent}"></label><label>PE atual<input id="caPE" type="number" min="0" value="${a.peCurrent}"></label></div><div class="row-actions detail-actions"><button class="secondary" type="button" onclick="closeModal('detailModal')">Cancelar</button><button class="primary" type="button" onclick="saveCampaignAgentQuickEdit()">💾 Salvar alterações</button></div>`;openDetailModal();}

/* ---------- RESULTADO DE DADOS / DRAG + VISUAL ---------- */
function showRollResult(title,details,extra=''){
  const el=$('diceResult');if(!el)return showToast(`${title}: ${details}`);$('diceResultTitle').textContent=title;$('diceResultMain').textContent=details;$('diceResultExtra').textContent=extra;el.classList.remove('hidden');el.classList.add('visible');el.setAttribute('aria-live','polite');clearTimeout(showRollResult.timer);}

/* ---------- INICIALIZAÇÃO V17 ---------- */
function initialize(){
  const prefs=loadJSON(STORAGE.prefs,{});applyColorTheme(prefs.color||'escuro');const user=localStorage.getItem(STORAGE.user);if(user&&$('accountButton'))$('accountButton').textContent=user;
  agents=ensureUniqueIds(agents.map(normalizeAgent));saveAgents();homebrew=normalizeHomebrew(homebrew);saveHomebrew();campaigns=campaigns.map(normalizeCampaign);saveCampaigns();
  $('avatarFile')?.addEventListener('change',handleAvatar);$('importFile')?.addEventListener('change',handleImport);$('threatImageFile')?.addEventListener('change',handleThreatImage);
  $('librarySearch')?.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal('libraryModal');});
  document.addEventListener('click',e=>{if(!e.target.classList.contains('modal'))return;const protectedModals=['threatEditModal','homebrewEditModal','editModal'];if(protectedModals.includes(e.target.id))return;closeModal(e.target.id);});
  setupPWA();renderAgents();renderThreats();renderCampaigns();renderHomebrew();showInstallButton(true);setupDiceDrag();
  if($('threatEditModal')&&!$('threatEditModal').dataset.v17History){$('threatEditModal').dataset.v17History='1';$('threatEditModal').addEventListener('focusin',()=>{if(threatEditBuffer)v17ThreatPushUndo();});}
}


/* ============================================================
   WEIRD RPG V18 — CONSOLIDAÇÃO / EXPERIÊNCIA FINAL
   ------------------------------------------------------------
   Este bloco corrige pontos de integração encontrados na V17:
   - ações Homebrew de ameaças persistentes e visíveis
   - IDs estáveis das ações durante o editor
   - resumo de ameaça separado do editor
   - alterações do editor sincronizadas imediatamente com a campanha
   - exportação V18
   - resultado de dados realmente arrastável
   - visual/UX de história e detalhes reforçados
   ============================================================ */

function dedupePowers(list, fallbackOrigin='Ação'){
  const seen=new Set();
  return (Array.isArray(list)?list:[]).map(p=>normalizePower(p)).map((p,i)=>{
    if(!p.id||seen.has(p.id))p.id=uid();
    seen.add(p.id);
    if(!p.origin)p.origin=fallbackOrigin;
    return p;
  });
}

/* Mantém abilities e powers sincronizados sem apagar ações criadas pelo Mestre. */
function normalizeThreat(threat){
  const t=clone(threat||{});
  t.id=t.id||uid();
  t.name=text(t.name)||'Ameaça';
  t.hpMax=Math.max(1,num(t.hpMax,t.hp||10));
  t.hpCurrent=clamp(num(t.hpCurrent,t.hpMax),0,t.hpMax);
  t.attack=num(t.attack);
  t.level=clamp(num(t.level,1),1,10);
  t.desc=text(t.desc);
  t.fruit=text(t.fruit);
  t.image=text(t.image);
  t.items=Array.isArray(t.items)?t.items.map(normalizeItem):[];
  const oldAttrs=(t.attributes&&typeof t.attributes==='object')?t.attributes:{};
  if(oldAttrs.Carisma!==undefined&&oldAttrs.Presença===undefined)oldAttrs.Presença=oldAttrs.Carisma;
  t.attributes=Object.fromEntries(ATTRS.map(a=>[a,clamp(num(oldAttrs[a]),-2,20)]));

  const fromAbilities=Array.isArray(t.abilities)?t.abilities:[];
  const fromPowers=Array.isArray(t.powers)?t.powers:[];
  let source=fromAbilities.length?fromAbilities:fromPowers;
  if(!source.length){
    source=[{id:uid(),name:'Ataque básico',origin:'Ameaça',level:t.level,cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:'Ataque básico da ameaça.',color:'vermelho'}];
  }
  t.abilities=dedupePowers(source,'Ameaça');
  t.powers=clone(t.abilities);
  t.initiative=t.initiative??null;
  return t;
}

/* Ameaças Homebrew também entram na lista pública do Mestre. */
function allThreatEntries(){
  const built=THREATS.map((tuple,i)=>{
    const data=normalizeThreat({
      id:`builtin-${i}-${String(tuple[0]).replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase()}`,
      name:tuple[0],hpMax:tuple[1],hpCurrent:tuple[1],attack:tuple[2],desc:tuple[3],level:1,
      abilities:[{id:`builtin-action-${i}`,name:'Ataque básico',origin:'Ameaça',level:1,cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:tuple[3],color:'vermelho'}]
    });
    return {id:data.id,name:data.name,data,homebrew:false};
  });
  const custom=(homebrew.threats||[]).map((raw)=>{const data=normalizeThreat(raw);return {id:data.id,name:data.name,data,homebrew:true};});
  return [...built,...custom];
}

/* Lista de ameaças: built-in + Homebrew, sempre renderizada na página. */
function renderThreats(){
  const box=$('threatList');
  if(!box)return;
  const query=String($('threatSearch')?.value||'').trim().toLowerCase();
  const entries=allThreatEntries().filter(e=>`${e.name} ${e.data.desc||''} ${e.data.fruit||''}`.toLowerCase().includes(query));
  if(!entries.length){
    box.innerHTML=`<div class="empty threat-empty-v18"><b>👹</b><h3>Nenhuma ameaça encontrada</h3><p>Crie uma ameaça no Homebrew ou retire o filtro da busca.</p><button type="button" class="primary" onclick="openThreatHomebrewFromPage()">＋ Criar ameaça</button></div>`;
    return;
  }
  box.innerHTML=entries.map((entry)=>{
    const t=normalizeThreat(entry.data);
    const actions=t.abilities||[];
    const image=t.image
      ? `<img class="threat-list-image" src="${escapeAttr(t.image)}" alt="${escapeAttr(t.name)}" onclick="openThreatImageViewer('${escapeAttr(t.image)}')" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('image-failed')">`
      : `<div class="threat-list-image placeholder">👹</div>`;
    const tags=actions.slice(0,4).map(p=>`<span class="tag color-tag color-${escapeAttr(p.color||'vermelho')}">⚔️ ${escapeHTML(p.name)}</span>`).join('');
    const idxHome=homebrew.threats.findIndex(x=>x.id===entry.id);
    return `<article class="threat-card-v18 ${entry.homebrew?'homebrew-threat':''}">
      <div class="threat-card-v18-image">${image}</div>
      <div class="threat-card-v18-body">
        <div class="threat-card-v18-top"><span class="library-kind ${entry.homebrew?'homebrew':''}">${entry.homebrew?'HOMEBREW':'BIBLIOTECA'}</span><span class="threat-level-badge">Nível ${t.level}</span></div>
        <h3>${escapeHTML(t.name)}</h3>
        <p>${escapeHTML(t.desc||'Sem descrição.')}</p>
        <div class="threat-card-stats"><span>❤️ ${t.hpMax} PV</span><span>⚔️ +${t.attack} ATK</span><span>🧩 ${actions.length} ações</span>${t.fruit?`<span>🍈 ${escapeHTML(t.fruit)}</span>`:''}</div>
        <div class="threat-card-actions-tags">${tags||'<span class="tag">Sem ações cadastradas</span>'}</div>
        <div class="agent-actions threat-card-buttons"><button type="button" class="primary" onclick="previewThreatById('${escapeAttr(entry.id)}')">📜 Ver ficha</button><button type="button" class="secondary" onclick="openCampaignSelector('threat','${escapeAttr(entry.id)}')">⚓ Adicionar à campanha</button>${entry.homebrew?`<button type="button" class="secondary" onclick="openHomebrewEdit('threats',${idxHome})">✎ Editar</button>`:''}</div>
      </div>
    </article>`;
  }).join('');
}

/* Homebrew de ameaças: agora a gravação lê sempre os campos atuais. */
function readHomebrewThreatPowersDraftV18(){
  const list=Array.isArray(detailContext?.threatDraft)?detailContext.threatDraft:[];
  const root=$('homebrewEditBody');
  root?.querySelectorAll('[data-hbtp]').forEach(el=>{
    const i=num(el.dataset.index,-1);
    if(i<0||!list[i])return;
    const key=el.dataset.hbtp;
    let value=el.value;
    if(key==='cost')value=Math.max(0,num(value));
    if(key==='threshold')value=value===''?null:clamp(num(value),1,100);
    list[i][key]=value;
  });
  return dedupePowers(list,'Ameaça • Homebrew');
}

function renderHomebrewThreatEditorV18(x={}){
  const powers=Array.isArray(detailContext?.threatDraft)?detailContext.threatDraft:(x.abilities||x.powers||[]).map(normalizePower);
  detailContext.threatDraft=clone(powers.length?powers:[normalizePower({id:uid(),name:'Ataque básico',origin:'Ameaça • Homebrew',level:1,cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:'Explique esta ação.',color:'rosa'})]);
  const image=detailContext.threatData?.image||x.image||'';
  const actions=detailContext.threatDraft.map((p,i)=>`<article class="threat-power-editor-v18 color-${escapeAttr(p.color||'rosa')}">
    <header><div><span class="eyebrow">AÇÃO ${i+1}</span><b>${escapeHTML(p.name||'Ação')}</b></div><button type="button" class="delete" onclick="removeHomebrewThreatPowerDraft(${i})">×</button></header>
    <div class="form-grid">
      <label>Nome<input data-hbtp="name" data-index="${i}" value="${escapeAttr(p.name)}" placeholder="Ex.: Corte do Mar"></label>
      <label>Tipo<select data-hbtp="type" data-index="${i}">${['Ataque','Habilidade','Defesa','Utilidade','Suporte','Ritual'].map(v=>`<option ${v===p.type?'selected':''}>${v}</option>`).join('')}</select></label>
      <label>Custo PE<input type="number" min="0" data-hbtp="cost" data-index="${i}" value="${p.cost||0}"></label>
      <label>Atributo<select data-hbtp="attribute" data-index="${i}">${[...ATTRS,'Sem teste'].map(v=>`<option ${v===p.attribute?'selected':''}>${v}</option>`).join('')}</select></label>
      <label>Teste<input data-hbtp="check" data-index="${i}" value="${escapeAttr(p.check||'')}" placeholder="1d20 + Força ou 1d100"></label>
      <label>Dano<input data-hbtp="damage" data-index="${i}" value="${escapeAttr(p.damage||'')}" placeholder="1d8"></label>
      <label>Limiar d100<input type="number" min="1" max="100" data-hbtp="threshold" data-index="${i}" value="${p.successThreshold??''}" placeholder="80"></label>
      <label>Alcance<input data-hbtp="range" data-index="${i}" value="${escapeAttr(p.range||'')}" placeholder="Curto / Médio / Longo"></label>
      <label>Cor<select data-hbtp="color" data-index="${i}">${['amarelo','azul','verde','vermelho','roxo','rosa','cinza'].map(v=>`<option ${v===(p.color||'rosa')?'selected':''}>${v}</option>`).join('')}</select></label>
      <label>Duração<input data-hbtp="duration" data-index="${i}" value="${escapeAttr(p.duration||'')}" placeholder="Instantâneo / 2 turnos"></label>
      <label class="wide">Como funciona<textarea data-hbtp="desc" data-index="${i}" placeholder="Explique passo a passo.">${escapeHTML(p.desc||'')}</textarea></label>
      <label class="wide">Efeito especial<textarea data-hbtp="effect" data-index="${i}" placeholder="Queima, empurra, cura, paralisa...">${escapeHTML(p.effect||'')}</textarea></label>
    </div>
  </article>`).join('');
  $('homebrewEditBody').innerHTML=`
    <div class="threat-image-editor-v18">
      <div class="threat-image-preview-v18">${image?`<img src="${escapeAttr(image)}" alt="Imagem da ameaça" onclick="openThreatImageViewer('${escapeAttr(image)}')">`:'👹'}</div>
      <div><b>Imagem da ameaça</b><p class="muted">Ela será salva junto da ameaça e aparecerá na página Ameaças e na campanha.</p><button type="button" class="secondary" onclick="chooseThreatImage()">📷 ${image?'Trocar':'Adicionar'} imagem</button>${image?`<button type="button" class="secondary" onclick="detailContext.threatData.image='';renderHomebrewThreatEditorV18(detailContext.threatData)">🗑 Remover</button>`:''}</div>
    </div>
    <div class="form-grid threat-base-editor-v18">
      <label>Nome<input id="hbName" value="${escapeAttr(x.name||'')}" placeholder="Ex.: Almirante da Névoa"></label>
      <label>PV máximo<input id="hbHP" type="number" min="1" value="${num(x.hpMax,30)}"></label>
      <label>Ataque base<input id="hbAtk" type="number" value="${num(x.attack,5)}"></label>
      <label>Nível<input id="hbLevel" type="number" min="1" max="10" value="${clamp(num(x.level,1),1,10)}"></label>
      <label class="wide">Fruta / poder principal<input id="hbFruit" value="${escapeAttr(x.fruit||'')}" placeholder="Ex.: Mera Mera no Mi"></label>
      <label class="wide">Descrição<textarea id="hbDesc" placeholder="Explique a ameaça e seu papel na cena.">${escapeHTML(x.desc||'')}</textarea></label>
    </div>
    <div class="threat-powers-header threat-powers-header-v18"><div><span class="eyebrow">AÇÕES</span><h3>⚔️ Ataques e habilidades</h3><p class="muted">Todas as ações ficam salvas e aparecem na campanha.</p></div><button type="button" class="secondary" onclick="addHomebrewThreatPowerDraft()">＋ Adicionar ação</button></div>
    <div id="homebrewThreatPowers" class="threat-powers-stack-v18">${actions}</div>
    <div class="homebrew-savebar threat-savebar-v18"><div><b>Homebrew • Ameaça</b><small>Salve e ela aparecerá em Ameaças e nas campanhas.</small></div><button type="button" class="secondary" onclick="closeModal('homebrewEditModal')">Cancelar</button><button type="button" class="primary" onclick="saveHomebrewEntry('threats',${detailContext.index})">💾 Salvar ameaça</button></div>`;
}

function addHomebrewThreatPowerDraft(){
  detailContext.threatDraft=readHomebrewThreatPowersDraftV18();
  const i=detailContext.threatDraft.length+1;
  detailContext.threatDraft.push(normalizePower({id:uid(),name:`Nova ação ${i}`,origin:'Ameaça • Homebrew',level:clamp(num($('hbLevel')?.value,1),1,10),cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:'Explique exatamente como esta ação funciona.',effect:'',color:'rosa'}));
  const currentData={...(detailContext.threatData||{}),name:$('hbName')?.value||detailContext.threatData?.name||'Nova ameaça',hpMax:num($('hbHP')?.value,30),attack:num($('hbAtk')?.value,5),level:num($('hbLevel')?.value,1),fruit:$('hbFruit')?.value||'',desc:$('hbDesc')?.value||'',image:detailContext.threatData?.image||''};
  detailContext.threatData=currentData;renderHomebrewThreatEditorV18(currentData);
}
function removeHomebrewThreatPowerDraft(index){
  detailContext.threatDraft=readHomebrewThreatPowersDraftV18();
  if(detailContext.threatDraft.length<=1){showToast('Mantenha pelo menos uma ação.');return;}
  detailContext.threatDraft.splice(index,1);
  renderHomebrewThreatEditorV18(detailContext.threatData||{});
}

/* Sobrescreve apenas a abertura/salvamento de ameaça Homebrew. */
function openHomebrewEdit(type,index){
  if(type==='threats'){
    const x=homebrew.threats?.[index];if(!x)return;
    detailContext={homebrew:true,type,index,threatDraft:clone((x.abilities||x.powers||[]).map(normalizePower)),threatData:clone(x)};
    $('homebrewEditTitle').textContent=`Editar ameaça: ${x.name}`;
    renderHomebrewThreatEditorV18(x);openModal('homebrewEditModal');return;
  }
  if(type==='fruits'){
    const f=homebrew.fruits?.[index];if(!f)return;
    detailContext={homebrew:true,type,index};v17FruitBuffer=normalizeCustomFruit(f);$('homebrewEditTitle').textContent=`Editar Akuma no Mi: ${v17FruitBuffer.name}`;renderFruitHomebrewEditor();openModal('homebrewEditModal');return;
  }
  if(V17_LEGACY_RENDER_HOME_BREW)V17_LEGACY_RENDER_HOME_BREW.call(null);
  const x=homebrew[type]?.[index];if(!x)return;
  detailContext={homebrew:true,type,index};$('homebrewEditTitle').textContent=`Editar ${homebrewLabel(type)}`;renderHomebrewEditBody(type,x);openModal('homebrewEditModal');
}

function saveHomebrewEntry(type,index){
  if(type==='threats'){
    detailContext.threatDraft=readHomebrewThreatPowersDraftV18();
    const old=index>=0?homebrew.threats[index]:null;
    const image=String(detailContext.threatData?.image||'');
    const item=normalizeThreat({
      ...(old||{}),id:old?.id||uid(),name:$('hbName')?.value.trim()||'Nova ameaça',hpMax:Math.max(1,num($('hbHP')?.value,30)),hpCurrent:Math.max(1,num($('hbHP')?.value,30)),attack:num($('hbAtk')?.value,5),level:clamp(num($('hbLevel')?.value,1),1,10),fruit:$('hbFruit')?.value.trim()||'',desc:$('hbDesc')?.value.trim()||'',image,abilities:detailContext.threatDraft,powers:detailContext.threatDraft
    });
    if(index>=0)homebrew.threats[index]=item;else homebrew.threats.push(item);
    homebrew=normalizeHomebrew(homebrew);saveHomebrew();renderHomebrew();renderThreats();closeModal('homebrewEditModal');showToast(`✅ ${item.name} salva no Homebrew e disponível em Ameaças.`);return;
  }
  if(type==='fruits'){
    readFruitHomebrewBuffer();
    const f=normalizeCustomFruit({...v17FruitBuffer,name:$('fhName').value.trim(),type:$('fhType').value,desc:$('fhDesc').value.trim(),balance:$('fhBalance').value.trim(),specialUnlocks:$('fhSpecial').value.split(/\n+/).map(x=>x.trim()).filter(Boolean)});
    if(!f.name){showToast('Digite o nome da fruta.');return;}
    f.id=index>=0?homebrew.fruits[index].id:(f.id||uid());if(index<0)homebrew.fruits.push(f);else homebrew.fruits[index]=f;homebrew=normalizeHomebrew(homebrew);saveHomebrew();renderHomebrew();closeModal('homebrewEditModal');showToast(`🍈 ${f.name} salva no Homebrew.`);return;
  }
  if(V17_LEGACY_SAVE_HOME_BREW_ENTRY)return V17_LEGACY_SAVE_HOME_BREW_ENTRY(type,index);
}

/* Resumo de ameaça é resumo; editar continua sendo outro botão. */
function openThreatFromCampaign(cid,index){
  const c=getCampaign(cid),t=c?.threats[index];if(!t)return;
  const n=normalizeThreat(t),image=n.image?`<img class="campaign-full-avatar" src="${escapeAttr(n.image)}" alt="${escapeAttr(n.name)}" onclick="openThreatImageViewer('${escapeAttr(n.image)}')">`:'👹';
  const powers=n.abilities||[];
  $('detailBody').innerHTML=`<div class="campaign-summary-sheet">
    <div class="campaign-modal-hero">${image}<div><span class="eyebrow">RESUMO DA AMEAÇA</span><h2>${escapeHTML(n.name)}</h2><p>Nível ${n.level} • ATK +${n.attack}</p></div></div>
    <div class="campaign-modal-resource-grid"><div><span>PV</span><b>${n.hpCurrent}/${n.hpMax}</b></div><div><span>AÇÕES</span><b>${powers.length}</b></div><div><span>FRUTA</span><b>${n.fruit?escapeHTML(n.fruit):'—'}</b></div><div><span>INICIATIVA</span><b>${c.initiatives[`t:${n.id}`]??'—'}</b></div></div>
    <div class="campaign-summary-description"><b>Descrição</b><p>${escapeHTML(n.desc||'Sem descrição.')}</p></div>
    <h3>⚔️ Ações</h3><div class="campaign-full-power-list">${powers.length?powers.map((p,i)=>`<button type="button" class="campaign-full-power color-${escapeAttr(p.color||'vermelho')}" onclick="campaignPowerInfo('${escapeAttr(cid)}','threat',${index},${i})"><b>${escapeHTML(p.name)}</b><small>${p.cost||0} PE • ${escapeHTML(p.check||'Sem teste')}</small></button>`).join(''):'<span class="muted">Nenhuma ação.</span>'}</div>
    <div class="row-actions detail-actions"><button type="button" class="primary" onclick="closeModal('detailModal');editThreat('${escapeAttr(cid)}',${index})">✎ Editar ameaça</button><button type="button" class="secondary" onclick="closeModal('detailModal')">Fechar</button></div>
  </div>`;openDetailModal();
}

/* Leitura do editor preserva IDs de itens/ações para Undo/Redo não duplicar tudo. */
function readThreatEditorAll(noRender=false){
  if(!threatEditBuffer)return null;
  const t=clone(threatEditBuffer),root=$('editThreatBody');if(!root)return t;
  const get=id=>$(id)?.value;
  t.name=text(get('teName')||t.name).trim();
  t.hpMax=Math.max(1,num(get('teHP'),t.hpMax));
  t.hpCurrent=clamp(num(get('teCur'),t.hpCurrent),0,t.hpMax);
  t.attack=num(get('teAtk'),t.attack);
  t.level=clamp(num(get('teLvl'),t.level||1),1,10);
  t.fruit=text(get('teFruit'));t.desc=text(get('teDesc'));
  t.attributes=Object.fromEntries(ATTRS.map((a,i)=>[a,clamp(num($('tea'+i)?.value),-2,20)]));
  const existingItems=Array.isArray(t.items)?t.items:[];
  t.items=String(get('teItems')||'').split(',').map(x=>x.trim()).filter(Boolean).map(name=>{
    const old=existingItems.find(i=>i.name===name);
    return normalizeItem({id:old?.id||uid(),name,type:'Especial',origin:'Ameaça'});
  });
  const list=clone(t.abilities||[]);
  root.querySelectorAll('[data-tp]').forEach(el=>{
    const i=num(el.dataset.index,-1);if(i<0||!list[i])return;
    const k=el.dataset.tp;
    if(k==='threshold')list[i].successThreshold=el.value===''?null:clamp(num(el.value),1,100);
    else if(k==='cost')list[i].cost=Math.max(0,num(el.value));
    else if(k==='level')list[i].level=clamp(num(el.value,1),1,10);
    else list[i][k]=el.value;
  });
  t.abilities=dedupePowers(list,'Ameaça');t.powers=clone(t.abilities);
  return t;
}

/* Salvar a ficha completa também atualiza imediatamente a campanha de origem. */
function saveCurrentAgent(){
  readEditorFields();
  if(!current?.name?.trim()){setEditorTab('identity');showToast('Coloque o nome do personagem.');return false;}
  if(current.fruit&&current.fruitChoices.length!==2){showToast('A fruta precisa de exatamente 2 poderes iniciais.');setEditorTab('fruit');return false;}
  current.updatedAt=Date.now();current=normalizeAgent(current);
  const index=agents.findIndex(x=>x.id===current.id);
  if(index>=0)agents[index]=clone(current);else agents.push(clone(current));
  agents=ensureUniqueIds(agents).map(normalizeAgent);saveAgents();clearCreationDraft();syncAgentToCampaigns(current);
  const campaignId=returnCampaignId;
  if(campaignId&&getCampaign(campaignId)){saveCampaigns();}
  showToast('💾 Alterações salvas.');
  if(campaignId&&activeCampaignPageId===campaignId){setTimeout(()=>refreshCampaignView(campaignId,{toast:'✅ Ficha salva e campanha atualizada.'}),0);}
  return true;
}

/* Exportação atualizada, mantendo formato simples e compatível. */
function exportAgent(id){
  const a=agents.find(x=>x.id===id);if(!a){showToast('Ficha não encontrada para exportar.');return;}
  const normalized=normalizeAgent(a);
  const payload={format:'WEIRD-RPG',type:'agent',version:18,exportedAt:new Date().toISOString(),agent:normalized};
  const blob=new Blob(['\ufeff'+JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=`weird-rpg-${(normalized.name||'ficha').replace(/[^a-z0-9áéíóúãõç_-]/gi,'_')}.json`;
  document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  showToast('✅ Ficha exportada em .json e pronta para enviar.');
}

/* Resultado de dados: arrastar com mouse, touch ou caneta e manter posição. */
function setupDiceDrag(){
  const box=$('diceResult');if(!box||box.dataset.dragV18==='1')return;box.dataset.dragV18='1';
  let active=false,startX=0,startY=0,left=0,top=0;
  const point=e=>({x:e.clientX??e.touches?.[0]?.clientX??0,y:e.clientY??e.touches?.[0]?.clientY??0});
  const down=e=>{
    if(e.target.closest('button'))return;
    const p=point(e),r=box.getBoundingClientRect();active=true;startX=p.x;startY=p.y;left=r.left;top=r.top;box.style.left=`${left}px`;box.style.top=`${top}px`;box.style.right='auto';box.style.bottom='auto';box.classList.add('dragging');if(e.cancelable)e.preventDefault();
    try{box.setPointerCapture?.(e.pointerId)}catch{}
  };
  const move=e=>{if(!active)return;const p=point(e);const maxX=Math.max(8,window.innerWidth-box.offsetWidth-8),maxY=Math.max(8,window.innerHeight-box.offsetHeight-8);box.style.left=`${clamp(left+p.x-startX,8,maxX)}px`;box.style.top=`${clamp(top+p.y-startY,8,maxY)}px`;if(e.cancelable)e.preventDefault();};
  const up=()=>{if(!active)return;active=false;box.classList.remove('dragging');};
  box.addEventListener('pointerdown',down);window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}
function showRollResult(title,details,extra=''){
  const el=$('diceResult');if(!el)return showToast(`${title}: ${details}`);
  $('diceResultTitle').textContent=title;$('diceResultMain').textContent=details;$('diceResultExtra').textContent=extra;
  el.classList.remove('hidden');el.classList.add('visible');el.setAttribute('aria-live','polite');clearTimeout(showRollResult.timer);setupDiceDrag();
}

/* História: blocos mais claros para leitura. */
function renderSheetStory(){
  const fields=[['👤','Personalidade',current.personality,'Como o personagem costuma agir, pensar e reagir.'],['⚖️','Código de honra',current.honor,'Regras pessoais que ele tenta seguir.'],['🎯','Sonho',current.dream,'Objetivo grande que move a aventura.'],['📖','História',current.history,'Passado, origem, acontecimentos importantes e motivos.']];
  return `<section class="sheet-section story-section-v18"><div class="section-head"><div><span class="eyebrow">HISTÓRIA</span><h2>História de ${escapeHTML(current.name||'este personagem')}</h2><p class="muted">Aqui fica tudo que explica quem é o personagem e por que ele segue sua jornada.</p></div>${sheetEditButton('✎ Editar história','story')}</div><div class="story-grid-v18">${fields.map(([icon,title,value,help],i)=>`<article class="story-block-v18 ${i===3?'wide':''}"><header><span>${icon}</span><div><b>${title}</b><small>${help}</small></div></header><p>${escapeHTML(value||'Ainda não preenchido.')}</p></article>`).join('')}</div></section>`;
}

/* Reforça o botão de editar a ficha completa quando salvamos durante uma campanha. */
function openCampaignAgentFullEditor(){
  const ctx=detailContext;if(!ctx?.campaignEditAgent)return;
  const c=getCampaign(ctx.campaignId),m=c?.members[ctx.index];if(!m)return;
  current=clone(normalizeAgent(m.agent));editingId=current.id;returnCampaignId=ctx.campaignId;activeCampaignIdForRoll=ctx.campaignId;
  closeModal('detailModal');beginEditor(current);go('create');
}

/* Inicialização consolidada V18: não registra listeners duplicados. */
function initialize(){
  const prefs=loadJSON(STORAGE.prefs,{});applyColorTheme(prefs.color||'escuro');
  const user=localStorage.getItem(STORAGE.user);if(user&&$('accountButton'))$('accountButton').textContent=user;
  agents=ensureUniqueIds(agents.map(normalizeAgent)).map(normalizeAgent);saveAgents();
  homebrew=normalizeHomebrew(homebrew);saveHomebrew();
  campaigns=campaigns.map(normalizeCampaign);saveCampaigns();
  $('avatarFile')?.addEventListener('change',handleAvatar);$('importFile')?.addEventListener('change',handleImport);$('threatImageFile')?.addEventListener('change',handleThreatImage);
  $('librarySearch')?.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal('libraryModal');});
  document.addEventListener('click',e=>{if(!e.target.classList.contains('modal'))return;const protectedIds=['threatEditModal','homebrewEditModal','editModal'];if(protectedIds.includes(e.target.id))return;closeModal(e.target.id);});
  setupPWA();renderAgents();renderThreats();renderCampaigns();renderHomebrew();showInstallButton(true);setupDiceDrag();
  const threatModal=$('threatEditModal');if(threatModal&&!threatModal.dataset.historyListenersV18){threatModal.dataset.historyListenersV18='1';threatModal.addEventListener('focusin',()=>{if(threatEditBuffer)v17ThreatPushUndo();});}
}


/* ============================================================
   WEIRD RPG V18 — ÚLTIMOS PONTOS DE INTEGRAÇÃO
   ============================================================ */

/* Imagem também funciona no editor de ameaça Homebrew. */
function handleThreatImage(event){
  const file=event.target.files?.[0];
  if(!file){return;}
  if(!/^image\/(png|jpe?g|webp)$/i.test(file.type)){showToast('Use PNG, JPG ou WEBP.');event.target.value='';return;}
  if(file.size>4*1024*1024){showToast('Imagem acima de 4 MB.');event.target.value='';return;}
  compressImageFile(file,900,.80).then(data=>{
    if(threatEditBuffer){
      v17ThreatPushUndo(true);readThreatEditorAll();threatEditBuffer.image=data;renderThreatEditorBody(threatEditBuffer);showToast('🖼️ Imagem adicionada. Salve as alterações.');
    }else if(detailContext?.homebrew&&detailContext.type==='threats'){
      detailContext.threatData=detailContext.threatData||{};detailContext.threatData.image=data;renderHomebrewThreatEditorV18(detailContext.threatData);showToast('🖼️ Imagem adicionada ao Homebrew. Salve a ameaça.');
    }else{
      showToast('Abra o editor de uma ameaça para adicionar uma imagem.');
    }
  }).catch(()=>showToast('Não foi possível processar a imagem.')).finally(()=>{event.target.value='';});
}

/* Editor de ameaça começa com a imagem atual também no buffer Homebrew. */
function chooseThreatImage(){
  const input=$('threatImageFile');
  if(input){input.value='';input.click();}
}

/* Exportação e sincronização ficam disponíveis para o modo campanha. */
function saveCampaignAgentQuickEdit(){
  const ctx=detailContext;if(!ctx?.campaignEditAgent)return;
  const c=getCampaign(ctx.campaignId),m=c?.members[ctx.index];if(!m)return;
  const before=normalizeAgent(m.agent);
  const a=normalizeAgent({...before,
    name:$('caName')?.value.trim()||before.name,
    level:clamp(num($('caLevel')?.value,before.level),1,10),
    hpCurrent:Math.max(0,num($('caHP')?.value,before.hpCurrent)),
    peCurrent:Math.max(0,num($('caPE')?.value,before.peCurrent))
  });
  recalculateResourcesAfterProgress(before,a);
  m.agent=a;syncAgentChanges(a);saveCampaigns();closeModal('detailModal');refreshCampaignView(ctx.campaignId);showToast('✅ Alterações do agente salvas e mostradas na mesa.');
}

/* Service worker V18: troca limpa de cache sem perder o app instalável. */
async function setupPWA(){
  if('serviceWorker' in navigator){
    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      for(const reg of regs){try{await reg.update()}catch(_){}
      }
      const reg=await navigator.serviceWorker.register('./sw.js?v=25');
      try{await reg.update()}catch(_){}
      if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
    }catch(_){/* PWA pode não estar disponível em file:// */}
  }
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;showInstallButton(true);});
  window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;showInstallButton(true);showToast('📱 WEIRD RPG instalado no aparelho!');});
}


/* Homebrew: abertura consistente para ameaças/frutas novas. */
function openHomebrewCreate(type){
  detailContext={homebrew:true,type,index:-1};
  if(type==='threats'){
    detailContext.threatData={id:uid(),name:'Nova ameaça',hpMax:30,attack:5,level:1,fruit:'',desc:'',image:''};
    detailContext.threatDraft=[normalizePower({id:uid(),name:'Ataque básico',origin:'Ameaça • Homebrew',level:1,cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:'Ataque básico da ameaça.',color:'rosa'})];
    $('homebrewEditTitle').textContent='Criar ameaça';renderHomebrewThreatEditorV18(detailContext.threatData);openModal('homebrewEditModal');return;
  }
  if(type==='fruits'){
    v17FruitBuffer=normalizeCustomFruit({id:uid(),name:'Nova Akuma no Mi',type:'Paramecia',desc:'Descreva a fruta.',balance:'Defina limites, custos e fraquezas.',starterPowers:Array.from({length:5},(_,i)=>starterPowerTemplate(null,i)),levels:{},specialUnlocks:[]});
    $('homebrewEditTitle').textContent='Criar Akuma no Mi';renderFruitHomebrewEditor();openModal('homebrewEditModal');return;
  }
  if(V17_LEGACY_RENDER_HOME_BREW)V17_LEGACY_RENDER_HOME_BREW.call(null);
  $('homebrewEditTitle').textContent=`Criar ${homebrewLabel(type)}`;renderHomebrewEditBody(type,{});openModal('homebrewEditModal');
}
function deleteHomebrew(type,index){
  if(!homebrew[type]?.[index])return;
  if(!confirmAction('Apagar este conteúdo Homebrew?'))return;
  const name=homebrew[type][index].name;
  homebrew[type].splice(index,1);homebrew=normalizeHomebrew(homebrew);saveHomebrew();renderHomebrew();renderThreats();showToast(`🗑 ${name} apagado do Homebrew.`);
}


/* ============================================================
   WEIRD RPG V19 — FRUTA ALEATÓRIA + GUIA DE EXPANSÃO
   ------------------------------------------------------------
   Este bloco fica no FINAL do script.js de propósito.
   Assim você pode manter a estrutura anterior e acrescentar novas
   frutas/Haki sem precisar reescrever o sistema inteiro.
   ============================================================ */

/* ---------- FRUTA ALEATÓRIA ---------- */
window.__weirdRandomFruitState=window.__weirdRandomFruitState||{clicks:0,required:4,result:null};
function randomFruitState(){return window.__weirdRandomFruitState;}

function ensureRandomFruitModal(){
  if($('randomFruitModal'))return;
  const wrap=document.createElement('div');
  wrap.id='randomFruitModal';
  wrap.className='modal hidden random-fruit-modal';
  wrap.innerHTML=`
    <div class="modal-box random-fruit-box" role="dialog" aria-modal="true" aria-labelledby="randomFruitTitle">
      <button class="close" type="button" onclick="closeRandomFruit()">×</button>
      <span class="eyebrow">AKUMA NO MI • SORTEIO</span>
      <h2 id="randomFruitTitle">🎲 Fruta Aleatória</h2>
      <p id="randomFruitInstruction" class="random-fruit-instruction">Clique na fruta <b>3 a 5 vezes</b> para descobrir qual fruta você ganhou.</p>
      <div id="randomFruitStage" class="random-fruit-stage">
        <button id="randomFruitMystery" class="mystery-fruit" type="button" onclick="spinRandomFruitClick()" aria-label="Clique para girar a fruta aleatória">
          <span class="mystery-fruit-leaf">⌁</span>
          <span class="mystery-fruit-mark">?</span>
        </button>
      </div>
      <div id="randomFruitProgress" class="random-fruit-progress">0 / 4 cliques</div>
      <div id="randomFruitReveal" class="random-fruit-reveal hidden"></div>
      <div class="random-fruit-actions">
        <button id="randomFruitCloseBtn" class="secondary" type="button" onclick="closeRandomFruit()">Fechar</button>
        <button id="randomFruitUseBtn" class="primary hidden" type="button" onclick="useRandomFruitResult()">🍈 Usar esta fruta</button>
      </div>
    </div>`;
  document.body.appendChild(wrap);
}

function openRandomFruit(){
  ensureRandomFruitModal();
  window.__weirdRandomFruitState={clicks:0,required:3+Math.floor(Math.random()*3),result:null};
  const stage=$('randomFruitStage'),mystery=$('randomFruitMystery'),reveal=$('randomFruitReveal'),use=$('randomFruitUseBtn');
  stage?.classList.remove('revealed');
  mystery?.classList.remove('is-shaking','is-revealed');
  reveal?.classList.add('hidden');
  if(reveal)reveal.innerHTML='';
  use?.classList.add('hidden');
  $('randomFruitProgress').textContent=`0 / ${randomFruitState().required} cliques`;
  $('randomFruitInstruction').innerHTML=`Clique na fruta <b>${randomFruitState().required} vezes</b> para descobrir qual fruta você ganhou.`;
  openModal('randomFruitModal');
  setTimeout(()=>mystery?.focus(),80);
}

function closeRandomFruit(){
  closeModal('randomFruitModal');
  window.__weirdRandomFruitState={clicks:0,required:4,result:null};
}

function animateMysteryFruit(){
  const el=$('randomFruitMystery');
  if(!el)return;
  el.classList.remove('is-shaking');
  void el.offsetWidth;
  el.classList.add('is-shaking');
  setTimeout(()=>el.classList.remove('is-shaking'),430);
}

function playFruitBiteSound(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)return;
    const ctx=new AudioCtx();
    const now=ctx.currentTime;
    const master=ctx.createGain();
    master.gain.setValueAtTime(.0001,now);
    master.gain.exponentialRampToValueAtTime(.22,now+.01);
    master.gain.exponentialRampToValueAtTime(.0001,now+.18);
    master.connect(ctx.destination);

    const osc=ctx.createOscillator();
    osc.type='triangle';
    osc.frequency.setValueAtTime(170,now);
    osc.frequency.exponentialRampToValueAtTime(70,now+.12);
    osc.connect(master);
    osc.start(now);
    osc.stop(now+.13);

    const buffer=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.055),ctx.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);
    const noise=ctx.createBufferSource();
    noise.buffer=buffer;
    const filter=ctx.createBiquadFilter();
    filter.type='bandpass';
    filter.frequency.value=1500;
    filter.Q.value=.7;
    const noiseGain=ctx.createGain();
    noiseGain.gain.setValueAtTime(.28,now);
    noiseGain.gain.exponentialRampToValueAtTime(.0001,now+.06);
    noise.connect(filter).connect(noiseGain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now+.06);
    setTimeout(()=>ctx.close().catch(()=>{}),300);
  }catch(_){/* áudio é opcional */}
}

function getRandomFruitPool(){
  return allFruitEntries().filter(x=>x?.data?.name);
}

function showRandomFruitReveal(fruit){
  ensureRandomFruitModal();
  const reveal=$('randomFruitReveal'),stage=$('randomFruitStage'),mystery=$('randomFruitMystery'),use=$('randomFruitUseBtn');
  if(!reveal||!stage||!mystery)return;
  randomFruitState().result=fruit;
  mystery.classList.remove('is-shaking');
  mystery.classList.add('is-revealed');
  stage.classList.add('revealed');
  reveal.classList.remove('hidden');
  reveal.innerHTML=`
    <span class="eyebrow">VOCÊ GANHOU</span>
    <div class="random-fruit-result-icon">🍈</div>
    <h3>${escapeHTML(fruit.data.name)}</h3>
    <span class="random-fruit-type">${escapeHTML(fruit.data.type||'Paramecia')}</span>
    <p>${escapeHTML(fruit.data.desc||'Uma Akuma no Mi escolhida aleatoriamente.')}</p>`;
  use?.classList.remove('hidden');
  $('randomFruitInstruction').innerHTML=`🎉 A fruta foi revelada! Você ganhou <b>${escapeHTML(fruit.data.name)}</b>.`;
  $('randomFruitProgress').textContent=`✅ ${randomFruitState().clicks} cliques — resultado revelado`;
}

function spinRandomFruitClick(){
  if(randomFruitState().result)return;
  randomFruitState().clicks++;
  animateMysteryFruit();
  $('randomFruitProgress').textContent=`${randomFruitState().clicks} / ${randomFruitState().required} cliques`;
  if(randomFruitState().clicks<randomFruitState().required)return;
  playFruitBiteSound();
  const pool=getRandomFruitPool();
  if(!pool.length){showToast('Não existem frutas cadastradas para o sorteio.');return;}
  const fruit=pool[Math.floor(Math.random()*pool.length)];
  setTimeout(()=>showRandomFruitReveal(fruit),520);
}

function useRandomFruitResult(){
  const result=randomFruitState().result;
  if(!result)return;
  if(typeof current==='undefined'||!current){showToast('Abra uma ficha antes de escolher a fruta.');return;}
  readEditorFields();
  const f=normalizeCustomFruit(result.data);
  current.fruit=f;
  current.fruitLevel=clamp(num(current.level,1),1,10);
  current.fruitChoices=[];
  current.fruitSelections={};
  current.fruitPowerEdits={};
  current.attacks=(current.attacks||[]).filter(x=>x.source!=='fruit');
  closeRandomFruit();
  renderEditor();
  showToast(`🍈 ${f.name} foi adicionada à ficha. Agora escolha 2 dos 5 poderes iniciais.`);
}

/* O primeiro item da biblioteca é sempre o sorteio. */
function renderLibrary(){
  const list=mergedLibrary(libraryType);
  const query=($('librarySearch')?.value||'').trim().toLowerCase();
  let filtered=list.filter(x=>`${x.name||''} ${x.desc||''} ${x.origin||''} ${x.type||''}`.toLowerCase().includes(query));
  if(libraryType==='items'&&libraryItemFilter!=='Todos')filtered=filtered.filter(x=>x.type===libraryItemFilter);
  const box=$('libraryList');if(!box)return;
  const categoryBar=libraryType==='items'?`<div class="help-banner"><b>Filtro de itens:</b> escolha uma categoria para encontrar a arma ou objeto mais rápido.</div><div class="category-pills library-categories">${['Todos','Arma','Armadura','Consumível','Ferramenta','Navegação','Comunicação','Conhecimento','Munição','Especial'].map(c=>`<button type="button" class="${libraryItemFilter===c?'selected':''}" onclick="setLibraryItemFilter('${c}')">${c}</button>`).join('')}</div>`:'';
  const randomCard=libraryType==='fruits'?`<article class="library-card random-fruit-library-card"><div><span class="library-kind homebrew">SORTEIO</span><b>❓ Fruta Aleatória</b><small>Você não escolhe a fruta. O site sorteia uma entre todas as frutas cadastradas, incluindo Homebrew.</small><div class="tags"><span class="tag">🎲 3–5 cliques</span><span class="tag">🔊 Som</span><span class="tag">🍈 Homebrew incluído</span></div></div><button type="button" class="primary random-fruit-open-btn" onclick="openRandomFruit()">🎲 Girar fruta</button></article>`:'';
  if(!filtered.length){box.innerHTML=categoryBar+randomCard+'<div class="empty-small">Nada encontrado nesta categoria.</div>';return;}
  box.innerHTML=categoryBar+randomCard+filtered.map(x=>{
    const realType=libraryType==='races'?'race':libraryType==='roles'?'role':libraryType;
    const index=list.indexOf(x);
    const isHomebrew=!['races','roles','fruits','haki'].includes(libraryType)&&homebrew[libraryType]?.some(y=>y.id===x.id);
    let action='';
    if(libraryType==='races')action=`<button type="button" class="primary" onclick="chooseRace('${escapeAttr(x.name)}')">Escolher</button>`;
    else if(libraryType==='roles')action=`<button type="button" class="primary" onclick="chooseRole('${escapeAttr(x.name)}',${detailContext?.index??0})">Escolher</button>`;
    else if(libraryType==='fruits'){
      const fruitEntry=allFruitEntries().find(f=>f.data?.name===x.name && f.id===x.id) || allFruitEntries().find(f=>f.data?.name===x.name);
      action=`<button type="button" class="primary" onclick="chooseFruitById('${escapeAttr(fruitEntry?.id||x.id)}')">Escolher</button>`;
    }
    else if(libraryType==='haki')action=`<button type="button" class="secondary" onclick="openDetail('haki','${escapeAttr(x.name)}')">Ver</button>`;
    else action=`<button type="button" class="primary" onclick="addLibraryEntryById('${escapeAttr(x.id)}','${libraryType}')">Adicionar</button>`;
    return `<div class="library-card"><div><span class="library-kind ${isHomebrew?'homebrew':''}">${isHomebrew?'HOMEBREW':'BIBLIOTECA'}</span><b>${escapeHTML(x.name)}</b><small>${escapeHTML(x.type||x.origin||'')} • ${escapeHTML(x.desc||'')}</small>${x.b?`<div class="tags">${Object.entries(x.b).map(([a,v])=>`<span class="tag">${escapeHTML(a)} ${v>=0?'+':''}${v}</span>`).join('')}</div>`:''}</div><button type="button" class="info-btn" onclick="openDetail('${escapeAttr(realType)}','${escapeAttr(x.name)}')">ⓘ</button>${action}</div>`;
  }).join('');
}

/* Frutas podem ter progressão própria. Se não tiverem, usamos a progressão padrão do sistema. */
function fruitPowerOptions(fruit,level){
  if(!fruit)return[];
  const f=normalizeCustomFruit(fruit),l=clamp(num(level,1),1,10);
  if(l===1)return f.starterPowers||[];
  const custom=f.levels?.[l]||f.levels?.[String(l)];
  if(Array.isArray(custom)&&custom.length){
    return custom.slice(0,3).map(p=>normalizePower({...p,level:l,source:'fruit',sourceId:p.sourceId||p.id,origin:'Akuma no Mi',color:'vermelho'}));
  }
  const baseFruit=String(f.name||'');
  const row=(FRUIT_PROGRESSION?.[baseFruit]||[])[clamp(l-2,0,8)]||[`${baseFruit} — Ataque Nvl ${l}`,`${baseFruit} — Defesa Nvl ${l}`,`${baseFruit} — Especial Nvl ${l}`];
  const stage=Math.max(1,l-1);
  const damage=stage>=8?'3d10':stage>=6?'2d8':stage>=4?'2d6':stage>=2?'1d10':'1d8';
  const cost=Math.min(8,Math.ceil(stage/2));
  const attackAttr=stage%2?'Destreza':'Força';
  const cfg=[
    {type:'Ataque',attribute:attackAttr,check:`1d20 + ${attackAttr}`,damage,cost,range:stage>=5?'Médio':'Curto',desc:`Use ${row[0]} como técnica ofensiva da ${baseFruit}. Faça o teste; se passar, role o dano.`},
    {type:'Defesa',attribute:'Constituição',check:'1d20 + Constituição',damage:'',cost,range:'Pessoal',desc:`Use ${row[1]} como reação defensiva. Faça o teste para ativar a proteção.`},
    {type:'Utilidade',attribute:stage%2?'Destreza':'Vontade',check:`1d20 + ${stage%2?'Destreza':'Vontade'}`,damage:stage>=7?'2d6':'',cost,range:stage>=6?'Médio':'Curto',desc:`Use ${row[2]} para mobilidade, controle, suporte ou posicionamento.`}
  ];
  return row.map((name,i)=>makeFruitPower(name,f,i,l,{...cfg[i],...fruitPowerFlavor(baseFruit,name,cfg[i].type,l,cfg[i].damage)}));
}

/* ---------- MARCADORES EXPLÍCITOS PARA APRENDER A EDITAR ----------
   FRUTAS: edite LIB.fruits[] no começo do arquivo.
   HAKI: edite HAKI.observacao / HAKI.armamento / HAKI.rei.
   HOME BREW: continua salvo no localStorage e pode ser criado pela UI.
   ============================================================ */

/* V19: manter a instalação e o cache em uma versão nova. */
async function setupPWA(){
  if('serviceWorker' in navigator){
    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      for(const reg of regs){try{await reg.update()}catch(_){}}
      const reg=await navigator.serviceWorker.register('./sw.js?v=25');
      try{await reg.update()}catch(_){ }
      if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
    }catch(_){ }
  }
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;showInstallButton(true);});
  window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;showInstallButton(true);showToast('📱 WEIRD RPG instalado no aparelho!');});
}
/* WEIRD RPG V20 — estabilidade de dados e editor de ameaças */
(function(){
  const V20_NS='weirdRpgV20';

  /* ---------- RESULTADO DE DADOS: posição estável e limitada ---------- */
  const diceState={dragging:false,x:null,y:null,pointerId:null};
  function getDice(){return document.getElementById('diceResult');}
  function clampDicePosition(x,y){
    const box=getDice(); if(!box) return {x:8,y:8};
    const w=box.offsetWidth||330, h=box.offsetHeight||190;
    const maxX=Math.max(8,window.innerWidth-w-8), maxY=Math.max(8,window.innerHeight-h-8);
    return {x:Math.round(Math.max(8,Math.min(x,maxX))),y:Math.round(Math.max(8,Math.min(y,maxY)))};
  }
  function applyDicePosition(){
    const box=getDice();if(!box)return;
    if(diceState.x==null||diceState.y==null){
      box.classList.remove('dice-v20-positioned');
      box.style.removeProperty('left'); box.style.removeProperty('top');
      return;
    }
    const p=clampDicePosition(diceState.x,diceState.y);diceState.x=p.x;diceState.y=p.y;
    box.classList.add('dice-v20-positioned');
    box.style.setProperty('left',p.x+'px');box.style.setProperty('top',p.y+'px');
    box.style.setProperty('right','auto','important');box.style.setProperty('bottom','auto','important');
  }
  window.__weirdDiceV20={state:diceState,apply:applyDicePosition};

  window.setupDiceDrag=function(){
    const box=getDice();if(!box||box.dataset.dragV20==='1')return;
    box.dataset.dragV20='1';
    const point=e=>({x:Number.isFinite(e.clientX)?e.clientX:(e.touches?.[0]?.clientX||0),y:Number.isFinite(e.clientY)?e.clientY:(e.touches?.[0]?.clientY||0)});
    box.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;
      if(e.target.closest('button'))return;
      const p=point(e),r=box.getBoundingClientRect();
      const baseX=diceState.x==null?r.left:diceState.x, baseY=diceState.y==null?r.top:diceState.y;
      const bounded=clampDicePosition(baseX,baseY);
      diceState.dragging=true;diceState.pointerId=e.pointerId;diceState.startX=p.x;diceState.startY=p.y;diceState.baseX=bounded.x;diceState.baseY=bounded.y;diceState.x=bounded.x;diceState.y=bounded.y;
      box.classList.add('dragging','dice-v20-positioned');box.style.animation='none';applyDicePosition();
      try{box.setPointerCapture(e.pointerId)}catch(_){ }
      e.preventDefault();
    });
    box.addEventListener('pointermove',e=>{
      if(!diceState.dragging||e.pointerId!==diceState.pointerId)return;
      const p=point(e);const next=clampDicePosition(diceState.baseX+(p.x-diceState.startX),diceState.baseY+(p.y-diceState.startY));diceState.x=next.x;diceState.y=next.y;applyDicePosition();e.preventDefault();
    });
    const end=e=>{if(!diceState.dragging)return;if(diceState.pointerId!=null&&e.pointerId!=null&&e.pointerId!==diceState.pointerId)return;diceState.dragging=false;diceState.pointerId=null;box.classList.remove('dragging');applyDicePosition();};
    box.addEventListener('pointerup',end);box.addEventListener('pointercancel',end);box.addEventListener('lostpointercapture',()=>{if(diceState.dragging){diceState.dragging=false;diceState.pointerId=null;box.classList.remove('dragging');applyDicePosition();}});
    window.addEventListener('resize',()=>{if(diceState.x!=null&&diceState.y!=null)applyDicePosition();});
  };

  window.showRollResult=function(title,details,extra=''){
    const el=getDice(); if(!el){if(typeof showToast==='function')showToast(`${title}: ${details}`);return;}
    document.getElementById('diceResultTitle').textContent=title;
    document.getElementById('diceResultMain').textContent=details;
    document.getElementById('diceResultExtra').textContent=extra;
    el.classList.remove('hidden');el.classList.add('visible');el.setAttribute('aria-live','polite');el.style.animation='none';
    requestAnimationFrame(()=>{el.style.animation='none';applyDicePosition();});
    window.setupDiceDrag();
  };
  window.dismissDiceResult=function(){const el=getDice();if(el)el.classList.add('hidden');};

  /* ---------- FICHA DE AGENTE: Abrir ficha realmente abre a página ---------- */
  window.openSheetById=function(id){
    const agent=(agents||[]).find(x=>x.id===id);if(!agent){showToast('Ficha não encontrada.');return;}
    closeAllModals?.();
    current=clone(normalizeAgent(agent));editingId=current.id;returnCampaignId=null;activeCampaignIdForRoll=null;sheetTab='overview';
    go('sheet');window.scrollTo({top:0,left:0,behavior:'auto'});renderSheet();
  };

  /* ---------- IMAGEM DAS AMEAÇAS: mesmo tamanho do agente ---------- */
  window.renderThreatEditorBody=window.renderThreatEditorBody;

  /* ---------- UNDO/REDO REAL NO EDITOR DE AMEAÇA ---------- */
  function threatHistoryInit(){
    if(!threatEditBuffer)return;
    v17ThreatUndo=[clone(threatEditBuffer)];v17ThreatRedo=[];threatHistoryLast=clone(threatEditBuffer);clearTimeout(threatHistoryTimer);
  }
  let threatHistoryTimer=null,threatHistoryLast=null;
  function captureThreatHistory(force=false){
    if(!threatEditBuffer||!document.getElementById('editThreatBody'))return;
    const state=readThreatEditorAll?.();if(!state)return;
    if(!force&&threatHistoryLast&&v17ThreatSame(threatHistoryLast,state))return;
    v17ThreatUndo.push(clone(state));
    if(v17ThreatUndo.length>100)v17ThreatUndo.shift();
    v17ThreatRedo=[];threatHistoryLast=clone(state);
  }
  function scheduleThreatHistory(){clearTimeout(threatHistoryTimer);threatHistoryTimer=setTimeout(()=>captureThreatHistory(false),180);}
  function installThreatHistoryListeners(){
    const modal=document.getElementById('threatEditModal');if(!modal||modal.dataset.v20History==='1')return;modal.dataset.v20History='1';
    modal.addEventListener('input',e=>{if(e.target.matches('input[data-tp],select[data-tp],textarea[data-tp],#teName,#teHP,#teCur,#teAtk,#teLvl,#teFruit,#teItems,#teDesc,#tea0,#tea1,#tea2,#tea3,#tea4,#tea5'))scheduleThreatHistory();});
    modal.addEventListener('change',()=>captureThreatHistory(true));
  }
  window.threatUndo=function(){
    if(!threatEditBuffer){showToast('Nenhuma ameaça aberta.');return;}
    clearTimeout(threatHistoryTimer);captureThreatHistory(false);
    if(v17ThreatUndo.length<=1){showToast('Nada para desfazer.');return;}
    const currentState=v17ThreatUndo.pop();v17ThreatRedo.push(clone(currentState));
    threatEditBuffer=clone(v17ThreatUndo[v17ThreatUndo.length-1]);threatHistoryLast=clone(threatEditBuffer);renderThreatEditorBody(threatEditBuffer);showToast('↶ Alteração desfeita.');
  };
  window.threatRedo=function(){
    if(!threatEditBuffer||!v17ThreatRedo.length){showToast('Nada para refazer.');return;}
    clearTimeout(threatHistoryTimer);const currentState=readThreatEditorAll?.()||threatEditBuffer;
    if(!v17ThreatUndo.length||!v17ThreatSame(v17ThreatUndo[v17ThreatUndo.length-1],currentState))v17ThreatUndo.push(clone(currentState));
    threatEditBuffer=clone(v17ThreatRedo.pop());threatHistoryLast=clone(threatEditBuffer);renderThreatEditorBody(threatEditBuffer);showToast('↷ Alteração refeita.');
  };

  /* ---------- AÇÕES DE AMEAÇA: adiciona de forma determinística ---------- */
  window.addThreatPowerDraft=function(){
    if(!threatEditBuffer)return;
    const currentState=readThreatEditorAll?.()||clone(threatEditBuffer);threatEditBuffer=clone(currentState);
    const list=Array.isArray(threatEditBuffer.abilities)?threatEditBuffer.abilities.slice():[];
    const n=list.length+1;
    list.push(normalizePower({id:uid(),name:`Nova ação ${n}`,origin:'Ameaça',level:threatEditBuffer.level||1,cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',desc:'Explique exatamente como esta ação funciona.',effect:'',color:'vermelho'}));
    threatEditBuffer.abilities=list.map(normalizePower);threatEditBuffer.powers=clone(threatEditBuffer.abilities);renderThreatEditorBody(threatEditBuffer);v17ThreatUndo=v17ThreatUndo.length?v17ThreatUndo:[clone(currentState)];v17ThreatUndo.push(clone(threatEditBuffer));v17ThreatRedo=[];threatHistoryLast=clone(threatEditBuffer);installThreatHistoryListeners();showToast(`⚔️ Ação ${n} adicionada.`);
  };
  window.removeThreatPowerDraft=function(index){
    if(!threatEditBuffer)return;const currentState=readThreatEditorAll?.()||clone(threatEditBuffer);const list=currentState.abilities||[];if(list.length<=1){showToast('Mantenha pelo menos uma ação.');return;}list.splice(index,1);threatEditBuffer=clone({...currentState,abilities:list,powers:list});renderThreatEditorBody(threatEditBuffer);v17ThreatUndo.push(clone(threatEditBuffer));v17ThreatRedo=[];threatHistoryLast=clone(threatEditBuffer);installThreatHistoryListeners();
  };

  const oldEditThreat=window.editThreat;
  window.editThreat=function(cid,index){
    const c=getCampaign(cid),t=c?.threats[index];if(!t)return;
    threatEditingCampaignId=cid;threatEditingIndex=index;threatEditBuffer=normalizeThreat(clone(t));
    $('editThreatTitle').textContent=`Editar ameaça: ${threatEditBuffer.name}`;$('editThreatBody').innerHTML=renderThreatEditorBody(threatEditBuffer);openModal('threatEditModal');threatHistoryInit();installThreatHistoryListeners();
  };

  const oldSaveThreatEdit=window.saveThreatEdit;
  window.saveThreatEdit=function(cid,index,closeAfter=true){
    const c=getCampaign(cid),old=c?.threats?.[index];if(!c||!old)return false;
    const draft=readThreatEditorAll?.();if(!draft)return false;
    draft.image=String(threatEditBuffer?.image??old.image??'');const t=normalizeThreat(draft);c.threats[index]=t;saveCampaigns();
    if(typeof renderThreats==='function')renderThreats();if(activeCampaignPageId===cid&&typeof refreshCampaignView==='function')refreshCampaignView(cid);
    if(closeAfter){closeModal('threatEditModal');threatEditBuffer=null;v17ThreatUndo=[];v17ThreatRedo=[];threatHistoryLast=null;showToast('✅ Ameaça salva e editor fechado.');}
    else{threatEditBuffer=clone(t);v17ThreatUndo=[clone(t)];v17ThreatRedo=[];threatHistoryLast=clone(t);renderThreatEditorBody(threatEditBuffer);installThreatHistoryListeners();showToast('💾 Alterações salvas. O editor continua aberto.');}
    return true;
  };

  /* ---------- AMEAÇAS: imagens em tamanho consistente na campanha ---------- */
  const originalThreatCard=window.campaignThreatCard;
  if(originalThreatCard){
    /* preserva lógica atual; CSS em V20 é responsável pelo tamanho. */
  }

  /* Instala listeners depois do DOM existir. */
  const boot=()=>{
    /* Remove listeners das versões V18/V19 presos ao cartão de resultado.
       O clone mantém os onclicks HTML e elimina os listeners antigos. */
    const oldBox=document.getElementById('diceResult');
    if(oldBox && !oldBox.dataset.v20Fresh){
      const fresh=oldBox.cloneNode(true);fresh.dataset.v20Fresh='1';oldBox.replaceWith(fresh);
    }
    window.setupDiceDrag();
    installThreatHistoryListeners();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


/* V20: adicionar ação também é seguro no editor Homebrew da ameaça. */
(function(){
  const oldAddHomebrew=window.addHomebrewThreatPowerDraft;
  window.addHomebrewThreatPowerDraft=function(){
    if(!detailContext||detailContext.type!=='threats')return oldAddHomebrew?.();
    detailContext.threatDraft=readHomebrewThreatPowersDraftV18();
    const n=detailContext.threatDraft.length+1;
    detailContext.threatDraft.push(normalizePower({
      id:uid(),name:`Nova ação ${n}`,origin:'Ameaça • Homebrew',level:clamp(num($('hbLevel')?.value,1),1,10),
      cost:0,attribute:'Força',check:'1d20 + Força',damage:'1d6',type:'Ataque',
      desc:'Explique exatamente como esta ação funciona.',effect:'',range:'Curto',color:'rosa'
    }));
    const d={...(detailContext.threatData||{}),
      name:$('hbName')?.value||detailContext.threatData?.name||'Nova ameaça',
      hpMax:num($('hbHP')?.value,30),attack:num($('hbAtk')?.value,5),level:clamp(num($('hbLevel')?.value,1),1,10),
      fruit:$('hbFruit')?.value||'',desc:$('hbDesc')?.value||'',image:detailContext.threatData?.image||''
    };
    detailContext.threatData=d;renderHomebrewThreatEditorV18(d);showToast(`⚔️ Ação ${n} adicionada ao Homebrew.`);
  };
})();


/* ============================================================
   WEIRD RPG V23 — RESULTADO DE DADOS SEM TELEPORTE
   ------------------------------------------------------------
   Sistema único de arraste com Pointer Events.
   • arrasta somente pela barra superior do resultado
   • posição é relativa ao viewport, nunca à página
   • nunca deixa a caixa sair da área visível
   • funciona com mouse, toque e caneta
   • não usa transform para posicionar depois do arraste
   • preserva a posição enquanto o usuário continua rolando a página
   ============================================================ */
(function installStableDiceV23(){
  const get=id=>document.getElementById(id);
  const state={x:null,y:null};
  let bound=false;
  let drag=null;

  function viewport(){
    const vv=window.visualViewport;
    const width=Math.max(1,Number(vv?.width)||window.innerWidth);
    const height=Math.max(1,Number(vv?.height)||window.innerHeight);
    const ox=Number(vv?.offsetLeft)||0;
    const oy=Number(vv?.offsetTop)||0;
    let reserve=8;
    const nav=document.querySelector('.mobile-bottom-nav');
    if(nav){
      const cs=getComputedStyle(nav);
      if(cs.display!=='none' && cs.visibility!=='hidden') reserve=Math.max(reserve,nav.getBoundingClientRect().height+10);
    }
    return {width,height,ox,oy,reserve};
  }

  function limits(){
    const box=get('diceResult');
    if(!box) return {minX:8,minY:8,maxX:8,maxY:8};
    const vp=viewport();
    const r=box.getBoundingClientRect();
    const w=Math.max(1,r.width||box.offsetWidth||360);
    const h=Math.max(1,r.height||box.offsetHeight||210);
    const margin=8;
    const minX=vp.ox+margin;
    const minY=vp.oy+margin;
    const maxX=Math.max(minX,vp.ox+vp.width-w-margin);
    const maxY=Math.max(minY,vp.oy+vp.height-h-vp.reserve);
    return {minX,minY,maxX,maxY};
  }

  function clampPos(x,y){
    const l=limits();
    return {
      x:Math.round(Math.max(l.minX,Math.min(Number(x)||l.minX,l.maxX))),
      y:Math.round(Math.max(l.minY,Math.min(Number(y)||l.minY,l.maxY)))
    };
  }

  function setPx(el,property,value){el.style.setProperty(property,`${Math.round(value)}px`,'important');}

  function apply(){
    const box=get('diceResult');
    if(!box || state.x==null || state.y==null) return;
    const p=clampPos(state.x,state.y);
    state.x=p.x;state.y=p.y;
    box.classList.add('dice-v23-positioned');
    box.style.setProperty('position','fixed','important');
    setPx(box,'left',p.x);
    setPx(box,'top',p.y);
    box.style.setProperty('right','auto','important');
    box.style.setProperty('bottom','auto','important');
    box.style.setProperty('margin','0','important');
    box.style.setProperty('transform','none','important');
  }

  function center(){
    const box=get('diceResult'); if(!box) return;
    const vp=viewport();
    const r=box.getBoundingClientRect();
    const w=Math.max(1,r.width||Math.min(410,vp.width-16));
    const h=Math.max(1,r.height||210);
    state.x=vp.ox+(vp.width-w)/2;
    state.y=vp.oy+(vp.height-h-vp.reserve)/2;
    apply();
  }

  function replaceAndBind(){
    const old=get('diceResult');
    if(!old) return null;
    const box=old.cloneNode(true);
    box.id='diceResult';
    box.removeAttribute('style');
    box.dataset.v23='1';
    old.replaceWith(box);

    const handle=box.querySelector('.dice-drag-handle');
    if(!handle) return box;

    const start=e=>{
      if(box.classList.contains('hidden')) return;
      if(e.pointerType==='mouse' && e.button!==0) return;
      const r=box.getBoundingClientRect();
      const base=clampPos(r.left,r.top);
      state.x=base.x;state.y=base.y;
      drag={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,baseX:base.x,baseY:base.y};
      box.classList.add('dragging','dice-v23-positioned');
      apply();
      try{handle.setPointerCapture(e.pointerId);}catch(_){ }
      if(e.cancelable)e.preventDefault();
    };
    const move=e=>{
      if(!drag || e.pointerId!==drag.pointerId) return;
      const next=clampPos(
        drag.baseX+(e.clientX-drag.startX),
        drag.baseY+(e.clientY-drag.startY)
      );
      state.x=next.x;state.y=next.y;apply();
      if(e.cancelable)e.preventDefault();
    };
    const finish=e=>{
      if(!drag) return;
      if(e?.pointerId!=null && e.pointerId!==drag.pointerId) return;
      drag=null;
      box.classList.remove('dragging');
      apply();
    };

    handle.addEventListener('pointerdown',start,{passive:false});
    handle.addEventListener('pointermove',move,{passive:false});
    handle.addEventListener('pointerup',finish,{passive:false});
    handle.addEventListener('pointercancel',finish,{passive:false});
    handle.addEventListener('lostpointercapture',()=>{
      if(drag){drag=null;box.classList.remove('dragging');apply();}
    });

    window.addEventListener('resize',()=>{if(state.x!=null&&state.y!=null)apply();},{passive:true});
    window.visualViewport?.addEventListener('resize',()=>{if(state.x!=null&&state.y!=null)apply();},{passive:true});
    window.visualViewport?.addEventListener('scroll',()=>{if(state.x!=null&&state.y!=null)apply();},{passive:true});
    bound=true;
    return box;
  }

  function show(title,details,extra=''){
    let box=get('diceResult');
    if(!box){if(typeof showToast==='function')showToast(`${title}: ${details}`);return;}
    if(!bound || box.dataset.v23!=='1') box=replaceAndBind();
    get('diceResultTitle').textContent=title;
    get('diceResultMain').textContent=details;
    get('diceResultExtra').textContent=extra;
    box.classList.remove('hidden');
    box.setAttribute('aria-live','polite');
    /* Uma nova rolagem mantém a posição anterior. Só centraliza na primeira. */
    requestAnimationFrame(()=>{
      if(state.x==null||state.y==null) center(); else apply();
    });
  }

  function dismiss(){
    const box=get('diceResult');
    if(box){box.classList.add('hidden');box.classList.remove('dragging');}
    drag=null;
  }

  window.showRollResult=show;
  window.dismissDiceResult=dismiss;
  window.setupDiceDrag=()=>{if(!bound)replaceAndBind();};

  const boot=()=>{
    bound=false;drag=null;
    const box=replaceAndBind();
    if(box) window.setupDiceDrag=()=>{};
    window.showRollResult=show;
    window.dismissDiceResult=dismiss;
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();

/* ============================================================
   WEIRD RPG V24 — DADO ARRASTÁVEL ESTÁVEL
   ============================================================ */
(function installDiceV24(){
  let dragState=null;
  let position=null;
  let initialized=false;

  const get=id=>document.getElementById(id);

  function viewport(){
    const vv=window.visualViewport;
    const width=Math.max(1,Number(vv?.width)||window.innerWidth);
    const height=Math.max(1,Number(vv?.height)||window.innerHeight);
    const offsetX=Number(vv?.offsetLeft)||0;
    const offsetY=Number(vv?.offsetTop)||0;
    let reserve=8;
    const nav=document.querySelector('.mobile-bottom-nav');
    if(nav){
      const cs=getComputedStyle(nav);
      if(cs.display!=='none'&&cs.visibility!=='hidden'&&nav.offsetHeight>0) reserve=Math.max(reserve,nav.offsetHeight+8);
    }
    return {width,height,offsetX,offsetY,reserve};
  }

  function bounds(box){
    const v=viewport(),r=box.getBoundingClientRect();
    const w=Math.max(1,r.width||box.offsetWidth||320),h=Math.max(1,r.height||box.offsetHeight||200);
    return {minX:v.offsetX+8,minY:v.offsetY+8,maxX:Math.max(v.offsetX+8,v.offsetX+v.width-w-8),maxY:Math.max(v.offsetY+8,v.offsetY+v.height-h-v.reserve)};
  }

  function clampPos(x,y,box){
    const b=bounds(box),nx=Number(x),ny=Number(y);
    return {x:Math.round(Math.max(b.minX,Math.min(Number.isFinite(nx)?nx:b.minX,b.maxX))),y:Math.round(Math.max(b.minY,Math.min(Number.isFinite(ny)?ny:b.minY,b.maxY)))};
  }

  function apply(){
    const box=get('diceResult');if(!box||!position)return;
    position=clampPos(position.x,position.y,box);
    box.classList.add('dice-v24-positioned');
    box.style.setProperty('position','fixed','important');
    box.style.setProperty('left',`${position.x}px`,'important');
    box.style.setProperty('top',`${position.y}px`,'important');
    box.style.setProperty('right','auto','important');
    box.style.setProperty('bottom','auto','important');
    box.style.setProperty('margin','0','important');
    box.style.setProperty('transform','none','important');
    box.style.setProperty('animation','none','important');
  }

  function center(){
    const box=get('diceResult');if(!box)return;
    const v=viewport(),r=box.getBoundingClientRect();
    const w=Math.max(1,r.width||Math.min(410,v.width-16)),h=Math.max(1,r.height||200);
    position=clampPos(v.offsetX+(v.width-w)/2,v.offsetY+(v.height-h-v.reserve)/2,box);apply();
  }

  function removeOldElement(){
    const old=get('diceResult');if(!old)return null;
    const fresh=old.cloneNode(true);fresh.removeAttribute('style');fresh.dataset.v24Fresh='1';old.replaceWith(fresh);return fresh;
  }

  function finish(e){
    if(!dragState)return;
    if(e?.pointerId!=null&&e.pointerId!==dragState.pointerId)return;
    dragState=null;
    const box=get('diceResult');
    if(box){box.classList.remove('dragging');box.style.setProperty('cursor','default','important');apply();}
  }

  function bind(){
    let box=get('diceResult');if(!box)return;
    if(box.dataset.v24Fresh!=='1') box=removeOldElement()||box;
    if(box.dataset.v24Bound==='1')return;
    box.dataset.v24Bound='1';
    const handle=box.querySelector('.dice-drag-handle');if(!handle)return;

    handle.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      if(e.target.closest('button'))return;
      const rect=box.getBoundingClientRect(),base=clampPos(rect.left,rect.top,box);
      position=base;
      dragState={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,baseX:base.x,baseY:base.y};
      box.classList.add('dragging');
      box.style.setProperty('cursor','grabbing','important');
      try{handle.setPointerCapture(e.pointerId);}catch(_){ }
      if(e.cancelable)e.preventDefault();
      e.stopPropagation();
    },{passive:false});

    const move=e=>{
      if(!dragState||e.pointerId!==dragState.pointerId)return;
      position=clampPos(dragState.baseX+(e.clientX-dragState.startX),dragState.baseY+(e.clientY-dragState.startY),box);
      apply();
      if(e.cancelable)e.preventDefault();
    };
    document.addEventListener('pointermove',move,{passive:false});
    document.addEventListener('pointerup',finish,{passive:false});
    document.addEventListener('pointercancel',finish,{passive:false});

    window.addEventListener('resize',()=>{if(position)apply();},{passive:true});
    if(window.visualViewport)window.visualViewport.addEventListener('resize',()=>{if(position)apply();},{passive:true});
  }

  function show(title,details,extra=''){
    let box=get('diceResult');if(!box){if(typeof showToast==='function')showToast(`${title}: ${details}`);return;}
    if(box.dataset.v24Fresh!=='1')box=removeOldElement()||box;
    get('diceResultTitle').textContent=title;
    get('diceResultMain').textContent=details;
    get('diceResultExtra').textContent=extra;
    box.classList.remove('hidden');box.classList.add('visible');box.setAttribute('aria-live','polite');
    bind();
    requestAnimationFrame(()=>{if(position==null)center();else apply();});
  }

  function dismiss(){const box=get('diceResult');if(box){box.classList.add('hidden');box.classList.remove('dragging');}dragState=null;}

  function boot(){
    if(initialized)return;initialized=true;
    if(get('diceResult')?.dataset.v24Fresh!=='1')removeOldElement();
    bind();
  }

  window.showRollResult=show;
  window.dismissDiceResult=dismiss;
  window.setupDiceDrag=boot;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


/* ============================================================
   WEIRD RPG V25 — ACESSIBILIDADE, BACKUP E MAPA DE CAMPANHA
   ============================================================ */

/* Acessibilidade: zoom geral configurável, salvo no navegador. */
const V25_UI_SCALES = [
  {value:0.85,label:'85%'},{value:0.95,label:'95%'},{value:1,label:'100%'},
  {value:1.10,label:'110%'},{value:1.20,label:'120%'},{value:1.30,label:'130%'}
];
let v25ScaleObserver=null;
function v25ScaleNode(el,scale){
  if(!el||el.nodeType!==1)return;
  const win=getComputedStyle(el),parent=el.parentElement?getComputedStyle(el.parentElement):null;
  const isInherited=el.tagName!=='BODY'&&!el.style.fontSize&&parent&&Math.abs(parseFloat(win.fontSize)-parseFloat(parent.fontSize))<0.1;
  if(!el.dataset.v25BaseFont&&!isInherited)el.dataset.v25BaseFont=String(parseFloat(win.fontSize)||16);
  if(el.dataset.v25BaseFont)el.style.fontSize=`${Math.max(8,parseFloat(el.dataset.v25BaseFont)*scale)}px`;
  if(/^(BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)){
    const props=['Top','Right','Bottom','Left'];
    props.forEach(side=>{
      const data='v25Pad'+side,css='padding'+side;
      if(!el.dataset[data])el.dataset[data]=String(parseFloat(getComputedStyle(el)[css])||0);
      el.style[css]=`${Math.max(0,parseFloat(el.dataset[data])*scale)}px`;
    });
    if(!el.dataset.v25BaseMinHeight){
      const cs=getComputedStyle(el),mh=parseFloat(cs.minHeight),height=parseFloat(cs.height);
      const base=Math.max(Number.isFinite(mh)?mh:0,Number.isFinite(height)?height:0);
      el.dataset.v25BaseMinHeight=String(base>20?base:0);
    }
    if(parseFloat(el.dataset.v25BaseMinHeight)>0)el.style.minHeight=`${parseFloat(el.dataset.v25BaseMinHeight)*scale}px`;
  }
}
function v25ScaleTree(root,scale){
  if(!root)return;
  if(root.nodeType===1)v25ScaleNode(root,scale);
  root.querySelectorAll?.('*').forEach(el=>v25ScaleNode(el,scale));
}
function applyUiScale(value){
  const parsed=Number(value);
  const scale=V25_UI_SCALES.some(x=>Math.abs(x.value-parsed)<0.001)?parsed:1;
  document.documentElement.dataset.uiScale=String(scale);
  document.documentElement.style.setProperty('--weird-ui-scale',String(scale));
  v25ScaleTree(document.body,scale);
  const prefs=loadJSON(STORAGE.prefs,{});prefs.scale=scale;saveJSON(STORAGE.prefs,prefs);
  if(!v25ScaleObserver&&document.body){
    v25ScaleObserver=new MutationObserver(records=>{
      const sc=Number(document.documentElement.dataset.uiScale||1);
      records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)v25ScaleTree(node,sc);}));
    });
    v25ScaleObserver.observe(document.body,{childList:true,subtree:true});
  }
  renderUiScaleOptions();
}
function renderUiScaleOptions(){
  const box=$('uiScaleOptions');if(!box)return;
  const prefs=loadJSON(STORAGE.prefs,{}),scale=Number(prefs.scale||1);
  box.innerHTML=V25_UI_SCALES.map(item=>`<button type="button" class="ui-scale-choice ${Math.abs(scale-item.value)<0.001?'selected':''}" aria-pressed="${Math.abs(scale-item.value)<0.001}" onclick="applyUiScale(${item.value})">${item.value>1?'＋ ':item.value<1?'− ':''}${item.label}${Math.abs(scale-item.value)<0.001?' ✓':''}</button>`).join('');
}
const V25_openOptionsBase=openOptions;
openOptions=function(){V25_openOptionsBase();renderUiScaleOptions();};

/* Download JSON reutilizável para backup e envio aos jogadores. */
function v25DownloadJSON(filename,payload){
  const blob=new Blob(['\ufeff',JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=filename;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1800);
}
function v25SafeFilename(name,fallback){return String(name||fallback).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]+/gi,'_').replace(/^_+|_+$/g,'')||fallback;}
function exportThreatById(id){
  const entry=allThreatEntries().find(x=>x.id===id||x.data?.id===id);if(!entry){showToast('Ameaça não encontrada para exportar.');return;}
  const data=normalizeThreat(entry.data);
  v25DownloadJSON(`weird-rpg-ameaca-${v25SafeFilename(data.name,'ameaca')}.json`,{format:'WEIRD-RPG',type:'threat',version:25,exportedAt:new Date().toISOString(),data});
  showToast(`✅ Ameaça “${data.name}” exportada em JSON.`);
}
function exportAllHomebrewThreats(){
  const list=(homebrew.threats||[]).map(normalizeThreat);
  if(!list.length){showToast('Você ainda não criou ameaças Homebrew para exportar.');return;}
  v25DownloadJSON('weird-rpg-ameacas-homebrew.json',{format:'WEIRD-RPG',type:'threats',version:25,exportedAt:new Date().toISOString(),threats:list});
  showToast(`✅ ${list.length} ameaça(s) exportada(s).`);
}
function importThreatFile(){const input=$('threatImportFile');if(!input){showToast('Campo de importação de ameaça não encontrado.');return;}input.value='';input.click();}
async function handleThreatImport(event){
  const file=event.target.files?.[0];if(!file)return;
  try{
    let raw=String(await file.text()).replace(/^\uFEFF/,'').trim();let parsed=JSON.parse(raw);if(typeof parsed==='string')parsed=JSON.parse(parsed);
    let candidates=[];
    if(Array.isArray(parsed))candidates=parsed;
    else if(Array.isArray(parsed.threats))candidates=parsed.threats;
    else if(parsed.type==='threat'&&parsed.data)candidates=[parsed.data];
    else if(parsed.threat&&typeof parsed.threat==='object')candidates=[parsed.threat];
    else if(parsed.data&&typeof parsed.data==='object'&&(parsed.data.hpMax!=null||parsed.data.abilities||parsed.data.powers))candidates=[parsed.data];
    else candidates=[parsed];
    candidates=candidates.map(x=>x?.data&&typeof x.data==='object'?x.data:x?.threat||x).filter(x=>x&&typeof x==='object'&&(x.name||x.title)&&(x.abilities||x.powers||x.hpMax!=null||x.hp!=null));
    if(!candidates.length)throw new Error('O JSON não contém uma ameaça reconhecida.');
    const imported=[];
    for(const rawThreat of candidates){
      const name=String(rawThreat.name||rawThreat.title||'Ameaça importada').trim();
      const normalized=normalizeThreat({...rawThreat,id:uid(),name});
      normalized.id=uid();
      normalized.origin='Homebrew importado';
      homebrew.threats.push(normalized);imported.push(normalized.name);
    }
    homebrew=normalizeHomebrew(homebrew);saveHomebrew();renderThreats();renderHomebrew();
    showToast(`✅ ${imported.length} ameaça(s) importada(s): ${imported.slice(0,2).join(', ')}${imported.length>2?'…':''}`);
  }catch(err){showToast(`❌ Não foi possível importar: ${err.message||'arquivo inválido'}`);}
  finally{event.target.value='';}
}
function exportFruitById(idOrName){
  const entry=allFruitEntries().find(x=>x.id===idOrName||x.data?.id===idOrName||x.data?.name===idOrName);if(!entry){showToast('Akuma no Mi não encontrada para exportar.');return;}
  const f=normalizeCustomFruit(entry.data);
  v25DownloadJSON(`weird-rpg-fruta-${v25SafeFilename(f.name,'akuma')}.json`,{format:'WEIRD-RPG',type:'fruit',version:25,exportedAt:new Date().toISOString(),data:f});
  showToast(`✅ ${f.name} exportada em JSON.`);
}
function exportAllHomebrewFruits(){
  const list=(homebrew.fruits||[]).map(normalizeCustomFruit);
  if(!list.length){showToast('Você ainda não criou frutas Homebrew para exportar.');return;}
  v25DownloadJSON('weird-rpg-akuma-no-mi-homebrew.json',{format:'WEIRD-RPG',type:'fruits',version:25,exportedAt:new Date().toISOString(),fruits:list});
  showToast(`✅ ${list.length} fruta(s) exportada(s).`);
}
function importFruitFile(){const input=$('fruitImportFile');if(!input){showToast('Campo de importação de fruta não encontrado.');return;}input.value='';input.click();}
async function handleFruitImport(event){
  const file=event.target.files?.[0];if(!file)return;
  try{
    let raw=String(await file.text()).replace(/^\uFEFF/,'').trim();let parsed=JSON.parse(raw);if(typeof parsed==='string')parsed=JSON.parse(parsed);
    let candidates=[];
    if(Array.isArray(parsed))candidates=parsed;
    else if(Array.isArray(parsed.fruits))candidates=parsed.fruits;
    else if(parsed.type==='fruit'&&parsed.data)candidates=[parsed.data];
    else if(parsed.fruit&&typeof parsed.fruit==='object')candidates=[parsed.fruit];
    else if(parsed.data&&typeof parsed.data==='object'&&(parsed.data.starterPowers||parsed.data.basic||parsed.data.levels))candidates=[parsed.data];
    else candidates=[parsed];
    candidates=candidates.map(x=>x?.data&&typeof x.data==='object'?x.data:x?.fruit||x).filter(x=>x&&typeof x==='object'&&(x.name||x.starterPowers||x.basic));
    if(!candidates.length)throw new Error('O JSON não contém uma Akuma no Mi reconhecida.');
    const imported=[];
    for(const rawFruit of candidates){
      const f=normalizeCustomFruit({...rawFruit,id:uid(),name:String(rawFruit.name||'Akuma no Mi importada').trim()});
      f.id=uid();homebrew.fruits.push(f);imported.push(f.name);
    }
    homebrew=normalizeHomebrew(homebrew);saveHomebrew();renderHomebrew();
    showToast(`✅ ${imported.length} fruta(s) importada(s): ${imported.slice(0,2).join(', ')}${imported.length>2?'…':''}`);
  }catch(err){showToast(`❌ Não foi possível importar: ${err.message||'arquivo inválido'}`);}
  finally{event.target.value='';}
}

/* Acrescenta importação/exportação nos cartões/listas sem remover a UI existente. */
const V25_oldRenderThreats=renderThreats;
renderThreats=function(){
  V25_oldRenderThreats();
  const head=document.querySelector('#threats .page-head .head-actions');
  if(head&&!head.querySelector('[data-v25-threat-import]')){
    const imp=document.createElement('button');imp.type='button';imp.className='secondary';imp.dataset.v25ThreatImport='1';imp.textContent='📥 Importar JSON';imp.addEventListener('click',importThreatFile);
    const all=document.createElement('button');all.type='button';all.className='secondary';all.dataset.v25ThreatExport='1';all.textContent='📤 Backup Homebrew';all.title='Exportar todas as ameaças que você criou';all.addEventListener('click',exportAllHomebrewThreats);
    head.prepend(imp);head.appendChild(all);
  }
  const q=String($('threatSearch')?.value||'').trim().toLowerCase();
  const entries=allThreatEntries().filter(e=>`${e.name} ${e.data.desc||''} ${e.data.fruit||''}`.toLowerCase().includes(q));
  document.querySelectorAll('#threatList .threat-card-v18').forEach((card,i)=>{
    const entry=entries[i];if(!entry)return;const actions=card.querySelector('.threat-card-buttons');if(!actions||actions.querySelector('[data-v25-export-threat]'))return;
    const btn=document.createElement('button');btn.type='button';btn.className='secondary';btn.dataset.v25ExportThreat='1';btn.textContent='📤 Exportar';btn.addEventListener('click',()=>exportThreatById(entry.id));actions.appendChild(btn);
  });
};
const V25_oldRenderHomebrew=renderHomebrew;
renderHomebrew=function(){
  V25_oldRenderHomebrew();
  const content=document.querySelector('#homebrewRoot .homebrew-content');if(!content)return;
  const head=content.querySelector('.page-head');if(head&&!head.querySelector('.v25-data-tools')){
    const tools=document.createElement('div');tools.className='v25-data-tools';
    if(homebrewTab==='fruits'){
      const imp=document.createElement('button');imp.type='button';imp.className='secondary';imp.textContent='📥 Importar fruta(s)';imp.onclick=importFruitFile;
      const exp=document.createElement('button');exp.type='button';exp.className='secondary';exp.textContent='📤 Exportar frutas';exp.onclick=exportAllHomebrewFruits;tools.append(imp,exp);
    } else if(homebrewTab==='threats'){
      const imp=document.createElement('button');imp.type='button';imp.className='secondary';imp.textContent='📥 Importar ameaça(s)';imp.onclick=importThreatFile;
      const exp=document.createElement('button');exp.type='button';exp.className='secondary';exp.textContent='📤 Exportar ameaças';exp.onclick=exportAllHomebrewThreats;tools.append(imp,exp);
    }
    if(tools.children.length)head.appendChild(tools);
  }
  if(homebrewTab==='fruits'){
    document.querySelectorAll('#homebrewRoot .homebrew-card').forEach((card,i)=>{
      const f=homebrew.fruits[i];const actions=card.querySelector('.agent-actions');if(!f||!actions||actions.querySelector('[data-v25-fruit-export]'))return;
      const btn=document.createElement('button');btn.type='button';btn.className='secondary';btn.dataset.v25FruitExport='1';btn.textContent='📤 Exportar';btn.addEventListener('click',()=>exportFruitById(f.id));actions.prepend(btn);
    });
  }
  if(homebrewTab==='threats'){
    document.querySelectorAll('#homebrewRoot .homebrew-card').forEach((card,i)=>{
      const t=homebrew.threats[i];const actions=card.querySelector('.agent-actions');if(!t||!actions||actions.querySelector('[data-v25-threat-export]'))return;
      const btn=document.createElement('button');btn.type='button';btn.className='secondary';btn.dataset.v25ThreatExport='1';btn.textContent='📤 Exportar';btn.addEventListener('click',()=>exportThreatById(t.id));actions.prepend(btn);
    });
  }
};
/* Also place import/export controls in the fruit library used during character creation. */
const V25_oldOpenLibrary=openLibrary;
openLibrary=function(type){V25_oldOpenLibrary(type);if(type==='fruits'){
  const box=document.querySelector('#libraryModal .library-box');if(!box)return;
  let tools=box.querySelector('.v25-fruit-library-tools');if(!tools){tools=document.createElement('div');tools.className='v25-fruit-library-tools v25-data-tools';const search=$('librarySearch');search?.insertAdjacentElement('afterend',tools);}
  tools.innerHTML='<button type="button" class="secondary" onclick="importFruitFile()">📥 Importar fruta</button><button type="button" class="secondary" onclick="exportAllHomebrewFruits()">📤 Exportar frutas próprias</button>';
}}
const V25_oldRenderLibrary=renderLibrary;
renderLibrary=function(){V25_oldRenderLibrary();if(libraryType!=='fruits')return;const cards=[...document.querySelectorAll('#libraryList .library-card')];cards.forEach(card=>{if(card.querySelector('[data-v25-library-export]'))return;const name=card.querySelector('b')?.textContent?.trim();if(!name)return;const btn=document.createElement('button');btn.type='button';btn.className='secondary';btn.dataset.v25LibraryExport='1';btn.textContent='📤';btn.title='Exportar esta Akuma no Mi';btn.addEventListener('click',()=>exportFruitById(name));card.appendChild(btn);});};

/* ============================================================
   WEIRD RPG V26 — MAPA DE MESA AVANÇADO
   Ferramentas: selecionar, mão/pan, lápis, névoa, revelar,
   zoom, setas, redimensionamento, categorias e backup.
   ============================================================ */
let v26ActiveMapCampaignId=null;
let v26PendingTokenCampaignId=null;
let v26MapTool='select';
let v26PickerCampaignId=null;
let v26PickerCategory='Ameaças';
let v26PickerItems=[];
let v26WheelSaveTimer=null;

const V26_MAP_CATEGORIES={
  'Animais':[
    ['Cachorro','🐕'],['Gato','🐈'],['Cavalo','🐎'],['Lobo','🐺'],['Raposa','🦊'],['Urso','🐻'],['Javali','🐗'],['Macaco','🐒'],['Gorila','🦍'],['Águia','🦅'],['Corvo','🐦‍⬛'],['Papagaio','🦜'],['Cobra','🐍'],['Jacaré','🐊'],['Tubarão','🦈'],['Baleia','🐋'],['Polvo','🐙'],['Caranguejo','🦀'],['Tartaruga','🐢'],['Rato','🐀'],['Morcego','🦇'],['Aranha','🕷️'],['Escorpião','🦂'],['Dinossauro','🦖'],['Dragão','🐉'],['Peixe','🐟'],['Golfinho','🐬'],['Pinguim','🐧'],['Abelha','🐝'],['Borboleta','🦋'],['Veado','🦌'],['Elefante','🐘'],['Leão','🦁'],['Tigre','🐅'],['Rinoceronte','🦏'],['Hipopótamo','🦛']
  ],
  'Objetos':[
    ['Baú','🧰'],['Tesouro','💰'],['Moedas','🪙'],['Barril','🛢️'],['Caixa','📦'],['Mesa','🪑'],['Cadeira','🪑'],['Cama','🛏️'],['Porta','🚪'],['Janela','🪟'],['Escada','🪜'],['Corda','🪢'],['Tocha','🔥'],['Fogueira','🔥'],['Lanterna','🏮'],['Chave','🗝️'],['Livro','📕'],['Mapa','🗺️'],['Bandeira','🚩'],['Estátua','🗿'],['Fonte','⛲'],['Poço','🕳️'],['Barricada','🛑'],['Caixote','🧱'],['Pedra','🪨'],['Árvore','🌳'],['Arbusto','🌿'],['Palmeira','🌴'],['Cogumelo','🍄'],['Cristal','💎'],['Totem','🗿'],['Altar','🕯️'],['Cofre','🔐'],['Armadilha','⚠️'],['Espinhos','🌵'],['Ponte','🌉'],['Pilar','🏛️'],['Pilha de ossos','☠️'],['Barraca','⛺'],['Rede','🪢'],['Tenda','⛺'],['Barril explosivo','💣'],['Engrenagem','⚙️'],['Canhão','💥'],['Bússola','🧭'],['Relógio','🕰️']
  ],
  'Veículos':[
    ['Navio pirata','🏴‍☠️'],['Barco pequeno','🚣'],['Bote','🛶'],['Navio de guerra','⚓'],['Submarino','🚤'],['Carroça','🛒'],['Carruagem','🐴'],['Bicicleta','🚲'],['Motocicleta','🏍️'],['Carro','🚗'],['Trem','🚂'],['Dirigível','🎈'],['Balão','🎈'],['Aeronave','✈️']
  ],
  'Marcadores':[
    ['Ponto de interesse','📍'],['Objetivo','🎯'],['Entrada','⬇️'],['Saída','⬆️'],['Perigo','☠️'],['Missão','⭐'],['Interrogação','❓'],['Exclamação','❗'],['Som','🔊'],['Alerta','🚨'],['Zona segura','🟢'],['Zona proibida','⛔'],['Spawn','✨'],['Portal','🌀'],['Rastros','👣'],['Pegadas','🐾']
  ],
  'Efeitos':[
    ['Explosão','💥'],['Fogo','🔥'],['Gelo','❄️'],['Raio','⚡'],['Fumaça','💨'],['Veneno','☣️'],['Magia','✨'],['Aura','🔮'],['Sangue','🩸'],['Água','💧'],['Vento','🌪️'],['Sombra','🌑'],['Luz','🌟'],['Barreira','🛡️'],['Armadilha mágica','🪄'],['Área de cura','💚']
  ]
};

function ensureCampaignMapData(c){
  if(!c.mapData||typeof c.mapData!=='object')c.mapData={};
  const d=c.mapData;
  d.background=String(d.background||'');
  d.name=String(d.name||`${c.name||'Campanha'} — Mapa`);
  d.width=clamp(num(d.width,1400),500,5000);
  d.height=clamp(num(d.height,820),400,3500);
  d.showGrid=d.showGrid!==false;
  d.zoom=clamp(num(d.zoom,1),.2,3);
  d.panX=num(d.panX,0);d.panY=num(d.panY,0);
  d.tool=['select','hand','draw','fog','reveal'].includes(d.tool)?d.tool:'select';
  d.tokens=Array.isArray(d.tokens)?d.tokens.filter(Boolean).map((t,i)=>({
    id:t.id||uid(),type:t.type||'custom',sourceId:t.sourceId||'',label:String(t.label||'Token'),
    labelOverride:!!t.labelOverride,emoji:t.emoji||'🎯',image:String(t.image||''),
    x:clamp(num(t.x,18+(i%6)*12),3,97),y:clamp(num(t.y,18+Math.floor(i/6)*12),5,95),
    size:clamp(num(t.size,68),38,220),category:t.category||''
  })) : [];
  d.inkData=String(d.inkData||'');d.fogData=String(d.fogData||'');
  return d;
}

const V26_baseRenderCampaignBoard=renderCampaignBoard;
renderCampaignBoard=function(c){
  ensureCampaignMapData(c);
  let html=V26_baseRenderCampaignBoard(c);
  const cid=escapeAttr(c.id);
  html=html.replace('<div class="campaign-v17-sticky-actions">','<div class="campaign-v17-sticky-actions"><button type="button" class="primary" onclick="toggleCampaignMap(\''+cid+'\')">🗺 Mapa</button>');
  const panel=`<section class="campaign-v25-map-panel campaign-v26-map-panel" id="campaignMapPanel-${cid}" hidden>
    <div class="campaign-v26-map-titlebar">
      <div class="campaign-v26-map-titlecopy"><span class="eyebrow">MESA • MODO MAPA</span><input id="campaignMapName-${cid}" class="campaign-v26-map-name" value="${escapeAttr(ensureCampaignMapData(c).name)}" aria-label="Nome do mapa" onchange="renameCampaignMap('${cid}',this.value)" onkeydown="if(event.key==='Enter'){this.blur();}"><p>Monte o cenário, mova tokens, desenhe no mapa e esconda áreas com névoa de guerra. As alterações são salvas nesta campanha neste navegador.</p></div>
      <div class="campaign-v26-top-actions"><button type="button" class="secondary" onclick="chooseCampaignMapBackground('${cid}')">🖼️ Fundo</button><button type="button" class="secondary" onclick="exportCampaignMap('${cid}')">📤 Exportar</button><button type="button" class="secondary" onclick="importCampaignMap('${cid}')">📥 Importar</button><button type="button" class="primary" onclick="toggleCampaignMap('${cid}')">✕ Voltar à mesa</button></div>
    </div>
    <div class="campaign-v26-toolbar" role="toolbar" aria-label="Ferramentas do mapa">
      <div class="campaign-v26-toolgroup"><span>Ferramentas</span><button type="button" data-map-tool="select" class="selected" onclick="setCampaignMapTool('${cid}','select')" title="Selecionar e mover tokens">↖ Selecionar</button><button type="button" data-map-tool="hand" onclick="setCampaignMapTool('${cid}','hand')" title="Arrastar o mapa para navegar">✋ Mão</button><button type="button" data-map-tool="draw" onclick="setCampaignMapTool('${cid}','draw')" title="Desenhar e rabiscar">✏️ Lápis</button><button type="button" data-map-tool="fog" onclick="setCampaignMapTool('${cid}','fog')" title="Pintar névoa para esconder uma área">🌫️ Névoa</button><button type="button" data-map-tool="reveal" onclick="setCampaignMapTool('${cid}','reveal')" title="Apagar a névoa e revelar área">🔦 Revelar</button></div>
      <div class="campaign-v26-toolgroup"><span>Zoom / navegação</span><button type="button" onclick="zoomCampaignMap('${cid}',-.15)" title="Diminuir zoom">−</button><output id="campaignMapZoom-${cid}">100%</output><button type="button" onclick="zoomCampaignMap('${cid}',.15)" title="Aumentar zoom">＋</button><button type="button" onclick="fitCampaignMap('${cid}')" title="Enquadrar o mapa inteiro">⛶ Enquadrar</button><div class="campaign-v26-panpad" aria-label="Mover mapa"><button type="button" onclick="panCampaignMap('${cid}',0,-80)" title="Mover para cima">↑</button><span><button type="button" onclick="panCampaignMap('${cid}',-80,0)" title="Mover para esquerda">←</button><button type="button" onclick="panCampaignMap('${cid}',80,0)" title="Mover para direita">→</button></span><button type="button" onclick="panCampaignMap('${cid}',0,80)" title="Mover para baixo">↓</button></div></div>
      <div class="campaign-v26-toolgroup"><span>Elementos</span><button type="button" class="secondary" onclick="openCampaignMapTokenPicker('${cid}')">＋ Agentes</button><button type="button" class="secondary" onclick="openCampaignMapAssetPicker('${cid}')">🧩 Biblioteca</button><button type="button" class="secondary" onclick="chooseCampaignMapTokenImage('${cid}')">📷 Token próprio</button><button type="button" class="secondary" onclick="toggleCampaignMapGrid('${cid}')">⌗ Grade</button></div>
      <div class="campaign-v26-toolgroup"><span>Camadas</span><button type="button" onclick="clearCampaignMapDrawings('${cid}')">🧹 Limpar desenhos</button><button type="button" onclick="clearCampaignMapFog('${cid}')">🌫️ Limpar névoa</button></div>
      <div class="campaign-v26-toolgroup"><span>Token selecionado</span><button type="button" onclick="resizeSelectedMapToken('${cid}',-10)" title="Diminuir token">A−</button><button type="button" onclick="resizeSelectedMapToken('${cid}',10)" title="Aumentar token">A＋</button><button type="button" onclick="renameSelectedMapToken('${cid}')">✎ Renomear</button><button type="button" class="danger" onclick="removeSelectedMapToken('${cid}')">🗑 Remover</button><small id="campaignMapSelection-${cid}">Selecione um token no mapa.</small></div>
    </div>
    <div class="campaign-v26-map-settings"><label>Largura do mapa (px)<input type="number" id="campaignMapWidth-${cid}" min="500" max="5000" step="100" value="${ensureCampaignMapData(c).width}"></label><label>Altura do mapa (px)<input type="number" id="campaignMapHeight-${cid}" min="400" max="3500" step="100" value="${ensureCampaignMapData(c).height}"></label><button type="button" class="primary" onclick="applyCampaignMapSize('${cid}')">↔ Aplicar tamanho</button><label class="campaign-v26-brush">Tamanho do pincel <input type="range" id="campaignMapBrush-${cid}" min="6" max="180" value="${ensureCampaignMapData(c).brushSize||36}" oninput="updateCampaignMapBrushLabel('${cid}',this.value)"><small id="campaignMapBrushValue-${cid}">${ensureCampaignMapData(c).brushSize||36}px</small></label><label class="campaign-v26-color-label">Cor do lápis<select id="campaignMapBrushColor-${cid}" onchange="setCampaignMapBrushColor('${cid}',this.value)"><option value="#ffd166">Amarelo</option><option value="#ffffff">Branco</option><option value="#ff5b65">Vermelho</option><option value="#5bbcff">Azul</option><option value="#43df9a">Verde</option><option value="#d69bff">Roxo</option></select></label><span class="campaign-v26-shortcut-note">Dica: use a ferramenta Mão para arrastar o cenário; a roda do mouse sobre o mapa ajusta o zoom.</span></div>
    <div class="campaign-map-stage campaign-map-viewport" id="campaignMapStage-${cid}" data-campaign-map-stage="${cid}" aria-label="Mapa de campanha"><div class="campaign-v26-map-board" id="campaignMapBoard-${cid}"></div></div>
    <div class="campaign-map-legend"><span>🔵 Agente</span><span>🔴 Ameaça</span><span>🟡 Objeto</span><span>✏️ Desenho</span><span>🌫️ Névoa salva no mapa</span></div>
    <div class="campaign-map-footer"><span id="campaignMapStatus-${cid}">Mapa salvo automaticamente nesta campanha.</span><span>O modo local não sincroniza a névoa com aparelhos de outros jogadores.</span></div>
  </section>`;
  html=html.replace(/<section class="campaign-v25-map-panel" id="campaignMapPanel-[^"]+" hidden>[\s\S]*?<\/section>/,panel);
  html=html.replace('<section class="campaign-v17-history">',panel+'<section class="campaign-v17-history">');
  return html;
};

function toggleCampaignMap(cid){
  const c=getCampaign(cid);if(!c)return;
  const boardRoot=document.querySelector(`[data-campaign-board="${CSS.escape(cid)}"]`);if(!boardRoot)return;
  const content=boardRoot.querySelector('.campaign-v17-content'),panel=$(`campaignMapPanel-${cid}`);if(!content||!panel)return;
  const opening=panel.hidden;panel.hidden=!opening;content.classList.toggle('campaign-v25-map-open',opening);v26ActiveMapCampaignId=opening?cid:null;
  if(opening){const d=ensureCampaignMapData(c);v26MapTool=d.tool;renderCampaignMap(cid);requestAnimationFrame(()=>{panel.scrollIntoView({block:'start',behavior:'smooth'});fitCampaignMap(cid);});}
  else {const header=boardRoot.querySelector('.campaign-v17-sticky');header?.scrollIntoView({block:'nearest',behavior:'smooth'});}
}
function v26MapSource(c,token){
  if(token.type==='agent'){
    const m=c.members.find(x=>x.id===token.sourceId||x.agentId===token.sourceId);
    if(m)return {label:token.labelOverride?token.label:(m.agent.name||token.label),image:m.agent.avatar||token.image||'',emoji:'👤'};
  }
  if(token.type==='threat'){
    const t=c.threats.find(x=>x.id===token.sourceId);
    if(t)return {label:token.labelOverride?token.label:(t.name||token.label),image:t.image||token.image||'',emoji:'👹'};
  }
  return {label:token.label||'Token',image:token.image||'',emoji:token.emoji||'🎯'};
}
function v26BoardTransform(cid){
  const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c),board=$(`campaignMapBoard-${cid}`);if(!board)return;
  board.style.width=`${d.width}px`;board.style.height=`${d.height}px`;board.classList.toggle('grid-on',d.showGrid);board.style.transform=`translate(${d.panX}px, ${d.panY}px) scale(${d.zoom})`;
  const z=$(`campaignMapZoom-${cid}`);if(z)z.textContent=`${Math.round(d.zoom*100)}%`;
  const stage=$(`campaignMapStage-${cid}`);if(stage)stage.classList.toggle('grid-on',d.showGrid);
}
function v26CanvasLoad(canvas,dataUrl){
  if(!canvas||!dataUrl)return;
  const ctx=canvas.getContext('2d'),img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);};img.src=dataUrl;
}
function renderCampaignMap(cid){
  const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);const stage=$(`campaignMapStage-${cid}`);const board=$(`campaignMapBoard-${cid}`);if(!stage||!board)return;
  d.tool=d.tool||'select';v26MapTool=d.tool;
  board.style.width=`${d.width}px`;board.style.height=`${d.height}px`;
  let html=d.background?`<img class="campaign-map-background" src="${escapeAttr(d.background)}" alt="Fundo do mapa" draggable="false">`:'<div class="campaign-map-empty"><b>🗺️ Cenário de batalha</b><small>Carregue um fundo ou monte o tabuleiro livre. Use Mão para navegar, Lápis para marcar rotas e Névoa para esconder áreas.</small></div>';
  html+=d.tokens.map((token,index)=>{
    const source=v26MapSource(c,token),kind=token.type==='agent'?'agent':token.type==='threat'?'threat':'custom';
    const size=clamp(num(token.size,68),38,220),portrait=clamp(Math.round(size*.68),28,150);
    const pic=source.image?`<img src="${escapeAttr(source.image)}" alt="" draggable="false" onerror="this.style.display='none';this.parentElement.dataset.failed='1'">`:`<span>${escapeHTML(source.emoji||'🎯')}</span>`;
    return `<div class="campaign-map-token ${kind} ${d.selectedTokenId===token.id?'is-selected':''}" role="group" tabindex="0" data-map-token-index="${index}" data-map-token-id="${escapeAttr(token.id)}" style="left:${clamp(num(token.x,50),2,98)}%;top:${clamp(num(token.y,50),3,97)}%;--map-token-size:${size}px;--map-token-portrait:${portrait}px" title="${escapeAttr(source.label)}"><button type="button" class="campaign-map-token-remove" title="Remover token" aria-label="Remover ${escapeAttr(source.label)}" onclick="removeCampaignMapToken('${escapeAttr(cid)}','${escapeAttr(token.id)}')">×</button><div class="token-portrait">${pic}</div><span class="token-label">${escapeHTML(source.label)}</span></div>`;
  }).join('');
  html+=`<svg class="campaign-map-ink-svg" id="campaignMapInkSvg-${cid}" viewBox="0 0 ${d.width} ${d.height}" preserveAspectRatio="none" aria-hidden="true">${(d.drawings||[]).map(x=>`<path d="${escapeAttr(x.d||'')}" fill="none" stroke="${escapeAttr(x.color||'#f7d35f')}" stroke-width="${clamp(num(x.width,5),1,40)}" stroke-linecap="round" stroke-linejoin="round" opacity="${clamp(num(x.opacity,.95),.1,1)}"/>`).join('')}</svg><canvas class="campaign-map-canvas map-ink-canvas" id="campaignMapInk-${cid}" width="${d.width}" height="${d.height}" aria-label="Camada de desenho"></canvas><canvas class="campaign-map-canvas map-fog-canvas" id="campaignMapFog-${cid}" width="${d.width}" height="${d.height}" aria-label="Camada de névoa"></canvas>`;
  board.innerHTML=html;v26BoardTransform(cid);v26CanvasLoad($(`campaignMapInk-${cid}`),d.inkData);v26CanvasLoad($(`campaignMapFog-${cid}`),d.fogData);
  const ink=$(`campaignMapInk-${cid}`),fog=$(`campaignMapFog-${cid}`);
  if(ink)ink.style.pointerEvents=d.tool==='draw'?'auto':'none';if(fog)fog.style.pointerEvents=['fog','reveal'].includes(d.tool)?'auto':'none';
  stage.dataset.currentTool=d.tool;
  document.querySelectorAll(`#campaignMapPanel-${CSS.escape(cid)} [data-map-tool]`).forEach(b=>b.classList.toggle('selected',b.dataset.mapTool===d.tool));
  const width=$(`campaignMapWidth-${cid}`),height=$(`campaignMapHeight-${cid}`);if(width)width.value=d.width;if(height)height.value=d.height;
  const brush=$(`campaignMapBrush-${cid}`);if(brush)brush.value=d.brushSize||36;const color=$(`campaignMapBrushColor-${cid}`);if(color)color.value=d.brushColor||'#ffd166';updateCampaignMapBrushLabel(cid,d.brushSize||36);
  bindCampaignMapDrag(cid,stage);bindCampaignMapNavigation(cid,stage);bindCampaignMapCanvas(cid,ink,'draw');bindCampaignMapCanvas(cid,fog,d.tool==='reveal'?'reveal':'fog');
  updateCampaignMapSelection(cid);
  const status=$(`campaignMapStatus-${cid}`);if(status)status.textContent=`${d.tokens.length} token(s) • ${d.width} × ${d.height}px • zoom ${Math.round(d.zoom*100)}% • salvamento automático`;
}
function saveCampaignMap(cid,message){const c=getCampaign(cid);if(!c)return false;const ok=saveCampaigns();const status=$(`campaignMapStatus-${cid}`);if(status)status.textContent=ok?(message||'✅ Mapa salvo automaticamente.'):'⚠️ Não foi possível salvar. O armazenamento pode estar cheio.';return ok;}
function setCampaignMapTool(cid,tool){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);d.tool=tool;v26MapTool=tool;saveCampaignMap(cid,`Ferramenta ativa: ${{select:'Selecionar',hand:'Mão / mover mapa',draw:'Lápis',fog:'Névoa',reveal:'Revelar névoa'}[tool]||tool}.`);renderCampaignMap(cid);}
function bindCampaignMapDrag(cid,stage){
  const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);const board=$(`campaignMapBoard-${cid}`);if(!board)return;
  board.querySelectorAll('.campaign-map-token').forEach(tokenEl=>{
    if(tokenEl.dataset.v26Bound==='1')return;tokenEl.dataset.v26Bound='1';let drag=null;
    tokenEl.addEventListener('pointerdown',e=>{
      const now=getCampaign(cid)?.mapData;if(!now||now.tool!=='select'||e.target.closest('button')||(e.pointerType==='mouse'&&e.button!==0))return;
      const index=num(tokenEl.dataset.mapTokenIndex,-1),token=now.tokens[index];if(!token)return;const rect=board.getBoundingClientRect();
      drag={pointerId:e.pointerId,index,startX:e.clientX,startY:e.clientY,baseX:num(token.x,50),baseY:num(token.y,50),rect,moved:false};
      try{tokenEl.setPointerCapture(e.pointerId)}catch(_){};e.preventDefault();
    },{passive:false});
    tokenEl.addEventListener('pointermove',e=>{
      if(!drag||e.pointerId!==drag.pointerId)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;
      const sizeRatio=ensureCampaignMapData(getCampaign(cid)).zoom||1;const x=clamp(drag.baseX+(dx/Math.max(1,drag.rect.width))*100,2,98),y=clamp(drag.baseY+(dy/Math.max(1,drag.rect.height))*100,3,97);
      tokenEl.style.left=`${x}%`;tokenEl.style.top=`${y}%`;if(e.cancelable)e.preventDefault();
    },{passive:false});
    const finish=e=>{
      if(!drag||e.pointerId!==drag.pointerId)return;const s=drag;drag=null;const c2=getCampaign(cid),map=c2&&ensureCampaignMapData(c2),token=map?.tokens[s.index];if(!token)return;
      if(s.moved){const dx=e.clientX-s.startX,dy=e.clientY-s.startY;token.x=clamp(s.baseX+dx/Math.max(1,s.rect.width)*100,2,98);token.y=clamp(s.baseY+dy/Math.max(1,s.rect.height)*100,3,97);}
      map.selectedTokenId=token.id;tokenEl.classList.add('is-selected');saveCampaignMap(cid,s.moved?'✅ Posição do token salva.':`Selecionado: ${token.label}.`);updateCampaignMapSelection(cid);
    };
    tokenEl.addEventListener('pointerup',finish);tokenEl.addEventListener('pointercancel',finish);
    tokenEl.addEventListener('click',()=>{const cc=getCampaign(cid);if(!cc)return;ensureCampaignMapData(cc).selectedTokenId=tokenEl.dataset.mapTokenId;updateCampaignMapSelection(cid);});
  });
}
function bindCampaignMapNavigation(cid,stage){
  if(stage.dataset.v26NavBound==='1')return;stage.dataset.v26NavBound='1';let pan=null;
  stage.addEventListener('pointerdown',e=>{const c=getCampaign(cid),d=c&&ensureCampaignMapData(c);if(!d||d.tool!=='hand'||e.target.closest('button'))return;if(e.pointerType==='mouse'&&e.button!==0)return;pan={id:e.pointerId,x:e.clientX,y:e.clientY,panX:d.panX,panY:d.panY,moved:false};try{stage.setPointerCapture(e.pointerId)}catch(_){};e.preventDefault();});
  stage.addEventListener('pointermove',e=>{if(!pan||pan.id!==e.pointerId)return;const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c),dx=e.clientX-pan.x,dy=e.clientY-pan.y;pan.moved=pan.moved||Math.abs(dx)+Math.abs(dy)>2;d.panX=pan.panX+dx;d.panY=pan.panY+dy;v26BoardTransform(cid);if(e.cancelable)e.preventDefault();},{passive:false});
  const end=e=>{if(!pan||pan.id!==e.pointerId)return;const moved=pan.moved;pan=null;if(moved)saveCampaignMap(cid,'✅ Posição do mapa salva.');};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
  stage.addEventListener('wheel',e=>{const c=getCampaign(cid),d=c&&ensureCampaignMapData(c);if(!d)return;e.preventDefault();const amount=e.deltaY<0?.08:-.08;zoomCampaignMapAt(cid,amount,e.clientX,e.clientY);clearTimeout(v26WheelSaveTimer);v26WheelSaveTimer=setTimeout(()=>saveCampaignMap(cid,'✅ Zoom salvo.'),250);},{passive:false});
}
function bindCampaignMapCanvas(cid,canvas,mode){
  if(!canvas||canvas.dataset.v26Bound==='1')return;canvas.dataset.v26Bound='1';let stroke=null;
  canvas.addEventListener('pointerdown',e=>{
    const c=getCampaign(cid),d=c&&ensureCampaignMapData(c);if(!d)return;
    const active=canvas.classList.contains('map-ink-canvas')?'draw':d.tool;if((active==='draw'&&d.tool!=='draw')||(!['fog','reveal'].includes(active)&&active!=='draw'))return;
    if(e.pointerType==='mouse'&&e.button!==0)return;const rect=canvas.getBoundingClientRect();const point={x:clamp((e.clientX-rect.left)/rect.width*canvas.width,0,canvas.width),y:clamp((e.clientY-rect.top)/rect.height*canvas.height,0,canvas.height)};
    const ctx=canvas.getContext('2d');const size=clamp(num(d.brushSize,36),6,180);stroke={pointerId:e.pointerId,ctx,mode:active,last:point,size};ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=active==='draw'?Math.max(2,size*.20):size;
    if(active==='draw'){ctx.globalCompositeOperation='source-over';ctx.strokeStyle=d.brushColor||'#ffd166';ctx.globalAlpha=.96;}else if(active==='fog'){ctx.globalCompositeOperation='source-over';ctx.strokeStyle='#080b10';ctx.globalAlpha=.94;}else{ctx.globalCompositeOperation='destination-out';ctx.strokeStyle='rgba(0,0,0,1)';ctx.globalAlpha=1;}
    ctx.beginPath();ctx.moveTo(point.x,point.y);ctx.lineTo(point.x+.1,point.y+.1);ctx.stroke();try{canvas.setPointerCapture(e.pointerId)}catch(_){};e.preventDefault();
  },{passive:false});
  canvas.addEventListener('pointermove',e=>{if(!stroke||stroke.pointerId!==e.pointerId)return;const rect=canvas.getBoundingClientRect(),p={x:clamp((e.clientX-rect.left)/rect.width*canvas.width,0,canvas.width),y:clamp((e.clientY-rect.top)/rect.height*canvas.height,0,canvas.height)};stroke.ctx.beginPath();stroke.ctx.moveTo(stroke.last.x,stroke.last.y);stroke.ctx.lineTo(p.x,p.y);stroke.ctx.stroke();stroke.last=p;if(e.cancelable)e.preventDefault();},{passive:false});
  const finish=e=>{if(!stroke||e.pointerId!==stroke.pointerId)return;const state=stroke;stroke=null;state.ctx.restore();const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);try{if(state.mode==='draw')d.inkData=canvas.toDataURL('image/png');else d.fogData=canvas.toDataURL('image/png');if(!saveCampaignMap(cid,state.mode==='draw'?'✏️ Desenho salvo.':state.mode==='fog'?'🌫️ Névoa salva.':'🔦 Área revelada e salva.'))showToast('Não foi possível salvar a camada; tente um mapa menor.');}catch(err){showToast('O mapa ficou grande demais para o armazenamento local. Exporte o mapa ou reduza a resolução.');}};
  canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
}
function zoomCampaignMapAt(cid,delta,clientX,clientY){
  const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c),stage=$(`campaignMapStage-${cid}`);if(!stage)return;const old=d.zoom,newZoom=clamp(old+delta,.2,3);if(newZoom===old)return;
  const r=stage.getBoundingClientRect();const px=clientX==null?r.left+r.width/2:clientX,py=clientY==null?r.top+r.height/2:clientY;const localX=px-r.left,localY=py-r.top;const mapX=(localX-d.panX)/old,mapY=(localY-d.panY)/old;d.zoom=newZoom;d.panX=localX-mapX*newZoom;d.panY=localY-mapY*newZoom;v26BoardTransform(cid);
}
function zoomCampaignMap(cid,delta){zoomCampaignMapAt(cid,delta);saveCampaignMap(cid,'Zoom alterado.');}
function panCampaignMap(cid,dx,dy){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);d.panX+=dx;d.panY+=dy;v26BoardTransform(cid);saveCampaignMap(cid,'Mapa movido.');}
function fitCampaignMap(cid){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c),stage=$(`campaignMapStage-${cid}`);if(!stage)return;const r=stage.getBoundingClientRect(),zoom=clamp(Math.min(r.width/d.width,r.height/d.height),.2,2.5);d.zoom=zoom;d.panX=(r.width-d.width*zoom)/2;d.panY=(r.height-d.height*zoom)/2;v26BoardTransform(cid);saveCampaignMap(cid,'Mapa enquadrado na tela.');}
function renameCampaignMap(cid,value){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);d.name=String(value||'').trim()||`${c.name||'Campanha'} — Mapa`;const field=$(`campaignMapName-${cid}`);if(field)field.value=d.name;saveCampaignMap(cid,'✅ Nome do mapa salvo.');}
function applyCampaignMapSize(cid){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c),w=clamp(num($(`campaignMapWidth-${cid}`)?.value,d.width),500,5000),h=clamp(num($(`campaignMapHeight-${cid}`)?.value,d.height),400,3500);d.width=Math.round(w);d.height=Math.round(h);d.zoom=1;d.panX=0;d.panY=0;
  ['inkData','fogData'].forEach(key=>{if(!d[key])return;const image=new Image();image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=d.width;canvas.height=d.height;canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);d[key]=canvas.toDataURL('image/png');saveCampaigns();};image.src=d[key];});saveCampaigns();renderCampaignMap(cid);requestAnimationFrame(()=>fitCampaignMap(cid));showToast(`📐 Tamanho do mapa definido: ${d.width} × ${d.height}px.`);
}
function updateCampaignMapBrushLabel(cid,value){const d=$(`campaignMapBrushValue-${cid}`);if(d)d.textContent=`${value}px`;const c=getCampaign(cid);if(c)ensureCampaignMapData(c).brushSize=clamp(num(value,36),6,180);}
function setCampaignMapBrushColor(cid,value){const c=getCampaign(cid);if(!c)return;ensureCampaignMapData(c).brushColor=['#ffd166','#ffffff','#ff5b65','#5bbcff','#43df9a','#d69bff'].includes(value)?value:'#ffd166';saveCampaignMap(cid,'Cor do lápis atualizada.');}
function clearCampaignMapDrawings(cid){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);if(!d.inkData){showToast('Não há desenhos para limpar.');return;}if(!confirmAction('Apagar todos os desenhos/rabiscos deste mapa?'))return;d.inkData='';saveCampaignMap(cid,'Desenhos removidos.');renderCampaignMap(cid);showToast('🧹 Desenhos removidos.');}
function clearCampaignMapFog(cid){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);if(!d.fogData){showToast('Não há névoa para limpar.');return;}if(!confirmAction('Revelar todo o mapa removendo a névoa?'))return;d.fogData='';saveCampaignMap(cid,'Névoa removida.');renderCampaignMap(cid);showToast('🔦 O mapa está todo revelado.');}
function updateCampaignMapSelection(cid){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c),token=d.tokens.find(t=>t.id===d.selectedTokenId);const label=$(`campaignMapSelection-${cid}`);if(label)label.textContent=token?`Selecionado: ${token.label} • ${token.size}px`:'Selecione um token no mapa.';const board=$(`campaignMapBoard-${cid}`);board?.querySelectorAll('.campaign-map-token').forEach(el=>el.classList.toggle('is-selected',el.dataset.mapTokenId===d.selectedTokenId));}
function selectedCampaignMapToken(cid){const c=getCampaign(cid);if(!c)return null;const d=ensureCampaignMapData(c);return d.tokens.find(t=>t.id===d.selectedTokenId)||null;}
function resizeSelectedMapToken(cid,delta){const c=getCampaign(cid);if(!c)return;const t=selectedCampaignMapToken(cid);if(!t){showToast('Selecione primeiro um token.');return;}t.size=clamp(num(t.size,68)+delta,38,220);saveCampaignMap(cid,`Tamanho de ${t.label}: ${t.size}px.`);renderCampaignMap(cid);}
function renameSelectedMapToken(cid){const c=getCampaign(cid);if(!c)return;const t=selectedCampaignMapToken(cid);if(!t){showToast('Selecione primeiro um token.');return;}const label=window.prompt('Novo nome para o token:',t.label);if(label===null)return;t.label=label.trim()||t.label;t.labelOverride=true;saveCampaignMap(cid,'✅ Nome do token salvo.');renderCampaignMap(cid);}
function removeSelectedMapToken(cid){const t=selectedCampaignMapToken(cid);if(!t){showToast('Selecione primeiro um token.');return;}removeCampaignMapToken(cid,t.id);}
function addCampaignMapToken(cid,token){
  const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);const item={id:uid(),type:token.type||'custom',sourceId:token.sourceId||'',label:String(token.label||'Token'),labelOverride:false,emoji:token.emoji||'🎯',image:token.image||'',x:clamp(num(token.x,42+Math.random()*16),5,95),y:clamp(num(token.y,42+Math.random()*16),5,95),size:clamp(num(token.size,68),38,220),category:token.category||''};d.tokens.push(item);d.selectedTokenId=item.id;saveCampaignMap(cid);['campaignMapPickerModal','campaignMapAssetPickerModal'].forEach(closeModal);renderCampaignMap(cid);showToast(`✅ ${item.label} adicionado ao mapa.`);
}
function removeCampaignMapToken(cid,tokenId){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);d.tokens=d.tokens.filter(t=>t.id!==tokenId);if(d.selectedTokenId===tokenId)d.selectedTokenId=null;saveCampaignMap(cid,'Token removido.');renderCampaignMap(cid);}
function toggleCampaignMapGrid(cid){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);d.showGrid=!d.showGrid;saveCampaignMap(cid,d.showGrid?'Grade ativada.':'Grade desativada.');renderCampaignMap(cid);}
function chooseCampaignMapBackground(cid){v26ActiveMapCampaignId=cid;const input=$('campaignMapBackgroundFile');if(input){input.value='';input.click();}}
function chooseCampaignMapTokenImage(cid){v26PendingTokenCampaignId=cid;const input=$('campaignMapTokenFile');if(input){input.value='';input.click();}}
async function handleCampaignMapBackground(event){const file=event.target.files?.[0],cid=v26ActiveMapCampaignId;if(!file||!cid)return;try{if(!/^image\/(png|jpe?g|webp)$/i.test(file.type))throw new Error('Escolha uma imagem PNG, JPG ou WEBP.');const image=await compressImageFile(file,2200,.78);const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c),old=d.background;d.background=image;if(!saveCampaignMap(cid,'✅ Fundo do mapa salvo.')){d.background=old;throw new Error('Armazenamento cheio. Use uma imagem menor.');}renderCampaignMap(cid);fitCampaignMap(cid);}catch(err){showToast(`❌ ${err.message||'Falha ao carregar o cenário.'}`);}finally{event.target.value='';}}
async function handleCampaignMapTokenImage(event){const file=event.target.files?.[0],cid=v26PendingTokenCampaignId;if(!file||!cid)return;try{if(!/^image\/(png|jpe?g|webp)$/i.test(file.type))throw new Error('Escolha uma imagem PNG, JPG ou WEBP.');const image=await compressImageFile(file,800,.8);const label=window.prompt('Nome deste token:','Token personalizado');if(label===null)return;addCampaignMapToken(cid,{type:'custom',label:label.trim()||'Token personalizado',image,emoji:'🎯'});}catch(err){showToast(`❌ ${err.message||'Falha ao carregar o token.'}`);}finally{event.target.value='';v26PendingTokenCampaignId=null;}}

function openCampaignMapTokenPicker(cid){
  const c=getCampaign(cid);if(!c)return;ensureCampaignMapData(c);let modal=$('campaignMapPickerModal');
  if(!modal){modal=document.createElement('div');modal.id='campaignMapPickerModal';modal.className='modal hidden';modal.innerHTML=`<div class="modal-box wide-modal campaign-v26-picker-modal"><button type="button" class="close" onclick="closeModal('campaignMapPickerModal')">×</button><span class="eyebrow">MAPA</span><h2>Adicionar agente</h2><p class="muted">Escolha um personagem já colocado na mesa. Para qualquer ameaça da biblioteca, use Biblioteca → Ameaças.</p><div id="campaignMapPickerList" class="campaign-map-picker-grid"></div></div>`;document.body.appendChild(modal);}
  v26PickerItems=c.members.map(m=>({type:'agent',sourceId:m.id,label:m.agent.name||'Agente',image:m.agent.avatar||'',emoji:'👤',category:'Agentes'}));
  $('campaignMapPickerList').innerHTML=v26PickerItems.length?v26PickerItems.map((x,i)=>v26MapPickerCard(x,i,cid)).join(''):'<div class="empty-small">Adicione um agente à campanha antes de colocá-lo no mapa.</div>';openModal('campaignMapPickerModal');
}
function v26MapPickerCard(x,index,cid){return `<button type="button" class="campaign-map-picker-item" onclick="addCampaignMapToken('${escapeAttr(cid)}',v26PickerItems[${index}])">${x.image?`<img src="${escapeAttr(x.image)}" alt="" onerror="this.style.display='none'">`:`<span class="map-picker-emoji">${escapeHTML(x.emoji||'🎯')}</span>`}<span><b>${escapeHTML(x.label)}</b><small>${escapeHTML(x.category|| (x.type==='agent'?'Agente':x.type==='threat'?'Ameaça':'Objeto'))}</small></span></button>`;}
function openCampaignMapAssetPicker(cid){
  if(!getCampaign(cid))return;v26PickerCampaignId=cid;v26PickerCategory='Ameaças';let modal=$('campaignMapAssetPickerModal');
  if(!modal){modal=document.createElement('div');modal.id='campaignMapAssetPickerModal';modal.className='modal hidden';modal.innerHTML=`<div class="modal-box wide-modal campaign-v26-picker-modal"><button type="button" class="close" onclick="closeModal('campaignMapAssetPickerModal')">×</button><span class="eyebrow">BIBLIOTECA DO MAPA</span><h2>Elementos para o cenário</h2><p class="muted">Ameaças padrão e Homebrew, animais, objetos, veículos, efeitos e marcadores. Clique num item para colocá-lo no tabuleiro.</p><input id="campaignMapAssetSearch" class="search" placeholder="🔎 Pesquisar elemento..." oninput="renderCampaignMapAssetPicker()"><div id="campaignMapAssetCategories" class="campaign-v26-asset-categories"></div><div id="campaignMapAssetList" class="campaign-map-picker-grid"></div></div>`;document.body.appendChild(modal);}
  renderCampaignMapAssetPicker();openModal('campaignMapAssetPickerModal');
}
function v26AssetItems(category,cid){
  if(category==='Ameaças')return allThreatEntries().map(e=>({type:'threat',sourceId:e.id,label:e.name,image:e.data.image||'',emoji:'👹',category:`Ameaças${e.homebrew?' • Homebrew':' • Biblioteca'}`,hpMax:e.data.hpMax,attack:e.data.attack,desc:e.data.desc}));
  if(category==='Agentes'){const c=getCampaign(cid);return c?c.members.map(m=>({type:'agent',sourceId:m.id,label:m.agent.name||'Agente',image:m.agent.avatar||'',emoji:'👤',category:'Agentes'})):[];}
  return (V26_MAP_CATEGORIES[category]||[]).map(([label,emoji])=>({type:'custom',label,emoji,category}));
}
function renderCampaignMapAssetPicker(){
  const cid=v26PickerCampaignId;if(!cid)return;const cats=['Ameaças','Agentes',...Object.keys(V26_MAP_CATEGORIES)];
  const catsRoot=$('campaignMapAssetCategories');if(catsRoot)catsRoot.innerHTML=cats.map(cat=>`<button type="button" class="${cat===v26PickerCategory?'selected':''}" onclick="v26PickerCategory='${cat}';renderCampaignMapAssetPicker()">${cat==='Ameaças'?'👹':cat==='Agentes'?'👤':cat==='Animais'?'🐾':cat==='Objetos'?'🧰':cat==='Veículos'?'⛵':cat==='Efeitos'?'✨':'📍'} ${cat}${cat==='Ameaças'?` (${allThreatEntries().length})`:''}</button>`).join('');
  const search=String($('campaignMapAssetSearch')?.value||'').trim().toLowerCase();v26PickerItems=v26AssetItems(v26PickerCategory,cid).filter(x=>`${x.label} ${x.category||''} ${x.desc||''}`.toLowerCase().includes(search));
  const root=$('campaignMapAssetList');if(!root)return;
  root.innerHTML=v26PickerItems.length?v26PickerItems.map((x,i)=>v26MapPickerCard(x,i,cid)).join(''):`<div class="empty-small">Nenhum elemento encontrado nesta categoria.</div>`;
}
function exportCampaignMap(cid){const c=getCampaign(cid);if(!c)return;const d=ensureCampaignMapData(c);v25DownloadJSON(`weird-rpg-mapa-${v25SafeFilename(d.name||c.name,'campanha')}.json`,{format:'WEIRD-RPG',type:'campaign-map',version:26,campaignName:c.name,mapData:d});showToast('✅ Backup do mapa exportado.');}
function importCampaignMap(cid){v26PendingTokenCampaignId=cid;const input=$('campaignMapImportFile');if(input){input.value='';input.click();}}
async function handleCampaignMapImport(event){const file=event.target.files?.[0],cid=v26PendingTokenCampaignId;if(!file||!cid)return;try{const parsed=JSON.parse(String(await file.text()).replace(/^\uFEFF/,''));const source=parsed.mapData||parsed.data?.mapData||parsed.data;if(!source||!Array.isArray(source.tokens))throw new Error('Este arquivo não contém um mapa WEIRD RPG válido.');const c=getCampaign(cid);if(!c)return;const old=c.mapData;c.mapData={...source,tokens:source.tokens.map(t=>({...t,id:uid()}))};ensureCampaignMapData(c);if(!saveCampaigns()){c.mapData=old;throw new Error('Sem espaço para guardar o mapa importado.');}renderCampaignMap(cid);requestAnimationFrame(()=>fitCampaignMap(cid));showToast('✅ Mapa importado.');}catch(err){showToast(`❌ Não foi possível importar o mapa: ${err.message||'arquivo inválido'}`);}finally{event.target.value='';v26PendingTokenCampaignId=null;}}
function installV26Controls(){
  const prefs=loadJSON(STORAGE.prefs,{});applyUiScale(Number(prefs.scale||1));
  [['threatImportFile',handleThreatImport],['fruitImportFile',handleFruitImport],['campaignMapBackgroundFile',handleCampaignMapBackground],['campaignMapTokenFile',handleCampaignMapTokenImage],['campaignMapImportFile',handleCampaignMapImport]].forEach(([id,fn])=>{const input=$(id);if(input&&input.dataset.v26Bound!=='1'){input.addEventListener('change',fn);input.dataset.v26Bound='1';}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installV26Controls,{once:true});else installV26Controls();
async function setupPWA(){
  if('serviceWorker'in navigator){try{const regs=await navigator.serviceWorker.getRegistrations();for(const reg of regs){try{await reg.update()}catch(_){}}const reg=await navigator.serviceWorker.register('./sw.js?v=26');try{await reg.update()}catch(_){}if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});}catch(_){}}
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;showInstallButton(true);});
  window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;showInstallButton(true);showToast('📱 WEIRD RPG instalado no aparelho!');});
}

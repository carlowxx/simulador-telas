# Como o Simulador de Telas funciona

Uma explicação direta, para responder quando alguém perguntar.

## O que é

Um programa de Windows que pega a foto da vistoria e coloca a tela simulada no lugar certo, no tamanho real, com sombra, canaleta e marcações. No fim, ele gera um PNG.

- **Roda 100% no computador.** As fotos não vão para internet nenhuma.
- **Não usa inteligência artificial nem gasta créditos.** Todas as contas (escala, perspectiva, sombra) são feitas pelo próprio programa.

## O que usamos para cada coisa

| Parte | O que é | Para que serve |
|---|---|---|
| **HTML, CSS e JavaScript** | As linguagens de páginas da web | O simulador inteiro (telas, botões, desenho da simulação) é como uma página web, num único arquivo (`app/index.html`). |
| **Canvas** | A "folha de desenho" do navegador | É onde a foto, a tela, a sombra e a canaleta são desenhadas pixel a pixel. |
| **Electron** | Uma "embalagem" que transforma uma página web num programa de Windows | Dá janela própria, ícone na área de trabalho e salvamento dos PNGs na pasta Imagens. É o mesmo tipo de tecnologia do WhatsApp Desktop, do Discord e do VS Code. |
| **Node.js / npm** | Ferramentas de programador | Usadas só para **montar** o programa. Quem só usa o simulador não precisa delas. |
| **electron-builder** | Ferramenta de empacotamento | Junta tudo num `.zip` pronto para instalar. |
| **Git e GitHub** | Histórico de versões e "nuvem" do código | Guarda todas as versões do código (dá para voltar a qualquer uma) e publica cada versão nova em **Releases**. |
| **GitHub Releases** | A página de downloads do projeto | De onde os PCs instalados baixam as atualizações. |
| **PowerShell** | O terminal do Windows | Roda os scripts que instalam o programa e criam os atalhos. |
| **Claude Code** | Assistente de programação com IA | Usado só para **desenvolver e corrigir** o programa. O programa em si não depende dele. |

## Onde fica instalado

- **Programa:** `C:\Users\<usuário>\AppData\Local\Programs\Simulador de Telas`, com atalho na Área de Trabalho e no Menu Iniciar.
- **Preferências** (modelo da tela, arte, base de 190 cm etc.): ficam guardadas no próprio PC, dentro do programa.
- **PNGs exportados:** `Imagens\Simulações`.

## Como instala num PC novo

Abra o **PowerShell** e cole:

```powershell
irm https://raw.githubusercontent.com/carlowxx/simulador-telas/main/scripts/instalar-online.ps1 | iex
```

O comando baixa a última versão do GitHub, instala e cria o atalho. Não precisa de Git, Node nem nada mais.

> Por que não existe um instalador `.exe` comum? O Windows 11 tem uma proteção (Controle Inteligente de Aplicativos) que bloqueia instaladores sem **assinatura digital**, um certificado pago. Instalando pelo PowerShell, essa barreira não aparece.

## Como funcionam as atualizações

1. Uma correção é feita no código e publicada no GitHub como versão nova (1.0.4, 1.0.5…).
2. Ao abrir, o programa consulta o GitHub. Se tiver versão nova, baixa só o arquivo da interface (`index.html`) e pergunta se quer atualizar.
3. Isso acontece em **todos os PCs instalados**, automaticamente.

Mudanças na "embalagem" (janela, downloads, o próprio atualizador) são raras. Quando acontecem, é preciso rodar o comando de instalação de novo.

## Como uma correção é feita (processo)

1. Abro o projeto (`Documentos\simulador-telas`) no Claude Code e descrevo a mudança.
2. A mudança é feita e testada.
3. Ela é salva no histórico (commit).
4. `npm run release` publica a versão nova no GitHub.
5. Os PCs instalados se atualizam sozinhos.

## Custos

Nenhum. GitHub (repositório público), Electron, Node e as demais ferramentas são gratuitos. O único custo opcional seria um certificado de assinatura digital, que não é necessário.

# Simulador de Telas

App de Windows para simular telas em fotos de vistoria e exportar PNG.

Com ele dá para:

- dar um **nome ao projeto** ao abrir o app (vira a pasta em `Imagens\Simulações`) e renomear cada imagem;
- marcar uma **medida** do croqui (parede, botoeira ou porta) para a tela entrar no tamanho real e em perspectiva;
- colocar uma ou mais **telas** em locais diferentes (arte e tamanho configuráveis na engrenagem ⚙), cada uma já com a canaleta até o teto;
- adicionar a **canaleta** (até o teto ou trajeto livre);
- montar a **infraestrutura**: rack de parede, eletroduto com curva ou condulete nas mudanças de direção, curva 90° avulsa e condulete;
- conferir medidas com a **régua** e marcar as linhas com encaixe automático nas bordas;
- fazer **marcações**: rack existente, objeto a remover, tela a remover ou texto livre;
- **baixar o PNG**, que vai para `Imagens\Simulações`.

As fotos abertas e a simulação são salvas sozinhas e voltam ao reabrir o app. Atalhos: Ctrl+Z desfaz, Ctrl+Y refaz, Ctrl+C / Ctrl+V copia e cola (inclusive entre fotos), R gira peças de infra, Esc volta para Selecionar.

O app roda 100% no computador. As fotos não são enviadas para lugar nenhum.

## Instalar

**No PC de desenvolvimento** (com este repositório):

```bash
npm install
npm run build
npm run instalar   # copia para %LOCALAPPDATA%\Programs e cria atalhos na Área de Trabalho e no Menu Iniciar
```

**Em outro PC** (sem precisar de Git nem Node): abra o PowerShell e cole

```powershell
irm https://raw.githubusercontent.com/carlowxx/simulador-telas/main/scripts/instalar-online.ps1 | iex
```

O comando baixa a última versão, instala em `%LOCALAPPDATA%\Programs` e cria os atalhos. Veja também [COMO-FUNCIONA.md](COMO-FUNCIONA.md).

Não existe instalador `.exe`, porque o Controle Inteligente de Aplicativos do Windows 11 bloqueia instaladores sem assinatura digital.

## Executável fixo ("launcher")

O Controle Inteligente de Aplicativos do Windows 11 bloqueia executáveis sem assinatura que ele não conhece, e cada build gera um `.exe` diferente. Por isso, todas as versões usam **o mesmo `.exe` já aceito**, guardado na Release [`launcher`](https://github.com/carlowxx/simulador-telas/releases/tag/launcher). O `npm run build` troca o `.exe` gerado por esse e refaz o `.zip` (`scripts/pin-exe.js`).

Se um dia o Electron for atualizado no `package.json`, é preciso gerar e publicar um launcher novo.

## Atualizações

Ao abrir, o app consulta a última Release. Se houver versão nova, ele baixa **só o `index.html`** (a interface, que não é executável) e pergunta se quer atualizar.

Mudanças em `main.js` (janela, downloads, atualização) não chegam por esse caminho. Nesse caso, rode `npm run build && npm run instalar` de novo.

## Desenvolvimento

```bash
npm install
npm start          # abre o app em modo desenvolvimento
npm run build      # gera o app em dist/win-unpacked e o .zip
npm run instalar   # instala/atualiza o app neste PC
npm run release    # sobe a versão, gera o .zip e publica a Release (index.html + zip) no GitHub
```

- O simulador inteiro fica em `app/index.html`.
- A janela, os downloads e a atualização automática ficam em `main.js`.

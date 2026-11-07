# Simulador de Telas

App de Windows para simular telas em fotos de vistoria e exportar PNG.

Com ele dá para:

- marcar uma **medida** do croqui (parede, botoeira ou porta) para a tela entrar no tamanho real e em perspectiva;
- colocar a **tela** (arte e tamanho configuráveis na engrenagem ⚙);
- adicionar a **canaleta**, até o teto ou com trajeto livre, em inox, alumínio, branca, preta ou marrom;
- fazer **marcações**: rack existente, objeto a remover, tela a remover ou texto livre;
- **baixar o PNG**, que vai para `Imagens\Simulações`.

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

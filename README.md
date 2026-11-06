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

Baixe o `Simulador-de-Telas-Setup-x.y.z.exe` na página de [Releases](https://github.com/carlowxx/simulador-telas/releases/latest) e execute.

O instalador não é assinado digitalmente. Se o Windows mostrar "O Windows protegeu o computador", clique em **Mais informações → Executar assim mesmo**.

Depois de instalado, o app **se atualiza sozinho** sempre que sair uma versão nova.

## Desenvolvimento

```bash
npm install
npm start          # abre o app em modo desenvolvimento
npm run dist       # gera o instalador em dist/ (sem publicar)
npm run release    # sobe a versão, gera o instalador e publica a Release no GitHub
```

- O simulador inteiro fica em `app/index.html`.
- A janela, os downloads e a atualização automática ficam em `main.js`.

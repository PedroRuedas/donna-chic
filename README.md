<div align="center">

# Donna Chic · Espaço de Beleza Feminino

Site institucional e portfólio do salão **Donna Chic**: cortes, tratamentos capilares, unhas e sobrancelha, com agendamento direto pelo WhatsApp.

**[donna-chic.netlify.app](https://donna-chic.netlify.app)**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)

</div>

---

## Sobre o projeto

Site de página única criado para um salão de beleza em atividade. Ele mostra o trabalho da casa e transforma visitas em agendamentos. A identidade visual segue a logo do salão: **preto e dourado**, assinatura em letra cursiva e o monograma "DC".

O projeto foi pensado primeiro para o **celular em pé**, já que a maior parte das clientes chega pelo Instagram e pelo WhatsApp. Por isso a navegação é toda vertical e as animações acontecem conforme a pessoa rola a página.

Não usa framework nem etapa de build. É HTML, CSS e JavaScript puros, sem dependências, e carrega rápido mesmo em conexão móvel.

## Funcionalidades

| Seção | O que faz |
| --- | --- |
| **Abertura** | Círculo dourado que se desenha, nome escrito como assinatura, brilhos em volta e partículas flutuando |
| **Sobre** | Texto do salão e contadores animados (anos de história, clientes atendidas) |
| **Portfólio** | Grade de fotos reais com entrada animada ao rolar e visualização ampliada com gesto de arrastar |
| **Bastidores** | Vídeos verticais que tocam sozinhos quando aparecem na tela, com borda dourada animada, barra de progresso e botão de som. No celular viram um carrossel no estilo stories |
| **Serviços** | Cartões com os serviços oferecidos |
| **Agendamento** | Formulário com os 13 serviços do salão, que abre o WhatsApp com a mensagem pronta |
| **Contato** | Endereço, horário de funcionamento e os dois números de WhatsApp |

**Outros detalhes**

- Barra de progresso de leitura no topo e botão flutuante do WhatsApp
- Menu do celular que abre em círculo, com os links entrando em sequência
- Efeito de profundidade (parallax) na abertura e na seção Sobre
- Respeita a opção **"reduzir movimento"** do aparelho, desligando as animações para quem precisa
- Navegação por teclado na galeria (setas e Esc) e textos alternativos nas imagens
- Fotos carregadas sob demanda (`loading="lazy"`) e vídeos que pausam fora da tela, para economizar dados

## Tecnologias

- **HTML5** semântico
- **CSS3**: variáveis, Grid, Flexbox, `clip-path`, `@property`, `scroll-snap` e animações por keyframes
- **JavaScript** puro: `IntersectionObserver` para as animações e os vídeos, `requestAnimationFrame` para o parallax e a API de toque para o arrastar da galeria
- **Google Fonts**: Allura (assinatura), Playfair Display (títulos) e Montserrat (texto)
- **Netlify** para hospedagem

## Estrutura

```
.
├── index.html            # estrutura e conteúdo da página
├── css/
│   └── style.css         # paleta, layout, animações e responsividade
├── js/
│   └── main.js           # portfólio, vídeos, galeria, agendamento e efeitos
├── images/
│   └── portfolio/        # fotos dos cortes (01.jpg a 11.jpg)
└── videos/               # vídeos verticais dos bastidores
```

## Como rodar localmente

Não precisa instalar nada. Basta abrir o `index.html` no navegador.

Para testar como um site de verdade (recomendado para os vídeos), suba um servidor simples na pasta do projeto:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Como atualizar o conteúdo

| Quero mudar... | Onde |
| --- | --- |
| Fotos do portfólio | Coloque a imagem em `images/portfolio/` e adicione na lista `PORTFOLIO` no começo de `js/main.js` |
| Vídeos | Coloque o `.mp4` em `videos/` e copie um bloco `<figure class="reel">` em `index.html` |
| Número do WhatsApp do agendamento | Constante `WHATSAPP` na linha 3 de `js/main.js` |
| Serviços do agendamento | Campo `<select id="servico">` em `index.html` |
| Endereço, horário e telefones | Seção `#contato` em `index.html` |
| Cores | Variáveis no início de `css/style.css` (`--gold`, `--black` etc.) |

## Publicação

O site está hospedado no **Netlify**. Para publicar uma nova versão, abra o projeto no painel do Netlify, vá em **Deploys** e arraste a pasta do projeto para a área de upload.

## Direitos

O código foi desenvolvido para o Donna Chic. As fotos, os vídeos, o nome e a identidade visual pertencem ao salão e às clientes retratadas. Eles não podem ser reutilizados sem autorização.

---

<div align="center">

Desenvolvido por [Pedro Ruedas](https://github.com/PedroRuedas)

</div>

# Meu IP - Minha Vida

`
/meu_projeto_ip
│
├── /public_html      # Diretório público acessível via web
│   ├── index.php     # Página principal
│   ├── style.css     # Arquivo CSS para estilos (opcional)
│   └── script.js     # Arquivo JavaScript para funcionalidades (opcional)
│
├── /src              # Código-fonte PHP
│   ├── IpService.php  # Classe ou funções relacionadas a IP
│   └── utils.php      # Funções utilitárias (se necessário)
│
├── /assets           # Recursos estáticos (imagens, etc.)
│   └── logo.png      # Exemplo de imagem
│
├── /config           # Configurações do projeto
│   └── config.php    # Arquivo de configuração (se necessário)
│
├── /logs             # Logs do aplicativo (se necessário)
│   └── app.log       # Arquivo de log (opcional)
│
├── /tests            # Testes (se necessário)
│   └── IpServiceTest.php  # Testes unitários (opcional)
│
└── .htaccess         # Arquivo de configuração do Apache (opcional)

## Descrição

Este projeto é uma aplicação web simples que exibe o IP do usuário que está acessando a página.

### Estrutura do Projeto

- **/public_html**: Contém os arquivos acessíveis via web.
  - **index.php**: Página principal que mostra o IP do usuário.
  - **style.css**: Arquivo CSS para estilos (opcional).
  - **script.js**: Arquivo JavaScript para funcionalidades (opcional).

- **/src**: Contém o código-fonte PHP.
  - **IpService.php**: Classe ou funções relacionadas a IP.
  - **utils.php**: Funções utilitárias (se necessário).

- **/assets**: Contém recursos estáticos como imagens.
  - **logo.png**: Exemplo de imagem.

- **/config**: Contém arquivos de configuração do projeto.
  - **config.php**: Arquivo de configuração (se necessário).

- **/logs**: Contém arquivos de log do aplicativo (se necessário).
  - **app.log**: Arquivo de log (opcional).

- **/tests**: Contém testes do projeto (se necessário).
  - **IpServiceTest.php**: Testes unitários (opcional).

- **.htaccess**: Arquivo de configuração do Apache (opcional).

### Como Executar

1. Instale um servidor web como Apache.
2. Coloque os arquivos do projeto no diretório raiz do servidor web.
3. Acesse a página principal via navegador para ver o IP do usuário.
### **Documentação das Entidades e Relacionamentos**

#### 1. **Tabela `usuarios`**
   - **Descrição:** Armazena informações sobre os usuários, que podem ser administradores ou associados.
   - **Campos:**
     - `id` (INT): Identificador único do usuário. Chave primária.
     - `nome` (VARCHAR): Nome completo do usuário.
     - `email` (VARCHAR): Endereço de e-mail do usuário. Deve ser único.
     - `senha_hash` (VARCHAR): Hash seguro da senha.
     - `tipo_usuario` (ENUM): Tipo de usuário (`administrador` ou `associado`).
     - `data_criacao` (TIMESTAMP): Data de criação do usuário.
   - **Relacionamentos:**
     - Relaciona-se com outras tabelas (como `entradas_saidas_financeiras`, `mensalidades` e `notificacoes`) através do `id`.

#### 2. **Tabela `entradas_saidas_financeiras`**
   - **Descrição:** Armazena os registros de entradas e saídas financeiras.
   - **Campos:**
     - `id` (INT): Identificador único do registro financeiro. Chave primária.
     - `tipo` (ENUM): Define se a movimentação é uma `entrada` ou `saida`.
     - `valor` (DECIMAL): Valor da movimentação.
     - `data_movimentacao` (DATE): Data em que a movimentação ocorreu.
     - `descricao` (TEXT): Descrição da movimentação.
     - `categoria` (VARCHAR): Categoria da movimentação.
     - `usuario_id` (INT): Referência para o `id` do usuário responsável pela movimentação. Chave estrangeira.
   - **Relacionamentos:**
     - Relaciona-se com `usuarios` através de `usuario_id`.

#### 3. **Tabela `mensalidades`**
   - **Descrição:** Controla os pagamentos de mensalidades dos associados.
   - **Campos:**
     - `id` (INT): Identificador único do registro de mensalidade. Chave primária.
     - `associado_id` (INT): Referência ao `id` do usuário associado. Chave estrangeira.
     - `valor` (DECIMAL): Valor da mensalidade.
     - `data_vencimento` (DATE): Data de vencimento da mensalidade.
     - `data_pagamento` (DATE): Data de pagamento da mensalidade (se pago).
     - `status` (ENUM): Status da mensalidade (`em_dia`, `pendente`, `inadimplente`).
   - **Relacionamentos:**
     - Relaciona-se com `usuarios` através de `associado_id`.

#### 4. **Tabela `notificacoes`**
   - **Descrição:** Armazena notificações enviadas aos usuários.
   - **Campos:**
     - `id` (INT): Identificador único da notificação. Chave primária.
     - `usuario_id` (INT): Referência ao `id` do usuário. Chave estrangeira.
     - `mensagem` (TEXT): Mensagem da notificação.
     - `tipo_notificacao` (ENUM): Tipo de notificação (`pagamento`, `comunicado`, `evento`).
     - `lida` (BOOLEAN): Indica se a notificação foi lida.
     - `data_envio` (TIMESTAMP): Data de envio da notificação.
   - **Relacionamentos:**
     - Relaciona-se com `usuarios` através de `usuario_id`.

#### 5. **Tabela `preferencias_notificacoes`**
   - **Descrição:** Define as preferências de notificações dos usuários.
   - **Campos:**
     - `id` (INT): Identificador único das preferências. Chave primária.
     - `usuario_id` (INT): Referência ao `id` do usuário. Chave estrangeira.
     - `receber_email` (BOOLEAN): Indica se o usuário deseja receber notificações por e-mail.
     - `receber_no_portal` (BOOLEAN): Indica se o usuário deseja receber notificações no portal.
   - **Relacionamentos:**
     - Relaciona-se com `usuarios` através de `usuario_id`.

---

### **Relacionamentos Entre Entidades**

1. **`usuarios` 1:N `entradas_saidas_financeiras`**
   - Um usuário pode registrar múltiplas movimentações financeiras.

2. **`usuarios` 1:N `mensalidades`**
   - Um usuário (associado) pode ter múltiplas mensalidades registradas.

3. **`usuarios` 1:N `notificacoes`**
   - Um usuário pode receber múltiplas notificações.

4. **`usuarios` 1:1 `preferencias_notificacoes`**
   - Um usuário pode ter uma única preferência de notificações configurada.

---

### CÓDIGO

```mysql

  -- Tabela usuarios
  CREATE TABLE usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      senha_hash VARCHAR(255) NOT NULL,
      tipo_usuario ENUM('administrador', 'associado') NOT NULL,
      data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabela entradas_saidas_financeiras
  CREATE TABLE entradas_saidas_financeiras (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tipo ENUM('entrada', 'saida') NOT NULL,
      valor DECIMAL(10, 2) NOT NULL,
      data_movimentacao DATE NOT NULL,
      descricao TEXT,
      categoria VARCHAR(100),
      usuario_id INT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );

  -- Tabela mensalidades
  CREATE TABLE mensalidades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      associado_id INT NOT NULL,
      valor DECIMAL(10, 2) NOT NULL,
      data_vencimento DATE NOT NULL,
      data_pagamento DATE,
      status ENUM('em_dia', 'pendente', 'inadimplente') DEFAULT 'pendente',
      FOREIGN KEY (associado_id) REFERENCES usuarios(id)
  );

  -- Tabela notificacoes
  CREATE TABLE notificacoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      mensagem TEXT NOT NULL,
      tipo_notificacao ENUM('pagamento', 'comunicado', 'evento') NOT NULL,
      lida BOOLEAN DEFAULT FALSE,
      data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );

  -- Tabela preferencias_notificacoes
  CREATE TABLE preferencias_notificacoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      receber_email BOOLEAN DEFAULT TRUE,
      receber_no_portal BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );


```
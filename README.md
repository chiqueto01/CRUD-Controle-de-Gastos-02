# Controle de Gastos — Full Stack (Express + SQLite + Frontend Vanilla)

Aplicação simples de **Controle de Gastos** com **Backend em Node/Express** e **banco SQLite** e **Frontend** estático servido pelo próprio Express.

> Deploy pronto para **Render** em um único serviço web.

## Funcionalidades
- Cadastrar, listar, editar e excluir gastos
- Filtro por mês (YYYY-MM)
- Resumo do mês com total e por categoria
- Persistência local em arquivo `data.sqlite` (SQLite)

## Stack
- **Backend:** Node.js 18+, Express, better-sqlite3
- **Banco:** SQLite (arquivo local)
- **Frontend:** HTML + CSS + JS (fetch API)

## Como rodar localmente
```bash
git clone <seu-fork-ou-repo>.git
cd controle-de-gastos/server
npm install
npm run seed   # opcional: popula alguns dados
npm run dev    # inicia em http://localhost:3000
```

## Endpoints
- `GET /api/expenses?month=YYYY-MM` — lista (opcionalmente filtra por mês)
- `POST /api/expenses` — cria gasto `{ title, amount:number, category, date:YYYY-MM-DD }`
- `PUT /api/expenses/:id` — atualiza gasto
- `DELETE /api/expenses/:id` — remove gasto
- `GET /api/summary?month=YYYY-MM` — total e por categoria do mês

## Deploy no Render
1. **Crie um repositório público** no GitHub e suba esta pasta `server/` como raiz do projeto (ou todo o projeto e configure o *Root Directory* como `server`).
2. No Render, `New +` → **Web Service** → Conecte seu GitHub.
3. Configure:
   - **Root Directory:** `server` (se o repo tiver esta estrutura). Se você subir só a pasta `server` como raiz, deixe em branco.
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node 18+
4. Deploy. A URL ficará no formato: `https://controledegastos-SeuNomeSobrenome.onrender.com`
   - Dica: dê o nome do serviço como `controledegastos-SeuNomeSobrenome` para bater com o formato solicitado.
5. Teste os endpoints e a interface Web (a mesma URL).

## Estrutura
```
server/
  public/
    index.html
    style.css
    app.js
  scripts/
    seed.js
  package.json
  server.js
```

## Autor
**Matheus Chiqueto**

## Observações
- O SQLite usa um arquivo `data.sqlite` no diretório do servidor. No Render (filesystem efêmero), os dados **não** persistem em *redeploys*. Para persistência real, considere migrar para Postgres gerenciado no Render.
- Este projeto foi pensado para ser simples e cumprir o requisito **Frontend + Backend** com deploy único.
- Licença: MIT.
# CRUD-Controle-de-Gastos-02

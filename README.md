# Controle de Gastos

Aplicação Web Full Stack para controle de despesas, desenvolvida em **Node.js + Express + SQLite + Frontend Vanilla (HTML, CSS, JS)**.

## Autor  
**Matheus Chiqueto**

## Como executar localmente

```bash
git clone https://github.com/SeuUsuario/controle-de-gastos.git
cd controle-de-gastos/server
npm install
npm run seed   # opcional - adiciona dados iniciais
npm start      # inicia o servidor em http://localhost:3000
```

## Deploy no Render

1. Crie um repositório público no GitHub com este código.  
2. No Render, crie um novo **Web Service** conectado ao repositório.  
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node 18+

**Deploy:** A URL ficará no formato:  
`https://controledegastos-MatheusChiqueto.onrender.com`  
**Dica:** Dê o nome do serviço como `controledegastos-MatheusChiqueto` para bater com o formato solicitado.

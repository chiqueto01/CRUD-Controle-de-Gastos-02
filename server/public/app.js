const apiBase = '';
document.getElementById('api-base').textContent = location.origin;

const tbody = document.querySelector('#table tbody');
const monthInput = document.getElementById('month');
const form = document.getElementById('expense-form');

// Load current month in filter
const now = new Date();
monthInput.value = now.toISOString().slice(0,7);

async function fetchExpenses(month){
  const url = month ? `/api/expenses?month=${month}` : '/api/expenses';
  const res = await fetch(url);
  return res.json();
}

async function fetchSummary(month){
  if(!month){ document.getElementById('summary').textContent='Selecione um mês'; return; }
  const res = await fetch(`/api/summary?month=${month}`);
  if(!res.ok){ document.getElementById('summary').textContent='—'; return; }
  const data = await res.json();
  const list = (data.byCategory||[]).map(x=>`<li>${x.category}: R$ ${x.total.toFixed(2)}</li>`).join('');
  document.getElementById('summary').innerHTML = `
    <p>Total: <strong>R$ ${data.total.toFixed(2)}</strong></p>
    <ul>${list}</ul>`;
}

function renderRows(items){
  tbody.innerHTML = '';
  for(const e of items){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${e.title}</td>
      <td><span class="badge">${e.category}</span></td>
      <td>R$ ${Number(e.amount).toFixed(2)}</td>
      <td class="actions">
        <button data-id="${e.id}" data-act="edit">Editar</button>
        <button data-id="${e.id}" data-act="del">Excluir</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

async function load(){
  const m = monthInput.value;
  const items = await fetchExpenses(m);
  renderRows(items);
  fetchSummary(m);
}

document.getElementById('filter-btn').onclick = load;
document.getElementById('clear-btn').onclick = ()=>{ monthInput.value=''; load(); };

tbody.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.act;
  if(act==='del'){
    if(confirm('Excluir gasto?')){ await fetch(`/api/expenses/${id}`, { method:'DELETE' }); load(); }
  } else if(act==='edit'){
    const tr = btn.closest('tr');
    const [dateEl, titleEl, catEl, amountEl] = tr.children;
    const title = prompt('Título', titleEl.textContent);
    if(title==null) return;
    const amount = Number(prompt('Valor', amountEl.textContent.replace('R$','').trim()));
    const category = prompt('Categoria', catEl.textContent);
    const date = prompt('Data (YYYY-MM-DD)', dateEl.textContent);
    await fetch(`/api/expenses/${id}`, {{ method:'PUT', headers:{{'Content-Type':'application/json'}}, body: JSON.stringify({{title, amount, category, date}}) }});
    load();
  }
});

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const amount = Number(document.getElementById('amount').value);
  const category = document.getElementById('category').value.trim();
  const date = document.getElementById('date').value;
  if(!title || !category || !date || isNaN(amount)) return;
  await fetch('/api/expenses', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ title, amount, category, date })
  });
  form.reset();
  load();
});

load();

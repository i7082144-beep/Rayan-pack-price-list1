function renderApp(){
  const DATA = PRODUCT_DATA;
  DATA.forEach(function(d, i){ d.id = i; });

  // ---- admin: load any locally-saved edits and apply them on top of the base data ----
  let adminEdits = {};
  if(window.IS_ADMIN){
    try{ adminEdits = JSON.parse(localStorage.getItem('rayan_admin_edits_v1') || '{}'); }catch(e){ adminEdits = {}; }
    Object.keys(adminEdits).forEach(function(id){
      if(DATA[id]) Object.assign(DATA[id], adminEdits[id]);
    });
  }

  // ---- icon system: pick an SVG placeholder based on keywords in product name ----
  const ICONS = {
    cup: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 14h32l-4 38a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4L16 14Z"/><path d="M16 14 14 8h36l-2 6"/><path d="M20 26h24"/></svg>`,
    plate: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="32" rx="24" ry="14"/><ellipse cx="32" cy="30" rx="14" ry="7"/></svg>`,
    bowl: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 30h44a22 14 0 0 1-44 0Z"/><path d="M22 30V18a10 6 0 0 1 20 0v12"/></svg>`,
    cutlery: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8v20a4 4 0 0 0 8 0V8M22 28v28M40 8c-4 0-6 4-6 10s2 10 6 10M40 8v40"/></svg>`,
    roll: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="18" width="44" height="28" rx="4"/><circle cx="32" cy="32" r="8"/></svg>`,
    bag: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 20h36l-3 34a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4L14 20Z"/><path d="M22 20v-4a10 10 0 0 1 20 0v4"/></svg>`,
    tissue: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="20" width="44" height="28" rx="3"/><path d="M22 20c2-6 6-6 10-2s8 4 10-2"/></svg>`,
    tape: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="9"/></svg>`,
    glove: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 30V12a4 4 0 0 1 8 0v14M28 26V10a4 4 0 0 1 8 0v16M36 26V12a4 4 0 0 1 8 0v18M44 26v-6a4 4 0 0 1 8 0v20c0 10-8 18-18 18h-2c-8 0-14-6-14-14v-6"/></svg>`,
    box: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20 32 8l24 12v24L32 56 8 44V20Z"/><path d="M8 20l24 12 24-12M32 32v24"/></svg>`,
    container: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22h40v28a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V22Z"/><path d="M10 16h44l-2 6H12l-2-6Z"/></svg>`,
    stick: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 50 50 14"/><circle cx="50" cy="14" r="4"/><circle cx="14" cy="50" r="4"/></svg>`,
  };

  function pickIcon(name, sheet){
    const s = name + ' ' + sheet;
    if(/كوب|اكواب/.test(s)) return ICONS.cup;
    if(/شوربه|شوربة/.test(s)) return ICONS.bowl;
    if(/معلق|شوك|سكين|ملعقة/.test(s)) return ICONS.cutlery;
    if(/استرتش|رول|فويل|فوم|مفرش/.test(s)) return ICONS.roll;
    if(/شنط|اكياس|كيس/.test(s)) return ICONS.bag;
    if(/مناديل|ورق زبده/.test(s)) return ICONS.tissue;
    if(/لصق|تيب/.test(s)) return ICONS.tape;
    if(/جوانتي/.test(s)) return ICONS.glove;
    if(/شيش|استيلر|خله اسنان|خلة اسنان/.test(s)) return ICONS.stick;
    if(/طبق|علبه|علبة|عبوة|عبوه|بيتزا|جاتوه/.test(s)) return ICONS.plate;
    return ICONS.container;
  }

  // stable color per sheet, derived from a small industrial palette
  const PALETTE = ['#12454A','#C97A3D','#3F7D5C','#5B655F','#8A4A3D','#2E5F63','#B08239','#3D6B5C'];
  function colorFor(sheet){
    let h = 0;
    for(let i=0;i<sheet.length;i++) h = (h*31 + sheet.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }

  // ---- build sheet/category index preserving original order ----
  const sheetOrder = [];
  const sheetMap = {}; // sheet -> { cats: [catName...], items: {cat: [items]} }
  DATA.forEach(function(d){
    if(!sheetMap[d.s]){ sheetMap[d.s] = {cats:[], items:{}}; sheetOrder.push(d.s); }
    const sm = sheetMap[d.s];
    if(!sm.items[d.c]){ sm.items[d.c] = []; sm.cats.push(d.c); }
    sm.items[d.c].push(d);
  });

  const total = DATA.length;
  const availableCount = DATA.filter(function(d){return d.a;}).length;
  document.getElementById('statsBar').innerHTML =
    '<div class="stat-pill"><b>'+total+'</b> منتج</div>' +
    '<div class="stat-pill"><b>'+availableCount+'</b> متاح حالياً</div>' +
    '<div class="stat-pill"><b>'+sheetOrder.length+'</b> قسم</div>';

  // ---- sidebar ----
  const catList = document.getElementById('catList');
  sheetOrder.forEach(function(sheet, idx){
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (idx===0 ? ' active':'');
    btn.dataset.sheet = sheet;
    const count = DATA.filter(function(d){return d.s===sheet;}).length;
    btn.innerHTML = '<span>'+sheet+'</span><span class="n">'+count+'</span>';
    btn.addEventListener('click', function(){
      document.querySelectorAll('.cat-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');
      const el = document.getElementById('sec-'+idx);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
    catList.appendChild(btn);
  });

  // ---- filter chips ----
  let currentFilter = 'all';
  document.getElementById('filterChips').addEventListener('click', function(e){
    const btn = e.target.closest('.filter-chip');
    if(!btn) return;
    document.querySelectorAll('.filter-chip').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    currentFilter = btn.dataset.f;
    render();
  });

  function cardHTML(d, sheet){
    const color = colorFor(sheet);
    const icon = pickIcon(d.n, sheet);
    const badge = d.a
      ? '<span class="badge ok">'+ (d.st||'متاح') +'</span>'
      : '<span class="badge no">'+ (d.st||'غير متاح') +'</span>';
    const priceHTML = d.p
      ? (/^[\d.,]+$/.test(d.p) ? d.p + ' <small>ج.م</small>' : d.p)
      : '<small>السعر عند الطلب</small>';
    const editBtn = window.IS_ADMIN
      ? '<button class="edit-btn" data-id="'+d.id+'" title="تعديل"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"/></svg></button>'
      : '';
    return '<div class="card '+(d.a ? '' : 'unavailable')+'" data-card-id="'+d.id+'">'
      + '<div class="card-img" style="color:'+color+'">'+icon+'<div class="noimg">صورة قريباً</div>'+editBtn+'</div>'
      + '<div class="card-body">'
        + '<div class="card-name">'+escapeHTML(d.n)+'</div>'
        + '<div class="card-meta">'+(d.q ? 'التعبئة: '+escapeHTML(d.q) : '&nbsp;')+'</div>'
        + '<div class="card-foot"><span class="price">'+priceHTML+'</span>'+badge+'</div>'
      + '</div>'
    + '</div>';
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function passesFilter(d){
    if(currentFilter==='available') return d.a;
    return true;
  }

  const resultsEl = document.getElementById('results');

  function render(){
    const q = document.getElementById('searchInput').value.trim();
    resultsEl.innerHTML = '';

    if(q.length > 0){
      const ql = q.toLowerCase();
      const matches = DATA.filter(function(d){
        return d.n.toLowerCase().indexOf(ql) !== -1 && passesFilter(d);
      });
      const sec = document.createElement('div');
      sec.className = 'section';
      sec.innerHTML = '<div class="section-head"><h2>نتائج البحث عن "'+escapeHTML(q)+'"</h2><span class="count">'+matches.length+' منتج</span></div>';
      const grid = document.createElement('div');
      grid.className = 'grid';
      if(matches.length===0){
        resultsEl.appendChild(sec);
        resultsEl.innerHTML += '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><div>مفيش نتائج مطابقة، جرب كلمة تانية</div></div>';
        return;
      }
      matches.forEach(function(d){ grid.insertAdjacentHTML('beforeend', cardHTML(d, d.s)); });
      sec.appendChild(grid);
      resultsEl.appendChild(sec);
      return;
    }

    sheetOrder.forEach(function(sheet, idx){
      const sm = sheetMap[sheet];
      const allItemsInSheet = DATA.filter(function(d){return d.s===sheet && passesFilter(d);});
      if(allItemsInSheet.length===0) return;

      const sec = document.createElement('div');
      sec.className = 'section';
      sec.id = 'sec-'+idx;
      sec.innerHTML = '<div class="section-head"><h2>'+escapeHTML(sheet)+'</h2><span class="count">'+allItemsInSheet.length+' منتج</span></div>';

      const multiCat = sm.cats.length > 1;
      sm.cats.forEach(function(cat){
        const items = sm.items[cat].filter(passesFilter);
        if(items.length===0) return;
        if(multiCat){
          const h = document.createElement('div');
          h.className = 'subgroup-title';
          h.textContent = cat;
          sec.appendChild(h);
        }
        const grid = document.createElement('div');
        grid.className = 'grid';
        items.forEach(function(d){ grid.insertAdjacentHTML('beforeend', cardHTML(d, sheet)); });
        sec.appendChild(grid);
      });
      resultsEl.appendChild(sec);
    });
  }

  let searchTimer;
  document.getElementById('searchInput').addEventListener('input', function(){
    clearTimeout(searchTimer);
    searchTimer = setTimeout(render, 120);
  });

  // ---- admin: edit modal + local persistence + export ----
  if(window.IS_ADMIN){
    const STATUS_OPTIONS = ['متاح', 'غير متاح', 'بالطلب فقط', 'قريباً', 'تواصل معنا'];

    function saveEdit(id, patch){
      adminEdits[id] = Object.assign({}, adminEdits[id], patch);
      localStorage.setItem('rayan_admin_edits_v1', JSON.stringify(adminEdits));
      Object.assign(DATA[id], patch);
      updatePendingBadge();
    }

    function updatePendingBadge(){
      const n = Object.keys(adminEdits).length;
      const el = document.getElementById('pendingBadge');
      if(el) el.textContent = n > 0 ? n + ' تعديل لسه محتاج تنزيل' : 'مفيش تعديلات محلية';
    }

    function openModal(id){
      const d = DATA[id];
      if(!d) return;
      const overlay = document.createElement('div');
      overlay.className = 'edit-overlay';
      overlay.innerHTML =
        '<div class="edit-modal">'
          + '<h3>'+escapeHTML(d.n)+'</h3>'
          + '<label>السعر</label>'
          + '<input type="text" id="mPrice" value="'+escapeHTML(d.p||'')+'" placeholder="مثال: 450 أو تواصل معنا">'
          + '<label>التعبئة / العدد</label>'
          + '<input type="text" id="mCount" value="'+escapeHTML(d.q||'')+'" placeholder="مثال: رول 2">'
          + '<label>الحالة</label>'
          + '<select id="mStatus">'
            + STATUS_OPTIONS.map(function(s){return '<option value="'+s+'"'+(d.st===s?' selected':'')+'>'+s+'</option>';}).join('')
          + '</select>'
          + '<div class="edit-actions">'
            + '<button class="btn-cancel" id="mCancel">إلغاء</button>'
            + '<button class="btn-save" id="mSave">حفظ</button>'
          + '</div>'
        + '</div>';
      document.body.appendChild(overlay);
      document.getElementById('mCancel').addEventListener('click', function(){ overlay.remove(); });
      overlay.addEventListener('click', function(e){ if(e.target === overlay) overlay.remove(); });
      document.getElementById('mSave').addEventListener('click', function(){
        const p = document.getElementById('mPrice').value.trim();
        const q = document.getElementById('mCount').value.trim();
        const st = document.getElementById('mStatus').value;
        const a = (st === 'غير متاح' || st === 'قريباً') ? false : true;
        saveEdit(id, {p:p, q:q, st:st, a:a});
        overlay.remove();
        render();
      });
    }

    resultsEl.addEventListener('click', function(e){
      const btn = e.target.closest('.edit-btn');
      if(!btn) return;
      openModal(Number(btn.dataset.id));
    });

    window.__exportData = function(){
      const clean = DATA.map(function(d){
        return {s:d.s, c:d.c, n:d.n, q:d.q, p:d.p, a:d.a, st:d.st};
      });
      const text = 'const PRODUCT_DATA = ' + JSON.stringify(clean) + ';\n';
      const blob = new Blob([text], {type:'text/javascript'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'data.js';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    };

    window.__resetEdits = function(){
      if(!confirm('هيتشال كل التعديلات المحلية اللي لسه معملتلهاش تنزيل. متأكد؟')) return;
      localStorage.removeItem('rayan_admin_edits_v1');
      location.reload();
    };

    updatePendingBadge();
  }

  render();
}

if(!window.__deferRender){ renderApp(); }
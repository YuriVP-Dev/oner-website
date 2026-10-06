/* ONER — dados dos produtos + páginas de venda. Para editar um produto, mude só aqui. */
const LUVA = ["6", "7", "8", "9", "10", "11"];
const PRODUTOS = [
  { id: "vorn", nome: "Luva ONER VORN", tag: "A Presença Dominante", preco: 469, img: "img/luva-vorn.png", tamanhos: LUVA,
    desc: "A VORN é a luva elite da ONER: palma Contact Grip de 3.5mm para aderência em qualquer clima e o sistema Hidden-Strap Tunnel, que esconde o fechamento e deixa a luva em silêncio na mão.",
    specs: [["Palma", "Contact Grip 3.5mm"], ["Fechamento", "Hidden-Strap Tunnel"], ["Linha", "Elite"]] },
  { id: "aegis", nome: "Luva ONER AEGIS", tag: "A Segurança Impenetrável", preco: 379, img: "img/luva-aegis.png", tamanhos: LUVA,
    desc: "Blackout da cabeça aos dedos. A AEGIS é feita para quem quer proteção e presença: dorso estruturado, punho firme e a assinatura \"Nada passa\" na palma.",
    specs: [["Cor", "Blackout"], ["Dorso", "Estruturado"], ["Assinatura", "Nada passa"]] },
  { id: "arken", nome: "Luva ONER ARKEN", tag: "O Toque Absoluto", preco: 299, img: "img/luva-arken.png", tamanhos: LUVA,
    desc: "Branca, leve e sensível. A ARKEN prioriza o toque: para quem sente a bola antes de ela chegar.",
    specs: [["Cor", "Branca"], ["Foco", "Toque e sensibilidade"]] },
  { id: "tech-case", nome: "Tech-Case EVA", tag: "Proteção semi-rígida", preco: 159, img: "img/tech-case.png",
    desc: "Estojo em EVA semi-rígido com zíper neon. Protege suas luvas e acessórios no treino, no jogo e na viagem.",
    specs: [["Material", "EVA semi-rígido"], ["Fechamento", "Zíper neon"], ["Uso", "Luvas e acessórios"]] },
  { id: "camisa", nome: "Camisa Termica ONER", tag: "Camisa térmica tech", preco: 89, img: "img/camisa-.png", tamanhos: ["P", "M", "G", "GG"],
    desc: "Camisa térmica de manga longa, ajuste justo ao corpo, para treinar e jogar com conforto.",
    specs: [["Modelo", "Manga longa"], ["Ajuste", "Justo ao corpo"], ["Cor", "Preta"]] },
  { id: "manguito", nome: "Manguito ONER Strata", tag: "Segurança em todo encaixe", preco: 39, img: "img/Manguito-Oner-Strata.jfif",
    desc: "O Strata é o acessório da ONER para reforçar a segurança em todo encaixe durante o jogo.",
    specs: [["Linha", "Strata"], ["Marca", "ONER"]] },
];

const $ = (s, r = document) => r.querySelector(s);
const fmt = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const store = {
  get: () => { try { return localStorage.getItem("oner_cart"); } catch (e) { return null; } },
  set: v => { try { localStorage.setItem("oner_cart", v); } catch (e) {} },
};
function badge() { const b = $(".bag span"), n = store.get(); if (b && n !== null) b.textContent = n; }
function toast(msg) { const t = $("#toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2200); }
badge();

/* Página inicial: transforma cada "Ver detalhes" em link para a página do produto */
if (!$("#pdp")) {
  document.querySelectorAll(".card").forEach((card, i) => {
    const nome = ($("h3", card) || {}).textContent;
    const p = PRODUTOS.find(x => x.nome.toLowerCase() === (nome || "").trim().toLowerCase()) || PRODUTOS[i];
    const btn = $(".btn--line", card);
    if (!p || !btn) return;
    const a = document.createElement("a");
    a.className = btn.className; a.textContent = btn.textContent; a.href = "produto.html?id=" + p.id; a.style.textAlign = "center";
    btn.replaceWith(a);
  });
}

/* Página de venda */
if ($("#pdp")) {
  const p = PRODUTOS.find(x => x.id === new URLSearchParams(location.search).get("id"));
  if (!p) {
    $("#pdp").innerHTML = '<a href="index.html#produtos" class="link back"><i>‹</i> Voltar aos produtos</a><h1>Produto não encontrado</h1>';
  } else {
    document.title = p.nome + " | ONER";
    let tam = "", qtd = 1;
    $("#pdp").innerHTML = `
      <a href="index.html#produtos" class="link back"><i>‹</i> Voltar aos produtos</a>
      <div class="pdp__grid">
        <div class="pdp__media"><img src="${p.img}" alt="${p.nome}"><span class="tag">${p.tag}</span></div>
        <div class="pdp__info">
          <p class="eyebrow">${p.tag}</p>
          <h1>${p.nome}</h1>
          <p class="pdp__price">${fmt(p.preco)}</p>
          <p class="pdp__desc">${p.desc}</p>
          ${p.tamanhos ? `<div class="opt"><h4>Tamanho</h4><div class="sizes" role="radiogroup">${p.tamanhos.map(t => `<button type="button" role="radio" aria-checked="false">${t}</button>`).join("")}</div></div>` : ""}
          <div class="opt"><h4>Quantidade</h4><div class="qty"><button type="button" id="menos" aria-label="Diminuir">−</button><span id="qtd">1</span><button type="button" id="mais" aria-label="Aumentar">+</button></div></div>
          <div class="pdp__buy">
            <button class="btn" id="comprar" type="button">Comprar agora</button>
            <button class="btn btn--line" id="add" type="button">Adicionar ao carrinho</button>
          </div>
          <dl class="specs">${p.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
        </div>
      </div>`;

    $(".sizes")?.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      document.querySelectorAll(".sizes button").forEach(x => x.setAttribute("aria-checked", x === b));
      tam = b.textContent;
    });
    const setQtd = n => { qtd = Math.max(1, Math.min(9, n)); $("#qtd").textContent = qtd; };
    $("#menos").onclick = () => setQtd(qtd - 1);
    $("#mais").onclick = () => setQtd(qtd + 1);
    const ok = () => { if (p.tamanhos && !tam) { toast("Escolha o tamanho"); return false; } return true; };
    $("#add").onclick = () => { if (!ok()) return; store.set((+store.get() || 0) + qtd); badge(); toast("Adicionado ao carrinho"); };

    $("#related").innerHTML = `<h2>Você também pode gostar</h2><div class="grid">${PRODUTOS.filter(x => x !== p).slice(0, 3).map(x => `
      <article class="card">
        <a class="card__img" href="produto.html?id=${x.id}"><img src="${x.img}" alt="${x.nome}"><span class="tag">${x.tag}</span></a>
        <div class="card__body"><h3>${x.nome}</h3><p class="price">${fmt(x.preco)}</p><a class="btn btn--line" href="produto.html?id=${x.id}" style="text-align:center">Ver detalhes</a></div>
      </article>`).join("")}</div>`;
  }
}

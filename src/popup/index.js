const getCleanUrl = (urlString) => {
  const url = new URL(urlString);
  const acc = url.searchParams.get("acc");
  return acc ? `${url.origin}${url.pathname}?acc=${acc}` : url.origin + url.pathname;
};

const statusEl = document.getElementById("status");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs.length) return;

  const tabUrl = tabs[0].url;
  const cleanUrl = getCleanUrl(tabUrl);

  const keys = [0, 1, 2].map(i => `draft-${cleanUrl}-${i}`);

  chrome.storage.local.get(keys, (result) => {
    const values = Object.values(result).filter(Boolean);

    if (values.length) {
      navigator.clipboard.writeText(values[0])
        .then(() => {
          statusEl.textContent = "📝 Rascunho encontrado e copiado!";
        })
        .catch(() => {
          statusEl.textContent = "🔒 Não foi possível copiar o rascunho.";
        });
    } else {
      statusEl.textContent = "Nenhum rascunho encontrado para esta página.";
    }
  });
});

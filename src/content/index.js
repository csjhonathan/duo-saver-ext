(() => {
  const getCleanUrl = () => {
    const url = new URL(window.location.href);
    const acc = url.searchParams.get("acc");
    return `${url.origin}${url.pathname}?acc=${acc}`;
  };

  const getElements = ({ kind, att, value }) => {
    return document.querySelectorAll(`${kind}[${att}="${value}"]`);
  };

  const textareas = getElements({
    kind: 'textarea',
    att: 'name',
    value: 'body'
  });

  if (textareas.length > 0) {
    textareas.forEach((textarea, index) => {
      if (!textarea.dataset.listenerAdded) {
        textarea.dataset.listenerAdded = "true";

        // Chave única para o storage
        const storageKey = `draft-${getCleanUrl()}-${index}`;

        // Carregar o valor salvo de chrome.storage
        chrome.storage.local.get([storageKey], (result) => {
          if (result[storageKey]) {
            // Coloca o valor no clipboard
            navigator.clipboard.writeText(result[storageKey])
              .then(() => {
                console.log('Valor copiado para o clipboard.');
              })
              .catch((err) => {
                console.error('Erro ao copiar para o clipboard:', err);
              });
          }
        });

        let debounceTimeout;

        // Adiciona o evento de input com debounce
        textarea.addEventListener('input', (e) => {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            // Salva o valor no chrome.storage
            chrome.storage.local.set({ [storageKey]: e.target.value }, () => {
              console.log('Rascunho salvo com chrome.storage.local');
            });
          }, 200);
        });

        console.log('Listener adicionado ao textarea.');
      }
    });
  } else {
    console.log('Nenhum textarea encontrado.');
  }
})();

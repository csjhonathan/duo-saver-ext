(() => {
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
        const storageKey = `draft-${window.location.href}-${index}`;

        // Carregar o valor salvo de chrome.storage
        chrome.storage.local.get([storageKey], (result) => {
          if (result[storageKey]) {
            textarea.value = result[storageKey];
            console.log('Valor recuperado do chrome.storage');
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
          }, 500);
        });

        console.log('Listener adicionado ao textarea.');
      }
    });
  } else {
    console.log('Nenhum textarea encontrado.');
  }
})();

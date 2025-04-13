(() => {

  const showDraftNotification = (text) => {
    const existing = document.getElementById("duo-saver-toast");
    if (existing) existing.remove(); // evita duplicatas
  
    const toast = document.createElement("div");
    toast.id = "duo-saver-toast";
    toast.textContent = text;
    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#00796b",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      zIndex: 9999,
      opacity: "0",
      transition: "opacity 0.3s ease-in-out",
    });
  
    document.body.appendChild(toast);
  
    // anima o fade-in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });
  
    // remove após 4 segundos
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.addEventListener("transitionend", () => toast.remove());
    }, 4000);
  };

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
                if (!sessionStorage.getItem("duo-saver-toast-shown")) {
                  showDraftNotification("📝 Encontramos um rascunho do seu último formulário, e colocamos na sua área de transferência!!");
                  sessionStorage.setItem("duo-saver-toast-shown", "1");
                }
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

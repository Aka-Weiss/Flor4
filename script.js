const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const dialog = document.querySelector('.detail-dialog');

function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a, button')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.header')) closeMenu();
});
matchMedia('(max-width: 760px)').addEventListener('change', closeMenu);

const cards = [...document.querySelectorAll('.bouquet-card')];
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    cards.forEach((card) => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    });
    const count = cards.filter((card) => !card.hidden).length;
    document.querySelector('.collection-count').textContent = count === 1
      ? '1 buquê para se encantar'
      : `${count} buquês para se encantar`;
  });
});

// A referência é estática. Os detalhes são demonstrativos, sem simular pedidos enviados.
const details = {
  classic: ['Delicadeza', 'Há sentimentos que ficam ainda mais bonitos em tons suaves. Rosas de jardim em rosa-claro, lisianthus brancos e eucalipto se encontram em um buquê de presença delicada.\n\nEnvolto em papel marfim e finalizado com fita rosada. Uma sugestão para aniversários, agradecimentos ou um simples “pensei em você”.'],
  minimal: ['Leveza', 'Um respiro de beleza no meio do dia. Lisianthus brancos, cravinas rosadas e pequenas margaridas formam uma composição leve, com espaço para cada flor aparecer.\n\nPapel marfim e laço de linho completam o gesto. Para surpreender sem precisar de uma ocasião especial.'],
  premium: ['Encanto', 'Para quando o carinho pede um gesto maior. Rosas em tons de rosa e pêssego, lisianthus brancos e eucalipto criam uma composição generosa, cheia de textura.\n\nA embalagem em camadas e a fita champanhe completam um buquê pensado para marcar encontros e celebrações.'],
  delivery: ['Carinho a caminho', 'Receber flores também faz parte do presente. Por isso, os detalhes da entrega precisam estar claros antes de escolher.\n\nEsta loja está em demonstração. Região atendida, valor do frete, prazos e opção de retirada ainda serão definidos. Nenhuma entrega pode ser agendada por esta página.'],
  contacts: ['Vamos conversar?', 'Quer escolher um presente ou imaginar um buquê para uma ocasião especial? Nosso atendimento será o lugar para essa conversa.\n\nO WhatsApp, o e-mail e os horários da loja ainda serão informados. Por enquanto, explore a coleção e descubra o estilo que combina com o seu gesto.'],
  care: ['Um carinho que continua', 'Ao receber flores de corte, coloque-as em um vaso limpo com água fresca. Retire as folhas que ficariam submersas e renove a água diariamente.\n\nMantenha o arranjo longe do sol direto e de fontes de calor. Siga as orientações específicas da florista para as espécies do seu buquê.'],
  privacy: ['Sobre a sua privacidade', 'Esta vitrine demonstrativa não possui cadastro, formulário, checkout ou ferramentas de análise integradas ao código. Os filtros funcionam no navegador e não salvam sua seleção.\n\nA política definitiva, com os dados da empresa e de seus fornecedores, deverá ser publicada antes da ativação de atendimento e vendas.'],
  terms: ['Sobre esta vitrine', 'As imagens foram criadas com inteligência artificial. Os produtos, preços e a narrativa da marca foram desenvolvidos para apresentar esta proposta de loja.\n\nNão há compra, reserva ou pagamento nesta página. Composição, disponibilidade, frete e condições comerciais deverão ser confirmados antes do lançamento.'],
};

document.querySelectorAll('[data-info], [data-bouquet]').forEach((button) => {
  button.addEventListener('click', () => {
    const [title, description] = details[button.dataset.info || button.dataset.bouquet];
    const card = button.closest('.bouquet-card');
    const photo = document.querySelector('.dialog-photo');
    const price = document.querySelector('.dialog-price');
    document.querySelector('#dialog-title').textContent = title;
    document.querySelector('#dialog-description').textContent = description;
    photo.hidden = !card;
    price.hidden = !card;
    if (card) {
      photo.src = card.querySelector('img').getAttribute('src');
      photo.alt = card.querySelector('img').alt;
      price.textContent = card.querySelector('.product-price').textContent;
    }
    dialog.showModal();
    dialog.scrollTop = 0;
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.dialog-return').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    dialog.close();
  }
});

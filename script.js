let currentLang = 'en';
let data = {};

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      renderChecklist();
    });

  document.getElementById('lang-en').addEventListener('click', () => {
    currentLang = 'en';
    document.getElementById('lang-en').classList.add('active');
    document.getElementById('lang-kr').classList.remove('active');
    renderChecklist();
  });

  document.getElementById('lang-kr').addEventListener('click', () => {
    currentLang = 'kr';
    document.getElementById('lang-kr').classList.add('active');
    document.getElementById('lang-en').classList.remove('active');
    renderChecklist();
  });
});

function renderChecklist() {
  const main = document.getElementById('checklist');
  main.innerHTML = '';

  // Render top-level categories
  for (const [key, category] of Object.entries(data)) {
    // Baby category might have subcategories
    if (key === 'baby') {
      renderBabyCategory(main, category);
    } else {
      renderCategory(main, category);
    }
  }
}

function renderCategory(container, categoryData) {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category';

  const title = document.createElement('h2');
  title.textContent = currentLang === 'en' ? categoryData.title_en : categoryData.title_kr;
  categoryDiv.appendChild(title);

  if (categoryData.items) {
    categoryDiv.appendChild(createItemList(categoryData.items));
  }

  container.appendChild(categoryDiv);
}

function renderBabyCategory(container, babyData) {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category';

  const title = document.createElement('h2');
  title.textContent = currentLang === 'en' ? babyData.title_en : babyData.title_kr;
  categoryDiv.appendChild(title);

  // Baby has subcategories
  for (const [subKey, subCat] of Object.entries(babyData.subcategories)) {
    const subDiv = document.createElement('div');
    subDiv.className = 'subcategory';

    const subTitle = document.createElement('h3');
    subTitle.textContent = currentLang === 'en' ? subCat.title_en : subCat.title_kr;
    subDiv.appendChild(subTitle);

    subDiv.appendChild(createItemList(subCat.items));
    categoryDiv.appendChild(subDiv);
  }

  container.appendChild(categoryDiv);
}

function createItemList(items) {
  const ul = document.createElement('ul');
  ul.className = 'items';

  items.forEach(item => {
    const li = document.createElement('li');
    if (item.subitems) {
      // If has subitems
      const itemTitle = document.createElement('strong');
      itemTitle.innerHTML = currentLang === 'en' ? item.en : item.kr;
      li.appendChild(itemTitle);

      const subUl = document.createElement('ul');
      subUl.className = 'subitems';
      item.subitems.forEach(sub => {
        const subLi = document.createElement('li');
        subLi.textContent = currentLang === 'en' ? sub.en : sub.kr;
        subUl.appendChild(subLi);
      });
      li.appendChild(subUl);
    } else {
      // Normal item
      li.textContent = currentLang === 'en' ? item.en : item.kr;
    }
    ul.appendChild(li);
  });

  return ul;
}

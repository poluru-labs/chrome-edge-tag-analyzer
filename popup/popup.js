document.addEventListener('DOMContentLoaded', function () {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const currentUrl = document.getElementById('currentUrl');
  const output = document.getElementById('output');
  const kicker = document.getElementById('resultKicker');
  const meta = document.getElementById('resultMeta');

  analyzeBtn.addEventListener('click', analyzePage);
  clearBtn.addEventListener('click', resetUi);
  showTabUrl();

  function showTabUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.url) {
        currentUrl.textContent = tabs[0].url;
        currentUrl.title = tabs[0].url;
      }
    });
  }

  function analyzePage() {
    analyzeBtn.classList.add('is-busy');
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing…';

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0]) {
        finishWithError('No active tab found.');
        return;
      }

      if (tabs[0].url) {
        currentUrl.textContent = tabs[0].url;
        currentUrl.title = tabs[0].url;
      }

      if (!isInjectableUrl(tabs[0].url)) {
        finishWithError('Chrome and Edge internal pages cannot be analyzed.');
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: countTags,
        },
        function (results) {
          resetButton();

          if (chrome.runtime.lastError) {
            showMessage(chrome.runtime.lastError.message, 'error');
            return;
          }

          const data = results && results[0] && results[0].result;
          if (!data || !data.tags || !data.tags.length) {
            showMessage('No HTML tags found on this page.', 'error');
            return;
          }

          showTable(data);
        },
      );
    });
  }

  function finishWithError(message) {
    resetButton();
    showMessage(message, 'error');
  }

  function resetButton() {
    analyzeBtn.classList.remove('is-busy');
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Page';
  }

  function resetUi() {
    kicker.textContent = 'Tags';
    meta.textContent = '';
    output.className = 'result-body is-empty';
    output.replaceChildren();
    const title = document.createElement('p');
    title.className = 'empty-title';
    title.textContent = 'Nothing analyzed';
    const copy = document.createElement('p');
    copy.className = 'empty-copy';
    copy.textContent = 'Click Analyze Page to count every HTML tag on this tab.';
    output.append(title, copy);
    resetButton();
    showTabUrl();
  }

  function showMessage(message, type) {
    kicker.textContent = type === 'error' ? 'Could not analyze' : 'Tags';
    meta.textContent = '';
    output.className = 'result-body';
    output.replaceChildren();
    const p = document.createElement('p');
    p.className = 'message' + (type === 'error' ? ' error' : '');
    p.textContent = message;
    output.append(p);
  }

  function showTable(data) {
    kicker.textContent = data.uniqueTags === 1 ? '1 tag type' : data.uniqueTags + ' tag types';
    meta.textContent = data.totalElements + ' elements';
    output.className = 'result-body';
    output.replaceChildren();

    const max = data.tags[0][1] || 1;
    const table = document.createElement('table');
    table.className = 'grid';

    const colgroup = document.createElement('colgroup');
    const colTag = document.createElement('col');
    colTag.className = 'col-tag';
    const colCount = document.createElement('col');
    colCount.className = 'col-count';
    colgroup.append(colTag, colCount);

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const thTag = document.createElement('th');
    thTag.scope = 'col';
    thTag.textContent = 'Tag';
    const thCount = document.createElement('th');
    thCount.scope = 'col';
    thCount.textContent = 'Count';
    headRow.append(thTag, thCount);
    thead.append(headRow);

    const tbody = document.createElement('tbody');
    data.tags.forEach(function (entry) {
      const name = entry[0];
      const count = entry[1];
      const tr = document.createElement('tr');

      const tdTag = document.createElement('td');
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = '<' + name + '>';
      tdTag.append(tag);

      const tdCount = document.createElement('td');
      const wrap = document.createElement('div');
      wrap.className = 'count-cell';
      const bar = document.createElement('div');
      bar.className = 'bar';
      const fill = document.createElement('span');
      fill.style.width = Math.max(6, Math.round((count / max) * 100)) + '%';
      bar.append(fill);
      const num = document.createElement('span');
      num.className = 'count';
      num.textContent = String(count);
      wrap.append(bar, num);
      tdCount.append(wrap);

      tr.append(tdTag, tdCount);
      tbody.append(tr);
    });

    table.append(colgroup, thead, tbody);
    output.append(table);
  }

  function isInjectableUrl(url) {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'chrome:' || parsed.protocol === 'chrome-extension:') return false;
      if (parsed.protocol === 'edge:' || parsed.protocol === 'about:') return false;
      if (parsed.hostname === 'chrome.google.com' && parsed.pathname.startsWith('/webstore')) return false;
      if (parsed.hostname === 'chromewebstore.google.com') return false;
      if (parsed.hostname === 'microsoftedge.microsoft.com') return false;
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'file:';
    } catch {
      return false;
    }
  }
});

function countTags() {
  const tagCounts = {};
  const allElements = document.getElementsByTagName('*');

  for (let i = 0; i < allElements.length; i++) {
    const tagName = allElements[i].tagName.toLowerCase();
    tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
  }

  const sortedTags = Object.entries(tagCounts).sort(function (a, b) {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  return {
    tags: sortedTags,
    totalElements: allElements.length,
    uniqueTags: Object.keys(tagCounts).length,
  };
}

document.addEventListener('DOMContentLoaded', function () {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const currentUrlDiv = document.getElementById('currentUrl');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const resultsDiv = document.getElementById('results');
  const noResultsDiv = document.getElementById('noResults');
  const tagsListDiv = document.getElementById('tagsList');
  const totalCountSpan = document.getElementById('totalCount');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]?.url) {
      currentUrlDiv.textContent = tabs[0].url;
      currentUrlDiv.title = tabs[0].url;
    }
  });

  analyzeBtn.addEventListener('click', analyzePage);
  clearBtn.addEventListener('click', clearResults);
  showNoResults();

  function analyzePage() {
    showLoading();
    hideError();
    analyzeBtn.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs[0]) {
        finishWithError('No active tab found.');
        return;
      }

      if (tabs[0].url) {
        currentUrlDiv.textContent = tabs[0].url;
        currentUrlDiv.title = tabs[0].url;
      }

      if (!isInjectableUrl(tabs[0].url)) {
        finishWithError('Cannot analyze this page due to browser restrictions.');
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: countTags,
        },
        function (results) {
          analyzeBtn.disabled = false;
          hideLoading();

          if (chrome.runtime.lastError) {
            showError(chrome.runtime.lastError.message);
            return;
          }

          if (results && results[0] && results[0].result) {
            displayResults(results[0].result);
          } else {
            showError('Failed to analyze the page. Please try again.');
          }
        },
      );
    });
  }

  function finishWithError(message) {
    analyzeBtn.disabled = false;
    hideLoading();
    showError(message);
  }

  function displayResults(data) {
    if (!data || !data.tags || data.tags.length === 0) {
      showNoResults();
      return;
    }

    totalCountSpan.textContent =
      'Total: ' + data.totalElements + ' elements (' + data.uniqueTags + ' unique tags)';

    tagsListDiv.replaceChildren();

    data.tags.forEach(function (entry) {
      const tagName = entry[0];
      const count = entry[1];
      const tagItem = document.createElement('div');
      tagItem.className = 'tag-item';

      const tagNameSpan = document.createElement('span');
      tagNameSpan.className = 'tag-name';
      tagNameSpan.textContent = '<' + tagName + '>';

      const tagCountSpan = document.createElement('span');
      tagCountSpan.className = 'tag-count';
      tagCountSpan.textContent = String(count);

      tagItem.append(tagNameSpan, tagCountSpan);
      tagsListDiv.append(tagItem);
    });

    hideNoResults();
    hideError();
    resultsDiv.hidden = false;
  }

  function showLoading() {
    loadingDiv.hidden = false;
    resultsDiv.hidden = true;
    noResultsDiv.hidden = true;
  }

  function hideLoading() {
    loadingDiv.hidden = true;
  }

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.hidden = false;
    resultsDiv.hidden = true;
    noResultsDiv.hidden = true;
  }

  function hideError() {
    errorDiv.hidden = true;
  }

  function showNoResults() {
    noResultsDiv.hidden = false;
    resultsDiv.hidden = true;
  }

  function hideNoResults() {
    noResultsDiv.hidden = true;
  }

  function clearResults() {
    hideError();
    hideLoading();
    resultsDiv.hidden = true;
    noResultsDiv.hidden = false;
    tagsListDiv.replaceChildren();
    totalCountSpan.textContent = 'Total: 0';
    analyzeBtn.disabled = false;
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

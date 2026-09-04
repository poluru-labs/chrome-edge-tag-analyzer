// Popup JavaScript for HTML Tag Counter Extension

document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const currentUrlDiv = document.getElementById('currentUrl');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const resultsDiv = document.getElementById('results');
  const noResultsDiv = document.getElementById('noResults');
  const tagsListDiv = document.getElementById('tagsList');
  const totalCountSpan = document.getElementById('totalCount');

  // Get current tab URL
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      currentUrlDiv.textContent = tabs[0].url;
    }
  });

  // Analyze button click handler
  analyzeBtn.addEventListener('click', function() {
    analyzePage();
  });

  // Clear button click handler
  clearBtn.addEventListener('click', function() {
    clearResults();
  });

  function analyzePage() {
    showLoading();
    hideError();
    
    // Get active tab and inject content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) {
        showError('No active tab found.');
        hideLoading();
        return;
      }

      const tabId = tabs[0].id;
      
      // Check if we can access this tab
      if (tabs[0].url.startsWith('chrome://') || 
          tabs[0].url.startsWith('chrome-extension://') ||
          tabs[0].url.startsWith('edge://') ||
          tabs[0].url.startsWith('about:')) {
        showError('Cannot analyze this page due to browser restrictions.');
        hideLoading();
        return;
      }

      // Execute script to count tags
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: countTags
      }, function(results) {
        hideLoading();
        
        if (chrome.runtime.lastError) {
          showError('Error: ' + chrome.runtime.lastError.message);
          return;
        }
        
        if (results && results[0] && results[0].result) {
          displayResults(results[0].result);
        } else {
          showError('Failed to analyze the page. Please try again.');
        }
      });
    });
  }

  function countTags() {
    // This function runs in the context of the web page
    const tagCounts = {};
    const allElements = document.getElementsByTagName('*');
    
    // Count each tag type
    for (let element of allElements) {
      const tagName = element.tagName.toLowerCase();
      tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
    }
    
    // Convert to array and sort by count (descending) then by name
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => {
        if (b[1] !== a[1]) {
          return b[1] - a[1]; // Sort by count descending
        }
        return a[0].localeCompare(b[0]); // Then by name ascending
      });
    
    return {
      tags: sortedTags,
      totalElements: allElements.length,
      uniqueTags: Object.keys(tagCounts).length
    };
  }

  function displayResults(data) {
    if (!data || !data.tags || data.tags.length === 0) {
      showNoResults();
      return;
    }

    // Update total count
    totalCountSpan.textContent = `Total: ${data.totalElements} elements (${data.uniqueTags} unique tags)`;
    
    // Clear previous results
    tagsListDiv.innerHTML = '';
    
    // Create tag items
    data.tags.forEach(([tagName, count]) => {
      const tagItem = document.createElement('div');
      tagItem.className = 'tag-item';
      
      const tagNameSpan = document.createElement('span');
      tagNameSpan.className = 'tag-name';
      tagNameSpan.textContent = `<${tagName}>`;
      
      const tagCountSpan = document.createElement('span');
      tagCountSpan.className = 'tag-count';
      tagCountSpan.textContent = count;
      
      tagItem.appendChild(tagNameSpan);
      tagItem.appendChild(tagCountSpan);
      tagsListDiv.appendChild(tagItem);
    });
    
    // Show results
    hideNoResults();
    hideError();
    resultsDiv.style.display = 'block';
  }

  function showLoading() {
    loadingDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    noResultsDiv.style.display = 'none';
  }

  function hideLoading() {
    loadingDiv.style.display = 'none';
  }

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    noResultsDiv.style.display = 'none';
  }

  function hideError() {
    errorDiv.style.display = 'none';
  }

  function showNoResults() {
    noResultsDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
  }

  function hideNoResults() {
    noResultsDiv.style.display = 'none';
  }

  function clearResults() {
    hideError();
    hideLoading();
    resultsDiv.style.display = 'none';
    noResultsDiv.style.display = 'block';
    tagsListDiv.innerHTML = '';
    totalCountSpan.textContent = 'Total: 0';
  }

  // Show initial state
  showNoResults();
});
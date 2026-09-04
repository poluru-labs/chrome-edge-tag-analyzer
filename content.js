// Content script for HTML Tag Counter Extension
// This script runs on every webpage to provide tag counting functionality

(function() {
  'use strict';
  
  // Function to count all HTML tags on the page
  function countAllTags() {
    const tagCounts = {};
    const allElements = document.getElementsByTagName('*');
    
    // Count each tag type
    for (let i = 0; i < allElements.length; i++) {
      const tagName = allElements[i].tagName.toLowerCase();
      tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
    }
    
    return {
      counts: tagCounts,
      totalElements: allElements.length,
      uniqueTags: Object.keys(tagCounts).length
    };
  }
  
  // Function to get detailed tag information
  function getTagDetails() {
    const result = countAllTags();
    
    // Convert to sorted array
    const sortedTags = Object.entries(result.counts)
      .sort((a, b) => {
        // Sort by count (descending), then by name (ascending)
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }
        return a[0].localeCompare(b[0]);
      });
    
    return {
      tags: sortedTags,
      totalElements: result.totalElements,
      uniqueTags: result.uniqueTags,
      url: window.location.href,
      title: document.title
    };
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'countTags') {
      try {
        const tagData = getTagDetails();
        sendResponse({
          success: true,
          data: tagData
        });
      } catch (error) {
        sendResponse({
          success: false,
          error: error.message
        });
      }
    }
    return true; // Keep message channel open for asynchronous response
  });
  
  // Optional: Log when content script loads (for debugging)
  console.log('HTML Tag Counter extension loaded on:', window.location.href);
  
})();
type NotFoundSuggestionProperties = {
  urls: string[];
};

/**
 * Server component that suggests the closest matching URL to the 404 page
 * Uses inline vanilla JS with Levenshtein distance to find the most similar URL
 */
export default function NotFoundSuggestion({urls}: NotFoundSuggestionProperties) {
  const urlsJson = JSON.stringify(urls);

  const inlineScript = `
(function() {
  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var matrix = [];
    for (var i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (var j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function closest(target, candidates) {
    if (!candidates || candidates.length === 0) return null;
    var minDistance = Infinity;
    var closestCandidate = candidates[0];
    for (var i = 0; i < candidates.length; i++) {
      var distance = levenshtein(target, candidates[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestCandidate = candidates[i];
      }
    }
    return closestCandidate;
  }

  var el = null;
  try {
    el = document.getElementById('not-found-suggestion');
    if (!el) return;
    var urls = JSON.parse(el.getAttribute('data-urls') || '[]');
    if (urls.length === 0) {
      var fallbackLink = document.createElement('a');
      fallbackLink.href = '/';
      fallbackLink.textContent = '/';
      el.textContent = '';
      el.appendChild(fallbackLink);
      return;
    }
    var baseUrl = window.location.protocol + '//' + window.location.host;
    var fullUrls = urls.map(function(path) { return baseUrl + path; });
    var closestUrl = closest(window.location.href, fullUrls);
    if (!closestUrl) {
      var fallbackLink = document.createElement('a');
      fallbackLink.href = '/';
      fallbackLink.textContent = '/';
      el.textContent = '';
      el.appendChild(fallbackLink);
      return;
    }
    var url = new URL(closestUrl);
    var link = document.createElement('a');
    link.href = url.pathname;
    link.textContent = url.pathname;
    el.textContent = '';
    el.appendChild(link);
  } catch (e) {
    console.error('Error finding closest URL:', e);
    if (el) {
      var fallbackLink = document.createElement('a');
      fallbackLink.href = '/';
      fallbackLink.textContent = '/';
      el.textContent = '';
      el.appendChild(fallbackLink);
    }
  }
})();
`;

  return (
    <>
      <span id="not-found-suggestion" data-urls={urlsJson}>...</span>
      <script dangerouslySetInnerHTML={{__html: inlineScript}} />
    </>
  );
}

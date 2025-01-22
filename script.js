document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://api.mediastack.com/v1/news';
    const API_KEY = '8c5ad42344a9347d894f89d97f356528';
    const LIMIT = 7;  // Limit to 7 articles

    async function fetchTrumpNews() {
        const response = await fetch(`${API_URL}?access_key=${API_KEY}&languages=en&limit=${LIMIT}&keywords=Trump`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const newsList = document.getElementById('news-list');
            data.data.forEach(article => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${article.url}" target="_blank">
                                        <strong>${article.title}</strong><br>
                                        <em>${article.source.name}</em><br>
                                        ${article.description}
                                      </a>`;
                newsList.appendChild(listItem);
            });
        } else {
            console.log('No articles found for Trump');
        }
    }

    fetchTrumpNews();
});

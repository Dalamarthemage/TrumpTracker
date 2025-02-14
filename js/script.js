document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://api.mediastack.com/v1/news';
    const API_KEY = process.env.API_KEY || '8c5ad42344a9347d894f89d97f356528';  // Use environment variable or fallback for local testing
    const LIMIT = 7;  // Limit to 7 articles
    const HOURS_LIMIT = 24; // Limit to 24 hours

    // Function to get articles from the last 24 hours
    function isArticleFromLast24Hours(publishedAt) {
        const currentTime = new Date();
        const articleTime = new Date(publishedAt);
        const timeDifference = currentTime - articleTime; // Time difference in milliseconds
        const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert to hours
        return hoursDifference <= HOURS_LIMIT;
    }

    async function fetchTrumpNews() {
        try {
            const response = await fetch(`${API_URL}?access_key=${API_KEY}&languages=en&limit=${LIMIT}&keywords=Trump`);

            if (!response.ok) {
                throw new Error(`Failed to fetch news: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("API Response:", data); // Log API response

            const newsList = document.getElementById('news-list');
            newsList.innerHTML = '';  // Clear previous content

            if (data.data && data.data.length > 0) {
                const fragment = document.createDocumentFragment();

                data.data
                    .filter(article => {
                        const isRecent = isArticleFromLast24Hours(article.published_at);
                        console.log(`Article published at ${article.published_at} is recent: ${isRecent}`);
                        return isRecent;
                    })  // Filter articles from the last 24 hours
                    .forEach(article => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<a href="${article.url}" target="_blank">
                                                <strong>${article.title}</strong><br>
                                                <em>${article.source.name}</em><br>
                                                ${article.description}
                                              </a>`;
                        fragment.appendChild(listItem);
                    });

                // If no articles are from the last 24 hours
                if (fragment.children.length === 0) {
                    const noArticlesMessage = document.createElement('li');
                    noArticlesMessage.textContent = "No articles found in the last 24 hours.";
                    fragment.appendChild(noArticlesMessage);
                }

                newsList.appendChild(fragment);
            } else {
                console.log('No articles found for Trump');
                const noArticlesMessage = document.createElement('li');
                noArticlesMessage.textContent = "No articles available at this time.";
                newsList.appendChild(noArticlesMessage);
            }
        } catch (error) {
            console.error("Error fetching the news:", error);
            const newsList = document.getElementById('news-list');
            const errorMessage = document.createElement('li');
            errorMessage.textContent = "Sorry, there was an issue fetching the news.";
            newsList.appendChild(errorMessage);
        }
    }

    fetchTrumpNews();
});

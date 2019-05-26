const url = 'https://www.reddit.com/r/funny.json';
let cachedData;

getData(url);

function getData(url) {
    
    return fetch(url)
        .then(response => response.json())
        .then(resp => {
            cachedData = mapResponse(resp)
            return cachedData
        })
        .then(cachedData => createTable(cachedData))
};

function mapResponse(resp) {
    const posts = resp.data.children.map(mapPost)
    return {
        posts: posts,
        count: posts.length
    };
};

function mapPost(post) {
    return {
        title: post.data.title,
        upvotes: post.data.ups,
        score: post.data.score,
        num_comments: post.data.num_comments,
        created: post.data.created,
        ratio: (post.data.ups / post.data.num_comments)
    };
};
// Funkcje sortujące //

function getBestComment() {
    const sortedByRatio = sortData('ratio');
    const bestComment = sortedByRatio.posts[0];
    return bestComment;
};

function filterByDate() {
    const filteredByDate = mapChosen(cachedData.posts.filter(filterByDateCondition));
    return filteredByDate;
};

function filterByDateCondition(element) {
    const dateNow = Date.now() / 1000;
    if ((dateNow - (element.created - 9 * 60 * 60)) < (60 * 60 * 24));
    return element;
};

function sortData(sortIndicator) {
    const sortedData = cachedData.posts.sort(function (a, b) {
        return b[sortIndicator] - a[sortIndicator] || b['created'] - a['created']
    });
    return mapChosen(sortedData);
};

function mapChosen(input) {
    const posts = input.map(mapChosenPost);
    return {
        posts: posts,
        count: posts.length
    };
};

function mapChosenPost(post) {
    return {
        title: post.title,
        upvotes: post.upvotes,
        score: post.score,
        num_comments: post.num_comments,
        created: post.created
    };
};
// Tworzenie tabeli z danymi
// Przypisanie funkcji do przycisków

document.getElementById('sortByUpVotes').addEventListener('click', () => {
    const sortedData = sortData('upvotes');
    createTable(sortedData);
});

document.getElementById('sortByNumComments').addEventListener('click', () => {
    const sortedData = sortData('num_comments');
    createTable(sortedData);
});

document.getElementById('sortByCreated').addEventListener('click', () => {
    const sortedData = sortData('created');
    createTable(sortedData);
});

document.getElementById('filterByDate').addEventListener('click', () => {
    const filteredByDate = filterByDate();
    createTable(filteredByDate);
});

document.getElementById('filterByRatio').addEventListener('click', () => {
    const bestComment = getBestComment();
    clearTable();
    document.getElementById('bestPost')
        .innerHTML = '<h4>tytuł postu z najwyższym stosunkiem głosów dodatnich do liczby komentarzy: </h4> <p> ' + bestComment.title + '</p>'
});
//Renderowanie tabeli
function clearTable() {
    document.getElementById('table').innerHTML = ""
    document.getElementById('bestPost').innerHTML = ""
};

function createTable(data) {
    clearTable();
    const list = document.getElementById('table');
    const table = document.createElement('table');
    table.setAttribute('id', 'lista');
    table.appendChild(createHeader());
    table.appendChild(createBody(data));
    list.appendChild(table);
};

function createHeader() {
    const thead = document.createElement('thead');
    thead.appendChild(createCell('Tytuł'));
    thead.appendChild(createCell('głosy +'));
    thead.appendChild(createCell('punktacja'));
    thead.appendChild(createCell('liczba komentarzy'));
    thead.appendChild(createCell('data utworzenia'));
    return thead;
};

function createBody(data) {
    const tbody = document.createElement('tbody');
    data.posts.map(function (post) {
        const row = document.createElement('row');
        row.appendChild(createCell(post.title));
        row.appendChild(createCell(post.upvotes));
        row.appendChild(createCell(post.score));
        row.appendChild(createCell(post.num_comments));
        row.appendChild(createCell(timeFromTimestamp(post.created)));
        tbody.appendChild(row);
    });
    return tbody;
}

function createCell(cellData) {
    const cell = document.createElement('td');
    cell.innerHTML = cellData;
    return cell;
};

function timeFromTimestamp(timestamp) {
    const date = new Date(timestamp * 1000 - (9 * 60 * 60 * 1000)); //przesunięcie stref czasowych (7[california do utc]+2[pl do utc]) //
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const formattedTime = hours + ':' + minutes.substr(-2) + ' ' + day + '.' + (month + 1) + '.' + year;
    return formattedTime;
};
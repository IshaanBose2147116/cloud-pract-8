const tbody = document.getElementById("table-body");
const PAGE_URL = window.location.href.split("?")[0];
console.log(`${ PAGE_URL }get-books`);

fetch(`${ PAGE_URL }get-books`, {
        method: 'GET',
        headers: { "Content-Type" : "application/json" }
}).then(response => {
    if (response.status === 200) {
        response.json().then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                tbody.innerHTML += `
                    <tr>
                        <td><img src="${ data[i].cover_link }" width="100" height="160" alt="Book Cover"/></td>
                        <td>${ data[i].title }</td>
                        <td>${ data[i].author }</td>
                        <td>${ data[i].stock }</td>
                    </tr>
                `;
            }
        });
    }
});
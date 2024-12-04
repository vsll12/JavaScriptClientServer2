function addElements(element) {
    let li = document.createElement("li");
    li.innerHTML = `
    <form class="editForm">
      <input name="product_name" data-enabled="true" disabled type="text" value="${element.product_name}">
      <input name="product_description" data-enabled="true" disabled type="text" value="${element.product_description}">
      <input name="product_price" data-enabled="true" disabled type="text" value="${element.product_price}">
      <input name="store_name" data-enabled="true" disabled type="text" value="${element.store_name}">
      <input name="store_address" data-enabled="true" disabled type="text" value="${element.store_address}">
      <button data-enabled="true" style="display:none;" class="saveProduct">SAVE</button>
      </form>
      <button class="editProduct">EDIT</button>
      <button class="deleteProduct">DELETE</button>
      `;

    li.querySelector('.deleteProduct').addEventListener('click', () => deleteProduct(element.id, li))
    li.querySelector('.editProduct').addEventListener('click', () => editProduct(li))
    li.querySelector('.editForm').addEventListener('submit', (ev) => saveProduct(ev, li, element.id))

    document.getElementById("list").appendChild(li);
}


function deleteProduct(id, li) {
    fetch(`http://localhost:5000/delete-admin/${id}`, {
        method: "DELETE"
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.case) {
                li.remove()
                console.log(data.text)
            } else {
                console.log(data.text)
            }
        })
        .catch((err) => console.log(err))
}

function editProduct(li) {
    let inputs = li.querySelectorAll('input')
    if (Array.from(inputs).some((item) => item.dataset.enabled === 'true')) {
        inputs.forEach((item) => {
            item.disabled = false
            item.dataset.enabled = 'false'
        })
        li.querySelector('form .saveProduct').style.display = 'inline-block'
    } else {
        inputs.forEach((item) => {
            item.disabled = true
            item.dataset.enabled = 'true'
        })
        li.querySelector('form .saveProduct').style.display = 'none'
    }

    console.log(inputs)
}

document.getElementById('addForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    let formData = Object.fromEntries([...new FormData(ev.target)]);
    console.log(formData);

    fetch('http://localhost:5000/add-admin', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.case) {
                formData.id = data.id; 
                addElements(formData); 
            } else {
                console.log(data.text);
            }
        })
        .catch((err) => console.log(err));
});



function saveProduct(ev, li, id) {
    ev.preventDefault()
    let formData = Object.fromEntries([...new FormData(ev.target)])
    console.log(formData)

    fetch(`http://localhost:5000/change-admin/${id}`, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.case) {
                let inputs = li.querySelectorAll('form input');
                inputs.forEach(input => {
                input.value = formData[input.name];
                input.dataset.enabled = true;
                input.disabled = 'true';
            });
            } else {
                console.log(data.text)
            }
        })
        .catch((err) => console.log(err))
}


function showList(arr) {
    document.getElementById("list").innerHTML = "";
    arr.forEach((element) => {
        addElements(element)
    });
}
function getGoods() {
    fetch('http://localhost:5000/goods', {
        method: "GET"
    })
        .then((res) => res.json())
        .then((data) => {
            showList(data)
        })
        .catch((err) => console.log(err))
}

getGoods()


document.getElementById('addForm').addEventListener('submit', (ev) => {
    ev.preventDefault()
    let formData = Object.fromEntries([...new FormData(ev.target)])
    console.log(formData)

    fetch('http://localhost:5000/add-admin', {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.case) {
         
                formData.id = data.id
                addElements(formData)
            } else {
                console.log(data.text)
            }
        })
        .catch((err) => console.log(err))
});


function saveProduct(ev, li, id) {
    ev.preventDefault();

    const formData = Object.fromEntries([...new FormData(ev.target)]);
    console.log("Form data to save:", formData);

    fetch(`http://localhost:5000/change-admin/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.case) {
                console.log(data.text);

    
                const inputs = li.querySelectorAll("input");
                inputs.forEach(input => {
                    input.value = formData[input.name];
                    input.disabled = true; 
                    input.dataset.enabled = "true"; 
                });

                li.querySelector(".saveProduct").style.display = "none"; 
            } else {
                console.error(data.text);
            }
        })
        .catch(error => {
            console.error("Error updating product:", error);
        });
};


function searchGoodsByStart(searchValue) {
    fetch(`http://localhost:5000/search-goods/${searchValue}`, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            showList(data); 
        })
        .catch((error) => {
            console.error("Error searching goods:", error);
        });
}


document.getElementById("searchGoodsForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const searchValue = document.getElementById("searchInput").value.trim();
    searchGoodsByStart(searchValue);
});




function searchGoodsByInclude(searchValue) {
    fetch(`http://localhost:5000/search-admin/${searchValue}`, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            showList(data); 
        })
        .catch((error) => {
            console.error("Error searching goods:", error);
        });
}


document.getElementById("searchAdminForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const searchValue = document.getElementById("adminSearchInput").value.trim();
    searchGoodsByInclude(searchValue);
});



function searchGoodsByPrice(minPrice, maxPrice) {
    fetch(`http://localhost:5000/search-price?minPrice=${minPrice}&maxPrice=${maxPrice}`, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            showList(data); 
        })
        .catch((error) => {
            console.error("Error searching goods by price:", error);
        });
}


document.getElementById("searchPriceForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const minPrice = document.getElementById("minPriceInput").value.trim();
    const maxPrice = document.getElementById("maxPriceInput").value.trim();
    searchGoodsByPrice(minPrice, maxPrice);
});


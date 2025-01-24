const socket = io()

socket.on('productsList', products=>{
    const productsList = document.getElementById('productsList')
    let prods = ''
    products.docs.forEach(prod => {
        prods += `
                <div class="product">
                    <h3>${prod.title}</h3>
                    <p>${prod.description}</p>
                    <p>Code: ${prod.code}</p>
                    <p>Price: $${prod.price}</p>
                    <p>Stock: ${prod.stock}</p>
                    <p>Category: ${prod.category}</p>
                    <button class="btn-delete" id="${prod.id}">Delete</button>
                </div>
                `
    });
    productsList.innerHTML = prods

    const btnDeleteProduct = document.querySelectorAll(".btn-delete")

    btnDeleteProduct.forEach(e=>{
        e.addEventListener("click", (evt)=>{
            const idProduct = evt.target.id
            socket.emit('deleting-product', idProduct)
        })
    })
})

const btnForm = document.getElementById("btnForm")
const inputs = document.querySelectorAll(".input")

let newProduct = {}

inputs.forEach(input=>{
    input.addEventListener("change", (e)=>{
        newProduct = {...newProduct, [e.target.name]: e.target.value
        }
    })
})


const hidden = document.querySelector('.hidden')

btnForm.addEventListener("click", (e)=>{
    e.preventDefault()
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
        hidden.classList.remove('hidden')
    } else {
        newProduct.stock = parseInt(newProduct.stock)
        newProduct.price = parseInt(newProduct.price)
        hidden.classList.add('hidden')
        socket.emit('new-product', newProduct)
        newProduct = {}
        inputs.forEach(input=>{
            input.value = ""
        })
    }
})
// Let's map the pizza records, and clone the pizza model
let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el)=> document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);

// List of Pizzas
pizzaJson.map( (item, index) => {
    let pizzaItem = c(".models .pizza-item").cloneNode(true);    

    //Informations in HTML
    pizzaItem.setAttribute("data-key", index);
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;    
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`  ;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

    //Remove the default page refresh and then show modal
    pizzaItem.querySelector("a").addEventListener("click", (e)=> {
        e.preventDefault();
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalQt = 1;
        modalKey = key;

        //Informations of the selected pizza inside the modal
        c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        c(".pizzaBig img").src = pizzaJson[key].img;
        c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; 
        c(".pizzaInfo--size.selected").classList.remove("selected"); //search size selected

        cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex]; 
        });

        c(".pizzaInfo--qt").innerHTML = modalQt;
        
        //Open modal
        c(".pizzaWindowArea").style.opacity = 0;
        c(".pizzaWindowArea").style.display = "flex";
        setTimeout( ()=>{
            c(".pizzaWindowArea").style.opacity = 1;
        },200 );
        
    });
    
    c(".pizza-area").append(pizzaItem);

} );

//Modal Events
function closeModal() {
    c(".pizzaWindowArea").style.opacity = 0;
    
    setTimeout( ()=>{
        c(".pizzaWindowArea").style.display = "none";
    },200 );    
}

//Close Modal
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach( (item) => {
    item.addEventListener("click", closeModal);
});

// Add quantity of pizzas [-]
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
    if(modalQt > 1) {
        modalQt--;
        c(".pizzaInfo--qt").innerHTML = modalQt;
    }
});

// Add quantity of pizzas [+]
c(".pizzaInfo--qtmais").addEventListener("click", () => {
    modalQt++;
    c(".pizzaInfo--qt").innerHTML = modalQt;
});

// Select pizza size
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
    size.addEventListener("click", (e) => {
        c(".pizzaInfo--size.selected").classList.remove("selected"); //search size selected
        size.classList.add("selected"); 
    });
});

//Add pizzas to cart
c(".pizzaInfo--addButton").addEventListener("click", () => {

    size = c(".pizzaInfo--size.selected").getAttribute("data-key");
    price = `R$ ${pizzaJson[modalKey].price.toFixed(2)}`

    let identifier = pizzaJson[modalKey].id+"@"+size;

    let key = cart.findIndex( (item)  => item.identifier == identifier );

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {

        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt,
            price: price 
        });

    }

    updateCart();
    closeModal();
});

//Mobile Cart
c(".menu-openner").addEventListener("click", ()=> {
    if(cart.length > 0 ) {
        c("aside").style.left = "0";
     }    
});
c(".menu-closer").addEventListener("click", () => {
    c("aside").style.left = "100vw";
});
function updateCart() {

    c(".menu-openner span").innerHTML = cart.length;
   

    if (cart.length > 0) {
        c("aside").classList.add("show");
        c(".cart").innerHTML = "";

        let subtotal = 0;
        let discounts = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find( (item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt; 

            let cartItem = c(".models .cart--item").cloneNode(true);

            let pizzaSizeName;
            let pizzaSize = cart[i].size;

            if(pizzaSize == 0) {pizzaSizeName = "P";}
            if(pizzaSize == 1) {pizzaSizeName = "M";}
            if(pizzaSize == 2) {pizzaSizeName = "G";}

            let pizzaName =  `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () => {

                if(cart[i].qt > 1 ) {
                    cart[i].qt--;
                } else {
                    cart.splice(i,1);
                }
                updateCart();
            });
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () => {
                cart[i].qt++;

                updateCart();
            });


            //Informations in HTML
            c(".cart").append(cartItem);

        }

        discounts = subtotal * 0.1;
        total = subtotal - discounts;
        c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c(".desconto span:last-child").innerHTML = `R$ ${discounts.toFixed(2)}`;
        c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        c("aside").classList.remove("show");
        c("aside").style.left = "100vw";
    }





};

//https://alunos.b7web.com.br/curso/javascript/compra-de-pizzas-parte-8
//https://github.com/joaogalvesluiz/pizza-purchase
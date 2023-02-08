//tarkistetaan onko kaikki tarvittava jo ladattu, jos on, suoritetaan ready()
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

//alustetaan kaupan toiminta
function ready() {
    var removeFromCartButton = document.getElementsByClassName('removebtn');
    for (var i = 0; i < removeFromCartButton.length; i++) {
        var button = removeFromCartButton[i];
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-qty-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    var addToCartButtons = document.getElementsByClassName('nappi');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
}

//ostonappi
function purchaseClicked() {
    alert("Thank you for your purchase!");
    var cartItems = document.getElementsByClassName('cart-items')[0];
    while(cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateTotal();
}

//tuotteiden lkm muutos
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

//koriin lisäys käsittely
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement;
    var title = shopItem.getElementsByClassName('cart-item-title')[0].innerHTML;
    var price = shopItem.getElementsByClassName('cart-price')[0].innerHTML;
    var imageSrc = shopItem.getElementsByClassName('tuotteet')[0].src;
    addItemToCart(title, price, imageSrc);
    updateTotal();
}

//tuotteen lisäys koriin
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if(cartItemNames[i].innerHTML == title) {
            alert("Already in cart.");
            return;
        }
    }
    //luodaan korin tuotteet sivulle
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-img" src="${imageSrc}" width="80" height="80">
                <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
            <div class="cart-qty cart-column">
                <input class="cart-qty-input" type="number" value="1">
                    <button class="removebtn" type="button" onclick="updateTotal()">Remove</button>
            </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('removebtn')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-qty-input')[0].addEventListener('change', quantityChanged);
}

//tavaran poisto korista
function removeCartItem(event) {
    var nappiPainettu = event.target;
    nappiPainettu.parentElement.parentElement.remove();
    updateTotal();
}

//tuotteiden lkm kasvatus
var lisaaNappi = document.getElementsByClassName('inc');
var vahennaNappi = document.getElementsByClassName('dec');
for(var i = 0; i < lisaaNappi.length; i++) {
    var button = lisaaNappi[i];
    button.addEventListener('click', function(event){
        var nappiPainettu = event.target;
        var input = nappiPainettu.parentElement.children[4];
        var inputValue = input.value;
        var newValue = parseInt(inputValue) + 1;
        input.value = newValue;
    })
}

//tuotteiden lkm vähennys
for(var i = 0; i < vahennaNappi.length; i++) {
    var button = vahennaNappi[i];
    button.addEventListener('click', function(event){
        var nappiPainettu = event.target;
        var input = nappiPainettu.parentElement.children[4];
        var inputValue = input.value;
        var newValue = parseInt(inputValue) - 1;
        if (newValue >= 0) {
            input.value = newValue;
        }
        else {
            input.value == 0;
        }
    })
}

//korista poiston käsittely
var removeFromCartButton = document.getElementsByClassName('removebtn');
for (var i = 0; i < removeFromCartButton.length; i++) {
    var button = removeFromCartButton[i];
    button.addEventListener('click', function(event) {
        var nappiPainettu = event.target;
        nappiPainettu.parentElement.parentElement.remove();
        updateTotal();
    })
}

//korin päivittäminen ajan tasalle
function updateTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for(var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-qty-input')[0];
        var price = parseFloat(priceElement.innerHTML.replace('€', ''));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerHTML = total + '€';
}

//tämä ostoksen teon jälkeen jotta kauppa nollaantuu
function sivunPaivitys() {
    setTimeout(function(){
        window.location.reload();
     }, 4000);
}

// Modal content clear id 
const clearTitle = document.getElementById("exampleModalLabel");
const clearImg = document.getElementById("modal-img");

// in modal hidden 'add to cart' button functionality for 'buy now' button
const hiddenCart = document.getElementById("hidden-cart");
hiddenCart.classList.remove("d-none");
// end 


// search by catagory section 
const searchFieldData = document.getElementById("search-btn").addEventListener("click", () => {
		const get = document.getElementById("input-field");
		const getData = get.value;
		get.value = "";
		loadProducts(getData, true);
	});


// function call load all api product section 
const loadProducts = (data, check) => {
	// 'check' is a boolean type data. when product load from search catagoty that time check == true 

	if (check === true) {
		const url = `https://fakestoreapi.com/products/category/${data}`;
		fetch(url)
			.then((res) => res.json())
			.then((json) => showProducts(json));
	} else {
		// loadProducts function call onloading 
		const url = `https://fakestoreapi.com/products`;
		fetch(url)
			.then((response) => response.json())
			.then((data) => showProducts(data));
	}
};
loadProducts();




// show all product in UI
const showProducts = (products) => {
	const allProducts = products.map((pd) => pd);
	// console.log(allProducts);
	const allProductDiv = document.getElementById("all-products");
	allProductDiv.innerHTML = "";  			//pervios data clean when new data come from searching
	let count = 0;                 			// product counting, how many product is found from onload and search load

	for (const product of allProducts) {
		count++;
		const image = product.image;
		const rating = product.rating;
		const starRating = doStarRating(rating.rate);  // function call for creating dynamic rating star
		const div = document.createElement("div");
		div.classList.add("product");
		div.innerHTML = `
		<div class="single-product shadow-lg rounded-3 mx-auto mb-5">
			<div>
				<img class="product-image" src=${image}></img>
			</div>
      		<h3>${product.title}</h3>
      		<p> <span class="fw-bold" >Category:</span> ${product.category}</p>


	  		<div class="d-flex justify-content-between align-items-center px-5 mx-5">
				<p>
					<span class="fw-bold">Rating:</span> ${rating.rate}
				</p>
				<p> ${rating.count} <span class="fw-bold"> People</span></p>
			
			</div>

			<p> ${starRating}</p>

      		<h2 >Price: $ ${product.price} </h2>
	  
      
      		<button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-warning">add to cart</button>
     		<button id="details-btn" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="loadSingleProductsDetails('${product.id}')">Details</button>

      	</div>
      `;
		allProductDiv.appendChild(div);
	}

	//check if there is no data found in search by catagory that time this will show an error message
	if (count === 0) {
		allProductDiv.innerHTML = `<h1 class=" text-center bg-warning p-3">No result found</h1>`;
	}
};

// dynamics star rating function
const doStarRating = (rate) => {
	// console.log("rate", rate);
	let rating = '';
	let i = 0;
	while (i < Math.round(rate)) {
		rating += `<i class="bi bi-star-fill text-warning"></i>`;
		i++;
	}
	return rating;

};



// single product details function called from 'view details' button 
const loadSingleProductsDetails = (id) => {
	const url = `https://fakestoreapi.com/products/${id}`;
	fetch(url)
		.then((res) => res.json())
		.then((data) => displayModal(data));
};


//single product details view in modal section 
const displayModal = (data) => {

	console.log("data id ", data);
	hiddenCart.classList.remove("d-none");

	const title = document.getElementById("exampleModalLabel");
	title.innerText = data.title;
	const imgAdd = document.getElementById("modal-img");
	const addCart = document
		.getElementById("addCartFromModal")
		.addEventListener("click", () => {
			addToCart(data.id, data.price);
			clearTitle.innerText = "";
			clearImg.innerText = "";
		});
	imgAdd.innerHTML = `
  	<div class="row">
   		<div class="col"><img  style="height:200px;" src="${data.image}" alt="" class="img-fluid"></div>
   		<div class="col"><h5>Description</h5> <p> ${data.description}</p></div>
  	</div>
  
  	<h5>Catagory: ${data.category}</h5>
  	<h5>Rating: ${data.rating.rate}</h5>
  	<h3 class="text-danger">Price: $ ${data.price}</h3>
`;
};


// if modal section is close after that this cleanData will clear all previous history
const clearData = () => {
	clearTitle.innerText = "";
	clearImg.innerText = "";
};


// buyNow modal functionality 
const buyNow = document.getElementById('buy-now').addEventListener('click', () => {

	const title = document.getElementById("exampleModalLabel");
	const totalProduct = document.getElementById("total-Products");
	const totalProductText = totalProduct.innerText;

	hiddenCart.classList.add("d-none");
	

	const totalPrice = document.getElementById("total");
	const totalPriceText = totalPrice.innerText;
	
	title.innerHTML = `<h1>My Cart</h1>`;
	const price = getInputValue("price");
	const deliverCharge = getInputValue("delivery-charge");
	const totalTax = getInputValue("total-tax");
	const cartPriceDetails = document.getElementById("modal-img");
	cartPriceDetails.innerHTML = `
	<table class="table">
							
			<tbody>
				<tr>
					<th>Total Added-Products:</th>
					<td>${totalProductText}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Price:</th>
					<td>$ ${price}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Delivery-Charge:</th>
					<td>$ ${deliverCharge}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Total-Tax:</th>
					<td>$ ${totalTax}</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th scope="row">Total</th>
					<td colspan="2">$ ${totalPriceText} </td>
				</tr>
			</tbody>
	</table>
   
`;
	

	
	
});

let count = 0;
const addToCart = (id, price) => {
	count = count + 1;

	updatePrice("price", price);

	updateTaxAndCharge();
	document.getElementById("total-Products").innerText = count;
	updateTotal();
};


const getInputValue = (id) => {
	const element = document.getElementById(id).innerText;
	// const converted = parseInt(element); (change)
	const converted = parseFloat(element);
	return converted;
};

// main price update function
const updatePrice = (id, value) => {
	const convertedOldPrice = getInputValue(id);
	console.log("old price", convertedOldPrice);
	const convertPrice = parseFloat(value);
	const total = convertedOldPrice + convertPrice;
	//  document.getElementById(id).innerText = Math.round(total);
	document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
	// document.getElementById(id).innerText = Math.round(value);
	document.getElementById(id).innerText = value;
	console.log("value", value);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
	const priceConverted = getInputValue("price");
	if (priceConverted > 200) {
		setInnerText("delivery-charge", 30);
		// setInnerText("total-tax", priceConverted * 0.2);
		setInnerText("total-tax", (priceConverted * 0.2).toFixed(2));
	}
	if (priceConverted > 400) {
		setInnerText("delivery-charge", 50);
		// setInnerText("total-tax", priceConverted * 0.3);
		setInnerText("total-tax", (priceConverted * 0.4).toFixed(2));
	}
	if (priceConverted > 500) {
		setInnerText("delivery-charge", 60);
		// setInnerText("total-tax", priceConverted * 0.4);
		setInnerText("total-tax", (priceConverted * 0.4).toFixed(2));
	}
};

//grandTotal update function
const updateTotal = () => {
	console.log("price in ", getInputValue("price"));

	const grandTotal =
		getInputValue("price") +
		getInputValue("delivery-charge") +
		getInputValue("total-tax");
	document.getElementById("total").innerText = grandTotal.toFixed(2);
};

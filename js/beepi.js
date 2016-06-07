
var cars,
	numBuckets = 50, // this value can be changed
	bucketSize,
	prices = [],
	minPrice,
	maxPrice,
	liked = [];



$(document).ready(function() {
	//console.log("document ready");

	$.get("js/cars.json", function(response) {
		// console.log(response);
		cars = response;

		console.log('1');

		var likedString = localStorage.getItem('beepiLikedCars');
		if(likedString != null)
			liked = JSON.parse(likedString);

		console.log('2');

		initCars();

		console.log('3');

		createBuckets();

		console.log('4');

		initSlider();

		console.log('5');

		initSearchbox();		

		console.log('6');		

 	});

});


function initCars() {

	var carsContainer = $("#cars-container")[0];

	cars.forEach(function(car) {

		var likedAttr = (liked.indexOf(car.id) > -1) ? "true" : "false";
		var likeSrc = (liked.indexOf(car.id) > -1) ? "assets/images/full_heart.png" : "assets/images/empty_heart_white.png";

		// render car on the grid
		var carHTML = '\
			<div class="car" id="car-' + car.id + '" style="background: url(\'' + car.image + '\'); background-size: cover;">\
				<div class="like-container">\
					<img class="like-button" onclick="likeHandler(this)" carid="' + car.id + '"\
					liked="' + likedAttr + '" src="' + likeSrc + '"/>\
				</div>\
				<div class="car-info">\
					<div class="car-name">' + car.name + '</div>\
					<div class="car-price">$' + car.price + '</div>\
					<div class="car-more-info">' + car.mileage + ' Miles  &bull;  ' + car.bodyType + '</div>\
				</div>\
			</div>';

		carsContainer.innerHTML += carHTML;
		
		// populate prices array 		
		prices.push(car.price);

		// set min and max price
		if(minPrice == null || maxPrice == null) {
			minPrice = maxPrice = car.price;
		} else if(car.price < minPrice) {
			minPrice = car.price;
		} else if(car.price > maxPrice) {
			maxPrice = car.price;
		}
	});

}


function createBuckets() {

	var buckets = [];
	buckets.length = numBuckets;
	buckets.fill(0);

	bucketSize = Math.ceil((maxPrice-minPrice)/numBuckets)+1; // ensures that max value falls in a bucket

	var tallestBucket = -1;  // tallest buckets is set to full height of buckets-container
								// all others are proportional to tallest bucket

	for(var i=0; i<prices.length; i++) {
		var index = Math.floor((prices[i]-minPrice)/bucketSize);
		buckets[index]++;

		if(buckets[index] > tallestBucket)
			tallestBucket = buckets[index];
	}

	var bucketsContainer = $("#buckets-container")[0];

	for(var i=0; i<buckets.length; i++) {

		var invertedBucketHeightPercentage = 100-(buckets[i]*100/tallestBucket);

		//ensures that tallest bucket has some height to get rendered
		var heightPercentage = (invertedBucketHeightPercentage > 0) ? invertedBucketHeightPercentage : 1;
		//console.log(heightPercentage);

		var bucketHTML = '\
			<div class="bucket" style="height: ' + heightPercentage + '%; width: ' + 100/numBuckets + '%;"></div>\
		';

		bucketsContainer.innerHTML += bucketHTML;
	}

	$(".buckets-background").addClass("show-bars");
}


function initSlider() {

	var slider = $("#range-selector")[0];

	noUiSlider.create(slider, {
		start: [minPrice, maxPrice],
		connect: true,
		margin: bucketSize,
		step: 1,
		range: {
			'min': minPrice,
			'max': maxPrice
		}
	});

	slider.noUiSlider.on("update", function(values) {
		//console.log(Number(values[0]).toLocaleString());
		var left = Number(values[0]),
			right = Number(values[1]);
		$("#range-price-left").html("$"+left.toLocaleString());
		$("#range-price-right").html("$"+right.toLocaleString());

		var maxWidthPercentage = (right-left)*100/(maxPrice-minPrice),
			marginLeftPercentage = (left-minPrice)*100/(maxPrice-minPrice);

		$("#buckets-background-active").css({
			"width": maxWidthPercentage+"%",
			"left": marginLeftPercentage+"%"
		});
	});

	slider.noUiSlider.on("change", function(values) {
		console.log("Searching for cars priced between $" + Number(values[0]).toLocaleString() + " and $" + Number(values[1]).toLocaleString());
		searchByPrice(Number(values[0]), Number(values[1]));
	});

}

function initSearchbox() {

	$("#search-bar").on("keydown", function(e) {
		if(e.keyCode === 13 && $("#search-bar").val() !== "") {
			//console.log($("#search-bar").val());
			var resultsMinPrice,
				resultsMaxPrice,
				numResults = 0,
				searchTerms = $("#search-bar").val().trim().toLowerCase().split(" ");

			for(var i=0; i<cars.length; i++) {

				for(var j=0; j<searchTerms.length; j++) {
					var term = searchTerms[j];
					if(cars[i].name.toLowerCase().indexOf(term) > -1 ||
						cars[i].bodyType.toLowerCase().indexOf(term) > -1 ||
						cars[i].year === term) { // match!

						numResults++;

						$("#car-"+cars[i].id).removeClass("hidden");

						if(resultsMinPrice == null || resultsMaxPrice == null)
							resultsMinPrice = resultsMaxPrice = cars[i].price;
						else if(cars[i].price < resultsMinPrice)
							resultsMinPrice = cars[i].price;
						else if(cars[i].price > resultsMaxPrice)
							resultsMaxPrice = cars[i].price;

						j = searchTerms.length; // skips to end of inner loop
					}

					if(j == searchTerms.length - 1) // if reached end of inner loop naturally (not a match)
						$("#car-"+cars[i].id).addClass("hidden");

				}

			}

			var resultsHTML = '\
				<span id="num-results">' + numResults + '</span>&nbsp;&nbsp;results found for&nbsp;&nbsp;\
				<span class="query">' + $("#search-bar").val() + '</span>\
				<button id="view-all" onclick="viewAllCars()">View All Cars</button>\
			';

			$("#results-summary").html(resultsHTML);

			var slider = $("#range-selector")[0];

			if(numResults > 0)
				slider.noUiSlider.set([resultsMinPrice, resultsMaxPrice]);
			else
				slider.noUiSlider.set([minPrice, maxPrice]);

		}
	});

}


function searchByPrice(from, to) {

	var numResults = 0;

	for(var i=0; i<cars.length; i++) {

		if(cars[i].price >= from && cars[i].price <= to) {

			numResults++;
			$("#car-"+cars[i].id).removeClass("hidden");

		} else {
			$("#car-"+cars[i].id).addClass("hidden");
		}

	}

	var resultsHTML = '\
			<span id="num-results">' + numResults + '</span>&nbsp;&nbsp;cars found priced between&nbsp;&nbsp;\
			<span class="query">$' + Number(from).toLocaleString() + '</span>&nbsp;&nbsp;and&nbsp;&nbsp;\
			<span class="query">$' + Number(to).toLocaleString() + '</span>\
			<button id="view-all" onclick="viewAllCars()">View All Cars</button>\
	';

	$("#results-summary").html(resultsHTML);

}

function viewAllCars() {

	$("#results-summary").html('<button id="view-liked" onclick="viewLiked()">View Liked Cars</button>');

	$("#search-bar").val("");

	$("#range-selector")[0].noUiSlider.set([minPrice, maxPrice]);

	for(var i=0; i<cars.length; i++) {
		$("#car-"+cars[i].id).removeClass("hidden");
	}
}

function viewLiked() {
	$(".car").addClass("hidden");

	for(var i=0; i<liked.length; i++) {
		$("#car-"+liked[i]).removeClass("hidden");
	}

	var resultsHTML = '\
		<span id="num-results">' + liked.length + '</span>&nbsp;&nbsp\
		<span class="query">liked cars</span>\
		<button id="view-all" onclick="viewAllCars()">View All Cars</button>\
	';

	$("#results-summary").html(resultsHTML);

}


function likeHandler(e) {

	var carId = Number($(e).attr("carid"));

	if($(e).attr("liked") === "true") {
		$(e).attr("src", "assets/images/empty_heart_white.png");
		$(e).attr("liked", "false");

		var index = liked.indexOf(carId);
		if(index > -1) {
			liked.splice(index, 1);
			localStorage.setItem('beepiLikedCars', JSON.stringify(liked));
		}

	} else {
		$(e).attr("src", "assets/images/full_heart.png");
		$(e).attr("liked", "true");

		if(liked.indexOf(carId) === -1) {
			liked.push(carId);
			localStorage.setItem('beepiLikedCars', JSON.stringify(liked));
		}		
	}

}



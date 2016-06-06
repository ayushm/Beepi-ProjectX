
var cars;

$(document).ready(function() {
	//console.log("document ready");

	$.get("js/cars.json", function(response) {
		// console.log(response);
		cars = response;

		renderCars();

 	});

});


function renderCars() {

	var carsContainer = $("#cars-container")[0];

	cars.forEach(function(car) {

		var carHTML = '\
			<div class="car" style="background: url(\'' + car.image + '\'); background-size: cover;">\
				<div class="car-info">\
					<div class="car-name">' + car.name + '</div>\
					<div class="car-price">$' + car.price + '</div>\
					<div class="car-more-info">' + car.mileage + ' Miles  &bull;  ' + car.bodyType + '</div>\
				</div>\
			</div>';

		carsContainer.innerHTML += carHTML;
	});

}
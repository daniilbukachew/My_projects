$(document).ready(function() {
	app_prices.initialize();
});
var app_prices = {
  initialize: function() {
    app_prices.events();
  },
	load_price: function(region, material, material_type, range, check) {
		$.ajax({
			url: '/prices/' + region + '.js',
			dataType: 'json',
			success: function(data) {
				var price = [];
				for (var i = range[0]; i <= range[2]; i++) {
						var price_slice = JSON.stringify(data[material][i].slice(range[1], range[3]));
						price.push(price_slice);
				}
				price = JSON.stringify(price);
				$.ajax({
					url: '/app_prices/app_prices.php',
					method: 'POST',
					data: {
						operation: 'load_price',
						price: price
					},
					success: function(data) {
						var type = $('select[id="' + material + '_type"]').val();
						var region = $('select[id="region"]').val();
						$("body").empty();
						$("body").append(data);
						$('div[material]').removeAttr('hidden');
						$('select[id="region"]').val(region);
						$('select[id="material"]').val(material)
						$('div[' + material + '_type]').removeAttr('hidden');
						$('select[data-action="Тип материала"]').val(type);
						$('div[id="action"]').removeAttr('hidden');
						$('div[id="input-num"]').removeAttr('hidden');
						$('div[id="change_price"]').removeAttr('hidden');
					}
				});
			},
			error: function() {
				alert('Произошла ошибка, обновите страницу!');
			}
		})
	},
	change_price: function(action, dif, price, material, region, material_type) {
		$.ajax({
			url: '/app_prices/app_prices.php',
			method: 'POST',
			data: {
				operation: "change_price",
				action: action,
				dif: dif,
				price: price,
				material: material,
				region: region,
				material_type: material_type,
			},
			success: function(data) {
				var material = $('select[id="material"]').val();
				var type = $('select[id="' + material + '_type"]').val();
				var region = $('select[id="region"]').val();
				$("body").empty();
				$("body").append(data);
				$('div[material]').removeAttr('hidden');
				$('select[id="region"]').val(region);
				$('select[id="material"]').val(material)
				$('div[' + material + '_type]').removeAttr('hidden');
				$('select[data-action="Тип материала"]').val(type);
				$('div[id="action"]').attr('hidden', 'true');
				$('div[id="input-num"]').attr('hidden', 'true');
				$('div[id="change_price"]').attr('hidden', 'true');
			},
		});
	},
  events: function() {
		$(document).on('change', 'select[data-action="Регион"]', function() {
			// console.log("выбран регион");
			var region = $('select[id="region"]').val();
			switch (region) {
				case '':
					$('table[id="result_before"]').remove();
					$('table[id="result_after"]').remove();
					$('div[material]').attr('hidden', 'true');
					$('div[Евроштакетник_type]').attr('hidden', 'true');
					$('div[Профнастил_type]').attr('hidden', 'true');
					$('div[id="action"]').attr('hidden', 'true');
					$('div[id="input-num"]').attr('hidden', 'true');
					$('div[id="change_price"]').attr('hidden', 'true');
					break;
				default:
				$('div[material]').removeAttr('hidden');
				$('select[id="material"]').val('Выберите материал');
				$('div[Евроштакетник_type]').attr('hidden', 'true');
				$('div[Профнастил_type]').attr('hidden', 'true');
			}
		});
    $(document).on('change', 'select[data-action="Материал"]', function() {
			// console.log("смена материала");
			var material = $('select[id="material"]').val();
			$('table[id="result_before"]').remove();
			$('table[id="result_after"]').remove();
			$('div[id="action"]').remove();
			$('div[id="input-num"]').remove();
			$('div[id="change_price"]').remove();
			switch (material) {
				case "Профнастил":
				$('div[Профнастил_type]').removeAttr('hidden');
				$('div[Евроштакетник_type]').attr('hidden', 'true');
				$('select[id="material"]').val();
				$('select[id="Профнастил_type"]').val('');
				break;
				case "Евроштакетник":
				$('div[Евроштакетник_type]').removeAttr('hidden');
				$('div[Профнастил_type]').attr('hidden', 'true');
				$('select[id="material"]').val();
				$('select[id="Евроштакетник_type"]').val('');
				break;
				default:
				$('div[Евроштакетник_type]').attr('hidden', 'true');
				$('div[Профнастил_type]').attr('hidden', 'true');
			}
    });
		$(document).one('change', 'select[data-action="Тип материала"]', function() {
			$('table[id="result_before"]').remove();
			$('table[id="result_after"]').remove();
			$('div[id="action"]').remove();
			$('div[id="input-num"]').remove();
			$('div[id="change_price"]').remove();
			var region = $('select[id="region"]').val();
			var material = $('select[id="material"]').val();
			var material_type = material + ' ' + $('select[id="' + material + '_type"]').val();
			app_prices.price_range(material_type, region, material);
			// console.log("изменение");
			$(document).off('change');
			$(document).off('click');
		});
		$(document).one('click', 'button[data-action="Изменить цену"]', function() {
			var region = $('select[id="region"]').val();
			var material = $('select[id="material"]').val();
			var price = $('div[id=json_send]').html();
			var action = $('select[data-action="Выберите действие"]').val();
			var dif = $('input[data-action="Введите число"]').val();
			var material_type = material + ' ' + $('select[id="' + material + '_type"]').val();
			// console.log("изменение цены");
			$('button[data-action="Изменить цену"]').find('hidden').remove();
			app_prices.change_price(action, dif, price, material, region, material_type);
			$(document).off('change');
			$(document).off('click');
		})
  },
	price_range: function(material_type, region, material) {
		var range = [];
		var range_sheet = '';
		switch (material_type) {
			case "Профнастил Эконом":
				range = [1, 0, 7, 5];
				break;
			case "Профнастил Стандарт":
				range = [1, 10, 7, 16];
				break;
			case "Евроштакетник Стандарт":
				range = [2, 0, 40, 5];
				break;
			case "Евроштакетник Шахматка":
				range = [2, 9, 40, 12];
				break;
			case "Евроштакетник Горизонтальный":
				range = [2, 16, 19, 19];
				break;
			case "Евроштакетник Горизонтальный односторонний":
				range = [2, 20, 26, 25];
				break;
			case "Профнастил Все типы профнастила":
				range = [1, 0, 7, 16];
				break;
			case "Евроштакетник Все типы евроштакетника":
				range = [2, 0, 40, 25];
				break;
			default:
				break;
		}
		app_prices.load_price(region, material, material_type, range);
	}
};

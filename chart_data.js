$(document).ready(function() {
  graphics.initialize();
})
var graphics = {
  initialize:function() {
    graphics.load_tables();
  },
  chart: function(chart_values, id, graphics_data, data, labels, options, chart_type) {
    $("canvas#Chart").remove();
    var canvas = $('<canvas id="Chart" width="800px" height="700px"></canvas>');
    $("body").append(canvas);
    const Canvas = document.getElementById("Chart").getContext("2d");
    const config = {
      type: chart_type,
      options: options,
      data: data,
    };
    var new_Chart = new Chart (Canvas, config);
    if (chart_type === "bar") {
      setTimeout(function () {
        mybarchartmethods.sort(new_Chart, 0)
      }, 1000);
      new_Chart.update();
    }
  },
  events: function(tables_array, id_array) {
    $(document).on('change', 'select[data-action="Выберите таблицу"]', function(){
      $("div.table_data").remove();
      $("Canvas#Chart").remove();
      var id = $('select[data-action="Выберите таблицу"]').val();
      if ($('select[data-action="Выберите данные для сравнения"]').length) {
        var id = $('select[data-action="Выберите таблицу"]').val();
        var graphics_data = $('select[data-action="Выберите данные для сравнения"]').val();
        var chart_data = [];
        for (var i = 0; i < tables_array[id_array.get(id)].length; i++) {
          chart_data.push(tables_array[id_array.get(id)][i][tables_array[id_array.get(id)][0].indexOf(graphics_data)]);
        }
        var chart_values = [];
        chart_values.push(chart_data);
        chart_data = [];
        for (var i = 0; i < tables_array[id_array.get(id)].length; i++) {
          chart_data.push(tables_array[id_array.get(id)][i][0]);
        }

        chart_values.push(chart_data);
        graphics.chart(chart_values, id, graphics_data);
      }
      else {
        if ($("label#chart_type").length === 0) {
          $("body").append('<label id="chart_type">Выберите тип графика: </label><select data-action="Выберите тип чарта" id=chart_type><option value="bar">bar</option><option value="line">line</option><option value="polarArea">polarArea</option><option value="radar">radar</option></select>');
          $("body").append('<button id="print-chart-btn">Распечатать график</button>')
        }
        $("body").append('<div class="table_data"><br><label id="table_data">Выберите данные для сравнения:</label></div>');

      }
      if (id === 'Выберите таблицу') {
        $('div.table_data').remove();
        $('<br><label>Выберите данные для сравнения:</label>').remove();
        $('label#chart_type').remove();
        $('select[data-action="Выберите тип чарта"]').remove();
        $('button#print-chart-btn').remove();
      }
      var table_values = tables_array[id_array.get(id)];
      for (var i = 0; i < table_values[0].length; i++) {
        if (table_values[0][i] !== "Регион" && table_values[0][i] !== "Менеджер") {
          $('div.table_data').append('<p id="table_data"><input type="checkbox" id="table_data" value="'+ table_values[0][i] +'">' + table_values[0][i] + '</p>');
        }
      }
      // $(document).off('change');
      // $(document).off('click');
    })
    $(document).on('change', 'input#table_data', function (){
      if ($(this).attr("checked")) {
        $(this).attr("checked", false);
      }
      else {
        $(this).attr("checked", true);
      }
      graphics.render_data(tables_array, id_array);
    })
    $(document).on('change', 'select[data-action="Выберите тип чарта"]', function() {
      graphics.render_data(tables_array, id_array);
    })
    $(document).on('click', 'button#print-chart-btn', function() {
      console.log("печать");
      var canvas = document.querySelector("#Chart");
      var canvas_img = canvas.toDataURL("image/png",1.0); //JPEG will not match background color
      var pdf = new jsPDF('portrait','px', 'letter'); //orientation, units, page size
      pdf.addImage(canvas_img, 'jpeg', 40, 40, 300, 250); //image, type, padding left, padding top, width, height
      pdf.autoPrint(); //print window automatically opened with pdf
      var blob = pdf.output("bloburl");
      window.open(blob);
    });
  },
  render_data: function(tables_array, id_array) {
    var chart_data = [];
    var chart_values = [];
    var graphics_data = [];
    var id = $('select[data-action="Выберите таблицу"]').val();
    $('input#table_data[checked]').each(function() {
      for (var i = 0; i < tables_array[id_array.get(id)].length; i++) {
          chart_data.push(tables_array[id_array.get(id)][i][tables_array[id_array.get(id)][0].indexOf($(this).val())]);
        }
        chart_values.push(chart_data);
        chart_data = [];
        graphics_data.push($(this).val());
    })
    for (var i = 0; i < tables_array[id_array.get(id)].length; i++) {
          chart_data.push(tables_array[id_array.get(id)][i][0]);
        }
        chart_values.push(chart_data);
    var colors_array = ["#FF9A34", "#32b4d9", "yellow", "green", "orange"];
    var backgroundColor_array = ["#9221d997", "#32b4d9a2", "#ffff00a2", "#00ff00a2", "#ffa500a1"];
    var background_color = [];
    var colors = [];
    for (var j = 0; j < chart_values.length - 1; j++) {
      for (var i = 0; i < chart_values[j].slice(1, -1).length; i++) {
        if (chart_values[j][i] !== '') {
          chart_values[j][i] = String(chart_values[j][i].replace(/ /g,''));
          chart_values[j][i] = parseFloat(chart_values[j][i].replace(',', '.'));
          // chart_values[j][i] = Math.log(chart_values[j][i]);
          colors.push(colors_array[j]);
        }
        else {
          chart_values[j][i] = 0;
          colors.push(colors_array[j]);
          background_color.push(backgroundColor_array[j]);
        }
      }
    }
    var data = [];
    var datasets = [];
    var labels = [];
    var options = [];
    var chart_type = $('select#chart_type').val();
    switch (chart_type) {
      case 'line':
        var scales = [];
        var yAxesId = [];
        var max_values = [];
        for (var i = 0; i < chart_values.length - 1; i++) {
          var n = i+1;
          var position = ['bottom', 'top'];
          if (n > 2) {
            n = 2;
          }
          yAxesId.push(n + '-y-axis');
          datasets.push(
            {
              label: graphics_data[i],
              data: chart_values[i].slice(1, -1),
              // backgroundColor: backgroundColor_array[i * (chart_values[i].length - 1)],
              borderColor: colors[i * (chart_values[i].length - 1)],
              yAxisID: yAxesId[i],
            },
          );
          scales[n + '-y-axis'] = {
            type: 'linear',
            position: 'left',
            };
        }
        for (var i = 1; i < chart_data.length - 1; i++) {
          labels.push(chart_data[i]);
        }
        options = {
          indexAxis: 'x',
          elements: {
            bar: {
              borderWidth: 1,
            }
          },
          responsive: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: chart_values[1][0] + "/" + graphics_data
            },
            tooltip: {

            }
          }
        };
      break;
      case 'polarArea':
      case 'radar':
        for (var i = 0; i < chart_values.length - 1; i++) {
          datasets.push(
            {
              label: graphics_data[i],
              data: chart_values[i].slice(1, -1),
              // backgroundColor: background_color[i * (chart_values[i].length - 1)],
              // fill: true,
              borderColor: colors[i * (chart_values[i].length - 1)]
            },
          );
        }
        for (var i = 1; i < chart_data.length - 1; i++) {
          labels.push(chart_data[i]);
        }
        options = {
          scales: {
            xAxes: [{
                ticks: {
                    min:0,
                    max:1000
                },
                type: 'logarithmic',
            }]
          },
          elements: {
            bar: {
              borderWidth: 1,
            }
          },
          responsive: false,
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: chart_values.pop()[0] + "/" + graphics_data
          },
        };
      break;
      default:
      var scales = [];
      var xAxesId = [];
      var max_values = [];
        for (var i = 0; i < chart_values.length - 1; i++) {
          var n = i+1;
          var position = ['bottom', 'top'];
          if (n > 2) {
            n = 2;
          }
          xAxesId.push(n + '-x-axis');
          datasets.push(
            {
              label: graphics_data[i],
              data: chart_values[i].slice(1, -1),
              backgroundColor: colors[i * (chart_values[i].length - 1)],
              xAxisID: xAxesId[i],
            }
          );
          scales[n + '-x-axis'] = {
            type: 'linear',
            position: 'bottom',
            };
        }
        for (var i = 1; i < chart_data.length - 1; i++) {
          labels.push(chart_data[i]);
        }
        options = {
          indexAxis: 'y',
          scales: scales,
          elements: {
            bar: {
              borderWidth: 1,
            }
          },
          responsive: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: chart_values.pop()[0] + "/" + graphics_data
            },
            tooltip: {

            }
          }
        };
      break;
    }
    data = {
      labels: labels,
      datasets: datasets
    };
    chart_values.push(chart_data);
    graphics.chart(chart_values, id, graphics_data, data, labels, options, chart_type);
  },
  load_tables: function() {
    $(document).on('click', 'button[data-action="load_tables"]', function(){
      $('body').html('');
      $('body').html('<button data-action="load_tables">Загрузить</button>');
      $.ajax({
        url: '',
        method: 'POST',
        dataType: 'html',
        success: function(data) {
          $("body").append(data);
          $(document).off('change', 'select[data-action="Выберите таблицу"]');
          $(document).off('change', 'select[data-action="Выберите данные для сравнения"]');
          graphics.data_table();
        },
        error: function() {
          console.log("ошибка");
        }
      });
    })
  },
  data_table: function() {
    // fetch('').then(function(response) {
    //     if(response.status === 200){
    //         return response.text();
    //     }else{
    //         console.log('Подключения к сети нет ');
    //     }
    // }).then(function(result) {
		//   var parser = new DOMParser();
		//   var doc = parser.parseFromString(result, "text/html");
      // var section = $('section', doc); сюда вставить нужный id
      // var tables = $('table', doc);
      var values_array = [];
      var tables_array = [];
      var tr_array = [];
      var id_array = [];
      var tables = $('table');
      $('table:visible').each(function() {
        for (var i = 0; i < tables.length; i++) {
          var child = tables[i].childNodes;
          id_array.push(tables[i].attributes["id"].nodeValue);
          for (var j = 0; j < child.length; j++) {
            var sub_child = child[j].childNodes;
            for (var l = 0; l < sub_child.length; l++) {
              var HTML_value = sub_child[l].childNodes;
              for (var h = 0; h < HTML_value.length; h++) {
                values_array.push(HTML_value[h].innerText);
              }
              tr_array.push(values_array);
              values_array = [];
            }
          }
          tables_array.push(tr_array);
          tr_array = [];
        }
        return false
      });
      $("body").append('<br><label>Выберите таблицу:</label><select data-action="Выберите таблицу"><option value="Выберите таблицу">Выберите таблицу</option></select>');
      var insert_id = new Map();
      for (var i = 0; i < id_array.length; i++) {
        $('select[data-action="Выберите таблицу"]').append('<option value="'+ id_array[i] +'">' + id_array[i] + '</option>');
        insert_id.set(id_array[i], i);
      }
      id_array = insert_id;
      graphics.events(tables_array, id_array);
  }
}

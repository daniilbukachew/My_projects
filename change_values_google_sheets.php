<head>
<script src="/js/jquery.min.js"></script>
<script src="google_sheets_values.js" type="text/javascript"></script>
</head>
<?php
  error_reporting(E_ALL);
  ini_set('display_errors', 1);

  require_once change_values_google_sheets.php

  echo "<div id='region'><label>Выберите регион: </label><select id='region' data-action='Регион'>
                  <option value=''>Выберите регион</option>
                  <option value='регион 1'>регион 1</option>
                  <option value='регион 2'>регион 2</option>
                  <option value='регион 3'>регион 3</option>
                  <option value='регион 4'>регион 4</option>
                  <option value='регион 5'>регион 5</option>
                  <option value='all' disabled>Все регионы</option></select>
        </div>";
  echo "<br>";
  echo "<div material hidden><label>Выберите материал: </label><select id='material' data-action='Материал'>
                  <option>Выберите материал</option>
                  <option value='материал 1'>материал 1</option>
                  <option value='материал 2'>материал 2</option>
                  <option value='материал 3' disabled>материал 3</option>
                  <option value='материал 4' disabled>материал 4</option>
                  <option value='материал 5' disabled>материал 5</option>
                  <option value='материал 6' disabled>материал 6</option>
                  <option value='материал 7' disabled>материал 7</option>
                  <option value='материал 8' disabled>материал 8</option>
                  <option value='материал 9' disabled>материал 9</option></select>
        </div>";
  echo "<div Профнастил_type hidden><label>Выберите тип материала 1</label><select data-action='Тип материала' id='материал 1_type'>
                  <option></option>
                  <option value='Эконом'>Эконом</option>
                  <option value='Стандарт'>Стандарт</option>
                  <option value='Все типы материала 1'>Все типы материала 1</option></select>
        </div>";
  echo "<div Евроштакетник_type hidden><label>Выберите тип евроштакетника: </label><select data-action='Тип материала' id='Евроштакетник_type'>
                  <option></option>
                  <option value='Стандарт'>Стандарт</option>
                  <option value='Шахматка'>Шахматка</option>
                  <option value='Горизонтальный'>Горизонтальный</option>
                  <option value='Горизонтальный односторонний'>Горизонтальный односторонний</option>
                  <option value='Все типы евроштакетника'>Все типы евроштакетника</option></select>
        </div>";
  if ($_POST !== []) {
    $operation = $_POST['operation'];
    prices::$operation();
  }
  echo "<br>";
  echo "<div id='action' hidden><label>Действие: </label>
    <select id='action' data-action='Выберите действие'>
            <option></option>
            <option value='+'>+</option>
            <option value='-'>-</option>
            <option value='%+'>%+</option>
            <option value='%-'>%-</option>
    </select>
  </div>";
  echo "<div id='input-num' hidden><label>Число: </label><input id='input-num' data-action='Введите число'></div>";
  echo "<br>";
  echo "<div id='change_price' hidden><button id='change_price' data-action='Изменить цену'>Изменить</button></div>";

?>

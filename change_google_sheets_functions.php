<?php
date_default_timezone_set('Europe/Moscow');

class prices {
  public static function load_price() {
    $data = $_POST['price'];
    $data = json_decode($data, true);
    foreach ($data as $key => $value) {
      $data[$key] = substr($data[$key], 1,-1);
      $data[$key] = explode(',', $data[$key]);
      $data[$key] = str_replace('""', ' ', $value);
    }
    foreach ($data as $key => $value) {
      $data[$key] = substr($data[$key], 1,-1);
      $data[$key] = explode(',', $data[$key]);
    }
      $result = '';
    for ($i=0; $i < count($data); $i++) {
      ${"result$i"} = '';
      for ($j=0; $j < count($data[$i]); $j++) {
        ${"result$i"} .= '<td>' . $data[$i][$j] . '</td>';
      }
      $result .= '<tr>' . ${"result$i"} . '</tr>';
    }
    $result = '<table id=result_before>' . $result . '</table>';
    echo $result;
    $data = json_encode($data);
    echo "<div id=json_send hidden>$data</div>";
  }

  public static function change_price() {
    $region = $_POST['region'];
    $material = $_POST['material'];
    $material_type = $_POST['material_type'];
    $data = $_POST['price'];
    $action = $_POST['action'];
    $dif = $_POST['dif'];
    $data = json_decode($data, true);
    $result = '';
    for ($i=0; $i < count($data); $i++) {
      ${"result$i"} = '';
      for ($j=0; $j < count($data[$i]); $j++) {
        ${"result$i"} .= '<td>' . $data[$i][$j] . '</td>';
      }
      $result .= '<tr>' . ${"result$i"} . '</tr>';
    }
    $result = '<table id=result_before>' . $result . '</table>';
    echo "$result";
    $price = $data;
    unset($price[0]);
    for ($i=0; $i <= count($data) ; $i++) {
      unset($price[$i][0]);
    }
    $price = array_values($price);
    for ($i=0; $i < count($price); $i++) {
      $price[$i] = array_values($price[$i]);
    }
    for ($i=0; $i < count($price); $i++) {
      for ($j=0; $j < count($price[$i]); $j++) {
        switch ($material_type) {
          case 'Евроштакетник Все типы евроштакетника':
            if ($j !== 4 &&
                $j !== 5 &&
                $j !== 8 &&
                $j !== 15 &&
                $j !== 19 &&
                $price[$i][$j] !== $price[18][16] &&
                $price[$i][$j] !== $price[27][20]) {
              if ($price[$i][$j] !== '' && ctype_digit($price[$i][$j])) {
                $price[$i][$j] = (int)$price[$i][$j];
                if ($action === '+') {
                  $price[$i][$j] = $price[$i][$j] + $dif;
                }
                elseif ($action === '-') {
                  $price[$i][$j] = $price[$i][$j] - $dif;
                }
                elseif ($action === '%+') {
                  $price[$i][$j] = $price[$i][$j] + $price[$i][$j]/100*$dif;
                  $price[$i][$j] = round($price[$i][$j], 0, PHP_ROUND_HALF_UP);
                }
                elseif ($action === '%-') {
                  $price[$i][$j] = $price[$i][$j] - $price[$i][$j]/$dif*$dif;
                  $price[$i][$j] = round($price[$i][$j], 0, PHP_ROUND_HALF_UP);
                }
              }
            }
            else {
              break;
            }
            break;
          default:
          if ($price[$i][$j] !== ' ' && ctype_digit($price[$i][$j])) {
            $price[$i][$j] = (int)$price[$i][$j];
            if ($action === '+') {
              $price[$i][$j] = $price[$i][$j] + $dif;
            }
            elseif ($action === '-') {
              $price[$i][$j] = $price[$i][$j] - $dif;
            }
            elseif ($action === '%+') {
              $price[$i][$j] = $price[$i][$j] + $price[$i][$j]/100*$dif;
              $price[$i][$j] = round($price[$i][$j], 0, PHP_ROUND_HALF_UP);
            }
            elseif ($action === '%-') {
              $price[$i][$j] = $price[$i][$j] - $price[$i][$j]/$dif*$dif;
              $price[$i][$j] = round($price[$i][$j], 0, PHP_ROUND_HALF_UP);
            }
          }
            break;
        }
      }
    }
    $send_price = $price;

    for ($i=0; $i < count($price); $i++) {
      array_unshift($price[$i], $data[$i+1][0]);
    }
    array_unshift($price, $data[0]);
    $result = '';
    for ($i=0; $i < count($price); $i++) {
      ${"result$i"} = '';
      for ($j=0; $j < count($price[$i]); $j++) {
        ${"result$i"} .= '<td>' . $price[$i][$j] . '</td>';
      }
      $result .= '<tr>' . ${"result$i"} . '</tr>';
    }
    $result = '<table id=result_after>' . $result . '</table>';
    echo "$result";
    prices::send_price($send_price, $region, $material, $material_type);
  }

  public static function send_price($send_price, $region, $material, $material_type) {

    require_once $_SERVER['DOCUMENT_ROOT'] . 'prices/google-client/vendor/autoload.php';

    $googleAccountKeyFilePath = $_SERVER['DOCUMENT_ROOT'] . 'prices/php/key.json';

    putenv('GOOGLE_APPLICATION_CREDENTIALS=' .$googleAccountKeyFilePath);

    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->addScope('https://www.googleapis.com/auth/spreadsheets');

    $service = new Google_Service_Sheets($client);
    $spreadsheetId_array = array(
      '77' => 'spreadsheetId_key',
      '78' => 'spreadsheetId_key',
      '36' => 'spreadsheetId_key',
      '52' => 'spreadsheetId_key',
      '16' => 'spreadsheetId_key');
    $spreadsheetId = $spreadsheetId_array[$region];
    $range_sheet_array = array(
      'Профнастил Эконом' => 'B3:E8',
      'Профнастил Стандарт' => 'L3:P8',
      'Профнастил Все типы профнастила' => 'B3:P8',
      'Евроштакетник Стандарт' => 'B4:E41',
      'Евроштакетник Шахматка' => 'K4:L41',
      'Евроштакетник Горизонтальный' => 'R4:S20',
      'Евроштакетник Горизонтальный односторонний' => 'V4:Y27',
      'Евроштакетник Все типы евроштакетника' => 'B4:Y41');
    $range = $material . '!' . $range_sheet_array[$material_type];

    $time = date("d-m-Y H:i");
    for ($i=0; $i < count($send_price); $i++) {
      $values[$i] = array();
      for ($j=0; $j < count($send_price[$i]); $j++) {
        array_push ($values[$i], $send_price[$i][$j]);
      }
    }
    $body = new Google_Service_Sheets_ValueRange(['values' => $values]);
    $options = array('valueInputOption' => 'USER_ENTERED');

    $service->spreadsheets_values->update($spreadsheetId, $range, $body,$options);
  }
}

?>

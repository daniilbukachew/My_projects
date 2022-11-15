<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('Europe/Moscow');
header('Content-Type: text/html; charset=utf-8');

require_once $_SERVER['DOCUMENT_ROOT'] . '/php/authorize.php';

////Используется две таблицы. Таблица "news" для просмотра самих новостей и "user_news" для списка просмотревших.
////"news" имеет поля "news_id" INT NOT NULL AUTO_INCREMENT - id новости, "news_date" DATETIME CURRENT TIME_STAMP - время новости, добавляемое автоматически, "news" TEXT NOT NULL - сам текст новости, "news_author_id" INT (связан ключом с id из fencer_users) - id пользователя, добавившего новость. "user_news" имеет поля "user_viewed_id" int not null (ключ от id из fencer_users),"news_viewed_id" - ключ от id новости из предыдущей таблицы,"count_view" tinyint - указывает, что пользователь просмотрел новость (будет принимать значение 1).
//В классе news 4 функции: insert_news() - добавляет новость в БД; show_news() - выводит на экран саму новость, автора её и отметку от просмотре; view_news() - добавляет в БД информацию о просмотре новости и count_news() - возвращает пользователю число непрочитанных новостей.
// $operation = '';
// $operation = $_POST['operation'];
// news::$operation;

class news {
  
	public static function insert_news () {
		$news = ($_POST['news']);
		$news_author_id = $_COOKIE['user_id'];
		$title = ($_POST['news_title']);
		$add_data = array('news_title' => $title,'news' => $news, 'news_author_id' => 	$news_author_id);
		DB::insert_array('news', $add_data);
		self::show_news();
	}

  public static function show_news () {
    $user = $COOKIE['user_id'];
    $news = DB::query("SELECT n.news_id, n.news_date, n.news, f_u.manager, u_n.news_viewed_id AS viewed FROM news AS n LEFT JOIN (SELECT id, manager FROM fencer_users) AS f_u ON f_u.id = n.news_author_id LEFT JOIN (SELECT * FROM user_news WHERE user_viewed_id = $user) AS u_n ON n.news_id = u_n.news_viewed_id ORDER BY n.news_date DESC");

		$result = "";
		foreach ($news as $key => $value) {
      $news_id = $value['news_id'];
      $count_viewed_array = DB::query("SELECT COUNT(news_viewed_id) FROM user_news WHERE news_viewed_id = $news_id");
      $count_viewed = $count_viewed_array[0]['COUNT(news_viewed_id)'];
      $viewed_user_array = DB::query("SELECT manager FROM user_news LEFT JOIN fencer_users ON user_news.user_viewed_id = fencer_users.id WHERE news_viewed_id = $news_id");
      for ($i=0; $i <=$count_viewed ; $i++) {
        $viewed_user .= $viewed_user_array[$i]['manager'];
        $viewed_user = $viewed_user . ", ";
      };
      $viewed_user = substr($viewed_user, 0, -4);
			$date_time = $value['news_date'];
			$news_title = $value['news_title'];
			$news_author = $value['manager'];
			$news_text = $value['news'];
			$result .=  '<section class="news_show">
									<div class="news_one">
									<h3>' . $news_title . '</h3>
									<div>' . $news_text . '</div>
									<div class="news_footer_left">' . $news_author . '</div>
									<div class="news_footer_right">' . $date_time . '</div>
                  <div class="news_footer_right">Просмотрели: ' . $viewed_user . '</div>
									</div>
									</section>';
      unset($viewed_user);
		}
			echo $result;
	}

  public static function view_news () {
    $news_id = ($_POST['news']);
    $view = $_POST['view'];
    $user_id = $_COOKIE['user_id'];
    if ($view === 1) {
      DB::query ("INSERT INTO user_news VALUES ($user_id, $news_id, 1)");
    }
  }

  public static function count_news () {
    $news_id = ($_POST['news']);
    $type = $_POST['view'];
    $user_id = $_COOKIE['user_id'];
    $count_array= DB::single_query("SELECT COUNT(news_id) AS count_unviewed FROM news LEFT JOIN user_news ON news.news_id = user_news.news_viewed_id WHERE news_id NOT IN (SELECT news_viewed_id FROM user_news WHERE user_viewed_id = $user_id)");
    $count = $count_array['count_unviewed'];
		echo $count;
  }
}

?>

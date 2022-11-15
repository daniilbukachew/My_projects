<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Стили</title>
    <link rel="stylesheet" href="/style/style.css">
    <script src="/js/jquery.min.js"></script>
    <script src="/js/jquery.cookies.js"></script>
    <script src="/news/count_news.js" type="text/javascript"></script>
  </head>
  <body>
    <section class="news_form_insert">
      <form name="authForm" method="post" action="<?=$_SERVER["PHP_SELF"]?>">
        <div class="news_one_form_insert">
          <h3 id="news-title"><input type="text" name="news_title" placeholder="Введите заголовок новости"></h3>
          <div><textarea type="text" name="news" placeholder="Введите текст новости"></textarea><br><br></div>
          <div class="news_footer_left_form_insert" id="news-submit"><input type="submit"></div>
        </div>
      </form>
    </section>

    <?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/php/authorize.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/news/test_class_news.php';
    news::insert_news();
    ?>
  </body>
</html>

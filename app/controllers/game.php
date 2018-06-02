<?php
echo "0";
$newsMng = new NewsManager();
echo "1";
$lastNewsNumber = $newsMng->getLastNewsNumber();
echo "2";
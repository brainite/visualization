<?php
if (isset($_SERVER['REQUEST_METHOD'])) {
  echo "Visualize!";
  exit;
}

chdir(__DIR__);
system('yui-compressor visualization.js  > visualization.min.js');

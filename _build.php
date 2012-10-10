<?php
if (isset($_SERVER['REQUEST_METHOD'])) {
  echo "Visualize!";
  exit;
}

chdir(__DIR__);

$js_files = array(
  'visualization.js' => 'visualization.min.js',
);
foreach ($js_files as $src => $min) {
  system("yui-compressor '$src'  > '$min'");
  $src_js = trim(file_get_contents($src));
  if (substr($src_js, 0, 2) !== '/*') {
    continue;
  }
  $src_parts = preg_split('@\n\s*\n@s', $src_js, 2);
  $min_js = file_get_contents($min);
  $min_js = array_shift($src_parts) . "\n" . $min_js;
  file_put_contents($min, $min_js);
}

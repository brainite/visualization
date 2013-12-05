<?php
if (isset($_SERVER['REQUEST_METHOD'])) {
  echo "Visualize!";
  exit;
}

chdir(__DIR__);

// Handle the JS files.
$js_files = array(
  'visualization.js' => 'visualization.min.js',
);
foreach ($js_files as $src_path => $min_path) {
  // Select a temp path.
  $tmp_path = str_replace('.min.', '.tmp.', $min_path);

  // Load the source.
  $src_js = trim(file_get_contents($src_path));
  $src_docblock = '';
  if (substr($src_js, 0, 2) === '/*') {
    $src_parts = preg_split('@\n\s*\n@s', $src_js, 2);
    $src_docblock = array_shift($src_parts) . "\n";
  }

  // Remove code from production.
  $parts = explode('<witti:remove', $src_js);
  $src_js = array_shift($parts);
  $removes = array();
  foreach ($parts as $part) {
    $part = explode('</witti:remove>', $part, 2);
    $src_js .= $part[1];
    $part = explode('>', $part[0], 2);
    if (trim($part[0]) !== '') {
      $removes[] = simplexml_load_string('<root ' . $part[0] . ' />');
    }
  }
  foreach ($removes as $remove) {
    if (isset($remove['match'])) {
      $src_js = preg_replace((string) $remove['match'], '', $src_js);
    }
  }

  // Save the source JS to the temp path.
  file_put_contents($tmp_path, $src_js);

  // Minify and then prepend the docblock.
  system("yui-compressor '$tmp_path'  > '$min_path'");
  if ($src_docblock) {
    $min_js = file_get_contents($min_path);
    $min_js = $src_docblock . $min_js;
    file_put_contents($min_path, $min_js);
  }
  unlink($tmp_path);
}

// Handle the git tag and version
$version_git = trim(`git tag`);
$version_js = 'v0';
reset($js_files);
$version_js_tmp = file_get_contents(key($js_files));
if (preg_match('~@version\s+([\d\.]+)\s~s', $version_js_tmp, $arr)) {
  $version_js = 'v' . $arr[1];
}
if ($version_js !== $version_git) {
  echo "Remember to tag this release.\n";
  $cmd = "git tag -a $version_js -m 'version $version_js'";
  echo "$cmd\n";
  $cmd = "git tag -d $version_git";
  echo "$cmd\n";
  $cmd = "git push origin --tags";
  echo "$cmd\n";
}

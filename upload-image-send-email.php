<?php
error_reporting(E_ALL);
ini_set('display_errors', True);

$data = $_POST['image'];
$email = $_POST['email'];
if (filter_var($email, FILTER_VALIDATE_EMAIL) === False) {
	header("HTTP/1.1 400 Iternal Server Error");
	exit("Invalid Email");
}

$file = 'photos/' . md5(uniqid()) . '.png';

// remove "data:image/png;base64,"
$uri =  substr($data,strpos($data,",")+1);

// save to file
$success = file_put_contents($file, base64_decode($uri));
if($success === FALSE) {
	header("HTTP/1.1 500 Iternal Server Error");
	exit("Internal error");
}
$url = "http://benjamin-hansen.com/baroque/" . $file;
$to      = $email;
$subject = 'Your Baroque Photo';
$message = "Thank you for trying \"Baroquesize Yourself\".<br>\r\n" .
	"Your can view and download your photo by going to the URL below:<br>\r\n" .
	"<a href='" . $url . "'>" . $url . "</a>";

$headers = 'From: webmaster@benjamin-hansen.com' . "\r\n" .
    'Reply-To: webmaster@benjamin-hansen.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion() . "\r\n" .
    "MIME-Version: 1.0\r\n" .
    "Content-Type: text/html; charset=ISO-8859-1\r\n";

$success = mail($to, $subject, $message, $headers);
if($success === FALSE) {
	header("HTTP/1.1 500 Iternal Server Error");
	exit("Internal error");
}
// return the filename
echo $file;
?>

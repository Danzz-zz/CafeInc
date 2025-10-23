<?php
/**
 * CafeInc Contact Form Handler
 * This PHP script handles contact form submissions with validation and email functionality
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set response header to JSON
header('Content-Type: application/json');

// Initialize response array
$response = array(
    'success' => false,
    'message' => ''
);

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method. Please use POST.';
    echo json_encode($response);
    exit;
}

// Sanitize and validate input function
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Validate email function
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Validate phone function
function validatePhone($phone) {
    // Remove all non-numeric characters except +
    $cleaned = preg_replace('/[^0-9+]/', '', $phone);
    // Check if length is reasonable (8-15 digits)
    return strlen($cleaned) >= 8 && strlen($cleaned) <= 15;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Validation errors array
$errors = array();

// Validate Name
if (empty($name)) {
    $errors['name'] = 'Name is required';
} elseif (strlen($name) < 3) {
    $errors['name'] = 'Name must be at least 3 characters long';
} elseif (strlen($name) > 100) {
    $errors['name'] = 'Name must not exceed 100 characters';
}

// Validate Email
if (empty($email)) {
    $errors['email'] = 'Email is required';
} elseif (!validateEmail($email)) {
    $errors['email'] = 'Invalid email format';
}

// Validate Phone
if (empty($phone)) {
    $errors['phone'] = 'Phone number is required';
} elseif (!validatePhone($phone)) {
    $errors['phone'] = 'Invalid phone number format';
}

// Validate Message
if (empty($message)) {
    $errors['message'] = 'Message is required';
} elseif (strlen($message) < 10) {
    $errors['message'] = 'Message must be at least 10 characters long';
} elseif (strlen($message) > 1000) {
    $errors['message'] = 'Message must not exceed 1000 characters';
}

// If there are validation errors, return them
if (!empty($errors)) {
    $response['message'] = 'Validation failed';
    $response['errors'] = $errors;
    echo json_encode($response);
    exit;
}

// All validations passed, process the form
try {
    // Save to database (example - uncomment if you have database)
    /*
    $servername = "localhost";
    $username = "your_username";
    $password = "your_password";
    $dbname = "cafeinc_db";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssss", $name, $email, $phone, $message);

    // Execute statement
    if (!$stmt->execute()) {
        throw new Exception("Error saving to database: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
    */

    // Save to text file as fallback (for demonstration)
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "==========================================\n";
    $logEntry .= "Submission Date: $timestamp\n";
    $logEntry .= "Name: $name\n";
    $logEntry .= "Email: $email\n";
    $logEntry .= "Phone: $phone\n";
    $logEntry .= "Message: $message\n";
    $logEntry .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $logEntry .= "==========================================\n\n";

    // Create logs directory if it doesn't exist
    if (!file_exists('logs')) {
        mkdir('logs', 0755, true);
    }

    // Write to log file
    $logFile = 'logs/contact_submissions.txt';
    if (file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX) === false) {
        throw new Exception("Failed to write to log file");
    }

    // Send email notification (configure your email settings)
    $to = "admin@cafeinc.com"; // Change to your email
    $subject = "New Contact Form Submission - CafeInc";
    
    $emailBody = "New contact form submission from CafeInc website:\n\n";
    $emailBody .= "Name: $name\n";
    $emailBody .= "Email: $email\n";
    $emailBody .= "Phone: $phone\n";
    $emailBody .= "Message:\n$message\n\n";
    $emailBody .= "Submitted on: $timestamp\n";
    $emailBody .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

    $headers = "From: noreply@cafeinc.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Attempt to send email (may fail if mail server not configured)
    @mail($to, $subject, $emailBody, $headers);

    // Send auto-reply to customer
    $customerSubject = "Thank you for contacting CafeInc!";
    $customerBody = "Dear $name,\n\n";
    $customerBody .= "Thank you for reaching out to CafeInc. We have received your message and will get back to you as soon as possible.\n\n";
    $customerBody .= "Your message:\n$message\n\n";
    $customerBody .= "Best regards,\n";
    $customerBody .= "The CafeInc Team\n";
    $customerBody .= "Where Every Cup Tells a Story ☕\n";

    $customerHeaders = "From: CafeInc <noreply@cafeinc.com>\r\n";
    $customerHeaders .= "X-Mailer: PHP/" . phpversion();

    @mail($email, $customerSubject, $customerBody, $customerHeaders);

    // Success response
    $response['success'] = true;
    $response['message'] = 'Thank you for your message! We will get back to you soon.';
    $response['data'] = array(
        'name' => $name,
        'email' => $email,
        'timestamp' => $timestamp
    );

} catch (Exception $e) {
    // Error handling
    $response['success'] = false;
    $response['message'] = 'An error occurred while processing your request. Please try again later.';
    
    // Log error (in production, you might want to log this to a file)
    error_log("Contact form error: " . $e->getMessage());
}

// Return JSON response
echo json_encode($response);

// Optional: Rate limiting to prevent spam
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $rateLimitFile = 'logs/rate_limit.json';
    $maxSubmissions = 5; // Maximum submissions
    $timeWindow = 3600; // Time window in seconds (1 hour)
    
    if (!file_exists('logs')) {
        mkdir('logs', 0755, true);
    }
    
    // Load existing rate limit data
    $rateLimitData = array();
    if (file_exists($rateLimitFile)) {
        $rateLimitData = json_decode(file_get_contents($rateLimitFile), true);
    }
    
    $currentTime = time();
    
    // Clean old entries
    if (isset($rateLimitData[$ip])) {
        $rateLimitData[$ip] = array_filter($rateLimitData[$ip], function($timestamp) use ($currentTime, $timeWindow) {
            return ($currentTime - $timestamp) < $timeWindow;
        });
    } else {
        $rateLimitData[$ip] = array();
    }
    
    // Check if limit exceeded
    if (count($rateLimitData[$ip]) >= $maxSubmissions) {
        return false;
    }
    
    // Add current submission
    $rateLimitData[$ip][] = $currentTime;
    
    // Save rate limit data
    file_put_contents($rateLimitFile, json_encode($rateLimitData), LOCK_EX);
    
    return true;
}

// Uncomment to enable rate limiting
/*
if (!checkRateLimit()) {
    $response['success'] = false;
    $response['message'] = 'Too many submissions. Please try again later.';
    echo json_encode($response);
    exit;
}
*/

?>

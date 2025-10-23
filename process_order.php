<?php
header('Content-Type: application/json');

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to validate phone number (Indonesian format)
function validatePhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    return preg_match('/^(08|62)\d{8,11}$/', $phone);
}

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Get and sanitize form data
$customerName = sanitizeInput($_POST['customer_name'] ?? '');
$customerEmail = sanitizeInput($_POST['customer_email'] ?? '');
$customerPhone = sanitizeInput($_POST['customer_phone'] ?? '');
$customerAddress = sanitizeInput($_POST['customer_address'] ?? '');
$paymentMethod = sanitizeInput($_POST['payment_method'] ?? '');
$orderNotes = sanitizeInput($_POST['order_notes'] ?? '');
$orderData = $_POST['order_data'] ?? '';
$orderTotal = sanitizeInput($_POST['order_total'] ?? '0');

// Validation
$errors = [];

// Validate name
if (empty($customerName) || strlen($customerName) < 3) {
    $errors[] = 'Name must be at least 3 characters';
}

// Validate email
if (!validateEmail($customerEmail)) {
    $errors[] = 'Invalid email address';
}

// Validate phone
if (!validatePhone($customerPhone)) {
    $errors[] = 'Invalid phone number';
}

// Validate address
if (empty($customerAddress) || strlen($customerAddress) < 10) {
    $errors[] = 'Please provide a complete delivery address';
}

// Validate payment method
$validPaymentMethods = ['cash', 'card', 'transfer', 'qris'];
if (!in_array($paymentMethod, $validPaymentMethods)) {
    $errors[] = 'Invalid payment method';
}

// Validate order data
$orderItems = json_decode($orderData, true);
if (empty($orderItems) || !is_array($orderItems)) {
    $errors[] = 'Order data is invalid or empty';
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $errors)
    ]);
    exit;
}

// Generate order ID
$orderId = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));

// Calculate delivery fee and grand total
$deliveryFee = 10000;
$grandTotal = intval($orderTotal) + $deliveryFee;

// Prepare order details
$orderDetails = [
    'order_id' => $orderId,
    'timestamp' => date('Y-m-d H:i:s'),
    'customer' => [
        'name' => $customerName,
        'email' => $customerEmail,
        'phone' => $customerPhone,
        'address' => $customerAddress
    ],
    'payment_method' => $paymentMethod,
    'order_notes' => $orderNotes,
    'items' => $orderItems,
    'subtotal' => intval($orderTotal),
    'delivery_fee' => $deliveryFee,
    'grand_total' => $grandTotal
];

// Save order to file (you can replace this with database insertion)
$ordersDir = __DIR__ . '/orders';
if (!file_exists($ordersDir)) {
    mkdir($ordersDir, 0777, true);
}

$orderFile = $ordersDir . '/' . $orderId . '.json';
file_put_contents($orderFile, json_encode($orderDetails, JSON_PRETTY_PRINT));

// Also append to orders log
$logFile = $ordersDir . '/orders_log.txt';
$logEntry = sprintf(
    "[%s] Order %s - Customer: %s - Total: Rp %s - Payment: %s\n",
    date('Y-m-d H:i:s'),
    $orderId,
    $customerName,
    number_format($grandTotal),
    strtoupper($paymentMethod)
);
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Prepare email content
$emailSubject = "Order Confirmation - $orderId";
$emailMessage = "Dear $customerName,\n\n";
$emailMessage .= "Thank you for your order at CafeInc!\n\n";
$emailMessage .= "Order Details:\n";
$emailMessage .= "Order ID: $orderId\n";
$emailMessage .= "Date: " . date('d F Y, H:i') . "\n\n";
$emailMessage .= "Items:\n";

foreach ($orderItems as $item) {
    $itemTotal = $item['price'] * $item['quantity'];
    $emailMessage .= sprintf(
        "- %s x%d @ Rp %s = Rp %s\n",
        $item['name'],
        $item['quantity'],
        number_format($item['price']),
        number_format($itemTotal)
    );
}

$emailMessage .= "\nSubtotal: Rp " . number_format($orderTotal) . "\n";
$emailMessage .= "Delivery Fee: Rp " . number_format($deliveryFee) . "\n";
$emailMessage .= "Grand Total: Rp " . number_format($grandTotal) . "\n\n";
$emailMessage .= "Payment Method: " . strtoupper($paymentMethod) . "\n";
$emailMessage .= "Delivery Address: $customerAddress\n";

if (!empty($orderNotes)) {
    $emailMessage .= "\nSpecial Instructions:\n$orderNotes\n";
}

$emailMessage .= "\n\nWe will contact you shortly to confirm your order.\n\n";
$emailMessage .= "Thank you for choosing CafeInc!\n\n";
$emailMessage .= "Best Regards,\nCafeInc Team";

// Email headers
$headers = "From: noreply@cafeinc.com\r\n";
$headers .= "Reply-To: contact@cafeinc.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email (Note: this requires a working mail server)
// Uncomment the line below if you have a mail server configured
// mail($customerEmail, $emailSubject, $emailMessage, $headers);

// Send success response
echo json_encode([
    'success' => true,
    'message' => 'Order placed successfully! Your order ID is ' . $orderId . '. We will contact you soon.',
    'order_id' => $orderId,
    'grand_total' => $grandTotal
]);
?>

try {
  $signup = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/signup' -Body (@{fullname='Smoke Tester';email='smoketest@example.com';password='Password123'} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Output "SIGNUP_SUCCESS: $($signup | ConvertTo-Json)"
} catch {
  Write-Output "SIGNUP_FAILED: $($_.Exception.Message)"
}
try {
  $login = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/login' -Body (@{email='smoketest@example.com';password='Password123'} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  $token = $login.token
  Write-Output "LOGIN_TOKEN: $token"
} catch {
  Write-Output "LOGIN_FAILED: $($_.Exception.Message)"
  exit 1
}
$headers = @{ Authorization = "Bearer $token" }
try {
  $wh = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/warehouses' -Headers $headers -Body (@{warehouseName='SmokeWH';warehouseLocation='CI'} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Output "WAREHOUSE_CREATED: $($wh | ConvertTo-Json)"
} catch {
  Write-Output "WAREHOUSE_FAILED: $($_.Exception.Message)"
}
try {
  $prod = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/products' -Headers $headers -Body (@{productName='Test Product';category='Test';quantityInStock=10;unitPrice=5.5;supplierName='Supplier';dateReceived='2026-05-29'} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Output "PRODUCT_CREATED: $($prod | ConvertTo-Json)"
} catch {
  Write-Output "PRODUCT_FAILED: $($_.Exception.Message)"
}
$products = Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/products' -Headers $headers
$warehouses = Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/warehouses' -Headers $headers
Write-Output "PRODUCTS_COUNT: $($products.Count); WAREHOUSES_COUNT: $($warehouses.Count)"
$productCode = $products[0].productCode
$warehouseCode = $warehouses[0].warehouseCode
try {
  $trans = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/transactions' -Headers $headers -Body (@{transactionDate='2026-05-29';quantityMoved=2;transactionType='Stock Out';productCode=$productCode;warehouseCode=$warehouseCode} | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Output "TRANSACTION_CREATED: $($trans | ConvertTo-Json)"
} catch {
  Write-Output "TRANSACTION_FAILED: $($_.Exception.Message)"
}
$report = Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/reports/inventory' -Headers $headers
Write-Output "REPORT_ROWS: $($report.Count)"

# OpenapiJsClient.DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addCategory**](DefaultApi.md#addCategory) | **POST** /category/add | 添加商品分类
[**addCategory_0**](DefaultApi.md#addCategory_0) | **POST** /category/add | 添加商品分类
[**addNews**](DefaultApi.md#addNews) | **POST** /news/add | 添加新闻
[**addNews_0**](DefaultApi.md#addNews_0) | **POST** /news/add | 添加新闻
[**addProduct**](DefaultApi.md#addProduct) | **POST** /product/add | 添加商品
[**addProduct_0**](DefaultApi.md#addProduct_0) | **POST** /product/add | 添加商品
[**addReview**](DefaultApi.md#addReview) | **POST** /review/add | 添加评价
[**addReview_0**](DefaultApi.md#addReview_0) | **POST** /review/add | 添加评价
[**addUser**](DefaultApi.md#addUser) | **POST** /user/add | 创建用户
[**addUser_0**](DefaultApi.md#addUser_0) | **POST** /user/add | 创建用户
[**adminListOrders**](DefaultApi.md#adminListOrders) | **GET** /order/admin/list | 获取所有订单
[**adminListOrders_0**](DefaultApi.md#adminListOrders_0) | **GET** /order/admin/list | 获取所有订单
[**adminListProducts**](DefaultApi.md#adminListProducts) | **GET** /product/admin/list | 管理员获取所有商品列表
[**adminListProducts_0**](DefaultApi.md#adminListProducts_0) | **GET** /product/admin/list | 管理员获取所有商品列表
[**adminListReviews**](DefaultApi.md#adminListReviews) | **GET** /review/admin/list | 管理员获取所有评价列表
[**adminListReviews_0**](DefaultApi.md#adminListReviews_0) | **GET** /review/admin/list | 管理员获取所有评价列表
[**adminListTradeRecords**](DefaultApi.md#adminListTradeRecords) | **GET** /trade-record/admin/list | 获取所有交易记录
[**adminListTradeRecords_0**](DefaultApi.md#adminListTradeRecords_0) | **GET** /trade-record/admin/list | 获取所有交易记录
[**advancedSearchProducts**](DefaultApi.md#advancedSearchProducts) | **GET** /product/advanced-search | 高级搜索商品
[**advancedSearchProducts_0**](DefaultApi.md#advancedSearchProducts_0) | **GET** /product/advanced-search | 高级搜索商品
[**applyForExchange**](DefaultApi.md#applyForExchange) | **POST** /order/exchange/apply/{orderId} | 申请物品交换
[**applyForExchange_0**](DefaultApi.md#applyForExchange_0) | **POST** /order/exchange/apply/{orderId} | 申请物品交换
[**auditUser**](DefaultApi.md#auditUser) | **POST** /user/admin/audit | 审核用户
[**auditUser_0**](DefaultApi.md#auditUser_0) | **POST** /user/admin/audit | 审核用户
[**batchDeleteRejectedUsers**](DefaultApi.md#batchDeleteRejectedUsers) | **POST** /user/admin/rejected/delete-all | 批量删除已拒绝用户
[**batchDeleteRejectedUsers_0**](DefaultApi.md#batchDeleteRejectedUsers_0) | **POST** /user/admin/rejected/delete-all | 批量删除已拒绝用户
[**cancelOrder**](DefaultApi.md#cancelOrder) | **POST** /order/cancel/{orderId} | 取消订单
[**cancelOrder_0**](DefaultApi.md#cancelOrder_0) | **POST** /order/cancel/{orderId} | 取消订单
[**completeOrder**](DefaultApi.md#completeOrder) | **POST** /order/complete/{orderId} | 完成订单
[**completeOrder_0**](DefaultApi.md#completeOrder_0) | **POST** /order/complete/{orderId} | 完成订单
[**confirmExchange**](DefaultApi.md#confirmExchange) | **POST** /order/exchange/confirm/{orderId} | 确认物品交换
[**confirmExchange_0**](DefaultApi.md#confirmExchange_0) | **POST** /order/exchange/confirm/{orderId} | 确认物品交换
[**confirmOrder**](DefaultApi.md#confirmOrder) | **POST** /order/confirm | 确认订单
[**confirmOrder_0**](DefaultApi.md#confirmOrder_0) | **POST** /order/confirm | 确认订单
[**createOrder**](DefaultApi.md#createOrder) | **POST** /order/create | 创建订单
[**createOrder_0**](DefaultApi.md#createOrder_0) | **POST** /order/create | 创建订单
[**deleteCategory**](DefaultApi.md#deleteCategory) | **DELETE** /category/delete/{id} | 删除商品分类
[**deleteCategory_0**](DefaultApi.md#deleteCategory_0) | **DELETE** /category/delete/{id} | 删除商品分类
[**deleteNews**](DefaultApi.md#deleteNews) | **DELETE** /news/delete/{id} | 删除新闻
[**deleteNews_0**](DefaultApi.md#deleteNews_0) | **DELETE** /news/delete/{id} | 删除新闻
[**deleteProduct**](DefaultApi.md#deleteProduct) | **POST** /product/delete | 删除商品
[**deleteProduct_0**](DefaultApi.md#deleteProduct_0) | **POST** /product/delete | 删除商品
[**deleteReview**](DefaultApi.md#deleteReview) | **POST** /review/delete | 删除评价
[**deleteReview_0**](DefaultApi.md#deleteReview_0) | **POST** /review/delete | 删除评价
[**deleteUser**](DefaultApi.md#deleteUser) | **POST** /user/delete | 删除用户
[**deleteUser_0**](DefaultApi.md#deleteUser_0) | **POST** /user/delete | 删除用户
[**exchangeWithPoints**](DefaultApi.md#exchangeWithPoints) | **POST** /order/pay/points/{orderId} | 积分兑换商品
[**exchangeWithPoints_0**](DefaultApi.md#exchangeWithPoints_0) | **POST** /order/pay/points/{orderId} | 积分兑换商品
[**getActiveUsersRanking**](DefaultApi.md#getActiveUsersRanking) | **GET** /statistics/active-users | 获取活跃用户排行
[**getActiveUsersRanking_0**](DefaultApi.md#getActiveUsersRanking_0) | **GET** /statistics/active-users | 获取活跃用户排行
[**getAverageRating**](DefaultApi.md#getAverageRating) | **GET** /review/average/{productId} | 获取商品平均评分
[**getAverageRating_0**](DefaultApi.md#getAverageRating_0) | **GET** /review/average/{productId} | 获取商品平均评分
[**getCategoryList**](DefaultApi.md#getCategoryList) | **GET** /category/list | 获取所有商品分类
[**getCategoryList_0**](DefaultApi.md#getCategoryList_0) | **GET** /category/list | 获取所有商品分类
[**getComprehensiveStatistics**](DefaultApi.md#getComprehensiveStatistics) | **GET** /statistics/comprehensive | 获取综合统计信息
[**getComprehensiveStatistics_0**](DefaultApi.md#getComprehensiveStatistics_0) | **GET** /statistics/comprehensive | 获取综合统计信息
[**getHighDemandProducts**](DefaultApi.md#getHighDemandProducts) | **GET** /statistics/high-demand-products | 获取需求量大商品排行
[**getHighDemandProducts_0**](DefaultApi.md#getHighDemandProducts_0) | **GET** /statistics/high-demand-products | 获取需求量大商品排行
[**getHighInventoryProducts**](DefaultApi.md#getHighInventoryProducts) | **GET** /statistics/high-inventory-products | 获取闲置量大商品排行
[**getHighInventoryProducts_0**](DefaultApi.md#getHighInventoryProducts_0) | **GET** /statistics/high-inventory-products | 获取闲置量大商品排行
[**getLatestNews**](DefaultApi.md#getLatestNews) | **GET** /news/latest | 获取最新新闻
[**getLatestNews_0**](DefaultApi.md#getLatestNews_0) | **GET** /news/latest | 获取最新新闻
[**getLatestProducts**](DefaultApi.md#getLatestProducts) | **GET** /product/latest | 获取最新商品列表
[**getLatestProducts_0**](DefaultApi.md#getLatestProducts_0) | **GET** /product/latest | 获取最新商品列表
[**getLoginUser**](DefaultApi.md#getLoginUser) | **GET** /user/get/login | 获取当前登录用户
[**getLoginUser_0**](DefaultApi.md#getLoginUser_0) | **GET** /user/get/login | 获取当前登录用户
[**getMonthlyStatistics**](DefaultApi.md#getMonthlyStatistics) | **GET** /statistics/monthly | 获取月度统计数据
[**getMonthlyStatistics_0**](DefaultApi.md#getMonthlyStatistics_0) | **GET** /statistics/monthly | 获取月度统计数据
[**getMonthlyTopSellingProducts**](DefaultApi.md#getMonthlyTopSellingProducts) | **GET** /statistics/monthly-products | 获取月度交易商品排行
[**getMonthlyTopSellingProducts_0**](DefaultApi.md#getMonthlyTopSellingProducts_0) | **GET** /statistics/monthly-products | 获取月度交易商品排行
[**getMyReviewForProduct**](DefaultApi.md#getMyReviewForProduct) | **GET** /review/get/my/product/{productId} | 获取当前用户对商品的评价
[**getMyReviewForProduct_0**](DefaultApi.md#getMyReviewForProduct_0) | **GET** /review/get/my/product/{productId} | 获取当前用户对商品的评价
[**getNewsDetail**](DefaultApi.md#getNewsDetail) | **GET** /news/detail/{id} | 获取新闻详情
[**getNewsDetail_0**](DefaultApi.md#getNewsDetail_0) | **GET** /news/detail/{id} | 获取新闻详情
[**getNewsList**](DefaultApi.md#getNewsList) | **GET** /news/list | 分页获取新闻列表
[**getNewsList_0**](DefaultApi.md#getNewsList_0) | **GET** /news/list | 分页获取新闻列表
[**getOrderById**](DefaultApi.md#getOrderById) | **GET** /order/get/{orderId} | 获取订单详情
[**getOrderById_0**](DefaultApi.md#getOrderById_0) | **GET** /order/get/{orderId} | 获取订单详情
[**getOrderStatistics**](DefaultApi.md#getOrderStatistics) | **GET** /order/statistics | 获取订单统计信息
[**getOrderStatistics_0**](DefaultApi.md#getOrderStatistics_0) | **GET** /order/statistics | 获取订单统计信息
[**getPendingAuditUsers**](DefaultApi.md#getPendingAuditUsers) | **GET** /user/admin/pending | 获取待审核用户列表
[**getPendingAuditUsers_0**](DefaultApi.md#getPendingAuditUsers_0) | **GET** /user/admin/pending | 获取待审核用户列表
[**getProductById**](DefaultApi.md#getProductById) | **GET** /product/get/{id} | 获取商品详情
[**getProductById_0**](DefaultApi.md#getProductById_0) | **GET** /product/get/{id} | 获取商品详情
[**getProductTradeStatistics**](DefaultApi.md#getProductTradeStatistics) | **GET** /statistics/product/{productId} | 获取商品交易统计
[**getProductTradeStatistics_0**](DefaultApi.md#getProductTradeStatistics_0) | **GET** /statistics/product/{productId} | 获取商品交易统计
[**getRejectedUserCount**](DefaultApi.md#getRejectedUserCount) | **GET** /user/admin/rejected/count | 获取已拒绝用户数量
[**getRejectedUserCount_0**](DefaultApi.md#getRejectedUserCount_0) | **GET** /user/admin/rejected/count | 获取已拒绝用户数量
[**getReviewById**](DefaultApi.md#getReviewById) | **GET** /review/get/{id} | 获取评价详情
[**getReviewById_0**](DefaultApi.md#getReviewById_0) | **GET** /review/get/{id} | 获取评价详情
[**getReviewStatistics**](DefaultApi.md#getReviewStatistics) | **GET** /review/statistics/{productId} | 获取商品评价统计信息
[**getReviewStatistics_0**](DefaultApi.md#getReviewStatistics_0) | **GET** /review/statistics/{productId} | 获取商品评价统计信息
[**getTradeRecordDetail**](DefaultApi.md#getTradeRecordDetail) | **GET** /trade-record/get/{id} | 获取交易记录详情
[**getTradeRecordDetail_0**](DefaultApi.md#getTradeRecordDetail_0) | **GET** /trade-record/get/{id} | 获取交易记录详情
[**getUserById**](DefaultApi.md#getUserById) | **GET** /user/get | 根据ID获取用户
[**getUserById_0**](DefaultApi.md#getUserById_0) | **GET** /user/get | 根据ID获取用户
[**getUserReviewForProduct**](DefaultApi.md#getUserReviewForProduct) | **GET** /review/get/user/{userId}/product/{productId} | 获取用户对商品的评价
[**getUserReviewForProduct_0**](DefaultApi.md#getUserReviewForProduct_0) | **GET** /review/get/user/{userId}/product/{productId} | 获取用户对商品的评价
[**getUserTradeStatistics**](DefaultApi.md#getUserTradeStatistics) | **GET** /statistics/user/{userId} | 获取用户交易统计
[**getUserTradeStatistics_0**](DefaultApi.md#getUserTradeStatistics_0) | **GET** /statistics/user/{userId} | 获取用户交易统计
[**getUserVOById**](DefaultApi.md#getUserVOById) | **GET** /user/get/vo | 根据ID获取用户视图
[**getUserVOById_0**](DefaultApi.md#getUserVOById_0) | **GET** /user/get/vo | 根据ID获取用户视图
[**listBuyerOrders**](DefaultApi.md#listBuyerOrders) | **GET** /order/list/buyer | 获取买家订单列表
[**listBuyerOrdersByStatus**](DefaultApi.md#listBuyerOrdersByStatus) | **GET** /order/list/buyer/status/{status} | 根据状态获取买家订单列表
[**listBuyerOrdersByStatus_0**](DefaultApi.md#listBuyerOrdersByStatus_0) | **GET** /order/list/buyer/status/{status} | 根据状态获取买家订单列表
[**listBuyerOrders_0**](DefaultApi.md#listBuyerOrders_0) | **GET** /order/list/buyer | 获取买家订单列表
[**listBuyerTradeRecords**](DefaultApi.md#listBuyerTradeRecords) | **GET** /trade-record/list/buyer | 获取买家的交易记录列表
[**listBuyerTradeRecords_0**](DefaultApi.md#listBuyerTradeRecords_0) | **GET** /trade-record/list/buyer | 获取买家的交易记录列表
[**listMyProducts**](DefaultApi.md#listMyProducts) | **GET** /product/list/my | 获取当前用户发布的商品列表
[**listMyProducts_0**](DefaultApi.md#listMyProducts_0) | **GET** /product/list/my | 获取当前用户发布的商品列表
[**listMyReviews**](DefaultApi.md#listMyReviews) | **GET** /review/list/my | 获取当前用户的评价列表
[**listMyReviews_0**](DefaultApi.md#listMyReviews_0) | **GET** /review/list/my | 获取当前用户的评价列表
[**listProductByPage**](DefaultApi.md#listProductByPage) | **GET** /product/list/page | 分页获取商品列表
[**listProductByPage_0**](DefaultApi.md#listProductByPage_0) | **GET** /product/list/page | 分页获取商品列表
[**listProductsByCategory**](DefaultApi.md#listProductsByCategory) | **GET** /product/list/category/{categoryId} | 根据分类获取商品列表
[**listProductsByCategory_0**](DefaultApi.md#listProductsByCategory_0) | **GET** /product/list/category/{categoryId} | 根据分类获取商品列表
[**listReviewByPage**](DefaultApi.md#listReviewByPage) | **GET** /review/list/page | 分页获取评价列表
[**listReviewByPage_0**](DefaultApi.md#listReviewByPage_0) | **GET** /review/list/page | 分页获取评价列表
[**listReviewsByOrderId**](DefaultApi.md#listReviewsByOrderId) | **GET** /review/list/order/{orderId} | 根据订单ID获取评价列表
[**listReviewsByOrderId_0**](DefaultApi.md#listReviewsByOrderId_0) | **GET** /review/list/order/{orderId} | 根据订单ID获取评价列表
[**listReviewsByProductId**](DefaultApi.md#listReviewsByProductId) | **GET** /review/list/product/{productId} | 根据商品ID获取评价列表
[**listReviewsByProductId_0**](DefaultApi.md#listReviewsByProductId_0) | **GET** /review/list/product/{productId} | 根据商品ID获取评价列表
[**listReviewsByUserId**](DefaultApi.md#listReviewsByUserId) | **GET** /review/list/user/{userId} | 根据用户ID获取评价列表
[**listReviewsByUserId_0**](DefaultApi.md#listReviewsByUserId_0) | **GET** /review/list/user/{userId} | 根据用户ID获取评价列表
[**listSellerOrders**](DefaultApi.md#listSellerOrders) | **GET** /order/list/seller | 获取卖家订单列表
[**listSellerOrdersByStatus**](DefaultApi.md#listSellerOrdersByStatus) | **GET** /order/list/seller/status/{status} | 根据状态获取卖家订单列表
[**listSellerOrdersByStatus_0**](DefaultApi.md#listSellerOrdersByStatus_0) | **GET** /order/list/seller/status/{status} | 根据状态获取卖家订单列表
[**listSellerOrders_0**](DefaultApi.md#listSellerOrders_0) | **GET** /order/list/seller | 获取卖家订单列表
[**listSellerTradeRecords**](DefaultApi.md#listSellerTradeRecords) | **GET** /trade-record/list/seller | 获取卖家的交易记录列表
[**listSellerTradeRecords_0**](DefaultApi.md#listSellerTradeRecords_0) | **GET** /trade-record/list/seller | 获取卖家的交易记录列表
[**listUserByPage**](DefaultApi.md#listUserByPage) | **POST** /user/list/page | 分页获取用户列表
[**listUserByPage_0**](DefaultApi.md#listUserByPage_0) | **POST** /user/list/page | 分页获取用户列表
[**listUserProducts**](DefaultApi.md#listUserProducts) | **GET** /product/list/user/{userId} | 获取用户发布的商品列表
[**listUserProducts_0**](DefaultApi.md#listUserProducts_0) | **GET** /product/list/user/{userId} | 获取用户发布的商品列表
[**listUserVOByPage**](DefaultApi.md#listUserVOByPage) | **GET** /user/list/page/vo | 分页获取用户视图列表
[**listUserVOByPage_0**](DefaultApi.md#listUserVOByPage_0) | **GET** /user/list/page/vo | 分页获取用户视图列表
[**payOrder**](DefaultApi.md#payOrder) | **POST** /order/pay/{orderId} | 支付订单
[**payOrder_0**](DefaultApi.md#payOrder_0) | **POST** /order/pay/{orderId} | 支付订单
[**reviewProduct**](DefaultApi.md#reviewProduct) | **PUT** /product/review/{id} | 审核商品
[**reviewProduct_0**](DefaultApi.md#reviewProduct_0) | **PUT** /product/review/{id} | 审核商品
[**searchProducts**](DefaultApi.md#searchProducts) | **GET** /product/search | 搜索商品
[**searchProducts_0**](DefaultApi.md#searchProducts_0) | **GET** /product/search | 搜索商品
[**simulateWechatPay**](DefaultApi.md#simulateWechatPay) | **POST** /order/pay/wechat/{orderId} | 模拟微信支付
[**simulateWechatPay_0**](DefaultApi.md#simulateWechatPay_0) | **POST** /order/pay/wechat/{orderId} | 模拟微信支付
[**submitPaymentProof**](DefaultApi.md#submitPaymentProof) | **POST** /order/submit/proof | 提交支付凭证
[**submitPaymentProof_0**](DefaultApi.md#submitPaymentProof_0) | **POST** /order/submit/proof | 提交支付凭证
[**updateCategory**](DefaultApi.md#updateCategory) | **PUT** /category/update | 更新商品分类
[**updateCategory_0**](DefaultApi.md#updateCategory_0) | **PUT** /category/update | 更新商品分类
[**updateMyUser**](DefaultApi.md#updateMyUser) | **POST** /user/update/my | 更新个人信息
[**updateMyUser_0**](DefaultApi.md#updateMyUser_0) | **POST** /user/update/my | 更新个人信息
[**updateNews**](DefaultApi.md#updateNews) | **PUT** /news/update | 更新新闻
[**updateNews_0**](DefaultApi.md#updateNews_0) | **PUT** /news/update | 更新新闻
[**updateProduct**](DefaultApi.md#updateProduct) | **PUT** /product/update | 更新商品信息
[**updateProductStatus**](DefaultApi.md#updateProductStatus) | **PUT** /product/status/{id} | 更新商品状态
[**updateProductStatus_0**](DefaultApi.md#updateProductStatus_0) | **PUT** /product/status/{id} | 更新商品状态
[**updateProduct_0**](DefaultApi.md#updateProduct_0) | **PUT** /product/update | 更新商品信息
[**updateReview**](DefaultApi.md#updateReview) | **PUT** /review/update | 更新评价信息
[**updateReview_0**](DefaultApi.md#updateReview_0) | **PUT** /review/update | 更新评价信息
[**updateUser**](DefaultApi.md#updateUser) | **POST** /user/update | 更新用户
[**updateUser_0**](DefaultApi.md#updateUser_0) | **POST** /user/update | 更新用户
[**userLogin**](DefaultApi.md#userLogin) | **POST** /user/login | 用户登录
[**userLogin_0**](DefaultApi.md#userLogin_0) | **POST** /user/login | 用户登录
[**userLogout**](DefaultApi.md#userLogout) | **POST** /user/logout | 用户注销
[**userLogout_0**](DefaultApi.md#userLogout_0) | **POST** /user/logout | 用户注销
[**userRegister**](DefaultApi.md#userRegister) | **POST** /user/register | 用户注册
[**userRegister_0**](DefaultApi.md#userRegister_0) | **POST** /user/register | 用户注册



## addCategory

> BaseResponseLong addCategory(categoryAddRequest)

添加商品分类

管理员添加新的商品分类

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let categoryAddRequest = new OpenapiJsClient.CategoryAddRequest(); // CategoryAddRequest | 
apiInstance.addCategory(categoryAddRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **categoryAddRequest** | [**CategoryAddRequest**](CategoryAddRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addCategory_0

> BaseResponseLong addCategory_0(categoryAddRequest)

添加商品分类

管理员添加新的商品分类

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let categoryAddRequest = new OpenapiJsClient.CategoryAddRequest(); // CategoryAddRequest | 
apiInstance.addCategory_0(categoryAddRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **categoryAddRequest** | [**CategoryAddRequest**](CategoryAddRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addNews

> BaseResponseLong addNews(newsAddRequest)

添加新闻

管理员添加新的新闻

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let newsAddRequest = new OpenapiJsClient.NewsAddRequest(); // NewsAddRequest | 
apiInstance.addNews(newsAddRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newsAddRequest** | [**NewsAddRequest**](NewsAddRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addNews_0

> BaseResponseLong addNews_0(newsAddRequest)

添加新闻

管理员添加新的新闻

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let newsAddRequest = new OpenapiJsClient.NewsAddRequest(); // NewsAddRequest | 
apiInstance.addNews_0(newsAddRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newsAddRequest** | [**NewsAddRequest**](NewsAddRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addProduct

> BaseResponseLong addProduct(productAddRequest)

添加商品

用户添加新的商品

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productAddRequest = new OpenapiJsClient.ProductAddRequest(); // ProductAddRequest | 
apiInstance.addProduct(productAddRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productAddRequest** | [**ProductAddRequest**](ProductAddRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addProduct_0

> BaseResponseLong addProduct_0(productAddRequest)

添加商品

用户添加新的商品

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productAddRequest = new OpenapiJsClient.ProductAddRequest(); // ProductAddRequest | 
apiInstance.addProduct_0(productAddRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productAddRequest** | [**ProductAddRequest**](ProductAddRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addReview

> BaseResponseLong addReview(review)

添加评价

用户对已完成的订单进行评价

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let review = new OpenapiJsClient.Review(); // Review | 
apiInstance.addReview(review, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **review** | [**Review**](Review.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addReview_0

> BaseResponseLong addReview_0(review)

添加评价

用户对已完成的订单进行评价

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let review = new OpenapiJsClient.Review(); // Review | 
apiInstance.addReview_0(review, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **review** | [**Review**](Review.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addUser

> BaseResponseLong addUser(userAddRequest)

创建用户

管理员创建新用户

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userAddRequest = new OpenapiJsClient.UserAddRequest(); // UserAddRequest | 
apiInstance.addUser(userAddRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userAddRequest** | [**UserAddRequest**](UserAddRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## addUser_0

> BaseResponseLong addUser_0(userAddRequest)

创建用户

管理员创建新用户

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userAddRequest = new OpenapiJsClient.UserAddRequest(); // UserAddRequest | 
apiInstance.addUser_0(userAddRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userAddRequest** | [**UserAddRequest**](UserAddRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## adminListOrders

> BaseResponsePageOrder adminListOrders(opts)

获取所有订单

管理员获取所有订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'status': 56 // Number | 订单状态
};
apiInstance.adminListOrders(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **status** | **Number**| 订单状态 | [optional] 

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## adminListOrders_0

> BaseResponsePageOrder adminListOrders_0(opts)

获取所有订单

管理员获取所有订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'status': 56 // Number | 订单状态
};
apiInstance.adminListOrders_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **status** | **Number**| 订单状态 | [optional] 

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## adminListProducts

> BaseResponsePageProduct adminListProducts(opts)

管理员获取所有商品列表

管理员获取所有商品列表（包括未审核的）

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'keyword': "keyword_example", // String | 关键词
  'categoryId': 789, // Number | 分类ID
  'status': 56 // Number | 商品状态
};
apiInstance.adminListProducts(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **keyword** | **String**| 关键词 | [optional] 
 **categoryId** | **Number**| 分类ID | [optional] 
 **status** | **Number**| 商品状态 | [optional] 

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## adminListProducts_0

> BaseResponsePageProduct adminListProducts_0(opts)

管理员获取所有商品列表

管理员获取所有商品列表（包括未审核的）

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'keyword': "keyword_example", // String | 关键词
  'categoryId': 789, // Number | 分类ID
  'status': 56 // Number | 商品状态
};
apiInstance.adminListProducts_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **keyword** | **String**| 关键词 | [optional] 
 **categoryId** | **Number**| 分类ID | [optional] 
 **status** | **Number**| 商品状态 | [optional] 

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## adminListReviews

> BaseResponsePageReview adminListReviews(opts)

管理员获取所有评价列表

管理员获取所有评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'productId': 789, // Number | 商品ID
  'userId': 789, // Number | 用户ID
  'orderId': 789, // Number | 订单ID
  'minRating': 56, // Number | 最低评分
  'maxRating': 56 // Number | 最高评分
};
apiInstance.adminListReviews(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **productId** | **Number**| 商品ID | [optional] 
 **userId** | **Number**| 用户ID | [optional] 
 **orderId** | **Number**| 订单ID | [optional] 
 **minRating** | **Number**| 最低评分 | [optional] 
 **maxRating** | **Number**| 最高评分 | [optional] 

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## adminListReviews_0

> BaseResponsePageReview adminListReviews_0(opts)

管理员获取所有评价列表

管理员获取所有评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'productId': 789, // Number | 商品ID
  'userId': 789, // Number | 用户ID
  'orderId': 789, // Number | 订单ID
  'minRating': 56, // Number | 最低评分
  'maxRating': 56 // Number | 最高评分
};
apiInstance.adminListReviews_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **productId** | **Number**| 商品ID | [optional] 
 **userId** | **Number**| 用户ID | [optional] 
 **orderId** | **Number**| 订单ID | [optional] 
 **minRating** | **Number**| 最低评分 | [optional] 
 **maxRating** | **Number**| 最高评分 | [optional] 

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## adminListTradeRecords

> BaseResponsePageTradeRecord adminListTradeRecords(opts)

获取所有交易记录

管理员获取所有交易记录列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'tradeStatus': 56, // Number | 交易状态
  'startDate': new Date("2013-10-20T19:20:30+01:00"), // Date | 开始日期
  'endDate': new Date("2013-10-20T19:20:30+01:00") // Date | 结束日期
};
apiInstance.adminListTradeRecords(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **tradeStatus** | **Number**| 交易状态 | [optional] 
 **startDate** | **Date**| 开始日期 | [optional] 
 **endDate** | **Date**| 结束日期 | [optional] 

### Return type

[**BaseResponsePageTradeRecord**](BaseResponsePageTradeRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## adminListTradeRecords_0

> BaseResponsePageTradeRecord adminListTradeRecords_0(opts)

获取所有交易记录

管理员获取所有交易记录列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'tradeStatus': 56, // Number | 交易状态
  'startDate': new Date("2013-10-20T19:20:30+01:00"), // Date | 开始日期
  'endDate': new Date("2013-10-20T19:20:30+01:00") // Date | 结束日期
};
apiInstance.adminListTradeRecords_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **tradeStatus** | **Number**| 交易状态 | [optional] 
 **startDate** | **Date**| 开始日期 | [optional] 
 **endDate** | **Date**| 结束日期 | [optional] 

### Return type

[**BaseResponsePageTradeRecord**](BaseResponsePageTradeRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## advancedSearchProducts

> BaseResponsePageProduct advancedSearchProducts(opts)

高级搜索商品

多条件组合搜索商品，支持分类、价格、支付方式筛选和排序

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'keyword': "keyword_example", // String | 搜索关键词
  'categoryId': 789, // Number | 分类ID
  'minPrice': 3.4, // Number | 最低价格
  'maxPrice': 3.4, // Number | 最高价格
  'paymentMethod': 56, // Number | 支付方式 (0-现金, 1-微信, 2-积分, 3-交换)
  'sortField': "sortField_example", // String | 排序字段 (price/createtime/name)
  'sortOrder': "'desc'", // String | 排序顺序 (asc/desc)
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.advancedSearchProducts(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**| 搜索关键词 | [optional] 
 **categoryId** | **Number**| 分类ID | [optional] 
 **minPrice** | **Number**| 最低价格 | [optional] 
 **maxPrice** | **Number**| 最高价格 | [optional] 
 **paymentMethod** | **Number**| 支付方式 (0-现金, 1-微信, 2-积分, 3-交换) | [optional] 
 **sortField** | **String**| 排序字段 (price/createtime/name) | [optional] 
 **sortOrder** | **String**| 排序顺序 (asc/desc) | [optional] [default to &#39;desc&#39;]
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## advancedSearchProducts_0

> BaseResponsePageProduct advancedSearchProducts_0(opts)

高级搜索商品

多条件组合搜索商品，支持分类、价格、支付方式筛选和排序

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'keyword': "keyword_example", // String | 搜索关键词
  'categoryId': 789, // Number | 分类ID
  'minPrice': 3.4, // Number | 最低价格
  'maxPrice': 3.4, // Number | 最高价格
  'paymentMethod': 56, // Number | 支付方式 (0-现金, 1-微信, 2-积分, 3-交换)
  'sortField': "sortField_example", // String | 排序字段 (price/createtime/name)
  'sortOrder': "'desc'", // String | 排序顺序 (asc/desc)
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.advancedSearchProducts_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**| 搜索关键词 | [optional] 
 **categoryId** | **Number**| 分类ID | [optional] 
 **minPrice** | **Number**| 最低价格 | [optional] 
 **maxPrice** | **Number**| 最高价格 | [optional] 
 **paymentMethod** | **Number**| 支付方式 (0-现金, 1-微信, 2-积分, 3-交换) | [optional] 
 **sortField** | **String**| 排序字段 (price/createtime/name) | [optional] 
 **sortOrder** | **String**| 排序顺序 (asc/desc) | [optional] [default to &#39;desc&#39;]
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## applyForExchange

> BaseResponseBoolean applyForExchange(orderId)

申请物品交换

买家申请物品交换

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.applyForExchange(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## applyForExchange_0

> BaseResponseBoolean applyForExchange_0(orderId)

申请物品交换

买家申请物品交换

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.applyForExchange_0(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## auditUser

> BaseResponseBoolean auditUser(userAuditRequest)

审核用户

管理员审核用户申请

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userAuditRequest = new OpenapiJsClient.UserAuditRequest(); // UserAuditRequest | 
apiInstance.auditUser(userAuditRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userAuditRequest** | [**UserAuditRequest**](UserAuditRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## auditUser_0

> BaseResponseBoolean auditUser_0(userAuditRequest)

审核用户

管理员审核用户申请

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userAuditRequest = new OpenapiJsClient.UserAuditRequest(); // UserAuditRequest | 
apiInstance.auditUser_0(userAuditRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userAuditRequest** | [**UserAuditRequest**](UserAuditRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## batchDeleteRejectedUsers

> BaseResponseString batchDeleteRejectedUsers(userBatchDeleteRequest)

批量删除已拒绝用户

管理员一键删除所有已拒绝的用户账号

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userBatchDeleteRequest = new OpenapiJsClient.UserBatchDeleteRequest(); // UserBatchDeleteRequest | 
apiInstance.batchDeleteRejectedUsers(userBatchDeleteRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userBatchDeleteRequest** | [**UserBatchDeleteRequest**](UserBatchDeleteRequest.md)|  | 

### Return type

[**BaseResponseString**](BaseResponseString.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## batchDeleteRejectedUsers_0

> BaseResponseString batchDeleteRejectedUsers_0(userBatchDeleteRequest)

批量删除已拒绝用户

管理员一键删除所有已拒绝的用户账号

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userBatchDeleteRequest = new OpenapiJsClient.UserBatchDeleteRequest(); // UserBatchDeleteRequest | 
apiInstance.batchDeleteRejectedUsers_0(userBatchDeleteRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userBatchDeleteRequest** | [**UserBatchDeleteRequest**](UserBatchDeleteRequest.md)|  | 

### Return type

[**BaseResponseString**](BaseResponseString.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## cancelOrder

> BaseResponseBoolean cancelOrder(orderId)

取消订单

用户取消订单

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.cancelOrder(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## cancelOrder_0

> BaseResponseBoolean cancelOrder_0(orderId)

取消订单

用户取消订单

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.cancelOrder_0(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## completeOrder

> BaseResponseBoolean completeOrder(orderId)

完成订单

卖家或买家确认订单完成

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.completeOrder(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## completeOrder_0

> BaseResponseBoolean completeOrder_0(orderId)

完成订单

卖家或买家确认订单完成

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.completeOrder_0(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## confirmExchange

> BaseResponseBoolean confirmExchange(orderId)

确认物品交换

卖家确认物品交换

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.confirmExchange(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## confirmExchange_0

> BaseResponseBoolean confirmExchange_0(orderId)

确认物品交换

卖家确认物品交换

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.confirmExchange_0(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## confirmOrder

> BaseResponseBoolean confirmOrder(orderConfirmRequest)

确认订单

买家确认收货

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderConfirmRequest = new OpenapiJsClient.OrderConfirmRequest(); // OrderConfirmRequest | 
apiInstance.confirmOrder(orderConfirmRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderConfirmRequest** | [**OrderConfirmRequest**](OrderConfirmRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## confirmOrder_0

> BaseResponseBoolean confirmOrder_0(orderConfirmRequest)

确认订单

买家确认收货

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderConfirmRequest = new OpenapiJsClient.OrderConfirmRequest(); // OrderConfirmRequest | 
apiInstance.confirmOrder_0(orderConfirmRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderConfirmRequest** | [**OrderConfirmRequest**](OrderConfirmRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## createOrder

> BaseResponseLong createOrder(productId)

创建订单

用户创建新的订单，自动使用商品设置的支付方式

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 789; // Number | 商品ID
apiInstance.createOrder(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## createOrder_0

> BaseResponseLong createOrder_0(productId)

创建订单

用户创建新的订单，自动使用商品设置的支付方式

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 789; // Number | 商品ID
apiInstance.createOrder_0(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteCategory

> BaseResponseBoolean deleteCategory(id)

删除商品分类

管理员根据ID删除商品分类

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 分类ID
apiInstance.deleteCategory(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 分类ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteCategory_0

> BaseResponseBoolean deleteCategory_0(id)

删除商品分类

管理员根据ID删除商品分类

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 分类ID
apiInstance.deleteCategory_0(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 分类ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteNews

> BaseResponseBoolean deleteNews(id)

删除新闻

管理员根据ID删除新闻

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 新闻ID
apiInstance.deleteNews(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 新闻ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteNews_0

> BaseResponseBoolean deleteNews_0(id)

删除新闻

管理员根据ID删除新闻

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 新闻ID
apiInstance.deleteNews_0(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 新闻ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## deleteProduct

> BaseResponseBoolean deleteProduct(deleteRequest)

删除商品

用户删除自己的商品

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let deleteRequest = new OpenapiJsClient.DeleteRequest(); // DeleteRequest | 
apiInstance.deleteProduct(deleteRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteRequest** | [**DeleteRequest**](DeleteRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteProduct_0

> BaseResponseBoolean deleteProduct_0(deleteRequest)

删除商品

用户删除自己的商品

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let deleteRequest = new OpenapiJsClient.DeleteRequest(); // DeleteRequest | 
apiInstance.deleteProduct_0(deleteRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteRequest** | [**DeleteRequest**](DeleteRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteReview

> BaseResponseBoolean deleteReview(deleteRequest)

删除评价

用户删除自己的评价

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let deleteRequest = new OpenapiJsClient.DeleteRequest(); // DeleteRequest | 
apiInstance.deleteReview(deleteRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteRequest** | [**DeleteRequest**](DeleteRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteReview_0

> BaseResponseBoolean deleteReview_0(deleteRequest)

删除评价

用户删除自己的评价

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let deleteRequest = new OpenapiJsClient.DeleteRequest(); // DeleteRequest | 
apiInstance.deleteReview_0(deleteRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteRequest** | [**DeleteRequest**](DeleteRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteUser

> BaseResponseBoolean deleteUser(deleteRequest)

删除用户

管理员删除用户

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let deleteRequest = new OpenapiJsClient.DeleteRequest(); // DeleteRequest | 
apiInstance.deleteUser(deleteRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteRequest** | [**DeleteRequest**](DeleteRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## deleteUser_0

> BaseResponseBoolean deleteUser_0(deleteRequest)

删除用户

管理员删除用户

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let deleteRequest = new OpenapiJsClient.DeleteRequest(); // DeleteRequest | 
apiInstance.deleteUser_0(deleteRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deleteRequest** | [**DeleteRequest**](DeleteRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## exchangeWithPoints

> BaseResponseBoolean exchangeWithPoints(orderId)

积分兑换商品

使用积分兑换商品

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.exchangeWithPoints(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## exchangeWithPoints_0

> BaseResponseBoolean exchangeWithPoints_0(orderId)

积分兑换商品

使用积分兑换商品

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.exchangeWithPoints_0(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getActiveUsersRanking

> BaseResponseListUserRankingItem getActiveUsersRanking(startDate, endDate, opts)

获取活跃用户排行

获取指定时间范围内的活跃用户排行榜

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let startDate = new Date("2013-10-20T19:20:30+01:00"); // Date | 开始日期
let endDate = new Date("2013-10-20T19:20:30+01:00"); // Date | 结束日期
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getActiveUsersRanking(startDate, endDate, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **startDate** | **Date**| 开始日期 | 
 **endDate** | **Date**| 结束日期 | 
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListUserRankingItem**](BaseResponseListUserRankingItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getActiveUsersRanking_0

> BaseResponseListUserRankingItem getActiveUsersRanking_0(startDate, endDate, opts)

获取活跃用户排行

获取指定时间范围内的活跃用户排行榜

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let startDate = new Date("2013-10-20T19:20:30+01:00"); // Date | 开始日期
let endDate = new Date("2013-10-20T19:20:30+01:00"); // Date | 结束日期
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getActiveUsersRanking_0(startDate, endDate, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **startDate** | **Date**| 开始日期 | 
 **endDate** | **Date**| 结束日期 | 
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListUserRankingItem**](BaseResponseListUserRankingItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getAverageRating

> BaseResponseDouble getAverageRating(productId)

获取商品平均评分

获取指定商品的平均评分

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
apiInstance.getAverageRating(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseDouble**](BaseResponseDouble.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getAverageRating_0

> BaseResponseDouble getAverageRating_0(productId)

获取商品平均评分

获取指定商品的平均评分

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
apiInstance.getAverageRating_0(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseDouble**](BaseResponseDouble.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCategoryList

> BaseResponseListCategory getCategoryList()

获取所有商品分类

获取系统中所有的商品分类信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getCategoryList((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseListCategory**](BaseResponseListCategory.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getCategoryList_0

> BaseResponseListCategory getCategoryList_0()

获取所有商品分类

获取系统中所有的商品分类信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getCategoryList_0((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseListCategory**](BaseResponseListCategory.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getComprehensiveStatistics

> BaseResponseStatisticsResponse getComprehensiveStatistics(opts)

获取综合统计信息

获取指定时间范围内的综合统计信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'startDate': new Date("2013-10-20T19:20:30+01:00"), // Date | 开始日期
  'endDate': new Date("2013-10-20T19:20:30+01:00") // Date | 结束日期
};
apiInstance.getComprehensiveStatistics(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **startDate** | **Date**| 开始日期 | [optional] 
 **endDate** | **Date**| 结束日期 | [optional] 

### Return type

[**BaseResponseStatisticsResponse**](BaseResponseStatisticsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getComprehensiveStatistics_0

> BaseResponseStatisticsResponse getComprehensiveStatistics_0(opts)

获取综合统计信息

获取指定时间范围内的综合统计信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'startDate': new Date("2013-10-20T19:20:30+01:00"), // Date | 开始日期
  'endDate': new Date("2013-10-20T19:20:30+01:00") // Date | 结束日期
};
apiInstance.getComprehensiveStatistics_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **startDate** | **Date**| 开始日期 | [optional] 
 **endDate** | **Date**| 结束日期 | [optional] 

### Return type

[**BaseResponseStatisticsResponse**](BaseResponseStatisticsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getHighDemandProducts

> BaseResponseListProductRankingItem getHighDemandProducts(opts)

获取需求量大商品排行

获取需求量大的商品排行榜

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getHighDemandProducts(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListProductRankingItem**](BaseResponseListProductRankingItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getHighDemandProducts_0

> BaseResponseListProductRankingItem getHighDemandProducts_0(opts)

获取需求量大商品排行

获取需求量大的商品排行榜

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getHighDemandProducts_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListProductRankingItem**](BaseResponseListProductRankingItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getHighInventoryProducts

> BaseResponseListProductRankingItem getHighInventoryProducts(opts)

获取闲置量大商品排行

获取闲置量大的商品排行榜

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getHighInventoryProducts(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListProductRankingItem**](BaseResponseListProductRankingItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getHighInventoryProducts_0

> BaseResponseListProductRankingItem getHighInventoryProducts_0(opts)

获取闲置量大商品排行

获取闲置量大的商品排行榜

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getHighInventoryProducts_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListProductRankingItem**](BaseResponseListProductRankingItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getLatestNews

> BaseResponseNews getLatestNews()

获取最新新闻

获取系统中最新的一条新闻信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getLatestNews((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseNews**](BaseResponseNews.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getLatestNews_0

> BaseResponseNews getLatestNews_0()

获取最新新闻

获取系统中最新的一条新闻信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getLatestNews_0((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseNews**](BaseResponseNews.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getLatestProducts

> BaseResponseListProduct getLatestProducts(opts)

获取最新商品列表

获取最新发布的商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getLatestProducts(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListProduct**](BaseResponseListProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getLatestProducts_0

> BaseResponseListProduct getLatestProducts_0(opts)

获取最新商品列表

获取最新发布的商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getLatestProducts_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListProduct**](BaseResponseListProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getLoginUser

> BaseResponseLoginUserVo getLoginUser()

获取当前登录用户

获取当前登录用户的详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getLoginUser((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseLoginUserVo**](BaseResponseLoginUserVo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getLoginUser_0

> BaseResponseLoginUserVo getLoginUser_0()

获取当前登录用户

获取当前登录用户的详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getLoginUser_0((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseLoginUserVo**](BaseResponseLoginUserVo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getMonthlyStatistics

> BaseResponseStatisticsResponse getMonthlyStatistics(month, year)

获取月度统计数据

获取指定月份的统计数据

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let month = 56; // Number | 月份
let year = 56; // Number | 年份
apiInstance.getMonthlyStatistics(month, year, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **month** | **Number**| 月份 | 
 **year** | **Number**| 年份 | 

### Return type

[**BaseResponseStatisticsResponse**](BaseResponseStatisticsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getMonthlyStatistics_0

> BaseResponseStatisticsResponse getMonthlyStatistics_0(month, year)

获取月度统计数据

获取指定月份的统计数据

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let month = 56; // Number | 月份
let year = 56; // Number | 年份
apiInstance.getMonthlyStatistics_0(month, year, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **month** | **Number**| 月份 | 
 **year** | **Number**| 年份 | 

### Return type

[**BaseResponseStatisticsResponse**](BaseResponseStatisticsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getMonthlyTopSellingProducts

> BaseResponseListProductRankingItem getMonthlyTopSellingProducts(month, year, opts)

获取月度交易商品排行

获取指定月份的交易商品排行榜

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let month = 56; // Number | 月份
let year = 56; // Number | 年份
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getMonthlyTopSellingProducts(month, year, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **month** | **Number**| 月份 | 
 **year** | **Number**| 年份 | 
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListProductRankingItem**](BaseResponseListProductRankingItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getMonthlyTopSellingProducts_0

> BaseResponseListProductRankingItem getMonthlyTopSellingProducts_0(month, year, opts)

获取月度交易商品排行

获取指定月份的交易商品排行榜

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let month = 56; // Number | 月份
let year = 56; // Number | 年份
let opts = {
  'limit': 10 // Number | 限制数量
};
apiInstance.getMonthlyTopSellingProducts_0(month, year, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **month** | **Number**| 月份 | 
 **year** | **Number**| 年份 | 
 **limit** | **Number**| 限制数量 | [optional] [default to 10]

### Return type

[**BaseResponseListProductRankingItem**](BaseResponseListProductRankingItem.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getMyReviewForProduct

> BaseResponseReview getMyReviewForProduct(productId)

获取当前用户对商品的评价

获取当前登录用户对指定商品的评价

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
apiInstance.getMyReviewForProduct(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseReview**](BaseResponseReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getMyReviewForProduct_0

> BaseResponseReview getMyReviewForProduct_0(productId)

获取当前用户对商品的评价

获取当前登录用户对指定商品的评价

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
apiInstance.getMyReviewForProduct_0(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseReview**](BaseResponseReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getNewsDetail

> BaseResponseNews getNewsDetail(id)

获取新闻详情

根据ID获取新闻的详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 新闻ID
apiInstance.getNewsDetail(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 新闻ID | 

### Return type

[**BaseResponseNews**](BaseResponseNews.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getNewsDetail_0

> BaseResponseNews getNewsDetail_0(id)

获取新闻详情

根据ID获取新闻的详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 新闻ID
apiInstance.getNewsDetail_0(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 新闻ID | 

### Return type

[**BaseResponseNews**](BaseResponseNews.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getNewsList

> BaseResponseListNews getNewsList(opts)

分页获取新闻列表

分页获取系统中的新闻信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.getNewsList(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponseListNews**](BaseResponseListNews.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getNewsList_0

> BaseResponseListNews getNewsList_0(opts)

分页获取新闻列表

分页获取系统中的新闻信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.getNewsList_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponseListNews**](BaseResponseListNews.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getOrderById

> BaseResponseOrder getOrderById(orderId)

获取订单详情

根据订单ID获取订单详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.getOrderById(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseOrder**](BaseResponseOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getOrderById_0

> BaseResponseOrder getOrderById_0(orderId)

获取订单详情

根据订单ID获取订单详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.getOrderById_0(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseOrder**](BaseResponseOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getOrderStatistics

> BaseResponseOrderRequest getOrderStatistics()

获取订单统计信息

获取当前用户的订单统计信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getOrderStatistics((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseOrderRequest**](BaseResponseOrderRequest.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getOrderStatistics_0

> BaseResponseOrderRequest getOrderStatistics_0()

获取订单统计信息

获取当前用户的订单统计信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getOrderStatistics_0((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseOrderRequest**](BaseResponseOrderRequest.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPendingAuditUsers

> BaseResponsePageUser getPendingAuditUsers(opts)

获取待审核用户列表

管理员获取待审核用户列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.getPendingAuditUsers(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageUser**](BaseResponsePageUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getPendingAuditUsers_0

> BaseResponsePageUser getPendingAuditUsers_0(opts)

获取待审核用户列表

管理员获取待审核用户列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.getPendingAuditUsers_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageUser**](BaseResponsePageUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getProductById

> BaseResponseProduct getProductById(id)

获取商品详情

根据商品ID获取商品详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 商品ID
apiInstance.getProductById(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 商品ID | 

### Return type

[**BaseResponseProduct**](BaseResponseProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getProductById_0

> BaseResponseProduct getProductById_0(id)

获取商品详情

根据商品ID获取商品详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 商品ID
apiInstance.getProductById_0(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 商品ID | 

### Return type

[**BaseResponseProduct**](BaseResponseProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getProductTradeStatistics

> BaseResponseStatisticsResponse getProductTradeStatistics(productId)

获取商品交易统计

获取指定商品的交易统计数据

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
apiInstance.getProductTradeStatistics(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseStatisticsResponse**](BaseResponseStatisticsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getProductTradeStatistics_0

> BaseResponseStatisticsResponse getProductTradeStatistics_0(productId)

获取商品交易统计

获取指定商品的交易统计数据

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
apiInstance.getProductTradeStatistics_0(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseStatisticsResponse**](BaseResponseStatisticsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getRejectedUserCount

> BaseResponseInteger getRejectedUserCount()

获取已拒绝用户数量

管理员获取已拒绝用户数量

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getRejectedUserCount((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseInteger**](BaseResponseInteger.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getRejectedUserCount_0

> BaseResponseInteger getRejectedUserCount_0()

获取已拒绝用户数量

管理员获取已拒绝用户数量

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.getRejectedUserCount_0((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseInteger**](BaseResponseInteger.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getReviewById

> BaseResponseReview getReviewById(id)

获取评价详情

根据评价ID获取评价详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 评价ID
apiInstance.getReviewById(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 评价ID | 

### Return type

[**BaseResponseReview**](BaseResponseReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getReviewById_0

> BaseResponseReview getReviewById_0(id)

获取评价详情

根据评价ID获取评价详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 评价ID
apiInstance.getReviewById_0(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 评价ID | 

### Return type

[**BaseResponseReview**](BaseResponseReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getReviewStatistics

> BaseResponseReviewRequest getReviewStatistics(productId)

获取商品评价统计信息

获取指定商品的评价统计信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
apiInstance.getReviewStatistics(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseReviewRequest**](BaseResponseReviewRequest.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getReviewStatistics_0

> BaseResponseReviewRequest getReviewStatistics_0(productId)

获取商品评价统计信息

获取指定商品的评价统计信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
apiInstance.getReviewStatistics_0(productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseReviewRequest**](BaseResponseReviewRequest.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getTradeRecordDetail

> BaseResponseTradeRecord getTradeRecordDetail(id)

获取交易记录详情

根据交易记录ID获取详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 交易记录ID
apiInstance.getTradeRecordDetail(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 交易记录ID | 

### Return type

[**BaseResponseTradeRecord**](BaseResponseTradeRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getTradeRecordDetail_0

> BaseResponseTradeRecord getTradeRecordDetail_0(id)

获取交易记录详情

根据交易记录ID获取详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 交易记录ID
apiInstance.getTradeRecordDetail_0(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 交易记录ID | 

### Return type

[**BaseResponseTradeRecord**](BaseResponseTradeRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserById

> BaseResponseUser getUserById(id)

根据ID获取用户

管理员根据用户ID获取用户详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 789; // Number | 用户ID
apiInstance.getUserById(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 用户ID | 

### Return type

[**BaseResponseUser**](BaseResponseUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserById_0

> BaseResponseUser getUserById_0(id)

根据ID获取用户

管理员根据用户ID获取用户详细信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 789; // Number | 用户ID
apiInstance.getUserById_0(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 用户ID | 

### Return type

[**BaseResponseUser**](BaseResponseUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserReviewForProduct

> BaseResponseReview getUserReviewForProduct(userId, productId)

获取用户对商品的评价

获取指定用户对指定商品的评价

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userId = 0; // Number | 用户ID
let productId = 0; // Number | 商品ID
apiInstance.getUserReviewForProduct(userId, productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseReview**](BaseResponseReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserReviewForProduct_0

> BaseResponseReview getUserReviewForProduct_0(userId, productId)

获取用户对商品的评价

获取指定用户对指定商品的评价

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userId = 0; // Number | 用户ID
let productId = 0; // Number | 商品ID
apiInstance.getUserReviewForProduct_0(userId, productId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 
 **productId** | **Number**| 商品ID | 

### Return type

[**BaseResponseReview**](BaseResponseReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserTradeStatistics

> BaseResponseStatisticsResponse getUserTradeStatistics(userId)

获取用户交易统计

获取指定用户的交易统计数据

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userId = 0; // Number | 用户ID
apiInstance.getUserTradeStatistics(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 

### Return type

[**BaseResponseStatisticsResponse**](BaseResponseStatisticsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserTradeStatistics_0

> BaseResponseStatisticsResponse getUserTradeStatistics_0(userId)

获取用户交易统计

获取指定用户的交易统计数据

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userId = 0; // Number | 用户ID
apiInstance.getUserTradeStatistics_0(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 

### Return type

[**BaseResponseStatisticsResponse**](BaseResponseStatisticsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserVOById

> BaseResponseUserVo getUserVOById(id)

根据ID获取用户视图

根据用户ID获取用户视图信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 789; // Number | 用户ID
apiInstance.getUserVOById(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 用户ID | 

### Return type

[**BaseResponseUserVo**](BaseResponseUserVo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## getUserVOById_0

> BaseResponseUserVo getUserVOById_0(id)

根据ID获取用户视图

根据用户ID获取用户视图信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 789; // Number | 用户ID
apiInstance.getUserVOById_0(id, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 用户ID | 

### Return type

[**BaseResponseUserVo**](BaseResponseUserVo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listBuyerOrders

> BaseResponsePageOrder listBuyerOrders(opts)

获取买家订单列表

获取当前登录用户的买家订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listBuyerOrders(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listBuyerOrdersByStatus

> BaseResponsePageOrder listBuyerOrdersByStatus(status, opts)

根据状态获取买家订单列表

根据状态获取买家订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let status = 0; // Number | 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消)
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listBuyerOrdersByStatus(status, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **Number**| 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消) | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listBuyerOrdersByStatus_0

> BaseResponsePageOrder listBuyerOrdersByStatus_0(status, opts)

根据状态获取买家订单列表

根据状态获取买家订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let status = 0; // Number | 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消)
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listBuyerOrdersByStatus_0(status, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **Number**| 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消) | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listBuyerOrders_0

> BaseResponsePageOrder listBuyerOrders_0(opts)

获取买家订单列表

获取当前登录用户的买家订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listBuyerOrders_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listBuyerTradeRecords

> BaseResponsePageTradeRecord listBuyerTradeRecords(opts)

获取买家的交易记录列表

获取当前登录用户的买家交易记录列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listBuyerTradeRecords(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageTradeRecord**](BaseResponsePageTradeRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listBuyerTradeRecords_0

> BaseResponsePageTradeRecord listBuyerTradeRecords_0(opts)

获取买家的交易记录列表

获取当前登录用户的买家交易记录列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listBuyerTradeRecords_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageTradeRecord**](BaseResponsePageTradeRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listMyProducts

> BaseResponsePageProduct listMyProducts(opts)

获取当前用户发布的商品列表

获取当前登录用户发布的商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listMyProducts(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listMyProducts_0

> BaseResponsePageProduct listMyProducts_0(opts)

获取当前用户发布的商品列表

获取当前登录用户发布的商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listMyProducts_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listMyReviews

> BaseResponsePageReview listMyReviews(opts)

获取当前用户的评价列表

获取当前登录用户的评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listMyReviews(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listMyReviews_0

> BaseResponsePageReview listMyReviews_0(opts)

获取当前用户的评价列表

获取当前登录用户的评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listMyReviews_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listProductByPage

> BaseResponsePageProduct listProductByPage(opts)

分页获取商品列表

分页获取已上架的商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listProductByPage(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listProductByPage_0

> BaseResponsePageProduct listProductByPage_0(opts)

分页获取商品列表

分页获取已上架的商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listProductByPage_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listProductsByCategory

> BaseResponsePageProduct listProductsByCategory(categoryId, opts)

根据分类获取商品列表

根据分类ID分页获取商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let categoryId = 0; // Number | 分类ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listProductsByCategory(categoryId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **categoryId** | **Number**| 分类ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listProductsByCategory_0

> BaseResponsePageProduct listProductsByCategory_0(categoryId, opts)

根据分类获取商品列表

根据分类ID分页获取商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let categoryId = 0; // Number | 分类ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listProductsByCategory_0(categoryId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **categoryId** | **Number**| 分类ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listReviewByPage

> BaseResponsePageReview listReviewByPage(opts)

分页获取评价列表

分页获取所有评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listReviewByPage(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listReviewByPage_0

> BaseResponsePageReview listReviewByPage_0(opts)

分页获取评价列表

分页获取所有评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listReviewByPage_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listReviewsByOrderId

> BaseResponsePageReview listReviewsByOrderId(orderId, opts)

根据订单ID获取评价列表

根据订单ID分页获取评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listReviewsByOrderId(orderId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listReviewsByOrderId_0

> BaseResponsePageReview listReviewsByOrderId_0(orderId, opts)

根据订单ID获取评价列表

根据订单ID分页获取评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listReviewsByOrderId_0(orderId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listReviewsByProductId

> BaseResponsePageReview listReviewsByProductId(productId, opts)

根据商品ID获取评价列表

根据商品ID分页获取评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listReviewsByProductId(productId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listReviewsByProductId_0

> BaseResponsePageReview listReviewsByProductId_0(productId, opts)

根据商品ID获取评价列表

根据商品ID分页获取评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productId = 0; // Number | 商品ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listReviewsByProductId_0(productId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | **Number**| 商品ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listReviewsByUserId

> BaseResponsePageReview listReviewsByUserId(userId, opts)

根据用户ID获取评价列表

根据用户ID分页获取评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userId = 0; // Number | 用户ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listReviewsByUserId(userId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listReviewsByUserId_0

> BaseResponsePageReview listReviewsByUserId_0(userId, opts)

根据用户ID获取评价列表

根据用户ID分页获取评价列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userId = 0; // Number | 用户ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listReviewsByUserId_0(userId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageReview**](BaseResponsePageReview.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listSellerOrders

> BaseResponsePageOrder listSellerOrders(opts)

获取卖家订单列表

获取当前登录用户的卖家订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listSellerOrders(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listSellerOrdersByStatus

> BaseResponsePageOrder listSellerOrdersByStatus(status, opts)

根据状态获取卖家订单列表

根据状态获取卖家订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let status = 0; // Number | 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消)
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listSellerOrdersByStatus(status, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **Number**| 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消) | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listSellerOrdersByStatus_0

> BaseResponsePageOrder listSellerOrdersByStatus_0(status, opts)

根据状态获取卖家订单列表

根据状态获取卖家订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let status = 0; // Number | 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消)
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listSellerOrdersByStatus_0(status, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | **Number**| 订单状态 (0-待支付, 1-已支付, 2-已完成, 3-已取消) | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listSellerOrders_0

> BaseResponsePageOrder listSellerOrders_0(opts)

获取卖家订单列表

获取当前登录用户的卖家订单列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listSellerOrders_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageOrder**](BaseResponsePageOrder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listSellerTradeRecords

> BaseResponsePageTradeRecord listSellerTradeRecords(opts)

获取卖家的交易记录列表

获取当前登录用户的卖家交易记录列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listSellerTradeRecords(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageTradeRecord**](BaseResponsePageTradeRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listSellerTradeRecords_0

> BaseResponsePageTradeRecord listSellerTradeRecords_0(opts)

获取卖家的交易记录列表

获取当前登录用户的卖家交易记录列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listSellerTradeRecords_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageTradeRecord**](BaseResponsePageTradeRecord.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listUserByPage

> BaseResponsePageUser listUserByPage(userQueryRequest)

分页获取用户列表

管理员分页获取用户列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userQueryRequest = new OpenapiJsClient.UserQueryRequest(); // UserQueryRequest | 
apiInstance.listUserByPage(userQueryRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userQueryRequest** | [**UserQueryRequest**](UserQueryRequest.md)|  | 

### Return type

[**BaseResponsePageUser**](BaseResponsePageUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## listUserByPage_0

> BaseResponsePageUser listUserByPage_0(userQueryRequest)

分页获取用户列表

管理员分页获取用户列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userQueryRequest = new OpenapiJsClient.UserQueryRequest(); // UserQueryRequest | 
apiInstance.listUserByPage_0(userQueryRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userQueryRequest** | [**UserQueryRequest**](UserQueryRequest.md)|  | 

### Return type

[**BaseResponsePageUser**](BaseResponsePageUser.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## listUserProducts

> BaseResponsePageProduct listUserProducts(userId, opts)

获取用户发布的商品列表

根据用户ID获取该用户发布的商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userId = 0; // Number | 用户ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listUserProducts(userId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listUserProducts_0

> BaseResponsePageProduct listUserProducts_0(userId, opts)

获取用户发布的商品列表

根据用户ID获取该用户发布的商品列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userId = 0; // Number | 用户ID
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.listUserProducts_0(userId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Number**| 用户ID | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listUserVOByPage

> BaseResponsePageUserVo listUserVOByPage(opts)

分页获取用户视图列表

分页获取用户视图信息列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'id': 789, // Number | 用户ID
  'userName': "userName_example", // String | 用户名
  'userRole': "userRole_example", // String | 用户角色
  'point': 56, // Number | 用户积分
  'sortField': "sortField_example", // String | 排序字段
  'sortOrder': "'desc'" // String | 排序顺序
};
apiInstance.listUserVOByPage(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **id** | **Number**| 用户ID | [optional] 
 **userName** | **String**| 用户名 | [optional] 
 **userRole** | **String**| 用户角色 | [optional] 
 **point** | **Number**| 用户积分 | [optional] 
 **sortField** | **String**| 排序字段 | [optional] 
 **sortOrder** | **String**| 排序顺序 | [optional] [default to &#39;desc&#39;]

### Return type

[**BaseResponsePageUserVo**](BaseResponsePageUserVo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## listUserVOByPage_0

> BaseResponsePageUserVo listUserVOByPage_0(opts)

分页获取用户视图列表

分页获取用户视图信息列表

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10, // Number | 每页大小
  'id': 789, // Number | 用户ID
  'userName': "userName_example", // String | 用户名
  'userRole': "userRole_example", // String | 用户角色
  'point': 56, // Number | 用户积分
  'sortField': "sortField_example", // String | 排序字段
  'sortOrder': "'desc'" // String | 排序顺序
};
apiInstance.listUserVOByPage_0(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]
 **id** | **Number**| 用户ID | [optional] 
 **userName** | **String**| 用户名 | [optional] 
 **userRole** | **String**| 用户角色 | [optional] 
 **point** | **Number**| 用户积分 | [optional] 
 **sortField** | **String**| 排序字段 | [optional] 
 **sortOrder** | **String**| 排序顺序 | [optional] [default to &#39;desc&#39;]

### Return type

[**BaseResponsePageUserVo**](BaseResponsePageUserVo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## payOrder

> BaseResponseBoolean payOrder(orderId)

支付订单

用户支付订单

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.payOrder(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## payOrder_0

> BaseResponseBoolean payOrder_0(orderId)

支付订单

用户支付订单

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.payOrder_0(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## reviewProduct

> BaseResponseBoolean reviewProduct(id, status)

审核商品

管理员审核商品（上架/拒绝）

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 商品ID
let status = 56; // Number | 审核状态
apiInstance.reviewProduct(id, status, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 商品ID | 
 **status** | **Number**| 审核状态 | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## reviewProduct_0

> BaseResponseBoolean reviewProduct_0(id, status)

审核商品

管理员审核商品（上架/拒绝）

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 商品ID
let status = 56; // Number | 审核状态
apiInstance.reviewProduct_0(id, status, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 商品ID | 
 **status** | **Number**| 审核状态 | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## searchProducts

> BaseResponsePageProduct searchProducts(keyword, opts)

搜索商品

根据关键词搜索商品

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let keyword = "keyword_example"; // String | 搜索关键词
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.searchProducts(keyword, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**| 搜索关键词 | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## searchProducts_0

> BaseResponsePageProduct searchProducts_0(keyword, opts)

搜索商品

根据关键词搜索商品

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let keyword = "keyword_example"; // String | 搜索关键词
let opts = {
  'current': 1, // Number | 当前页码
  'size': 10 // Number | 每页大小
};
apiInstance.searchProducts_0(keyword, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyword** | **String**| 搜索关键词 | 
 **current** | **Number**| 当前页码 | [optional] [default to 1]
 **size** | **Number**| 每页大小 | [optional] [default to 10]

### Return type

[**BaseResponsePageProduct**](BaseResponsePageProduct.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## simulateWechatPay

> BaseResponseBoolean simulateWechatPay(orderId)

模拟微信支付

模拟微信支付流程

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.simulateWechatPay(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## simulateWechatPay_0

> BaseResponseBoolean simulateWechatPay_0(orderId)

模拟微信支付

模拟微信支付流程

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let orderId = 0; // Number | 订单ID
apiInstance.simulateWechatPay_0(orderId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | **Number**| 订单ID | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## submitPaymentProof

> BaseResponseBoolean submitPaymentProof(paymentProofRequest)

提交支付凭证

买家上传现金支付凭证

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let paymentProofRequest = new OpenapiJsClient.PaymentProofRequest(); // PaymentProofRequest | 
apiInstance.submitPaymentProof(paymentProofRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentProofRequest** | [**PaymentProofRequest**](PaymentProofRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## submitPaymentProof_0

> BaseResponseBoolean submitPaymentProof_0(paymentProofRequest)

提交支付凭证

买家上传现金支付凭证

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let paymentProofRequest = new OpenapiJsClient.PaymentProofRequest(); // PaymentProofRequest | 
apiInstance.submitPaymentProof_0(paymentProofRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **paymentProofRequest** | [**PaymentProofRequest**](PaymentProofRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateCategory

> BaseResponseBoolean updateCategory(category)

更新商品分类

管理员更新商品分类信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let category = new OpenapiJsClient.Category(); // Category | 
apiInstance.updateCategory(category, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **category** | [**Category**](Category.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateCategory_0

> BaseResponseBoolean updateCategory_0(category)

更新商品分类

管理员更新商品分类信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let category = new OpenapiJsClient.Category(); // Category | 
apiInstance.updateCategory_0(category, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **category** | [**Category**](Category.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateMyUser

> BaseResponseBoolean updateMyUser(userUpdateMyRequest)

更新个人信息

用户更新自己的个人信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userUpdateMyRequest = new OpenapiJsClient.UserUpdateMyRequest(); // UserUpdateMyRequest | 
apiInstance.updateMyUser(userUpdateMyRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userUpdateMyRequest** | [**UserUpdateMyRequest**](UserUpdateMyRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateMyUser_0

> BaseResponseBoolean updateMyUser_0(userUpdateMyRequest)

更新个人信息

用户更新自己的个人信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userUpdateMyRequest = new OpenapiJsClient.UserUpdateMyRequest(); // UserUpdateMyRequest | 
apiInstance.updateMyUser_0(userUpdateMyRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userUpdateMyRequest** | [**UserUpdateMyRequest**](UserUpdateMyRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateNews

> BaseResponseBoolean updateNews(newsUpdateRequest)

更新新闻

管理员更新新闻信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let newsUpdateRequest = new OpenapiJsClient.NewsUpdateRequest(); // NewsUpdateRequest | 
apiInstance.updateNews(newsUpdateRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newsUpdateRequest** | [**NewsUpdateRequest**](NewsUpdateRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateNews_0

> BaseResponseBoolean updateNews_0(newsUpdateRequest)

更新新闻

管理员更新新闻信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let newsUpdateRequest = new OpenapiJsClient.NewsUpdateRequest(); // NewsUpdateRequest | 
apiInstance.updateNews_0(newsUpdateRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newsUpdateRequest** | [**NewsUpdateRequest**](NewsUpdateRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateProduct

> BaseResponseBoolean updateProduct(productUpdateRequest)

更新商品信息

用户更新自己的商品信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productUpdateRequest = new OpenapiJsClient.ProductUpdateRequest(); // ProductUpdateRequest | 
apiInstance.updateProduct(productUpdateRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productUpdateRequest** | [**ProductUpdateRequest**](ProductUpdateRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateProductStatus

> BaseResponseBoolean updateProductStatus(id, status)

更新商品状态

更新商品状态（上架/下架/售出等）

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 商品ID
let status = 56; // Number | 商品状态
apiInstance.updateProductStatus(id, status, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 商品ID | 
 **status** | **Number**| 商品状态 | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updateProductStatus_0

> BaseResponseBoolean updateProductStatus_0(id, status)

更新商品状态

更新商品状态（上架/下架/售出等）

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let id = 0; // Number | 商品ID
let status = 56; // Number | 商品状态
apiInstance.updateProductStatus_0(id, status, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Number**| 商品ID | 
 **status** | **Number**| 商品状态 | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## updateProduct_0

> BaseResponseBoolean updateProduct_0(productUpdateRequest)

更新商品信息

用户更新自己的商品信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let productUpdateRequest = new OpenapiJsClient.ProductUpdateRequest(); // ProductUpdateRequest | 
apiInstance.updateProduct_0(productUpdateRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productUpdateRequest** | [**ProductUpdateRequest**](ProductUpdateRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateReview

> BaseResponseBoolean updateReview(review)

更新评价信息

用户更新自己的评价信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let review = new OpenapiJsClient.Review(); // Review | 
apiInstance.updateReview(review, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **review** | [**Review**](Review.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateReview_0

> BaseResponseBoolean updateReview_0(review)

更新评价信息

用户更新自己的评价信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let review = new OpenapiJsClient.Review(); // Review | 
apiInstance.updateReview_0(review, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **review** | [**Review**](Review.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateUser

> BaseResponseBoolean updateUser(userUpdateRequest)

更新用户

管理员更新用户信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userUpdateRequest = new OpenapiJsClient.UserUpdateRequest(); // UserUpdateRequest | 
apiInstance.updateUser(userUpdateRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userUpdateRequest** | [**UserUpdateRequest**](UserUpdateRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## updateUser_0

> BaseResponseBoolean updateUser_0(userUpdateRequest)

更新用户

管理员更新用户信息

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userUpdateRequest = new OpenapiJsClient.UserUpdateRequest(); // UserUpdateRequest | 
apiInstance.updateUser_0(userUpdateRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userUpdateRequest** | [**UserUpdateRequest**](UserUpdateRequest.md)|  | 

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## userLogin

> BaseResponseLoginUserVo userLogin(userLoginRequest)

用户登录

用户账号密码登录

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userLoginRequest = new OpenapiJsClient.UserLoginRequest(); // UserLoginRequest | 
apiInstance.userLogin(userLoginRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userLoginRequest** | [**UserLoginRequest**](UserLoginRequest.md)|  | 

### Return type

[**BaseResponseLoginUserVo**](BaseResponseLoginUserVo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## userLogin_0

> BaseResponseLoginUserVo userLogin_0(userLoginRequest)

用户登录

用户账号密码登录

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userLoginRequest = new OpenapiJsClient.UserLoginRequest(); // UserLoginRequest | 
apiInstance.userLogin_0(userLoginRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userLoginRequest** | [**UserLoginRequest**](UserLoginRequest.md)|  | 

### Return type

[**BaseResponseLoginUserVo**](BaseResponseLoginUserVo.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## userLogout

> BaseResponseBoolean userLogout()

用户注销

用户退出登录

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.userLogout((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## userLogout_0

> BaseResponseBoolean userLogout_0()

用户注销

用户退出登录

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
apiInstance.userLogout_0((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**BaseResponseBoolean**](BaseResponseBoolean.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: */*


## userRegister

> BaseResponseLong userRegister(userRegisterRequest)

用户注册

新用户注册账号

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userRegisterRequest = new OpenapiJsClient.UserRegisterRequest(); // UserRegisterRequest | 
apiInstance.userRegister(userRegisterRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userRegisterRequest** | [**UserRegisterRequest**](UserRegisterRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


## userRegister_0

> BaseResponseLong userRegister_0(userRegisterRequest)

用户注册

新用户注册账号

### Example

```javascript
import OpenapiJsClient from 'openapi-js-client';

let apiInstance = new OpenapiJsClient.DefaultApi();
let userRegisterRequest = new OpenapiJsClient.UserRegisterRequest(); // UserRegisterRequest | 
apiInstance.userRegister_0(userRegisterRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userRegisterRequest** | [**UserRegisterRequest**](UserRegisterRequest.md)|  | 

### Return type

[**BaseResponseLong**](BaseResponseLong.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: */*


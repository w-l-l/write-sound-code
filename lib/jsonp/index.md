# jsonp概念

由于浏览器的安全性限制，不允许 `ajax` 访问协议不同、域名不同、端口号不同的数据接口，浏览器认为这种访问是不安全的。

可以通过动态创建 `script` 标签的形式，把 `script` 标签的 `src` 属性指向数据接口的地址，因为 `script` 标签不存在跨域限制，这种数据获取方式，称为 `JSONP`。

**注意：根据 JSONP 的实现原理知晓，JSONP 只支持 get 请求**

具体实现过程：

1. 先在客户端定义一个回调方法，预定义对数据的操作。

2. 再把这个回调方法的名称，通过 `url` 传参的形式，提交到服务器的数据接口。

3. 服务器数据接口组织好要发送给客户端的数据，再拿着客户端传递过来的回调方法名称（函数名），拼接出一个调用这个方法的字符串，发送给客户端去解析执行。

4. 客户端拿到服务器返回的字符串之后，当作 `script` 脚本去解析执行，这样就能够拿到 `JSONP` 的数据了。

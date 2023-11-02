# nonce_management

### 事前準備
redis install for wsl
 - sudo apt install redis-server
 - sudo service redis-server start

redis 起動確認
```
redis-cli
127.0.0.1:6379>となればOK
```

### スクリプト実行
 - node runMultipleTimes.js

### 実行する際の注意
一度実行して再度実行する場合にはredis-cli上で`FLUSHALL`を実行してredisの中身をクリアしてください

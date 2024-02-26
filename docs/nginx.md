# 目录

- [目录](#目录)
  - [nginx](#nginx)
    - [反向代理](#反向代理)
      - [关于代理头设置](#关于代理头设置)

## nginx

### 反向代理

#### 关于代理头设置

`proxy_set_header`: 在代理接口时，如果接口地址提供的是ip地址，则需要设置为`proxy_set_header Host $host`；若提供的是域名，则需要设置为域名：`proxy_set_header Host [name]]`，且不能带协议，其中`name`表示要代理的域名。
通常设置了代理，接口仍然404可能会是这个原因。
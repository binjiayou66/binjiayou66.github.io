<a id="top" name="top"></a>

1. 更面向对象，架构更清晰，维护性、扩展性更强
2. Virtual Record对数据模型入侵性更小（Record与Dictionary间互相转换，mergeRecord:方法Record链式合并）
3. 强弱业务分离（DataCenter与Table+Virtual Record）
4. 数据库迁移方案（*）
5. 数据同步方案
   1. 单向数据同步（identifier + isDirty + isDelete标志符）
   2. 双向数据同步
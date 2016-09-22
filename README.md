Boilerplate SensorTag / Fluent / ElasticSearch / Kibana
-----

## Requirement
* [fluentd-elasticsearch-kibana](https://github.com/muddydixon/fluentd-elasticsearch-kibana.git)
* [SensorTag CC2650](http://www.tij.co.jp/tool/jp/cc2650stk)


## How to run

```zsh
% git clone https://github.com/muddydixon/boilerplate-sensortag.git
% cd boilerplate-sensortag
% docker run -d -p 24224:24224 -p 5601:5601 -p 9200:9200 muddydixon/fluentd-elasticsearch-kibana
% curl -X PUT "http://192.168.99.100:9200/_template/template_1?pretty" --data @template.json
% DEBUG=sensortag npm start
% open 192.169.99.100:5601/
```

## License

Apache License Version 2.0

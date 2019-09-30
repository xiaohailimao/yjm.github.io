
       
# 正则表达式
<p>正则表达式经常被用于字段或任意字符串的校验，如下面这段校验基本日期格式的JavaScript代码：</p>
<pre class="hljs javascript"><code class="javascript"><span class="hljs-keyword">var</span> reg = <span class="hljs-regexp">/^(\\d{1,4})(-|\\/</span>)(\\d{<span class="hljs-number">1</span>,<span class="hljs-number">2</span>})\\<span class="hljs-number">2</span>(\\d{<span class="hljs-number">1</span>,<span class="hljs-number">2</span>})$/; 
<span class="hljs-keyword">var</span> r = fieldValue.match(reg);             
<span class="hljs-keyword">if</span>(r==<span class="hljs-literal">null</span>)alert(<span class="hljs-string">'Date format error!'</span>);           
</code></pre>
<p>下面是<strong>技匠</strong>整理的，在前端开发中经常使用到的<strong>20</strong>个正则表达式。</p>
<hr>
<h4><strong>1 . 校验密码强度</strong></h4>
<p>密码的强度必须是包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间。</p>
<pre class="hljs ruby"><code class="ruby">^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{<span class="hljs-number">8</span>,<span class="hljs-number">10</span>}$
</code></pre>
<h4><strong>2. 校验中文</strong></h4>
<p>字符串仅能是中文。</p>
<pre class="hljs ruby"><code class="ruby">^[\\u4e0<span class="hljs-number">0</span>-\\u9fa5]{<span class="hljs-number">0</span>,}$
</code></pre>
<h4><strong>3. 由数字、26个英文字母或下划线组成的字符串</strong></h4>
<pre class="hljs ruby"><code class="ruby">^\\w+$
</code></pre>
<h4><strong>4. 校验E-Mail 地址</strong></h4>
<p>同密码一样，下面是E-mail地址合规性的正则检查语句。</p>
<pre class="hljs bash"><code class="bash">[\\w!<span class="hljs-comment">#$%&amp;'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?</span>
</code></pre>
<h4><strong>5. 校验身份证号码</strong></h4>
<p>下面是身份证号码的正则校验。15 或 18位。</p>
<p>15位：</p>
<pre class="hljs ruby"><code class="ruby">^[<span class="hljs-number">1</span>-<span class="hljs-number">9</span>]\\d{<span class="hljs-number">7</span>}((<span class="hljs-number">0</span>\\d)<span class="hljs-params">|(1[0-2]))(([0|</span><span class="hljs-number">1</span><span class="hljs-params">|2]\\d)|</span><span class="hljs-number">3</span>[<span class="hljs-number">0</span>-<span class="hljs-number">1</span>])\\d{<span class="hljs-number">3</span>}$
</code></pre>
<p>18位：</p>
<pre class="hljs ruby"><code class="ruby">^[<span class="hljs-number">1</span>-<span class="hljs-number">9</span>]\\d{<span class="hljs-number">5</span>}[<span class="hljs-number">1</span>-<span class="hljs-number">9</span>]\\d{<span class="hljs-number">3</span>}((<span class="hljs-number">0</span>\\d)<span class="hljs-params">|(1[0-2]))(([0|</span><span class="hljs-number">1</span><span class="hljs-params">|2]\\d)|</span><span class="hljs-number">3</span>[<span class="hljs-number">0</span>-<span class="hljs-number">1</span>])\\d{<span class="hljs-number">3</span>}([<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]<span class="hljs-params">|X)$
</span></code></pre>
<h4><strong>6. 校验日期</strong></h4>
<p>“yyyy-mm-dd“ 格式的日期校验，已考虑平闰年。</p>
<pre class="hljs ruby"><code class="ruby">^(?<span class="hljs-symbol">:</span>(?!<span class="hljs-number">0000</span>)[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]{<span class="hljs-number">4</span>}-(?<span class="hljs-symbol">:</span>(?:<span class="hljs-number">0</span>[<span class="hljs-number">1</span>-<span class="hljs-number">9</span>]<span class="hljs-params">|1[0-2])-(?:0[1-9]|</span><span class="hljs-number">1</span>[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]<span class="hljs-params">|2[0-8])|</span>(?:<span class="hljs-number">0</span>[<span class="hljs-number">13</span>-<span class="hljs-number">9</span>]<span class="hljs-params">|1[0-2])-(?:29|</span><span class="hljs-number">30</span>)<span class="hljs-params">|(?:0[13578]|</span><span class="hljs-number">1</span>[<span class="hljs-number">02</span>])-<span class="hljs-number">31</span>)<span class="hljs-params">|(?:[0-9]{2}(?:0[48]|</span>[<span class="hljs-number">2468</span>][<span class="hljs-number">04</span>8]<span class="hljs-params">|[13579][26])|</span>(?:<span class="hljs-number">0</span>[<span class="hljs-number">48</span>]<span class="hljs-params">|[2468][048]|</span>[<span class="hljs-number">13579</span>][<span class="hljs-number">26</span>])<span class="hljs-number">00</span>)-<span class="hljs-number">02</span>-<span class="hljs-number">29</span>)$
</code></pre>
<h4><strong>7. 校验金额</strong></h4>
<p>金额校验，精确到2位小数。</p>
<pre class="hljs ruby"><code class="ruby">^[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]+(.[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]{<span class="hljs-number">2</span>})?$
</code></pre>
<h4><strong>8. 校验手机号</strong></h4>
<p>下面是国内 13、15、18开头的手机号正则表达式。（可根据目前国内收集号扩展前两位开头号码）</p>
<pre class="hljs ruby"><code class="ruby">^(<span class="hljs-number">13</span>[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]<span class="hljs-params">|14[5|</span><span class="hljs-number">7</span>]<span class="hljs-params">|15[0|</span><span class="hljs-number">1</span><span class="hljs-params">|2|</span><span class="hljs-number">3</span><span class="hljs-params">|5|</span><span class="hljs-number">6</span><span class="hljs-params">|7|</span><span class="hljs-number">8</span><span class="hljs-params">|9]|</span><span class="hljs-number">18</span>[<span class="hljs-number">0</span><span class="hljs-params">|1|</span><span class="hljs-number">2</span><span class="hljs-params">|3|</span><span class="hljs-number">5</span><span class="hljs-params">|6|</span><span class="hljs-number">7</span><span class="hljs-params">|8|</span><span class="hljs-number">9</span>])\\d{<span class="hljs-number">8</span>}$
</code></pre>
<h4><strong>9. 判断IE的版本</strong></h4>
<p>IE目前还没被完全取代，很多页面还是需要做版本兼容，下面是IE版本检查的表达式。</p>
<pre class="hljs ruby"><code class="ruby">^.*MSIE [<span class="hljs-number">5</span>-<span class="hljs-number">8</span>](?<span class="hljs-symbol">:</span>\\.[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]+)?(?!.*Trident\\/[<span class="hljs-number">5</span>-<span class="hljs-number">9</span>]\\.<span class="hljs-number">0</span>).*$
</code></pre>
<h4><strong>10. 校验IP-v4地址</strong></h4>
<p>IP4 正则语句。</p>
<pre class="hljs ruby"><code class="ruby">\\b(?<span class="hljs-symbol">:</span>(?:<span class="hljs-number">25</span>[<span class="hljs-number">0</span>-<span class="hljs-number">5</span>]<span class="hljs-params">|2[0-4][0-9]|</span>[<span class="hljs-number">01</span>]?[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>][<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]?)\\.){<span class="hljs-number">3</span>}(?:<span class="hljs-number">25</span>[<span class="hljs-number">0</span>-<span class="hljs-number">5</span>]<span class="hljs-params">|2[0-4][0-9]|</span>[<span class="hljs-number">01</span>]?[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>][<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]?)\\b
</code></pre>
<h4><strong>11. 校验IP-v6地址</strong></h4>
<p>IP6 正则语句。</p>
<pre class="hljs ruby"><code class="ruby">(([<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}<span class="hljs-symbol">:</span>){<span class="hljs-number">7</span>,<span class="hljs-number">7</span>}[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}<span class="hljs-params">|([0-9a-fA-F]{1,4}:){1,7}:|</span>([<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}<span class="hljs-symbol">:</span>){<span class="hljs-number">1</span>,<span class="hljs-number">6</span>}<span class="hljs-symbol">:</span>[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}<span class="hljs-params">|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|</span>([<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}<span class="hljs-symbol">:</span>){<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}(<span class="hljs-symbol">:</span>[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}){<span class="hljs-number">1</span>,<span class="hljs-number">3</span>}<span class="hljs-params">|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|</span>([<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}<span class="hljs-symbol">:</span>){<span class="hljs-number">1</span>,<span class="hljs-number">2</span>}(<span class="hljs-symbol">:</span>[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}){<span class="hljs-number">1</span>,<span class="hljs-number">5</span>}<span class="hljs-params">|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|</span><span class="hljs-symbol">:</span>((<span class="hljs-symbol">:</span>[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}){<span class="hljs-number">1</span>,<span class="hljs-number">7</span>}<span class="hljs-params">|:)|</span><span class="hljs-symbol">fe80:</span>(<span class="hljs-symbol">:</span>[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">0</span>,<span class="hljs-number">4</span>}){<span class="hljs-number">0</span>,<span class="hljs-number">4</span>}<span class="hljs-string">%[0-9a-zA-Z]</span>{<span class="hljs-number">1</span>,}<span class="hljs-params">|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|</span>(<span class="hljs-number">2</span>[<span class="hljs-number">0</span>-<span class="hljs-number">4</span>]<span class="hljs-params">|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|</span>(<span class="hljs-number">2</span>[<span class="hljs-number">0</span>-<span class="hljs-number">4</span>]<span class="hljs-params">|1{0,1}[0-9]){0,1}[0-9])|</span>([<span class="hljs-number">0</span>-<span class="hljs-number">9</span>a-fA-F]{<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}<span class="hljs-symbol">:</span>){<span class="hljs-number">1</span>,<span class="hljs-number">4</span>}<span class="hljs-symbol">:</span>((<span class="hljs-number">25</span>[<span class="hljs-number">0</span>-<span class="hljs-number">5</span>]<span class="hljs-params">|(2[0-4]|</span><span class="hljs-number">1</span>{<span class="hljs-number">0</span>,<span class="hljs-number">1</span>}[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]){<span class="hljs-number">0</span>,<span class="hljs-number">1</span>}[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>])\\.){<span class="hljs-number">3</span>,<span class="hljs-number">3</span>}(<span class="hljs-number">25</span>[<span class="hljs-number">0</span>-<span class="hljs-number">5</span>]<span class="hljs-params">|(2[0-4]|</span><span class="hljs-number">1</span>{<span class="hljs-number">0</span>,<span class="hljs-number">1</span>}[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]){<span class="hljs-number">0</span>,<span class="hljs-number">1</span>}[<span class="hljs-number">0</span>-<span class="hljs-number">9</span>]))
</code></pre>
<h4><strong>12. 检查URL的前缀</strong></h4>
<p>应用开发中很多时候需要区分请求是HTTPS还是HTTP，通过下面的表达式可以取出一个url的前缀然后再逻辑判断。</p>
<pre class="hljs javascript"><code class="javascript"><span class="hljs-keyword">if</span> (!s.match(<span class="hljs-regexp">/^[a-zA-Z]+:\\/</span>\\<span class="hljs-comment">//))</span>
{
    s = <span class="hljs-string">'http://'</span> + s;
}
</code></pre>
<h4><strong>13. 提取URL链接</strong></h4>
<p>下面的这个表达式可以筛选出一段文本中的URL。</p>
<pre class="hljs ruby"><code class="ruby">^(f<span class="hljs-params">|ht){1}(tp|</span>tps)<span class="hljs-symbol">:</span>\\/\\/([\\w-]+\\.)+[\\w-]+(\\/[\\w- ./?%&amp;=]*)?
</code></pre>
<h4><strong>14. 文件路径及扩展名校验</strong></h4>
<p>验证windows下文件路径和扩展名（下面的例子中为.txt文件）</p>
<pre class="hljs ruby"><code class="ruby">^([a-zA-Z]\\<span class="hljs-symbol">:|</span>\\\\)\\\\([^\\\\]+\\\\)*[^\\/<span class="hljs-symbol">:*</span>?<span class="hljs-string">"&lt;&gt;|]+\\.txt(l)?$
</span></code></pre>
<h4><strong>15. 提取Color Hex  Codes</strong></h4>
<p>有时需要抽取网页中的颜色代码，可以使用下面的表达式。</p>
<pre class="hljs bash"><code class="bash">^<span class="hljs-comment">#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$</span>
</code></pre>
<h4><strong>16. 提取网页图片</strong></h4>
<p>假若你想提取网页中所有图片信息，可以利用下面的表达式。</p>
<pre class="hljs bash"><code class="bash">\\&lt; *[img][^\\\\&gt;]*[src] *= *[\\<span class="hljs-string">"\\']{0,1}([^\\"</span>\\<span class="hljs-string">'\\ &gt;]*)
</span></code></pre>
<h4><strong>17. 提取页面超链接</strong></h4>
<p>提取html中的超链接。</p>
<pre class="hljs bash"><code class="bash">(&lt;a\\s*(?!.*\\brel=)[^&gt;]*)(href=<span class="hljs-string">"https?:\\/\\/)((?!(?:(?:www\\.)?'.implode('|(?:www\\.)?', <span class="hljs-variable">$follow_list</span>).'))[^"</span>]+)<span class="hljs-string">"((?!.*\\brel=)[^&gt;]*)(?:[^&gt;]*)&gt;
</span></code></pre>
<h4><strong>18. 查找CSS属性</strong></h4>
<p>通过下面的表达式，可以搜索到相匹配的CSS属性。</p>
<pre class="hljs bash"><code class="bash">^\\s*[a-zA-Z\\-]+\\s*[:]{1}\\s[a-zA-Z0-9\\s.<span class="hljs-comment">#]+[;]{1}</span>
</code></pre>
<h4><strong>19. 抽取注释</strong></h4>
<p>如果你需要移除HMTL中的注释，可以使用如下的表达式。</p>
<pre class="hljs xml"><code class="xml"><span class="hljs-comment">&lt;!--(.*?)--&gt;</span>
</code></pre>
<h4><strong>20. 匹配HTML标签</strong></h4>
<p>通过下面的表达式可以匹配出HTML中的标签属性。</p>
<pre class="hljs ruby"><code class="ruby">&lt;\\/?\\w+((\\s+\\w+(\\s*=\\s*(?<span class="hljs-symbol">:<span class="hljs-string">".*?"</span>|<span class="hljs-string">'.*?'</span>|</span>[\\^<span class="hljs-string">'"&gt;\\s]+))?)+\\s*|\\s*)\\/?&gt;
</span></code></pre>
<hr>

#### 21.脱敏处理

```js

filters: {
    //脱敏处理
    encrypt(value) {
      return value.replace(/(\d{3})\d*(\d{4})/, "$1********$2");
    }
  }
  
```
#### 22.地址解析

```js
/**
 * 解析一个url并生成window.location对象中包含的域
 * location:
 * {
 *      href: '包含完整的url',
 *      origin: '包含协议到pathname之前的内容',
 *      protocol: 'url使用的协议，包含末尾的:',
 *      username: '用户名', // 暂时不支持
 *      password: '密码',  // 暂时不支持
 *      host: '完整主机名，包含:和端口',
 *      hostname: '主机名，不包含端口'
 *      port: '端口号',
 *      pathname: '服务器上访问资源的路径/开头',
 *      search: 'query string，?开头',
 *      hash: '#开头的fragment identifier'
 * }
 *
 * @param {string} url 需要解析的url
 * @return {Object} 包含url信息的对象
 */
 
 function parseUrl(url) {
    var result = {};
    var url = url || location.href;
    var keys = ['href', 'origin', 'protocol', 'host',
                'hostname', 'port', 'pathname', 'search', 'hash'];
    var i, len;
    var regexp = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;

    var match = regexp.exec(url);
	 console.info('match=', match);
	 
    if (match) {
        for (i = keys.length - 1; i >= 0; --i) {
            result[keys[i]] = match[i] ? match[i] : '';
        }
    }
	 console.info('result=', result);
    return result;
}
```

## 允许多位数 15|17|18|20位，字母+数字

```
/^(^[\da-zA-Z]{15}$)|(^[\da-zA-Z]{17}$)|(^[\da-zA-Z]{18}$)|(^[\da-zA-Z]{20}$)$/
```


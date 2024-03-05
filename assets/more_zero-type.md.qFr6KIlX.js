import{_ as a,c as s,o as i,a5 as e}from"./chunks/framework.VfE2Uxrg.js";const E=JSON.parse('{"title":"零位类型","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"more/zero-type.md","filePath":"more/zero-type.md","lastUpdated":1704979746000}'),t={name:"more/zero-type.md"},h=e('<h1 id="零位类型" tabindex="-1">零位类型 <a class="header-anchor" href="#零位类型" aria-label="Permalink to &quot;零位类型&quot;">​</a></h1><p>在 zig 中，有一些类型是特殊的零位类型（<strong>Zero Type</strong>），它们的大小是 0 bit。</p><p>它们的特点是，涉及到它们的值不会出现在构建结果中（0 bit不占任何空间）。</p><h2 id="void" tabindex="-1"><code>void</code> <a class="header-anchor" href="#void" aria-label="Permalink to &quot;`void`&quot;">​</a></h2><p><code>void</code> 是很明显的<strong>零位类型</strong>，常用于函数无返回值。</p><p>但它不止这一种用法，还可以用来初始化泛型实例，例如 <code>std.AutoHashMap</code>：</p><div class="language-zig vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">zig</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> = </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">std</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">AutoHashMap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">i32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">std</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">testing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">allocator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><p>这样就会获得一个 <code>i32</code> 的 set，尽管可以使用其他方式来实现集合功能，但这样子实现效果内存占用会更少（因为相当于不存在 value）。</p><h2 id="整数" tabindex="-1">整数 <a class="header-anchor" href="#整数" aria-label="Permalink to &quot;整数&quot;">​</a></h2><p><a href="./../basic/basic_type/number.html">整数</a> 声明可以使用 <code>u0</code> 和 <code>i0</code> 来声明<strong>零位整数类型</strong>，它们的大小也是 0 bit。</p><h2 id="数组和切片" tabindex="-1">数组和切片 <a class="header-anchor" href="#数组和切片" aria-label="Permalink to &quot;数组和切片&quot;">​</a></h2><p><a href="./../basic/advanced_type/array.html">数组</a> 和 <a href="./../basic/advanced_type/silce.html">切片</a> 的长度为 0 时，就是<strong>零位类型</strong>。</p><p>另外，如果它们的元素类型是零位类型，则它们必定是<strong>零位类型</strong>，此时与数组（切片）长度无关。</p><h2 id="枚举" tabindex="-1">枚举 <a class="header-anchor" href="#枚举" aria-label="Permalink to &quot;枚举&quot;">​</a></h2><p>只有一个值的 <a href="./../basic/advanced_type/enum.html">枚举</a>，也是<strong>零位类型</strong>。</p><h2 id="结构体" tabindex="-1">结构体 <a class="header-anchor" href="#结构体" aria-label="Permalink to &quot;结构体&quot;">​</a></h2><p><a href="./../basic/advanced_type/struct.html">结构体</a> 为空或者字段均为零位类型时，此时结构体也是<strong>零位类型</strong>。</p><p>例如，<code>const zero = struct {};</code> 就是一个零位类型，它的大小为 0。</p><h2 id="联合类型" tabindex="-1">联合类型 <a class="header-anchor" href="#联合类型" aria-label="Permalink to &quot;联合类型&quot;">​</a></h2><p>仅具有一种可能类型（且该类型是零位类型）的 <a href="./../basic/union.html">联合类型</a> 也是零位类型。</p>',20),n=[h];function r(o,p,l,d,c,k){return i(),s("div",null,n)}const u=a(t,[["render",r]]);export{E as __pageData,u as default};
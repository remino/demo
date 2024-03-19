---
layout: top
---
# {{ site.title }}

[Code](https://github.com/remino/shards)

{% for page in site.html_pages %}
  {% assign url_parts = page.url | split: "." | first | split: "/" %}
  {% assign page_name = url_parts[1] %}
  {% if url_parts.size == 3 %}
- [{{ page.title | default: page_name }}]({{ page.url | relative_url }})
  {% endif %}
{% endfor %}

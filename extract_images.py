import urllib.request, re
url = 'https://paleturquoise-skunk-586080.hostingersite.com'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    links = re.findall(r'src=[\"\'](https?://paleturquoise-skunk-[^\s\"\']+\.(?:jpg|jpeg|png|webp))[\"\']', html)
    print("--- IMAGES ---")
    for link in set(links):
        print(link)
except Exception as e:
    print('Error:', e)

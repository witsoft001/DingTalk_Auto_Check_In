# DingTalk_Auto_Check_In
Android mobile 使用 Auto.js 實現釘釘自動打卡

## 關於Auto.js
不需要Root權限的JavaScript自動化軟體  
詳細參照<a href="https://hyb1996.github.io/AutoJs-Docs/" target="_blank">官方網站</a>  
官方apk載點已被下架，有需要的人請網上<a href="https://github.com/hyb1996/Auto.js/issues/500" target="_blank">自行搜尋</a>  

## 使用限制
使用限制上就如官方文件所寫 需要Android 7.0或以上、需要無障礙功能 等等  
值得一提的是，要注意你的手機有無 "自動啟動管理、電池效能最佳化、螢幕關閉時清理後台程式" 等等之類的功能  
記得全部要把對 Auto.js 的限制調掉，以確保腳本可以正確執行到最後  
1. 自動啟動管理 → 允許 Auto.js 可自動啟動
2. 電池最佳化 → 對於 Auto.js 不要最佳化
3. 螢幕關閉時清理後台程式 → 關閉此功能
4. Android手機種類繁多，只提我知道的，剩餘請自行研究

關於電池最佳化，要調整為不要最佳化的原因是，腳本會執行很長一段時間的sleep直到9點整，  
若將電池最佳化開啟，長時間不進行任何動作的app有可能會被進入閒置狀態，  
導致即使時間到了，腳本也不執行任何動作，很是尷尬。  

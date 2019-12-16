/** @description 螢幕滑動解鎖
 */
function Unlock() {
    if (!device.isScreenOn()) {
        device.wakeUp();
        sleep(500);
        swipe(device.width/2, device.height*3/4, device.width/2, device.height/4, 300);
        sleep(500);
    }
}

/** @description 點擊手機的清理後台app按鈕
 */
function ClearBackgroundApp() {
    recents();
    try {
        sleep(1000); // 不能用waitFor()，元件已經讀取到，但要等顯示動畫到位
        idMatches(/.*clear_all.*/).findOne(100).click();
    } catch (error) {
        back();
    }
    sleep(1000); // 等顯示動畫播完
}

/** @description 強制關閉指定app
 * @param {string} packageName 要關閉的app的package名稱(可用其他app查詢)
 */
function ForceClose(packageName) {
    app.openAppSetting(packageName);
    text(app.getAppName(packageName)).waitFor();  
    let is_sure = textMatches(/(.*強.*|.*停.*|.*結.*|.*行.*)/).findOne();
    if (is_sure.enabled()) {
        textMatches(/(.*強.*|.*停.*|.*結.*|.*行.*)/).findOne().click();
        textMatches(/(.*確.*|.*定.*)/).findOne().click();
        log(app.getAppName(packageName) + "應用已被關閉");
        sleep(1000);
        back();
    } else {
        log(app.getAppName(packageName) + "應用不能被正常關閉或不在後臺執行");
        back();
    }
}

/** @description 釘釘自動打卡
 * @param {boolean} checkInMode 設定打卡的模式，
 * true: 為上班打卡，false: 為下班打卡，預設為上班打卡
 */
function AutoCheckIn(checkInMode) {
    // Auto.js 不支援 ES6 的預設傳入參數
    if (typeof(checkInMode) == undefined){
        checkInMode = true;
    }

    if (checkInMode) {
        checkInText = "上班打卡";
    } else {
        checkInText = "下班打卡";
    }
    
    app.launch("com.alibaba.android.rimet"); // 開啟釘釘

    // 不知道為什麼app裡面一堆元件都是clickable都是false
    // 如果一個控制元件本身無法通過click()點選，那麼我們可以利用bounds()函式獲取其座標，再利用座標點選。
    text("工作").waitFor();
    let workBtn = text("工作").findOne().bounds();
    click(workBtn.centerX(), workBtn.centerY());

    text("考勤打卡").waitFor();
    let dattndBtn = text("考勤打卡").findOne().bounds();
    click(dattndBtn.centerX(), dattndBtn.centerY()-150);
    
    // 最多等30秒，沒有就重近頁面
    while (!text("打卡").findOne(30000)) {
        back();
        text("考勤打卡").waitFor();
        click(dattndBtn.centerX(), dattndBtn.centerY()-150);
    }
    sleep(3000);
    text(checkInText).waitFor(); // 有時候網路網路瞬斷會變外勤打卡，重複檢查已保險
    let checkInBtn = text(checkInText).findOne().bounds();
    click(checkInBtn.centerX(), checkInBtn.centerY());
}

/** @description 使用Telegrame傳送圖片給指定的人
 * @param {string} personName 要傳給的人的名字(需先加入聯絡人清單)
 * @param {string} fileName 圖片的檔名
 */
function TelegramNotice(personName, fileName) {
    app.launch("org.telegram.messenger"); // 開啟telegram

    className("android.widget.ImageView").depth(8).waitFor();
    let clickPoint = className("android.widget.ImageView").depth(8).findOne().bounds();
    click(clickPoint.centerX(), clickPoint.centerY());

    sleep(500);
    while (!text(personName).findOne(100)) {
        swipe(device.width/2, device.height/4, device.width/2, 0, 300);
    }
    clickPoint = text(personName).findOne().bounds();
    click(clickPoint.centerX(), clickPoint.centerY());

    sleep(500);
    desc("附加媒體").waitFor();
    desc("附加媒體").findOne().click();

    sleep(500);
    clickPoint = text("檔案").findOne().bounds();
    click(clickPoint.centerX(), clickPoint.centerY()-100);

    sleep(500);
    text("內部儲存空間").waitFor();
    clickPoint = text("內部儲存空間").findOne().bounds();
    click(clickPoint.centerX(), clickPoint.centerY());

    while (!text("Pictures").findOne(100)) {
        swipe(device.width/2, device.height/4, device.width/2, 0, 300);
    }
    clickPoint = text("Pictures").findOne().bounds();
    click(clickPoint.centerX(), clickPoint.centerY());

    while (!text(fileName).findOne(100)) {
        swipe(device.width/2, device.height/4, device.width/2, 0, 300);
    }
    clickPoint = text(fileName).findOne().bounds();
    click(clickPoint.centerX(), clickPoint.centerY());

    home(); // 如果用ForceClose()會導致照片上傳也被停止
}

auto();

var bright = device.getBrightness();
device.setBrightness(0); // 把螢幕亮度調成0，執行自動打卡時掩人耳目
Unlock();

var nowTime = new Date();
// 等待隨機0~5分鐘後打卡
randomTime =  Math.floor(Math.random()*300000);
toastLog("本次隨機等待時間為" + randomTime/1000 + "秒");
sleep(randomTime);

ClearBackgroundApp();
AutoCheckIn(true);

//請求截圖
var Screenshot = "Check-in_" + nowTime.getFullYear() + '-' + 
    (nowTime.getMonth()+1) + '-' + nowTime.getDate() + ".png";
if (requestScreenCapture()) {
    captureScreen("/storage/emulated/0/Pictures/" + Screenshot); //截圖
    toastLog ("截圖已完成");
    sleep(1000);
}

ForceClose("com.alibaba.android.rimet"); // 關閉釘釘
TelegramNotice("Bob Chen", Screenshot);

device.setBrightness(bright);

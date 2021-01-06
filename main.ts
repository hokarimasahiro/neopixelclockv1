function 固定表示 (stripData: string) {
    for (let index22 = 0; index22 <= stripData.length / 2 - 1; index22++) {
        LINE = bit.hexToNumber(stripData.substr(index22 * 2, 2))
        for (let Y = 0; Y <= 7; Y++) {
            if (index22 % 2 == 0) {
                POS = index22 * 8 + (0 + Y)
            } else {
                POS = index22 * 8 + (7 - Y)
            }
            if (bit.bitTest(LINE, 7 - Y)) {
                strip.setPixelColor(POS, 文字色)
            } else {
                strip.setPixelColor(POS, 背景色)
            }
        }
    }
}
function シフト表示 (stripData: string) {
    strip.shift(-8)
    strip2.shift(-8)
    LINE = bit.hexToNumber(stripData.substr(表示位置, 2))
    for (let Y2 = 0; Y2 <= 7; Y2++) {
        if (表示位置 % 4 == 0) {
            POS2 = Y2 + 248
            POS = 255 - Y2
        } else {
            POS = Y2 + 248
            POS2 = 255 - Y2
        }
        if (bit.bitTest(LINE, 7 - Y2)) {
            strip.setPixelColor(POS, 文字色)
            strip2.setPixelColor(POS2, 文字色)
        } else {
            strip.setPixelColor(POS, 背景色)
            strip2.setPixelColor(POS2, 背景色)
        }
    }
    if (表示位置 % 4 == 0) {
        strip.show()
    } else {
        strip2.show()
    }
    if (表示位置 >= stripData.length - 2) {
        表示位置 = 0
    } else {
        表示位置 = 表示位置 + 2
    }
}
input.onButtonPressed(Button.A, function () {
    if (文字色 == neopixel.colors(NeoPixelColors.Red)) {
        文字色 = neopixel.colors(NeoPixelColors.Orange)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Orange)) {
        文字色 = neopixel.colors(NeoPixelColors.Yellow)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Yellow)) {
        文字色 = neopixel.colors(NeoPixelColors.Green)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Green)) {
        文字色 = neopixel.colors(NeoPixelColors.Blue)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Blue)) {
        文字色 = neopixel.colors(NeoPixelColors.Indigo)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Indigo)) {
        文字色 = neopixel.colors(NeoPixelColors.Violet)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Violet)) {
        文字色 = neopixel.colors(NeoPixelColors.Purple)
    } else if (文字色 == neopixel.colors(NeoPixelColors.Purple)) {
        文字色 = neopixel.colors(NeoPixelColors.White)
    } else {
        文字色 = neopixel.colors(NeoPixelColors.Red)
    }
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    受信文字 = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    コマンド処理(受信文字)
})
function コマンド処理 (コマンド文字列: string) {
    コマンド = コマンド文字列.charAt(0)
    パラメータ = コマンド文字列.substr(2, 100).split(",")
    if (コマンド == "s") {
        rtc.setClockData(clockData.year, parseInt(パラメータ[0]))
        rtc.setClockData(clockData.month, parseInt(パラメータ[1]))
        rtc.setClockData(clockData.day, parseInt(パラメータ[2]))
        rtc.setClockData(clockData.weekday, parseInt(パラメータ[3]))
        rtc.setClockData(clockData.hour, parseInt(パラメータ[4]))
        rtc.setClockData(clockData.minute, parseInt(パラメータ[5]))
        rtc.setClockData(clockData.second, parseInt(パラメータ[6]))
        rtc.setClock()
    }
}
function メッセージ選択 (メッセージ番号: number) {
    if (メッセージ番号 < message.msgList.length) {
        メッセージ = message.msgList[メッセージ番号]
        if (メッセージ.length > 64) {
            for (let index = 0; index < 行末空白; index++) {
                メッセージ = "" + メッセージ + "00"
            }
            if (メッセージ.length % 4 != 0) {
                メッセージ = "" + メッセージ + "00"
            }
            strip.clear()
            strip2.clear()
            表示位置 = 0
        } else {
            固定表示(メッセージ)
            strip.show()
        }
    }
}
input.onButtonPressed(Button.B, function () {
    メッセージ番号 += 1
    if (メッセージ番号 > message.msgList.length) {
        メッセージ番号 = 0
    }
    メッセージ選択(メッセージ番号)
})
function 時刻表示 () {
    rtc.getClock()
    時 = rtc.getClockData(clockData.hour)
    分 = rtc.getClockData(clockData.minute)
    秒 = rtc.getClockData(clockData.second)
    if (時 < 10) {
        時計文字 = " "
    } else {
        時計文字 = ""
    }
    時計文字 = "" + 時計文字 + convertToText(時)
    if (秒 % 2 == 1) {
        時計文字 = "" + 時計文字 + "_"
    } else {
        時計文字 = "" + 時計文字 + ":"
    }
    if (分 < 10) {
        時計文字 = "" + 時計文字 + "0"
    } else {
        時計文字 = "" + 時計文字 + ""
    }
    時計文字 = "" + 時計文字 + convertToText(分)
    固定表示(clockfont.getClockStrip(時計文字))
    for (let index3 = 0; index3 <= 29; index3++) {
        POS2 = index3 + Math.trunc(index3 / 10)
        if (POS2 % 2 == 0) {
            POS = POS2 * 8 + 7
        } else {
            POS = POS2 * 8 + 0
        }
        if (秒 < 30) {
            if (秒 > index3) {
                strip.setPixelColor(POS, neopixel.rgb(0, 16, 0))
            } else {
                strip.setPixelColor(POS, neopixel.colors(NeoPixelColors.Black))
            }
        } else {
            if (秒 - 30 > index3) {
                strip.setPixelColor(POS, neopixel.colors(NeoPixelColors.Black))
            } else {
                strip.setPixelColor(POS, neopixel.rgb(0, 16, 0))
            }
        }
    }
    strip.show()
}
let 輝度 = 0
let 時計文字 = ""
let 秒 = 0
let 分 = 0
let 時 = 0
let メッセージ = ""
let パラメータ: string[] = []
let コマンド = ""
let 受信文字 = ""
let POS2 = 0
let 表示位置 = 0
let POS = 0
let LINE = 0
let 背景色 = 0
let 文字色 = 0
let メッセージ番号 = 0
let 行末空白 = 0
let strip2: neopixel.Strip = null
let strip: neopixel.Strip = null
let year = 0
let month = 0
let day = 0
let weekday = 0
let hour = 0
let minute = 0
let second = 0
bluetooth.startUartService()
rtc.getClock()
strip = neopixel.create(DigitalPin.P1, 256, NeoPixelMode.RGB)
strip.clear()
strip.show()
strip2 = neopixel.create(DigitalPin.P1, 256, NeoPixelMode.RGB)
strip2.clear()
strip2.show()
行末空白 = 8
メッセージ番号 = 0
文字色 = neopixel.colors(NeoPixelColors.Indigo)
背景色 = neopixel.colors(NeoPixelColors.Black)
let 最大輝度 = 255
let 最小輝度 = 5
メッセージ選択(メッセージ番号)
basic.forever(function () {
    輝度 = Math.constrain(input.lightLevel(), 最小輝度, 最大輝度)
    strip.setBrightness(輝度 / 5)
    strip2.setBrightness(輝度 / 5)
    if (メッセージ番号 >= message.msgList.length) {
        時刻表示()
    } else {
        if (メッセージ.length > 64) {
            シフト表示(メッセージ)
        }
    }
    basic.pause(100)
})
control.inBackground(function () {
	
})

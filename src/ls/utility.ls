window.lang = 'zh'
angular.module \plotDB
  ..service \i18n, <[$rootScope]> ++ ($rootScope) ->
    ret = do
      'Pricing': zh: '方案與定價', en: 'Pricing'
      'pricing-desc': zh: "提升您的視覺力", en: "empower you with visualizations"
      'price-free-desc': zh: "所有用戶都能享有", en: "for all users to evaluation PlotDB"
      'price-basic-desc': zh: "適合個人快速製圖", en: "Best for individual expertise"
      'price-expert-desc': zh: "團隊功能與私人內容", en: "privacy, team and enterprise"
      'Your Choice': zh: "您的選擇"
      'Select': zh: "選取"
      'annually': zh: "年繳"
      'or': zh: "或"
      'SHOWCASE': zh: "使用案例"
      'PALETTE': zh: "配色"
      'COLLECTIONS': zh: "作品集"
      'THEME': zh: "設計主題"
      'DATASET': zh: "資料集"
      'VISWORK': zh: "視覺化"
      'Storage Usage': zh: "空間用量"
      'Teams': zh: "團隊"
      'Settings': zh: "設定"
      'Billing': zh: "付款資訊"
      'Logout': zh: "登出"
      'Plan': zh: "方案"
      'Credit Card Number': zh: "您的信用卡號"
      'Subscribe': zh: "購買"
      'Expiration Date': zh: "卡片到期日"
      'CVC Code': zh: "檢查碼"
      'cvc-desc': zh: "卡片背面簽名區旁的三位數字", en: "3 digits number on back of card"
  ..filter \i18n, <[i18n]> ++ (i18n)-> -> (i18n[it] and i18n[it][window.lang]) or it
  ..filter \tags, -> -> if Array.isArray(it) => it else (it or "").split(\,)
  ..filter \nicedate, -> ->
    date = new Date(it)
    "#{date.getYear! + 1900}/#{date.getMonth! + 1}/#{date.getDate!}"
  ..filter \nicedatetime, -> ->
    pad = (it) -> "#{if it < 10 => '0' else ''}#it"
    date = new Date(it)
    Y = date.getYear! + 1900
    M = pad(date.getMonth! + 1)
    D = pad date.getDate!
    h = pad date.getHours!
    m = pad date.getMinutes!
    s = pad date.getSeconds!
    "#Y/#M/#D #h:#m:#s"
  ..filter \date, -> -> new Date(it)
  ..filter \timestamp -> -> new Date(it).getTime!
  ..filter \datelite, -> ->
    d = new Date(it)
    "#{d.getYear! + 1900}/#{d.getMonth! + 1}/#{d.getDate!} #{d.getHours!}:#{d.getMinutes!}"
  ..filter \length, -> -> [k for k of it].length
  ..filter \size, -> ->
    if !it or isNaN(it) => return \0B
    if it < 1000 => "#{it}B"
    else if it < 1048576 => "#{parseInt(it / 102.4)/10}KB"
    else "#{parseInt(it / 104857.6)/10}MB"

  ..directive \ngfile, <[$compile]> ++ ($compile) -> do
    require: <[]>
    restrict: \A
    scope: do
      model: \=ngData
    link: (s,e,a,c) -> e.on \change ~> s.$apply -> s.model = e.0.files
  ..directive \ngselect2, <[$compile entityService]> ++ ($compile, entityService) -> do

    require: <[]>
    restrict: \A
    scope: do
      model: \=ngData
      istag: \@istag
      type: \@type
      detail: \=ngDetail
    link: (s,e,a,c) ->
      changed = ->
        [cval,nval] = [s.model, $(e).val!]
        if !Array.isArray(cval) => return cval != nval
        [cval,nval] = [cval,nval].map -> (it or []).join(",")
        cval != nval
      if s.type => config = entityService.config.select2[s.type]
      else config = {}
      if s.istag => config <<< tags: true, tokenSeparators: [',',' ']
      $(e).select2 config
      $(e).select2 config .on \change, ~>
        # angularjs create object for chart if s.model = chart.blah and chart = undefined.
        # be aware of this behavior
        if changed! => setTimeout (->
          s.$apply ->
            s.model = $(e)val!
            if a.$attr["ngDetail"] => s.detail = $(e).select2('data')
        ),0
      s.$watch 'model', ((vals) ~>
        # escaped html from jquery.
        # jquery.val won't help select2 build option tags so we have to do this by ourselves
        if config.tags =>
          html = ""
          for val in (vals or []) => html += $("<option></option>").val(val).text(val).0.outerHTML
          $(e).html(html)
        if changed! => setTimeout (-> $(e).val(vals).trigger(\change) ),0
      ), true
  ..directive \readby, <[$compile]> ++ ($compile) ->
    do
      scope: do
        readby: \&readby
        encoding: \@encoding
        askencoding: \&askencoding
      link: (s,e,a,c) ->
        handler = s.readby!
        askencoding = s.askencoding!
        e.bind \change, (event) ->
          reader = ->
            fr = new FileReader!
            fr.onload = ->
              s.$apply -> handler fr.result, event.target.files.0
              e.val("")
            if s.encoding => fr.readAsText event.target.files.0, s.encoding
            else fr.readAsBinaryString event.target.files.0
          s.$apply ->
            if askencoding => askencoding reader
            else reader!

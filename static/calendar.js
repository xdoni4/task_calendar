var cal = {
    mon : true,
    sMth : 0,
    sYear : 0,
    sDIM : 0,
    sF : 0,
    sL : 0,
    sFD : 0,
    sLD : 0,
    ready : 0,

    hMth : null, hYear : null,
    hCD : null, hCB : null,
    hFormWrap : null, hForm : null,
    hfID : null, hfStart : null,
    hfEnd : null, hfTxt : null,
    hfColor : null, hfBG : null,
    hfDel : null,
    hUserId : null,

    ajax : (req, data, onload) => {
        let form = new FormData();
        for (let [k,v] of Object.entries(data)) { form.append(k,v); }

        fetch(req + "/", { method:"POST", body:form })
        .then(res => res.text())
        .then(txt => onload(txt))
        .catch(err => console.error(err));
    },


    init : () => {
        cal.hMth = document.getElementById("calMonth");
        cal.hYear = document.getElementById("calYear");
        cal.hCD = document.getElementById("calDays");
        cal.hCB = document.getElementById("calBody");
        cal.hFormWrap = document.getElementById("calForm");
        cal.hForm = cal.hFormWrap.querySelector("form");
        cal.hDayFormWrap = document.getElementById("calDayInfo");
        cal.hDayForm = cal.hDayFormWrap.querySelector("form");
        cal.hfID = document.getElementById("evtID");
        cal.hfStart = document.getElementById("evtStart");
        cal.hfEnd = document.getElementById("evtEnd");
        cal.hfTxt = document.getElementById("evtTxt");
        cal.hfColor = document.getElementById("evtColor");
        cal.hfBG = document.getElementById("evtBG");
        cal.hfDel = document.getElementById("evtDel");
        cal.hUserId = document.getElementById("userId");
        cal.overlayme = document.getElementById("dialog-container");
        cal.day_tasks = {};

        let now = new Date(), nowMth = now.getMonth() + 1;
        for (let [i,n] of Object.entries({
            1 : "January", 2 : "February", 3 : "March", 4 : "April",
            5 : "May", 6 : "June", 7 : "July", 8 : "August",
            9 : "September", 10 : "October", 11 : "November", 12 : "December"
        })) {
            let opt = document.createElement("option");
            opt.value = i;
            opt.innerHTML = n;
            if (i==nowMth) { opt.selected = true; }
            cal.hMth.appendChild(opt);
        }
        cal.hYear.value = parseInt(now.getFullYear());

        cal.hMth.onchange = cal.load;
        cal.hYear.onchange = cal.load;
        document.getElementById("calBack").onclick = () => cal.pshift();
        document.getElementById("calNext").onclick = () => cal.pshift(1);
        document.getElementById("calAdd").onclick = () => cal.show();
        cal.hForm.onsubmit = () => cal.save();
        document.getElementById("evtCX").onclick = () =>  cal.hFormWrap.close();
        document.getElementById("DayFormCX").onclick = () => cal.close_form();
        document.getElementById("trash0").onclick = () => cal.delete_task(0);
        document.getElementById("trash1").onclick = () => cal.delete_task(1);
        document.getElementById("trash2").onclick = () => cal.delete_task(2);
        document.getElementById("trash3").onclick = () => cal.delete_task(3);
        document.getElementById("trash4").onclick = () => cal.delete_task(4);
        document.getElementById("trash5").onclick = () => cal.delete_task(5);
        document.getElementById("trash6").onclick = () => cal.delete_task(6);
        document.getElementById("trash7").onclick = () => cal.delete_task(7);
        document.getElementById("trash8").onclick = () => cal.delete_task(8);
        document.getElementById("trash9").onclick = () => cal.delete_task(9);
        document.getElementById("confirm").onclick = () => cal.confirm();
        document.getElementById("cancel").onclick = () => cal.cancel();
        cal.hfDel.onclick = cal.del;

        let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        if (cal.mon) { days.push("Sun"); } else { days.unshift("Sun"); }
        for (let d of days) {
            let cell = document.createElement("div");
            cell.className = "calCell";
            cell.innerHTML = d;
            cal.hCD.appendChild(cell);
        }

        cal.load();
    },

    pshift : forward => {
        cal.sMth = parseInt(cal.hMth.value);
        cal.sYear = parseInt(cal.hYear.value);
        if (forward) { cal.sMth++; } else { cal.sMth--; }
        if (cal.sMth > 12) { cal.sMth = 1; cal.sYear++; }
        if (cal.sMth < 1) { cal.sMth = 12; cal.sYear--; }
        cal.hMth.value = cal.sMth;
        cal.hYear.value = cal.sYear;
        cal.load();
    },

    load : () => {
        cal.sMth = parseInt(cal.hMth.value);
        cal.sYear = parseInt(cal.hYear.value);
        cal.sDIM = new Date(cal.sYear, cal.sMth, 0).getDate();
        cal.sFD = new Date(cal.sYear, cal.sMth-1, 1).getDay();
        cal.sLD = new Date(cal.sYear, cal.sMth-1, cal.sDIM).getDay();
        let m = cal.sMth;
        if (m < 10) { m = "0" + m; }
        cal.sF = parseInt(String(cal.sYear) + String(m) + "010000");
        cal.sL = parseInt(String(cal.sYear) + String(m) + String(cal.sDIM) + "2359");
        cal.draw();
        cal.ajax("get", { month : cal.sMth, year : cal.sYear, id : cal.hUserId.value }, evt => {
            cal.day_tasks = JSON.parse(evt);
        });
    },

    draw : () => {
        let now = new Date(),
        nowMth = now.getMonth()+1,
        nowYear = parseInt(now.getFullYear()),
        nowDay = cal.sMth==nowMth && cal.sYear==nowYear ? now.getDate() : null ;

        let rowA, rowB, rowC, rowMap = {}, rowNum = 1,
            cell, cellNum = 1,
        rower = () => {
            rowA = document.createElement("div");
            rowB = document.createElement("div");
            rowC = document.createElement("div");
            rowA.className = "calRow";
            rowA.id = "calRow" + rowNum;
            rowB.className = "calRowHead";
            rowC.className = "calRowBack";
            cal.hCB.appendChild(rowA);
            rowA.appendChild(rowB);
            rowA.appendChild(rowC);
        },
        celler = day => {
          if (day) {
              cell = document.createElement("input");
              cell.value = day;
              cell.type = "button";
              cell.onclick = () => cal.show_day(day);
          }
          else {
              cell = document.createElement("div");
          }
          cell.className = "calCell";
          rowB.appendChild(cell);

          if (day===undefined) { cell.classList.add("calBlank"); }
          if (day!==undefined && day==nowDay) { cell.classList.add("calToday"); }

          rowC.appendChild(cell);
        };
        cal.hCB.innerHTML = ""; rower();

        if (cal.mon && cal.sFD != 1) {
            let blanks = cal.sFD==0 ? 7 : cal.sFD ;
            for (let i=1; i<blanks; i++) { celler(); cellNum++; }
        }
        if (!cal.mon && cal.sFD != 0) {
            for (let i=0; i<cal.sFD; i++) { celler(); cellNum++; }
        }

        for (let i=1; i<=cal.sDIM; i++) {
            rowMap[i] = { r : rowNum, c : cellNum };
            celler(i);
            if (cellNum%7==0 && i!=cal.sDIM) { rowNum++; rower(); }
            cellNum++;
        }

        if (cal.mon && cal.sLD != 0) {
            let blanks = cal.sLD==6 ? 1 : 7-cal.sLD;
            for (let i=0; i<blanks; i++) { celler(); cellNum++; }
        }
        if (!cal.mon && cal.sLD != 6) {
            let blanks = cal.sLD==0 ? 6 : 6-cal.sLD;
            for (let i=0; i<blanks; i++) { celler(); cellNum++; }
        }
    },

    delete_task : (task_number) => {
        cal.overlayme.style.display = "block";
        cal.del_task = task_number;
    },

    confirm : () => {
        cnt = 3 + cal.del_task;
        cal.hDayForm.children[cnt].style.display = 'none';
        var nodes = cal.hDayForm.children[cnt].children[1].childNodes;
        for(var j=0; j<nodes.length; j++) {
            if (nodes[j].nodeName.toLowerCase() == 'span') {
                 nodes[j].style.display = 'none';
             }
        }
        cal.hDayForm.children[cnt].children[0].del_task = true;
        cal.overlayme.style.display = "none";
    },

    cancel : () => {
        cal.overlayme.style.display = "none";
    },

    displayTextWidth : (text, font) => {
        let canvas = cal.displayTextWidth.canvas || (cal.displayTextWidth.canvas = document.createElement("canvas"));
        let context = canvas.getContext("2d");
        context.font = font;
        let metrics = context.measureText(text);
        return metrics.width;
    },

    close_form : () => {
        var cnt = 3;
        for (let i = 0; i < Object.values(document.getElementsByClassName('dayTask')).length; i++) {
            Object.values(document.getElementsByClassName('dayTask'))[i].children[1].children[0].innerHTML = '';
            cal.hDayForm.children[cnt].style.display = 'none';
            var nodes = cal.hDayForm.children[cnt].children[1].childNodes;
            cnt += 1;
            for(var j=0; j<nodes.length; j++) {
                if (nodes[j].nodeName.toLowerCase() == 'span') {
                     nodes[j].style.display = 'none';
                 }
            }
        }

        cnt = 3;
        var data_upd = {};
        var data_del = {};
        var day = cal.cur_day;
        for (let i = 0 ; i < Object.values(cal.day_tasks).length; i++) {
                date = new Date(Date.parse(Object.values(cal.day_tasks)[i].date))
                if (date.getDate() == day) {
                    data_upd[Object.values(cal.day_tasks)[i].id] = cal.hDayForm.children[cnt].children[0].checked;
                    data_del[Object.values(cal.day_tasks)[i].id] = cal.hDayForm.children[cnt].children[0].del_task;
                    cnt += 1;
                }
        }
        cal.ajax("update", data_upd, res => {
            if (res=="OK") {
            cal.hDayFormWrap.close();
            cal.load();
            } else { alert(res); }
        });

        cal.ajax("delete", data_del, res => {
            if (res=="OK") {
            cal.hDayFormWrap.close();
            cal.load();
            } else { alert(res); }
        });
    },

    show_day : day => {
        cal.cur_day = day;
        if (Object.keys(cal.day_tasks).length > 0) {
            var cnt = 3;
            for (let i = 0 ; i < Object.values(cal.day_tasks).length; i++) {
                date = new Date(Date.parse(Object.values(cal.day_tasks)[i].date))
                if (date.getDate() == day) {
                    cal.hDayForm.children[cnt].style.display = 'flex';
                    var nodes = cal.hDayForm.children[cnt].children[1].childNodes;
                    for(var j=0; j<nodes.length; j++) {
                        if (nodes[j].nodeName.toLowerCase() == 'span') {
                             nodes[j].style.display = 'inline-block';
                         }
                    }
                    cal.hDayForm.children[cnt].children[0].del_task = false;
                    cal.hDayForm.children[cnt].children[1].children[0].innerHTML = Object.values(cal.day_tasks)[i].text;
                    var between = document.getElementById("between" + (cnt - 3));
                    cal.between_set = (215 - cal.displayTextWidth(Object.values(cal.day_tasks)[i].text, "16px Open Sans")) + "px";
                    between.style.setProperty('width', cal.between_set);
                    cal.hDayForm.children[cnt].children[0].checked = Object.values(cal.day_tasks)[i].completed;
                    cnt += 1;
                }
            }
        }
        cal.hDayFormWrap.show();
  },

    show : id => {
        cal.hForm.reset();
        cal.hfID.value = "";
        cal.hfDel.style.display = "none";
        cal.hFormWrap.show();
    },

    save : () => {
        var data = {
            date : cal.hfStart.value.replace("T", " "),
            text : cal.hfTxt.value,
            id : cal.hUserId.value
        };

        cal.ajax("save", data, res => {
            if (res=="OK") {
                cal.hFormWrap.close();
                cal.load();
            } else { alert(res); }
        });
        return false;
    }
};

window.onload = cal.init;
// Generated by LiveScript 1.3.1
$(document).ready(function(){
  var lastDataIdx, lastIdx, setdata, update, generate, data, pal, charts;
  lastDataIdx = 0;
  lastIdx = 2;
  setdata = function(i){
    var chart;
    if (!(i != null)) {
      i = lastDataIdx;
    }
    chart = charts[lastIdx];
    chart.data(data[i][lastIdx]);
    chart.parse();
    chart.resize();
    chart.bind();
    return chart.render();
  };
  update = function(idx, color){
    var chart;
    idx == null && (idx = -1);
    if (idx >= 0) {
      pal.colors[idx].hex = color;
    }
    chart = charts[lastIdx];
    chart.config({
      palette: pal
    });
    chart.resize();
    return chart.render();
  };
  $('#land-edit-pick').on('click', function(e){
    var idx;
    idx = e.target.getAttribute('idx') || e.target.parentNode.getAttribute('idx');
    if (!(idx != null)) {
      return;
    }
    idx = +idx;
    $("#land-pdb-root > div:nth-child(" + (lastIdx + 1) + ")").hide();
    $("#land-edit-pick > .ib:nth-child(" + (lastIdx + 1) + ")").removeClass('active');
    lastIdx = idx;
    $("#land-pdb-root > div:nth-child(" + (idx + 1) + ")").show();
    $("#land-edit-pick > .ib:nth-child(" + (lastIdx + 1) + ")").addClass('active');
    update();
    return setdata();
  });
  generate = function(seed){
    var name, dept, gender, list, ret;
    name = ['James', 'Peter', 'David', 'Ben', 'Cathy', 'Tim', 'Rob', 'Edward', 'Frank', 'Eve', 'Helen', 'Stan'];
    dept = ['HR', 'FIN', 'GM', 'RD', 'IT'];
    gender = ['Male', 'Female', 'Other'];
    list = d3.range(12).map(function(d, i){
      var ret;
      ret = {
        name: name[i % name.length],
        dept: dept[i % dept.length]
      };
      if (seed) {
        ret.gender = gender[Math.random() > 0.8 ? 1 : 0];
        ret.workhour = Math.round(10 * Math.random() * (10 + i % dept.length)) / 10 + 3;
        ret.performance = Math.round(10 * Math.random() * 100) / 10 + 1;
        ret.charisma = d3.range(3).map(function(it){
          return Math.random() + it / 3;
        });
        ret.monwork = [Math.round(10 * Math.random() * 3) / 10 + 6, Math.round(10 * Math.random() * 5) / 10 + 9];
      } else {
        ret.gender = gender[i % gender.length];
        ret.workhour = Math.round(10 * Math.random() * 5) / 10 + 7;
        ret.performance = Math.round(10 * Math.random() * 30) / 10 + 10;
        ret.charisma = d3.range(3).map(function(){
          return Math.random() + 0.01;
        });
        ret.monwork = [Math.round(10 * Math.random() * 2) / 10 + 8, Math.round(10 * Math.random() * 3) / 10 + 7];
      }
      ret.charisma = ret.charisma.map(function(it){
        return Math.round(100 * it / d3.sum(ret.charisma));
      });
      ret.charisma[2] = 100 - (ret.charisma[0] + ret.charisma[1]);
      return ret;
    });
    ret = [{}, {}, {}, {}, {}];
    ret[0] = {
      src: [{
        name: "",
        data: list.map(function(it){
          return it.dept;
        })
      }],
      des: [{
        name: "",
        data: list.map(function(it){
          return it.gender;
        })
      }],
      size: [{
        name: "",
        data: list.map(function(it){
          return it.workhour;
        })
      }]
    };
    ret[1] = {
      value1: [{
        name: "",
        data: list.map(function(it){
          return it.charisma[0];
        })
      }],
      value2: [{
        name: "",
        data: list.map(function(it){
          return it.charisma[1];
        })
      }],
      value3: [{
        name: "",
        data: list.map(function(it){
          return it.charisma[2];
        })
      }]
    };
    ret[2] = {
      category: [{
        name: "",
        data: list.map(function(it){
          return it.dept;
        })
      }],
      name: [{
        name: "",
        data: list.map(function(it){
          return it.name;
        })
      }],
      value: [{
        name: "",
        data: list.map(function(it){
          return it.workhour;
        })
      }]
    };
    ret[3] = {
      order: [{
        name: "",
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }],
      values: [
        {
          name: "Female",
          data: list.map(function(it){
            return it.monwork[0];
          })
        }, {
          name: "Male",
          data: list.map(function(it){
            return it.monwork[1];
          })
        }
      ]
    };
    ret[4] = {
      category: [{
        name: "Dept.",
        data: list.map(function(it){
          return it.dept;
        })
      }],
      name: [{
        name: "Name",
        data: list.map(function(it){
          return it.name;
        })
      }],
      value: [{
        name: "",
        data: list.map(function(it){
          return it.performance;
        })
      }]
    };
    return ret;
  };
  data = [generate(0), generate(1)];
  pal = {
    colors: [
      {
        hex: '#d54876'
      }, {
        hex: '#eaac34'
      }, {
        hex: '#f2e336'
      }, {
        hex: '#66b2a2'
      }, {
        hex: '#3c5496'
      }
    ]
  };
  charts = [];
  return plotdb.load('/assets/json/samples.json', function(ret){
    var i$, to$, i, root, node, chart, results$ = [];
    charts = ret;
    for (i$ = 0, to$ = charts.length; i$ < to$; ++i$) {
      i = i$;
      root = $("#land-pdb-root > div:nth-child(" + (i + 1) + ")");
      node = $("#land-pdb-root > div:nth-child(" + (i + 1) + ") > div")[0];
      chart = charts[i];
      chart.config({
        palette: pal,
        value1Label: "Creativity",
        value2Label: "Dignity",
        value3Label: "Logic"
      });
      chart.data(data[0][i]);
      chart.attach(node);
      if (i === 2) {
        root.show();
      } else {
        root.hide();
      }
    }
    for (i$ = 1; i$ < 3; ++i$) {
      i = i$;
      fn$(i);
    }
    for (i$ = 0; i$ < 6; ++i$) {
      i = i$;
      results$.push(fn1$(i));
    }
    return results$;
    function fn$(v){
      var node;
      node = $("#land-edit-cog .btn-group .btn-default:nth-child(" + v + ")");
      return node.on('click', function(){
        var node;
        node = $("#land-edit-cog .btn-group .btn-default:nth-child(" + (lastDataIdx + 1) + ")").removeClass('active');
        setdata(v - 1);
        lastDataIdx = v - 1;
        return node = $("#land-edit-cog .btn-group .btn-default:nth-child(" + (lastDataIdx + 1) + ")").addClass('active');
      });
    }
    function fn1$(v){
      var node, ldcp, ref$;
      node = $("#land-edit-cog .color:nth-child(" + v + ")")[0];
      ldcp = new ldColorPicker(node, {
        index: (ref$ = v - 1) > 0 ? ref$ : 0,
        exclusive: true,
        'class': 'no-palette no-alpha',
        palette: pal,
        context: 'common'
      });
      if (!node) {
        return;
      }
      return ldcp.on('change', function(it){
        node.style.background = it;
        return update(v - 1, it);
      });
    }
  });
});
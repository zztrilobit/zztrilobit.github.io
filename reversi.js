(function() {
  var Reversi, reversi;

  Reversi = (function() {
    function Reversi() {}

    Reversi.prototype.learn_click = function() {};

    Reversi.prototype.init = function() {
      var i, j, row, tbl, _i, _results;
      tbl = $("#root").append($('<table ></table>'));
      _results = [];
      for (i = _i = 1; _i <= 8; i = ++_i) {
        row = tbl.append($('<row></row>'));
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 1; _j <= 8; j = ++_j) {
            _results1.push(row.append($('<td id="' + i + '_' + j + '">' + i + '_' + j + '</td>')));
          }
          return _results1;
        })());
      }
      return _results;
    };

    return Reversi;

  })();

  reversi = new Reversi;

  window.g_reversi = reversi;

  $(document).ready(function() {
    return reversi.init();
  });

}).call(this);

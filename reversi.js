(function() {
  var Cell, Reversi, reversi;

  Cell = (function() {
    function Cell(y, x, td) {
      this.y = y;
      this.x = x;
      this.td = td;
      this.state = 0;
    }

    Cell.prototype.getState = function() {
      return this.state;
    };

    Cell.prototype.setState = function(state) {
      this.state = state;
      return this.display();
    };

    Cell.prototype.roll = function() {
      switch (this.state) {
        case 1:
          this.state = 2;
          break;
        case 2:
          this.state = 1;
      }
      return this.display();
    };

    Cell.prototype.display = function() {
      switch (this.state) {
        case 0:
          return this.td.html(' ');
        case 1:
          return this.td.html('X');
        case 2:
          return this.td.html('O');
      }
    };

    return Cell;

  })();

  Reversi = (function() {
    function Reversi() {}

    Reversi.prototype.roll = function(flips) {
      var flip, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = flips.length; _i < _len; _i++) {
        flip = flips[_i];
        _results.push(this.field[flip[0]][flip[1]].roll());
      }
      return _results;
    };

    Reversi.prototype.onCellClick = function(i, j) {
      var flips, r;
      flips = this.getFlips(i, j, 1);
      if (flips.length > 0) {
        this.field[i][j].setState(1);
        this.roll(flips);
      }
      return;
      r = this.findAnyMove();
      if (r.flips.length > 0) {
        this.field[r.y][r.x].setState(2);
        this.roll(r.flips);
      }
    };

    Reversi.prototype.clicker = function(i, j) {
      return (function(_this) {
        return function(event) {
          return _this.onCellClick(i, j);
        };
      })(this);
    };

    Reversi.prototype.findAnyMove = function() {
      var found_x, found_y, foundflips, i, j, result, t, tmpflips, _i, _j, _k, _len, _ref, _ref1;
      tmpflips = [];
      foundflips = [];
      found_y = 0;
      found_x = 0;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          tmpflips = this.getFlips(i, j, 2);
          if (tmpflips.length > foundflips.length) {
            alert(tmpflips);
            foundflips = [];
            found_y = i;
            found_x = j;
            for (_k = 0, _len = tmpflips.length; _k < _len; _k++) {
              t = tmpflips[_k];
              foundflips.push(t);
            }
          }
        }
      }
      result = {
        x: found_x,
        y: found_y,
        flips: foundflips
      };
      return result;
    };

    Reversi.prototype.getFlips = function(y, x, p) {
      var a2, dir, dirs, dx, dy, flips, i, j, nx, ny, t, temp, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
      if (this.field[y][x].state !== 0) {
        return [];
      }
      dirs = [];
      a2 = function(x, y) {
        return [x, y];
      };
      flips = [];
      _ref = [-1, 0, 1];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _ref1 = [-1, 0, 1];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          j = _ref1[_j];
          if ((i !== 0) || (j !== 0)) {
            dirs.push(a2(i, j));
          }
        }
      }
      for (_k = 0, _len2 = dirs.length; _k < _len2; _k++) {
        dir = dirs[_k];
        dy = dir[0];
        dx = dir[1];
        nx = x + dx;
        ny = y + dy;
        temp = [];
        while ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx].state !== 0) && (this.field[ny][nx].state !== p)) {
          temp.push(a2(ny, nx));
          nx = nx + dx;
          ny = ny + dy;
        }
        if ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx].state = p)) {
          for (_l = 0, _len3 = temp.length; _l < _len3; _l++) {
            t = temp[_l];
            flips.push(a2(t[0], t[1]));
          }
        }
      }
      return flips;
    };

    Reversi.prototype.init = function() {
      var cc, cell, i, j, n, row, tbl, _i, _j, _ref, _ref1;
      tbl = $('<table border="2" cellpadding="2" cellspacing="0"></table>');
      tbl.appendTo($("#root"));
      this.field_size = 8;
      this.field = (function() {
        var _i, _j, _ref, _ref1, _results, _results1;
        _results = [];
        for (i = _i = 1, _ref = this.field_size + 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            _results1 = [];
            for (var _j = 1, _ref1 = this.field_size + 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; 1 <= _ref1 ? _j++ : _j--){ _results1.push(_j); }
            return _results1;
          }).apply(this));
        }
        return _results;
      }).call(this);
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        row = $('<row></row>');
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          cell = $('<td valign="middle" align="center" width="60" height="60" id="' + i + '_' + j + '"></td>');
          cell.appendTo(row);
          cc = new Cell(i, j, cell);
          cc.setState(0);
          this.field[i][j] = cc;
          cell.click(this.clicker(i, j));
        }
        tbl.append(row);
      }
      n = this.field_size / 2;
      this.field[n][n].setState(1);
      this.field[n + 1][n + 1].setState(1);
      this.field[n + 1][n + 1].setState(1);
      this.field[n][n + 1].setState(2);
      return this.field[n + 1][n].setState(2);
    };

    return Reversi;

  })();

  reversi = new Reversi;

  window.g_reversi = reversi;

  $(document).ready(function() {
    return reversi.init();
  });

}).call(this);

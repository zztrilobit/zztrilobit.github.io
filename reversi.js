(function() {
  var Cell, Reversi, ReversiBoard, reversi;

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
          return this.td.html('<b>X</b>');
        case 2:
          return this.td.html('<b>O</b>');
      }
    };

    return Cell;

  })();

  ReversiBoard = (function() {
    function ReversiBoard(fs) {
      var i, j, n, _i, _j, _ref, _ref1;
      this.field_size = fs;
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
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          this.field[i][j] = 0;
        }
      }
      n = this.field_size / 2;
      this.field[n][n] = 1;
      this.field[n + 1][n + 1] = 1;
      this.field[n][n + 1] = 2;
      this.field[n + 1][n] = 2;
    }

    ReversiBoard.prototype.clone = function() {
      var i, j, res, _i, _ref, _results;
      res = new ReversiBoard(this.field_size);
      _results = [];
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
            _results1.push(res.field[i][j] = this.field[i][j]);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    ReversiBoard.prototype.roll = function(y, x) {
      var n;
      switch (this.field[y][x]) {
        case 1:
          n = 2;
          break;
        case 2:
          n = 1;
          break;
        default:
          0;
      }
      return this.field[y][x] = n;
    };

    ReversiBoard.prototype.getFlips = function(y, x, p) {
      var a2, dir, dirs, dx, dy, flip, flips, i, j, nx, ny, t, temp, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
      if (this.field[y][x] !== 0) {
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
        while ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx] !== 0) && (this.field[ny][nx] !== p)) {
          temp.push({
            y: ny,
            x: nx
          });
          nx = nx + dx;
          ny = ny + dy;
        }
        if ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx] === p)) {
          for (_l = 0, _len3 = temp.length; _l < _len3; _l++) {
            t = temp[_l];
            flip = {
              y: t.y,
              x: t.x
            };
            flips.push(flip);
          }
        }
      }
      return flips;
    };

    ReversiBoard.prototype.apply = function(flips) {
      var flip, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = flips.length; _i < _len; _i++) {
        flip = flips[_i];
        _results.push(this.roll(flip.y, flip.x));
      }
      return _results;
    };

    ReversiBoard.prototype.score = function() {
      var i, j, scoreX, scoreY, _i, _j, _ref, _ref1;
      scoreX = 0;
      scoreY = 0;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          if (this.field[i][j] = 1) {
            scoreX++;
          }
          if (this.field[i][j] = 2) {
            scoreO++;
          }
        }
      }
      return {
        sx: scoreX,
        so: scoreO
      };
    };

    ReversiBoard.prototype.possibleMoves = function(side) {
      var found_x, found_y, foundflips, i, j, moves, tmpflips, _i, _j, _ref, _ref1;
      tmpflips = [];
      foundflips = [];
      found_y = 0;
      found_x = 0;
      moves = [];
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          tmpflips = this.getFlips(i, j, side);
          if (tmpflips.length > 0) {
            foundflips = [];
            found_y = i;
            found_x = j;
            moves.push({
              y: found_y,
              x: found_x,
              flips: tmpflips
            });
          }
        }
      }
      return moves;
    };

    return ReversiBoard;

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
      var done, flips, myMove, r;
      flips = this.getFlips(i, j, 1);
      if (flips.length > 0) {
        this.field[i][j].setState(1);
        this.roll(flips);
      } else {
        r = this.findAnyMove(1);
        if (r.flips.length > 0) {
          alert("Ход неверен, есть возможность правильного хода");
          return;
        }
      }
      myMove = 1 === 1;
      done = 1 === 0;
      this.calc();
      r = this.findAnyMove(2);
      while (myMove && (!done)) {
        if (r.flips.length > 0) {
          this.field[r.y][r.x].setState(2);
          this.roll(r.flips);
        }
        r = this.findAnyMove(1);
        if (r.flips.length > 0) {
          myMove = 1 === 0;
        } else {
          r = this.findAnyMove(2);
          done = r.flips.length === 0;
        }
      }
      this.calc();
      if (done) {
        alert("Game over!");
      }
    };

    Reversi.prototype.clicker = function(i, j) {
      return (function(_this) {
        return function(event) {
          return _this.onCellClick(i, j);
        };
      })(this);
    };

    Reversi.prototype.findAnyMove = function(side) {
      var found_x, found_y, foundflips, i, j, result, t, tmpflips, _i, _j, _k, _len, _ref, _ref1;
      tmpflips = [];
      foundflips = [];
      found_y = 0;
      found_x = 0;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          tmpflips = this.getFlips(i, j, side);
          if (tmpflips.length > foundflips.length) {
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
        if ((nx >= 1) && (nx <= this.field_size) && (ny >= 1) && (ny <= this.field_size) && (this.field[ny][nx].state === p)) {
          for (_l = 0, _len3 = temp.length; _l < _len3; _l++) {
            t = temp[_l];
            flips.push(a2(t[0], t[1]));
          }
        }
      }
      return flips;
    };

    Reversi.prototype.init = function() {
      var btn_init, cc, cell, ctrldiv, i, j, row, tbl, _i, _j, _ref, _ref1;
      ctrldiv = $('<div></div>');
      btn_init = $('<button>Init</button>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      $('<span>X:</span>').appendTo(ctrldiv);
      this.spanX = $('<span></span>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      $('<span>O:</span>').appendTo(ctrldiv);
      this.spanO = $('<span></span>').appendTo(ctrldiv);
      $('<p></p>').appendTo(ctrldiv);
      btn_init.click((function(_this) {
        return function() {
          return _this.initField();
        };
      })(this));
      ctrldiv.appendTo($("#root"));
      tbl = $('<table></table>');
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
          cell = $('<td valign="middle" align="center" width=40 height=40></td>');
          cell.appendTo(row);
          cc = new Cell(i, j, cell);
          cc.setState(0);
          this.field[i][j] = cc;
          cell.click(this.clicker(i, j));
        }
        tbl.append(row);
      }
      return this.initField();
    };

    Reversi.prototype.calc = function() {
      var i, j, scoreO, scoreX, _i, _j, _ref, _ref1;
      scoreX = 0;
      scoreO = 0;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          if (this.field[i][j].state === 1) {
            scoreX++;
          }
          if (this.field[i][j].state === 2) {
            scoreO++;
          }
        }
      }
      this.spanX.html(scoreX);
      return this.spanO.html(scoreO);
    };

    Reversi.prototype.initField = function() {
      var i, j, n, _i, _j, _ref, _ref1;
      for (i = _i = 1, _ref = this.field_size; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        for (j = _j = 1, _ref1 = this.field_size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          this.field[i][j].setState(0);
        }
      }
      n = this.field_size / 2;
      this.field[n][n].setState(1);
      this.field[n + 1][n + 1].setState(1);
      this.field[n + 1][n + 1].setState(1);
      this.field[n][n + 1].setState(2);
      this.field[n + 1][n].setState(2);
      return this.calc();
    };

    return Reversi;

  })();

  reversi = new Reversi;

  window.g_reversi = reversi;

  $(document).ready(function() {
    return reversi.init();
  });

}).call(this);
